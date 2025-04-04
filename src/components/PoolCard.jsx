import { useEffect, useMemo, useState } from "react";
import Pool from "../contract-hooks/Pool";
import "../styles/poolCard.css";
import { formatTime, getLocalTimeFromTimestamp } from "../utils/time";
import token from "../assets/images/token/token2.png";
import { Link } from "react-router-dom";
import arrow from "../assets/images/Arrow-right-up-Line.svg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useChainId } from "wagmi";
import { displayAmount } from "../utils/displayAmounts";

const PoolCard = ({ poolAddress, ybt }) => {
  const [pool, setPool] = useState();
  const [state, setState] = useState();
  const [currentCycle, setCycle] = useState();
  const [positionsFilled, setPositionsFilled] = useState();
  const [cyclesFinalized, setCyclesFinalized] = useState();

  const poolChainId = useChainId();

  useEffect(() => {
    const getPool = async () => {
      const [_pool, _positionsFilled, _cyclesFinalized] = await Promise.all([
        Pool.createInstance(poolAddress),
        new Pool(poolAddress).getPositionsFilled(),
        new Pool(poolAddress).getCyclesFinalized(),
      ]);

      setPool(_pool);
      setPositionsFilled(_positionsFilled);
      setCyclesFinalized(_cyclesFinalized);
    };

    getPool();
  }, [poolAddress]);

  useEffect(() => {
    if (!pool) return;

    setState(pool.calcPoolState(positionsFilled, cyclesFinalized));
  }, [pool, positionsFilled, cyclesFinalized]);

  useEffect(() => {
    if (state !== "LIVE") return;

    setCycle(pool.calcCurrentCycle());
  }, [state]);

  return (
    <SkeletonTheme height={25} width={100} baseColor="#dee4fa">
      <div className="card_ liSt mobileCard">
        <div className="card_Title">
          <div className="cryLogo">
            <img src={token} />
            <div>
              <h3>{ybt.symbol}</h3>
              <h4 style={{ color: "#dba501" }}>
                {pool ? (
                  `Bid = ${displayAmount(pool.amountCollateralInBase)} ${
                    ybt.baseToken.symbol === "wETH" ? "ETH" : ybt.baseToken.symbol
                  }`
                ) : (
                  <Skeleton />
                )}
              </h4>
            </div>
          </div>
          <div className="card__tags">
            {currentCycle && (
              <button disabled={true} className="btnYellow">
                {pool ? `Cycle ${currentCycle} / ${pool.totalCycles}` : <Skeleton />}
              </button>
            )}
            {state ? (
              <button disabled={true} className="btnYellow">
                {state}
              </button>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="card_body">
          {/* <ProgressBar
            percent={(10000 / 20000) * 100}
            currentValue={`10,000 USD`}
            endValue={`20,000 USD`}
          /> */}
          <ul>
            <li>
              <small>Total Cycles</small>
              <h3>{pool ? pool.totalCycles : <Skeleton />}</h3>
            </li>
            <li>
              <small>Cycle Duration</small>
              <h3>
                {pool ? (
                  <>
                    {formatTime(pool.cycleDuration).value}{" "}
                    <small className="mx-1">{formatTime(pool.cycleDuration).unit}</small>{" "}
                  </>
                ) : (
                  <Skeleton />
                )}
              </h3>
            </li>
            <li>
              <small>YBT Collateral</small>
              <h3>
                {pool ? (
                  <>
                    ~ {displayAmount(pool.amountCollateralInBase, 2)}{" "}
                    <small className="mx-1">
                      {ybt.baseToken.symbol === "wETH" ? "ETH" : ybt.baseToken.symbol}
                    </small>
                  </>
                ) : (
                  <Skeleton />
                )}
              </h3>
            </li>
            <li>
              <small>Cycle Deposit</small>
              <h3>
                {pool ? (
                  <>
                    {displayAmount(pool.amountCycle, 2)}{" "}
                    <small className="mx-1">
                      {ybt.baseToken.symbol === "wETH" ? "ETH" : ybt.baseToken.symbol}
                    </small>
                  </>
                ) : (
                  <Skeleton />
                )}
              </h3>
            </li>
          </ul>
        </div>
        <div className="card_footer">
          <div className="saleTime">
            <h3>
              {pool ? (
                `Start Time - ${
                  pool &&
                  `${getLocalTimeFromTimestamp(pool.startTime).formattedDate} ${
                    getLocalTimeFromTimestamp(pool.startTime).formattedTime
                  }`
                }`
              ) : (
                <Skeleton />
              )}
            </h3>

            {/* <Countdown
              onComplete={() => handleCountdownComplete(index, "ended")}
              date={new Date().getTime() + 3600000}
              renderer={({ days, hours, minutes, seconds }) => (
                <h3>
                  Sale Ends In -{" "}
                  <span>
                    {days}:{hours}:{minutes}:{seconds}
                  </span>
                </h3>
              )}
            /> */}
          </div>
          <div className="share">
            {true && (
              <img style={{ width: "25px", margin: "0 5px" }} src="/images/key.svg" alt="" />
            )}
            {pool ? (
              <Link to={`/pools/${pool.address}?ybt=${ybt.symbol}&poolChainId=${poolChainId}`}>
                <a className="btn btn--primary btn--view">
                  view <img src={arrow} />
                </a>
              </Link>
            ) : (
              <Skeleton width={60} />
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PoolCard;
