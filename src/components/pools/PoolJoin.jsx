import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import PoolRouter from "../../contract-hooks/PoolRouter";
import "../../styles/TokenInput.css";

const PoolJoin = ({ pool, allPositions, getAllPositions, setActionBtn }) => {
  const [ybtCollateral, setYbtCollateral] = useState(pool.collateralTokens[0]);
  const [amountYbtCollateral, setAmountYbtCollateral] = useState();
  const [userYbtCollateralBalance, setUserYbtCollateralBalance] = useState();
  const [userYbtCollateralAllowance, setUserYbtCollateralAllowance] = useState();

  const { address } = useAccount();
  const poolRouter = new PoolRouter(pool.address);

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
    const updatingActionBtn = () => {
      if (allPositions.length == pool.totalPositions) {
        return setActionBtn({
          text: "Pool is Filled",
          disabled: true,
        });
      }

      if (userYbtCollateralAllowance < amountYbtCollateral) {
        return setActionBtn({
          text: `Approve ${amountYbtCollateral.toFixed(5)} ${ybtCollateral.symbol}`,
          disabled: userYbtCollateralBalance < amountYbtCollateral ? true : false,
          onClick: handleApproveYbtCollateral,
        });
      }

      return setActionBtn({
        text: "Join Pool",
        disabled: false,
        onClick: handleJoinPool,
      });
    };

    updatingActionBtn();
  }, [userYbtCollateralBalance, userYbtCollateralAllowance, allPositions]);

  const getAmountCollateral = async () => {
    const _amountCollateral = await pool.getAmountCollateral(ybtCollateral);
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

  const handleApproveYbtCollateral = async () => {
    await ybtCollateral.approve(poolRouter.address, amountYbtCollateral);
    updateUserYbtCollateralAllowance();
  };

  const handleYbtCollateralChange = (e) => {
    setYbtCollateral(e.target.value);
  };

  const handleJoinPool = async () => {
    await poolRouter.depositCollateral(
      ybtCollateral.address,
      ybtCollateral.syAddress,
      amountYbtCollateral
    );

    updateUserYbtCollateralBalance();
    updateUserYbtCollateralAllowance();
    getAllPositions();
  };

  return (
    amountYbtCollateral && (
      <div className="pool__interface-box">
        <span className="label">Cycle Deposit</span>
        <span
          style={{
            fontSize: "14px",
            position: "absolute",
            right: "20px",
            top: "5px",
          }}
        >
          ~{pool.amountCollateralInAccounting} {pool.baseToken.symbol}
        </span>
        <span className="input-box">
          <span className="input"> {amountYbtCollateral.toFixed(5)}</span>
          <select value={ybtCollateral.symbol} onChange={handleYbtCollateralChange} name="" id="">
            {pool.collateralTokens.map((token, index) => {
              return (
                <option key={index} value={token.symbol}>
                  {token.symbol}
                </option>
              );
            })}
          </select>
        </span>
      </div>
    )
  );
};

export default PoolJoin;
