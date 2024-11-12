import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import Skeleton from "react-loading-skeleton";
import { displayAmount } from "../../utils/displayAmounts";

const PoolJoin = ({ pool, allPositions, getAllPositions, setActionBtn, setLoading }) => {
  const [ybtCollateral, setYbtCollateral] = useState(pool.collateralTokens[0]);
  const [amountYbtCollateral, setAmountYbtCollateral] = useState();
  const [userYbtCollateralBalance, setUserYbtCollateralBalance] = useState();
  const [userYbtCollateralAllowance, setUserYbtCollateralAllowance] = useState();

  const { address } = useAccount();

  useEffect(() => {
    getAmountCollateral();
    updateUserYbtCollateralBalance();
    updateUserYbtCollateralAllowance();
  }, [ybtCollateral]);

  useEffect(() => {
    if (!address) return;

    updateUserYbtCollateralBalance();
    updateUserYbtCollateralAllowance();
  }, [address]);

  useEffect(() => {
    if (!amountYbtCollateral) return;

    const updatingActionBtn = () => {
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
    ybtCollateral,
    amountYbtCollateral,
  ]);

  const getAmountCollateral = async () => {
    setAmountYbtCollateral(undefined);

    const _amountCollateral = await pool.getAmountCollateral(ybtCollateral);
    setAmountYbtCollateral(_amountCollateral);
  };

  const updateUserYbtCollateralBalance = async () => {
    const balance = await ybtCollateral.balanceOf(address);
    setUserYbtCollateralBalance(balance);
  };

  const updateUserYbtCollateralAllowance = async () => {
    const allowance = await ybtCollateral.allowance(address, pool.address);

    setUserYbtCollateralAllowance(allowance);
  };

  const handleYbtCollateralChange = (e) => {
    setYbtCollateral(pool.collateralTokens[parseInt(e.target.value)]);
  };

  const handleApproveAndJoin = async () => {
    await ybtCollateral.approve(pool.address, amountYbtCollateral);
    await Promise.all([updateUserYbtCollateralAllowance(), handleJoin()]);
  };

  const handleJoin = async () => {
    await pool.depositYbtCollateral(ybtCollateral.syAddress, address);

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
        ~{displayAmount(pool.amountCollateralInAccounting)} {pool.baseToken.symbol}
      </span>
      <span className="input-box">
        {amountYbtCollateral ? (
          <>
            <span className="input">{amountYbtCollateral.toFixed(3)}</span>
            <select onChange={handleYbtCollateralChange} value={ybtCollateral.index} name="" id="">
              {pool.collateralTokens.map((token, index) => (
                <option key={index} value={index}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </>
        ) : (
          <Skeleton baseColor="var(--color-bg)" width="120px" />
        )}
      </span>
    </div>
  );
};

export default PoolJoin;
