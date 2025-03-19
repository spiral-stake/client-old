import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import Skeleton from "react-loading-skeleton";
import { displayAmount } from "../../utils/displayAmounts";
import PoolRouter from "../../contract-hooks/PoolRouter";
import { toastSuccess } from "../../utils/toastWrapper";

const PoolJoin = ({ pool, allPositions, position, getAllPositions, setActionBtn, setLoading }) => {
  const ybtCollateral = pool.ybt;
  const [poolRouter, setPoolRouter] = useState();
  const [amountYbtCollateral, setAmountYbtCollateral] = useState();
  const [userYbtCollateralBalance, setUserYbtCollateralBalance] = useState();
  const [userYbtCollateralAllowance, setUserYbtCollateralAllowance] = useState();

  const { address } = useAccount();

  useEffect(() => {
    getPoolRouter();
    getAmountCollateral();
  }, []);

  const getPoolRouter = async () => {
    const _poolRouter = await PoolRouter.createInstance(pool);
    setPoolRouter(_poolRouter);
  };

  useEffect(() => {
    if (!address || !poolRouter) return;

    updateUserYbtCollateralBalance();
    updateUserYbtCollateralAllowance();
  }, [address, poolRouter]);

  useEffect(() => {
    if (!amountYbtCollateral) return;

    const updatingActionBtn = () => {
      if (position) {
        return setActionBtn({
          text: "Joined",
          disabled: true,
        });
      }

      if (allPositions.length == pool.totalPositions) {
        return setActionBtn({
          text: "Pool is Filled",
          disabled: true,
        });
      }

      if (userYbtCollateralBalance?.isLessThan(amountYbtCollateral)) {
        return setActionBtn({
          text: `Insufficient ${ybtCollateral.symbol} Balance`,
          disabled: true,
        });
      }

      if (userYbtCollateralAllowance?.isGreaterThanOrEqualTo(amountYbtCollateral)) {
        return setActionBtn({
          text: "Join Pool",
          disabled: false,
          onClick: handleAsync(handleJoin, setLoading),
        });
      }

      return setActionBtn({
        text: `Approve and Join`,
        disabled: userYbtCollateralBalance?.isLessThan(amountYbtCollateral) ? true : false,
        onClick: handleAsync(handleApproveAndJoin, setLoading),
      });
    };

    updatingActionBtn();
  }, [
    userYbtCollateralBalance,
    userYbtCollateralAllowance,
    allPositions,
    amountYbtCollateral,
    position,
  ]);

  const getAmountCollateral = async () => {
    setAmountYbtCollateral(undefined);

    const _amountCollateral = await pool.getAmountCollateral();
    setAmountYbtCollateral(_amountCollateral);
  };

  const updateUserYbtCollateralBalance = async () => {
    const balance = await ybtCollateral.balanceOf(address);
    setUserYbtCollateralBalance(balance);
  };

  const updateUserYbtCollateralAllowance = async () => {
    const allowance = await ybtCollateral.allowance(address, poolRouter.address);

    setUserYbtCollateralAllowance(allowance);
  };

  const handleApproveAndJoin = async () => {
    await ybtCollateral.approve(poolRouter.address, amountYbtCollateral);
    await Promise.all([updateUserYbtCollateralAllowance(), handleJoin()]);
  };

  const handleJoin = async () => {
    await poolRouter.depositYbtCollateral(address, amountYbtCollateral);

    toastSuccess("Joined the pool successfully");
    await Promise.all([
      updateUserYbtCollateralBalance(),
      updateUserYbtCollateralAllowance(),
      getAllPositions(),
    ]);
  };

  return (
    <div className="pool__interface-box">
      <span className="label">YBT Collateral</span>
      <span
        style={{
          fontSize: "14px",
          position: "absolute",
          right: "20px",
          top: "5px",
        }}
      >
        ~{displayAmount(pool.amountCollateralInBase)} {pool.baseToken.symbol}
      </span>
      <span className="input-box">
        {amountYbtCollateral ? (
          <>
            <span className="input">{amountYbtCollateral.toFixed(3)}</span>
            <div style={{ marginLeft: "5px" }}>{ybtCollateral.symbol}</div>
          </>
        ) : (
          <Skeleton baseColor="var(--color-bg)" width="120px" />
        )}
      </span>
    </div>
  );
};

export default PoolJoin;
