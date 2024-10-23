import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Pool from "../contract-hooks/Pool.js";
import ERC20 from "../contract-hooks/ERC20.js";
import ConnectWalletBtn from "../components/ConnectWalletBtn.jsx";
import "../styles/pool.css";
import { useAccount } from "wagmi";
import PoolJoin from "../components/pools/PoolJoin.jsx";
import { readUnderlyingToken } from "../config/contractsData";
import { getLocalTimeFromTimestamp } from "../utils/time.js";

const PoolPage = () => {
  const [pool, setPool] = useState();
  const [state, setState] = useState();
  const [currentCycle, setCycle] = useState();
  const [positions, setPositions] = useState();
  const [cyclesFinalized, setCyclesFinalized] = useState();

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address } = useAccount();
  const { address: poolAddress } = useParams();
  const cycleDepositTokenSymbol = useSearchParams()[0].get("cycleDepositToken");
  const cycleDepositTokenData = readUnderlyingToken(cycleDepositTokenSymbol);
  const { address: tokenAddress, name, symbol, decimals } = cycleDepositTokenData;

  const cycleDepositToken = new ERC20(tokenAddress, name, symbol, decimals);
  const collateralTokensData = cycleDepositTokenData.ybts;

  useEffect(() => {
    async function getPool() {
      const [_pool, _positions, _cyclesFinalized] = await Promise.all([
        Pool.createInstance(poolAddress),
        new Pool(poolAddress).getAllPositionsWithOwners(),
        new Pool(poolAddress).getCyclesFinalized(),
      ]);

      setPool(_pool);
      setPositions(_positions);
      setCyclesFinalized(_cyclesFinalized);
      setState(_pool.calcPoolState(_positions.length, cyclesFinalized));
    }

    getPool();
  }, []);

  useEffect(() => {
    if (state !== "LIVE") return;

    setCycle(pool.calcCurrentCycle());
  }, [state]);

  const updateActionBtn = (propObj) => {
    setActionBtn({ ...actionBtn, ...propObj });
  };

  const addPosition = (newPosition) => {
    setPositions([...positions, newPosition]);
  };

  const renderPoolInterface = () => {
    if (state === "WAITING") {
      return (
        <PoolJoin
          pool={pool}
          cycleDepositToken={cycleDepositToken}
          collateralTokensData={collateralTokensData}
          updateActionBtn={updateActionBtn}
          positions={positions}
          addPosition={addPosition}
        />
      );
    }

    if (state === "LIVE") {
      <PoolContribute />;
    }
  };

  return pool ? (
    <div className="pool">
      <div className="pool__interface">
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

      <div>
        <div>Pool State: {state}</div>
        {currentCycle && <div>Current Cycle: {currentCycle}</div>}
        <div>
          Amount Cycle: {pool.amountCycleDeposit} {cycleDepositToken.symbol}
        </div>
        <div>
          {pool.amountCollateralInAccounting} {cycleDepositToken.symbol}
        </div>
        <div>Cycle Duration: {pool.cycleDuration}</div>
        <div>Total Cycles: {pool.totalCycles}</div>
        <div>Start Time: {pool.startTime}</div>
        <div className="div">{getLocalTimeFromTimestamp(pool.startTime)}</div>
      </div>
    </div>
  ) : null;
};

export default PoolPage;
