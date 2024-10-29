import { useEffect, useMemo, useState } from "react";
import Pool from "../../contract-hooks/Pool";
import "../../styles/PoolCard.css";
import { getLocalTimeFromTimestamp } from "../../utils/time";
import token from "../../assets/images/token/token2.png";
import { Link } from "react-router-dom";
import arrow from "../../assets/images/Arrow-right-up-Line.svg";

const PoolCard = ({ poolAddress, baseToken }) => {
  const [pool, setPool] = useState();
  const [state, setState] = useState();
  const [currentCycle, setCycle] = useState();
  const [positionsFilled, setPositionsFilled] = useState();
  const [cyclesFinalized, setCyclesFinalized] = useState();

  console.log(baseToken);

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

  return pool ? (
    <>
      <div className="card_ liSt mobileCard">
        <div className="card_Title">
          <div className="cryLogo">
            <img src={token} />
            <div>
              <h3>{baseToken.symbol}</h3>
              <h4 style={{ color: "#dba501" }}>
                Win = {pool.amountCollateralInAccounting} {baseToken.symbol}
              </h4>
            </div>
          </div>
          <div>
            {currentCycle && (
              <button style={{ marginRight: "4px" }} disabled={true} className="btnYellow">
                Cycle {currentCycle} / {pool.totalCycles}
              </button>
            )}
            <button disabled={true} className="btnYellow">
              {state}
            </button>
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
              <h3>{pool.totalCycles}</h3>
            </li>
            <li>
              <small>Cycle Duration</small>
              <h3>
                {pool.cycleDuration / 240}{" "}
                <small className="mx-1">{pool.cycleDuration / 240 <= 1 ? "Month" : "Months"}</small>
              </h3>
            </li>
            <li>
              <small>YBT Collateral</small>
              <h3>
                ~ {pool.amountCollateralInAccounting}{" "}
                <small className="mx-1">{baseToken.symbol}</small>
              </h3>
            </li>
            <li>
              <small>Cycle Deposit</small>
              <h3>
                {pool.amountCycle} <small className="mx-1">{baseToken.symbol}</small>{" "}
              </h3>
            </li>
          </ul>
        </div>
        <div className="card_footer">
          <div className="saleTime">
            <h3>Starts at - {getLocalTimeFromTimestamp(pool.startTime)}</h3>

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
            <Link to={`/pools/${pool.address}?baseToken=${baseToken.symbol}`}>
              <a className="btn btn--primary btn--view">
                view <img src={arrow} />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default PoolCard;
