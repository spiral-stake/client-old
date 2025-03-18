import { useEffect, useState } from "react";
import { displayAmount } from "../../utils/displayAmounts";
import { handleAsync } from "../../utils/handleAsyncFunction";
import { toastSuccess } from "../../utils/toastWrapper";

const PoolRedeem = ({ pool, position, updatePosition, setActionBtn, setLoading }) => {
  const [amountCollateral, setAmountCollateral] = useState(null);

  useEffect(() => {
    if (!position) {
      setActionBtn({
        text: `Pool Discarded`,
        disabled: true,
      });
      return;
    }

    const updatingActionBtn = async () => {
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
    };

    updatingActionBtn();
  }, [position, setActionBtn]);

  const handleRedeemCollateralIfDiscarded = async () => {
    await pool.redeemCollateralIfDiscarded(position.id);
    toastSuccess("Redeemed Collateral successfully");

    await updatePosition(position.id);
  };

  return (
    position &&
    amountCollateral?.isGreaterThan(0) && (
      <div className="pool__interface-box">
        <span className="label">Redeem Collateral</span>
        <span className="input-box">
          <span className="input">
            {displayAmount(amountCollateral)}
            {pool.ybt.symbol}
          </span>
        </span>
      </div>
    )
  );
};

export default PoolRedeem;
