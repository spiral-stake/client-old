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

        if (position.amountCollateral?.isGreaterThan(0)) {
          setActionBtn({
            text: `Redeem YBT Collateral`,
            disabled: false,
            onClick: handleAsync(handleRedeemCollateralIfDiscarded, setLoading),
          });
        } else {
          setActionBtn({
            text: `Redeemed YBT Collateral`,
            disabled: true,
          });
        }
      } else {
        const _amountCollateralYield = await pool.getCollateralYield(position);
        setAmountCollateralYield(_amountCollateralYield);

        if (_amountCollateralYield?.isGreaterThan(0)) {
          setActionBtn({
            text: `Claim YBT Yield`,
            disabled: false,
            onClick: handleAsync(handleClaimYield, setLoading),
          });
        } else {
          setActionBtn({
            text: `Claimed YBT Yield`,
            disabled: true,
          });
        }
      }
    };

    updatingActionBtn();
  }, [position, state, setActionBtn]);

  const handleClaimYield = async () => {
    await pool.claimCollateralYield(position.id);

    await updatePosition(position.id);
  };

  const handleRedeemCollateralIfDiscarded = async () => {
    await pool.redeemCollateralIfDiscarded(position.id);

    await updatePosition(position.id);
  };

  return (
    position &&
    ((state === "DISCARDED" && amountCollateral?.isGreaterThan(0)) ||
      amountCollateralYield?.isGreaterThan(0)) && (
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
    )
  );
};

export default PoolRedeem;
