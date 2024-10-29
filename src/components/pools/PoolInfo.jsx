import { displayAmount } from "../../utils/displayAmounts";
import { displayDuration } from "../../utils/DisplayDuration";
import { getLocalTimeFromTimestamp } from "../../utils/time";
import truncateStr from "../../utils/truncateStr";

const PoolInfo = ({ pool }) => {
  return (
    <div className="pool__info">
      <p>
        <span>Pool Address:</span> {truncateStr(pool.address, 15)}
      </p>
      <p>
        <span>Cycle Amount:</span> {displayAmount(pool.amountCycle)} {pool.baseToken.symbol}
      </p>
      <p>
        {" "}
        <span>Collateral Amount:</span> ~ {displayAmount(pool.amountCollateralInAccounting)}{" "}
        {pool.baseToken.symbol}
      </p>
      <p>
        {" "}
        <span>Total Cycles:</span> {pool.totalCycles}
      </p>
      <p>
        {" "}
        <span>Cycle Duration:</span> {displayDuration(pool.cycleDuration)}
      </p>
      <p>
        {" "}
        <span>Cycle Deposit Duration:</span>
        {displayDuration(pool.cycleDepositDuration)}
      </p>
      <p>
        {" "}
        <span>Start Time: </span>
        {getLocalTimeFromTimestamp(pool.startTime)}
      </p>
    </div>
  );
};

export default PoolInfo;
