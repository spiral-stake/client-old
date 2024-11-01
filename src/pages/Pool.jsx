import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Pool from "../contract-hooks/Pool.js";
import "../styles/pool.css";
import { useAccount } from "wagmi";
import PoolJoin from "../components/pools/PoolJoin.jsx";
import Spiral from "../components/pools/Spiral.jsx";
import PoolRedeem from "../components/pools/PoolRedeem.jsx";
import PoolContribute from "../components/pools/PoolContribute.jsx";
import ConnectWalletBtn from "../components/ConnectWalletBtn.jsx";
import PoolInfo from "../components/pools/PoolInfo.jsx";

const PoolPage = () => {
  const [pool, setPool] = useState();
  const [state, setState] = useState("");
  const [currentCycle, setCycle] = useState(0);
  const [cyclesFinalized, setCyclesFinalized] = useState(0);

  const [allPositions, setAllPositions] = useState();
  const [position, setPosition] = useState();

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address } = useAccount();
  const { address: poolAddress } = useParams();
  const baseTokenSymbol = useSearchParams()[0].get("baseToken");

  useEffect(() => {
    async function getPool() {
      const _pool = await Pool.createInstance(poolAddress, baseTokenSymbol);

      const [_allPositions, _cyclesFinalized] = await Promise.all([
        _pool.getAllPositions(),
        _pool.getCyclesFinalized(),
      ]);

      setPool(_pool);
      setState(_pool.calcPoolState(_allPositions.length, cyclesFinalized));
      setCyclesFinalized(_cyclesFinalized);
      setAllPositions(_allPositions);
    }

    getPool();
  }, []);

  console.log(allPositions);

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
        />
      );
    }
  };

  return pool ? (
    <div className="pool">
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
        <div disabled={true} className="tag">
          <span>{state}</span>
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
        </div>

        <div className="pool__interface">
          {position && `Your Position Id: ${position.id}`}
          {renderPoolInterface()}
          {address ? (
            <button
              onClick={actionBtn.onClick}
              disabled={actionBtn.disabled}
              className="btn btn--primary"
            >
              {actionBtn.text}
            </button>
          ) : (
            <ConnectWalletBtn className="btn btn--primary" />
          )}
        </div>

        <PoolInfo pool={pool} />
      </div>
    </div>
  ) : null;
};

export default PoolPage;
