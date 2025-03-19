import { displayAmount } from "../../utils/displayAmounts";
import { formatTime, getLocalTimeFromTimestamp } from "../../utils/time";

const PoolInfo = ({ pool, state, currentCycleData }) => {
  return (
    <div className="pool__info">
      <ul>
        <li>
          <small>Collateral Amount</small>
          <h3>
            {pool ? (
              <>
                ~{displayAmount(pool.amountCollateralInBase)}{" "}
                <small className="mx-1">{pool.baseToken.symbol}</small>
              </>
            ) : (
              <Skeleton />
            )}
          </h3>
        </li>

        <li>
          <small>Cycle Amount</small>
          <h3>
            {pool ? (
              <>
                {displayAmount(pool.amountCycle)}{" "}
                <small className="mx-1">{pool.baseToken.symbol}</small>
              </>
            ) : (
              <Skeleton />
            )}
          </h3>
        </li>

        <li>
          <small>Total Cycles</small>
          <h3>
            {pool ? pool.totalCycles : <Skeleton />} <small>Cycles</small>
          </h3>
        </li>

        <li>
          <small>Cycle Duration</small>
          <h3>
            {pool ? formatTime(pool.cycleDuration).value : <Skeleton />}{" "}
            <small className="mx-1">{pool ? formatTime(pool.cycleDuration).unit : ""}</small>
          </h3>
        </li>

        <li>
          <small>Deposit & Bid Window</small>
          <h3>
            {pool ? formatTime(pool.cycleDepositAndBidDuration).value : <Skeleton />}{" "}
            <small className="mx-1">
              {pool ? formatTime(pool.cycleDepositAndBidDuration).unit : ""}
            </small>
          </h3>
        </li>

        {!currentCycleData ? (
          <li>
            <small>{state === "WAITING" ? "Starting at" : "Discarded at"}</small>
            <h3>
              {pool ? getLocalTimeFromTimestamp(pool.startTime).formattedDate : <Skeleton />}{" "}
              <small className="mx-1">
                {pool ? getLocalTimeFromTimestamp(pool.startTime).formattedTime : ""}
              </small>
            </h3>
          </li>
        ) : (
          <li>
            <small>{state === "LIVE" ? "Cycle Ends at" : "Ended at"}</small>
            <h3>
              {pool ? (
                getLocalTimeFromTimestamp(currentCycleData?.endTime).formattedDate
              ) : (
                <Skeleton />
              )}{" "}
              <small className="mx-1">
                {pool ? getLocalTimeFromTimestamp(currentCycleData?.endTime).formattedTime : ""}
              </small>
            </h3>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PoolInfo;
