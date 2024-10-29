import { useEffect, useState } from "react";
import { displayAmount } from "../../utils/displayAmounts";

const PoolRedeem = ({ pool, state, position, updatePosition, setActionBtn }) => {
  const [amountCollateral, setAmountCollateral] = useState(null);
  const [amountCollateralYield, setAmountCollateralYield] = useState(null);

  useEffect(() => {
    if (!position) {
      setActionBtn({
        text: `Pool Discarded`,
        disabled: true,
      });
      return;
    }

    const updatingActionBtn = async () => {
      if (state === "DISCARDED") {
        setAmountCollateral(position.amountCollateral);

        if (!position.amountCollateral) {
          setActionBtn({
            text: `Redeemed YBT Collateral`,
            disabled: true,
          });
        } else {
          setActionBtn({
            text: `Redeem YBT Collateral`,
            disabled: false,
            onClick: handleRedeemCollateralIfDiscarded,
          });
        }
      } else {
        const _amountCollateralYield = await pool.getCollateralYield(position);
        setAmountCollateralYield(_amountCollateralYield);

        if (!_amountCollateralYield) {
          setActionBtn({
            text: `Redeemed YBT Yield`,
            disabled: true,
          });
        } else {
          setActionBtn({
            text: `Redeem YBT Yield`,
            disabled: false,
            onClick: handleRedeemYield,
          });
        }
      }
    };

    updatingActionBtn();
  }, [position, state, setActionBtn]);

  // On all Cycles Finalized
  const handleRedeemYield = async () => {
    await pool.redeemCollateralYield(position.id);
    setAmountCollateralYield(0);
    updatePosition(position.id);
  };

  const handleRedeemCollateralIfDiscarded = async () => {
    await pool.redeemCollateralIfDiscarded(position.id);
    setAmountCollateral(0);
    updatePosition(position.id);
  };

  return position ? (
    (state === "DISCARDED" && amountCollateral) || amountCollateralYield ? (
      <div className="pool__interface-box">
        <span className="label">Redeem Collateral</span>
        <span className="input-box">
          <span className="input">
            {state === "DISCARDED"
              ? displayAmount(amountCollateral)
              : displayAmount(amountCollateralYield)}{" "}
            {pool.baseToken.symbol}
          </span>
        </span>
      </div>
    ) : null
  ) : null;
};

export default PoolRedeem;
