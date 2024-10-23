import { useEffect, useState } from "react";
import TokenInput from "../TokenInput";
import { useAccount } from "wagmi";
import ERC20 from "../../contract-hooks/ERC20";
import PoolRouter from "../../contract-hooks/PoolRouter";
import Pool from "../../contract-hooks/Pool";
import "../../styles/TokenInput.css";

const PoolJoin = ({
  pool,
  cycleDepositToken,
  collateralTokensData,
  updateActionBtn,
  positions,
  addPosition,
}) => {
  const collateralTokens = getCollateralTokens(collateralTokensData);

  const [collateralToken, setCollateralToken] = useState(collateralTokens[0]);
  const [amountCollateral, setAmountCollateral] = useState();
  const [userCollateralBalance, setUserCollateralBalance] = useState();
  const [userCollateralAllowance, setUserCollateralAllowance] = useState();

  const { address } = useAccount();
  const poolRouter = new PoolRouter(pool.address);

  useEffect(() => {
    getAmountCollateral();
    updateUserCollateralBalance();
    updateUserCollateralAllowance();
  }, [collateralToken]);

  useEffect(() => {
    if (!address) return;

    updateUserCollateralBalance();
    updateUserCollateralAllowance();
  }, [address]);

  useEffect(() => {
    const updatingActionBtn = () => {
      if (positions.length == pool.requiredPositions) {
        return updateActionBtn({
          text: "Pool is Filled",
          disabled: true,
        });
      }

      if (userCollateralBalance < amountCollateral) {
        return updateActionBtn({
          text: `Approve ${amountCollateral.toFixed(5)} ${collateralToken.symbol}`,
          disabled: true,
        });
      }

      if (userCollateralAllowance < amountCollateral) {
        return updateActionBtn({
          text: `Approve ${amountCollateral.toFixed(5)} ${collateralToken.symbol}`,
          disabled: false,
          onClick: handleApproveCollateral,
        });
      }

      return updateActionBtn({
        text: "Join Pool",
        disabled: false,
        onClick: handleJoinPool,
      });
    };

    updatingActionBtn();
  }, [userCollateralBalance, userCollateralAllowance, positions]);

  function getCollateralTokens(collateralTokensData) {
    const collateralTokens = [];

    for (let token of collateralTokensData) {
      const { address, name, symbol, decimals, syAddress } = token;
      const _collateralToken = new ERC20(address, name, symbol, decimals);
      _collateralToken.syAddress = syAddress;
      collateralTokens.push(_collateralToken);
    }

    return collateralTokens;
  }

  const updateUserCollateralBalance = async () => {
    const balance = await collateralToken.balanceOf(address);
    setUserCollateralBalance(balance);
  };

  const updateUserCollateralAllowance = async () => {
    const allowance = await collateralToken.allowance(address, poolRouter.address);
    setUserCollateralAllowance(allowance);
  };

  const getAmountCollateral = async () => {
    const _amountCollateral = await pool.getAmountCollateral(collateralToken);
    setAmountCollateral(_amountCollateral);
  };

  const handleApproveCollateral = async () => {
    await collateralToken.approve(poolRouter.address, amountCollateral);
    updateUserCollateralAllowance();
  };

  const handleCollateralTokenChange = (e) => {
    setCollateralToken(e.target.value);
  };

  const handleJoinPool = async () => {
    const position = await poolRouter.depositCollateral(
      collateralToken.address,
      collateralToken.syAddress,
      amountCollateral
    );

    updateUserCollateralBalance();
    updateUserCollateralAllowance();
    addPosition(position);
  };

  return (
    amountCollateral && (
      <>
        <span
          style={{
            fontSize: "14px",
            position: "absolute",
            right: "20px",
            top: "5px",
          }}
        >
          ~{pool.amountCollateralInAccounting} {cycleDepositToken.symbol}
        </span>
        <div className="pool__interface-box">
          <span className="label">YBT Collateral</span>
          <span className="input-box">
            <span className="input"> {amountCollateral.toFixed(5)}</span>
            <select
              value={collateralToken.symbol}
              onChange={handleCollateralTokenChange}
              name=""
              id=""
            >
              {collateralTokens.map((token, index) => {
                return (
                  <option key={index} value={token.symbol}>
                    {token.symbol}
                  </option>
                );
              })}
            </select>
          </span>
        </div>
      </>
    )
  );
};

export default PoolJoin;
