import { useEffect, useState } from "react";
import { displayAmount } from "../../utils/displayAmounts";
import { handleAsync } from "../../utils/handleAsyncFunction";

const PoolRedeem = ({ pool, state, position, updatePosition, setActionBtn, setLoading }) => {
  const [amountCollateral, setAmountCollateral] = useState(null);
  const [amountCollateralYield, setAmountCollateralYield] = useState(null);

  useEffect(() => {
    if (!position) {
      setActionBtn({
        text: `Pool ${state}`,
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
            onClick: handleAsync(handleRedeemCollateralIfDiscarded, setLoading),
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
            onClick: handleAsync(handleRedeemYield, setLoading),
          });
        }
      }
    };

    updatingActionBtn();
  }, [position, state, setActionBtn]);

  const handleRedeemYield = async () => {
    await pool.redeemCollateralYield(position.id);

    await updatePosition(position.id);
  };

  const handleRedeemCollateralIfDiscarded = async () => {
    await pool.redeemCollateralIfDiscarded(position.id);

    await updatePosition(position.id);
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
