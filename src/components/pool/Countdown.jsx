import Skeleton from "react-loading-skeleton";
import { countdown, getCurrentTimestampInSeconds } from "../../utils/time";
import { useEffect, useState } from "react";

const Countdown = ({
  pool,
  state,
  currentCycleData,
  isCycleDepositAndBidOpen,
  getPoolState,
  closeCycleDepositWindow,
  updateCurrentCycle,
}) => {
  const [timestamp, setTimestamp] = useState(getCurrentTimestampInSeconds());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimestamp(getCurrentTimestampInSeconds());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (state === "WAITING" && pool.startTime === timestamp) {
      getPoolState();
    }

    if (currentCycleData) {
      if (currentCycleData?.depositAndBidEndTime === timestamp) {
        closeCycleDepositWindow();
      }

      if (currentCycleData?.endTime === timestamp) {
        updateCurrentCycle();
      }
    }
  }, [timestamp, state, pool.startTime, isCycleDepositAndBidOpen, currentCycleData]);

  return (
    <div className="tag">
      {state === "WAITING" ? (
        <>
          <span>Starting In</span>
          <span>{countdown(pool.startTime - timestamp)}</span>
        </>
      ) : currentCycleData ? (
        isCycleDepositAndBidOpen ? (
          <>
            <span>Bid & Deposit</span>
            <span>{countdown(currentCycleData.depositAndBidEndTime - timestamp)}</span>
          </>
        ) : (
          <>
            <span>Cycle Ends In</span>
            <span>{countdown(currentCycleData.endTime - timestamp)}</span>
          </>
        )
      ) : (
        <Skeleton width={100} baseColor="var(--color-secondary)" />
      )}
    </div>
  );
};

export default Countdown;
