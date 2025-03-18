import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";
import ConnectWalletBtn from "../ConnectWalletBtn";
import { displayAmount } from "../../utils/displayAmounts";
import { toastSuccess } from "../../utils/toastWrapper";

const PoolBid = ({ pool, poolChainId, currentCycle, position, setLoading }) => {
  const [amountBid, setAmountBid] = useState("");
  const [lowestBid, setLowestBid] = useState({});
  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address, chainId } = useAccount();

  useEffect(() => {
    updateLowestBid();
  }, [currentCycle]);

  const updateLowestBid = async () => {
    setLowestBid(await pool.getLowestBid());
  };

  const handleAmountBidChange = (e) => {
    setAmountBid(e.target.value);
  };

  useEffect(() => {
    if (!position) {
      return setActionBtn({
        text: `Not Joined`,
        disabled: true,
      });
    }

    const updatingActionBtn = () => {
      if (position.winningCycle) {
        return setActionBtn({
          text: `Already Won, Cannot Bid`,
          disabled: true,
        });
      }

      const maxBidAmount = lowestBid.amount?.gt(0)
        ? lowestBid.amount
        : pool.amountCollateralInBase.plus(1);

      if (!amountBid || parseInt(amountBid) === 0) {
        return setActionBtn({
          text: `Bid Lowest Liqudity`,
          disabled: true,
        });
      }

      if (amountBid >= maxBidAmount) {
        return setActionBtn({
          text: `Bid Amount too High`,
          disabled: true,
        });
      }
      return setActionBtn({
        text: `Bid Lowest Liqudity`,
        disabled: false,
        onClick: handleAsync(handleCycleBid, setLoading),
      });
    };

    updatingActionBtn();
  }, [position, currentCycle, amountBid]);

  const handleCycleBid = async () => {
    await pool.bidCycle(position.id, amountBid);
    toastSuccess(`Lowest bid is now yours at ${amountBid} ${pool.baseToken.symbol}`);

    setAmountBid("");
    updateLowestBid();
  };

  return (
    position && (
      <div className="pool__interface">
        {lowestBid.amount?.isZero() ? (
          <>
            <span style={{ alignSelf: "flex-start" }}>No Bids Yet</span>
            <span style={{ alignSelf: "flex-start" }}>
              Eligible Bidders: {pool.totalCycles - (currentCycle - 1)}
            </span>
            <span style={{ alignSelf: "flex-start" }}>
              Max/Start Bid: {displayAmount(pool.amountCollateralInBase)} {pool.baseToken.symbol}
            </span>
          </>
        ) : (
          <>
            <span style={{ alignSelf: "flex-start" }}>
              Current Lowest Bid: {displayAmount(lowestBid.amount)} {pool.baseToken.symbol}
            </span>
            <span style={{ alignSelf: "flex-start" }}>
              Eligible Bidders: {pool.totalCycles - (currentCycle - 1)}
            </span>
            <span style={{ alignSelf: "flex-start" }}>
              {" "}
              By PositionId: {lowestBid.positionId}{" "}
              {position.id === lowestBid.positionId ? "(Your Position)" : ""}
            </span>
          </>
        )}

        <div className="pool__interface-box">
          <span className="label">Cycle Bid ({pool.baseToken.symbol})</span>
          <span className="input-box">
            <span className="input">
              <input
                style={{ background: "inherit", textAlign: "center" }}
                onChange={handleAmountBidChange}
                value={amountBid}
              />{" "}
            </span>
          </span>
        </div>

        {address ? (
          chainId === poolChainId ? (
            <button
              onClick={actionBtn.onClick}
              disabled={actionBtn.disabled}
              className="btn btn--primary"
            >
              {actionBtn.text}
            </button>
          ) : (
            <button
              disabled={false}
              onClick={() => switchChain({ chainId: poolChainId })}
              className="btn btn--primary"
            >
              {`Switch to ${chainConfig[poolChainId].name}`}
            </button>
          )
        ) : (
          <ConnectWalletBtn className="btn btn--primary" />
        )}
      </div>
    )
  );
};

export default PoolBid;
