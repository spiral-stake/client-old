import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Pool from "../contract-hooks/Pool.js";
import "../styles/pool.css";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import PoolJoin from "../components/pool/PoolJoin.jsx";
import Spiral from "../components/spiral/Spiral.jsx";
import PoolRedeem from "../components/pool/PoolRedeem.jsx";
import PoolContribute from "../components/pool/PoolContribute.jsx";
import ConnectWalletBtn from "../components/ConnectWalletBtn.jsx";
import PoolInfo from "../components/pool/PoolInfo.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import { chainConfig } from "../config/chainConfig.js";
import Loader from "../components/Loader.jsx";
import Skeleton from "react-loading-skeleton";
import PoolBid from "../components/pool/PoolBid.jsx";
import { getCurrentTimestampInSeconds } from "../utils/time.js";
import { toastSuccess } from "../utils/toastWrapper.js";

const PoolPage = () => {
  const [timestamp, setTimestamp] = useState();
  const [timerId, setTimerId] = useState(null);

  const [pool, setPool] = useState();
  const [state, setState] = useState(undefined);
  const [cyclesFinalized, setCyclesFinalized] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentCycleData, setCurrentCycleData] = useState({});
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] = useState();

  const [allPositions, setAllPositions] = useState();
  const [position, setPosition] = useState();

  const [actionBtn, setActionBtn] = useState({
    text: "Loading ...",
    onClick: () => {},
    disabled: false,
  });
  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { address: poolAddress } = useParams();
  const ybtSymbol = useSearchParams()[0].get("ybt");
  const poolChainId = parseInt(useSearchParams()[0].get("poolChainId"));

  useEffect(() => {
    const _timerId = setInterval(() => {
      setTimestamp(getCurrentTimestampInSeconds());
    }, 1000);

    setTimerId(_timerId);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    getPool();
  }, []);

  useEffect(() => {
    if (!pool) return;

    getPoolState();
  }, [pool]);

  useEffect(() => {
    if (!pool) return;

    // UPDATES ON POOL START
    if (timestamp === pool.startTime) {
      getPoolState();
    }

    // UPDATES ON CYCLE CHANGE
    if (timestamp === currentCycleData.endTime) {
      setCurrentCycle(currentCycle + 1);
    }

    // UPDATES ON CYCLE DEPOSIT AND BID DURATION CLOSURE
    if (timestamp === currentCycleData.depositAndBidEndTime) {
      setIsCycleDepositAndBidOpen(false);
      toastSuccess(`Deposit and Bid Window closed for cycle ${currentCycle}`);
    }

    if (timestamp === currentCycleData.depositAndBidEndTime + 10) {
      getPoolState();
    }
  }, [timestamp]);

  useEffect(() => {
    if (state === "LIVE") {
      // Only the first time
      if (!currentCycle) {
        return setCurrentCycle(pool.calcCurrentCycle());
      }

      const { startTime, endTime } = pool.calcCycleStartAndEndTime(currentCycle);
      const depositAndBidEndTime = pool.calcDepositAndBidEndTime(currentCycle);

      setCurrentCycleData({ startTime, endTime, depositAndBidEndTime });
      setIsCycleDepositAndBidOpen(pool.calcIsCycleDepositAndBidOpen(currentCycle));
      toastSuccess(`Cycle ${currentCycle} has started, Please make cycle Deposits and Bid`);
    } else if (state === "DISCARDED") {
      clearInterval(timerId);
      toastSuccess("Pool Discarded, Please redeem your YBT Collateral");
    } else if (state === "ENDED") {
      clearInterval(timerId);
      toastSuccess("Pool Ended, Claim Yield (if any)");
      setActionBtn({ text: "Pool Ended", disabled: true });
    }
  }, [state, currentCycle]);

  useEffect(() => {
    if (!address) return;
    if (!state || state == "WAITING") return;

    const userPositions = allPositions.filter((position) => position.owner === address);

    if (userPositions.length) {
      setPosition(userPositions[0]);
    } else {
      setPosition(undefined);
    }
  }, [address, state]);

  async function getPool() {
    const _pool = await Pool.createInstance(poolAddress, poolChainId, ybtSymbol);

    setPool(_pool);
  }

  const getPoolState = async () => {
    const [_allPositions, _cyclesFinalized] = await Promise.all([
      pool.getAllPositions(),
      pool.getCyclesFinalized(),
    ]);

    setState(pool.calcPoolState(_allPositions.length, _cyclesFinalized));
    setCyclesFinalized(_cyclesFinalized);
    setAllPositions(_allPositions);
  };

  const getAllPositions = async () => {
    const _allPositions = await pool.getAllPositions();
    setAllPositions(_allPositions);
  };

  const updatePosition = async (positionId) => {
    const updatedPosition = await pool.getPosition(positionId);

    setPosition(updatedPosition);

    const updatedPositions = [...allPositions];
    updatedPositions[positionId] = updatedPosition;
    setAllPositions(updatedPositions);
  };

  const renderPoolInterface = () => {
    if (state === "WAITING") {
      return (
        <PoolJoin
          pool={pool}
          allPositions={allPositions}
          getAllPositions={getAllPositions}
          setActionBtn={setActionBtn}
          setLoading={setLoading}
        />
      );
    }

    if (state === "LIVE") {
      return (
        <PoolContribute
          pool={pool}
          currentCycle={currentCycle}
          position={position}
          updatePosition={updatePosition}
          setActionBtn={setActionBtn}
          setLoading={setLoading}
          isCycleDepositAndBidOpen={isCycleDepositAndBidOpen}
        />
      );
    }

    if (state === "DISCARDED") {
      return (
        <PoolRedeem
          pool={pool}
          position={position}
          updatePosition={updatePosition}
          setActionBtn={setActionBtn}
          setLoading={setLoading}
        />
      );
    }
  };

  return pool ? (
    <>
      <div className="pool">
        <div className="pool__grid">
          <Spiral
            pool={pool}
            allPositions={allPositions}
            updatePosition={updatePosition}
            currentCycle={currentCycle}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              rowGap: "20px",
              justifyContent: "flex-start",
            }}
          >
            <div className="tag">
              <>
                {state ? (
                  <span>{state}</span>
                ) : (
                  <Skeleton width={100} baseColor="var(--color-secondary)" />
                )}
                {state === "LIVE" && (
                  <span>
                    Cycle - {currentCycle}/{pool.totalCycles}{" "}
                  </span>
                )}
                {state === "ENDED" && (
                  <span>
                    Cycle's Finalized - {cyclesFinalized}/{pool.totalCycles}{" "}
                  </span>
                )}
                {(state === "WAITING" || state === "DISCARDED") && (
                  <span>
                    Filled - {allPositions.length}/{pool.totalPositions}{" "}
                  </span>
                )}
                {state === undefined && <Skeleton width={100} baseColor="var(--color-secondary)" />}
              </>
            </div>
            <div className="pool__interface">
              {/* {position && `Your Position Id: ${position.id}`} */}
              {renderPoolInterface()}
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
            {isCycleDepositAndBidOpen && (
              <PoolBid
                poolChainId={poolChainId}
                pool={pool}
                currentCycle={currentCycle}
                position={position}
                setLoading={setLoading}
              />
            )}
            <PoolInfo pool={pool} />
          </div>
        </div>
      </div>
      <LoadingOverlay loading={loading} />
    </>
  ) : (
    <Loader />
  );
};

export default PoolPage;
