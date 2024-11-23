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

const PoolPage = () => {
  const [pool, setPool] = useState();
  const [state, setState] = useState(undefined);
  const [currentCycle, setCycle] = useState(0);
  const [cyclesFinalized, setCyclesFinalized] = useState(0);

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
  const baseTokenSymbol = useSearchParams()[0].get("baseToken");
  const poolChainId = parseInt(useSearchParams()[0].get("poolChainId"));

  useEffect(() => {
    async function getPool() {
      const _pool = await Pool.createInstance(poolAddress, poolChainId, baseTokenSymbol);

      setPool(_pool);

      const [_allPositions, _cyclesFinalized] = await Promise.all([
        _pool.getAllPositions(),
        _pool.getCyclesFinalized(),
      ]);

      setState(_pool.calcPoolState(_allPositions.length, _cyclesFinalized));
      setCyclesFinalized(_cyclesFinalized);
      setAllPositions(_allPositions);
    }

    getPool();
  }, []);

  useEffect(() => {
    if (state !== "LIVE") return;

    setCycle(pool.calcCurrentCycle());
  }, [state]);

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
        />
      );
    }

    if (state === "DISCARDED" || state === "ENDED") {
      return (
        <PoolRedeem
          pool={pool}
          state={state}
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
