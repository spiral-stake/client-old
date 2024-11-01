import { useEffect, useState } from "react";
import Input from "../components/input";
import TokenInput from "../components/TokenInput";
import { readBaseTokens, readBaseToken } from "../config/contractsData";
import ConnectWalletBtn from "../components/ConnectWalletBtn";
import { useAccount } from "wagmi";
import PoolFactory from "../contract-hooks/PoolFactory";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/apiConfig.json";

const baseTokens = readBaseTokens();

const CreatePool = () => {
  const [pool, setPool] = useState({
    baseToken: baseTokens[0],
    amountCycle: 0,
    cycleDuration: 0, // In minutes (Needs rework)
    totalCycles: 0,
    startInterval: 0, // In minutes (Needs rework)
  });
  const [newPoolAddress, setNewPoolAddress] = useState();
  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });

  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    const { amountCycle, cycleDuration, totalCycles, startInterval } = pool;

    if (amountCycle && cycleDuration && totalCycles && startInterval) {
      return setActionBtn({
        disabled: false,
        text: "Create Spiral Pool",
        onClick: handleCreatePool,
      });
    }

    return setActionBtn({
      disabled: true,
      text: "Create Spiral Pool",
    });
  }, [pool]);

  const handleBaseTokenChange = (e) => {
    const baseToken = readBaseToken(e.target.value);
    setPool({ ...pool, baseToken });
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = parseInt(e.target.value);

    const _pool = { ...pool };
    _pool[name] = value;

    setPool(_pool);
  };

  const handleCreatePool = async () => {
    const { baseToken, amountCycle, cycleDuration, totalCycles, startInterval } = pool;

    const poolFactory = new PoolFactory();
    const poolAddress = await poolFactory.createSpiralPool(
      baseToken,
      amountCycle,
      cycleDuration,
      totalCycles,
      startInterval
    );

    await axios.post(apiUrl + "/schedule-pool-cronjob", { poolAddress });
    navigate(`/pools/${poolAddress}?baseToken=${baseToken.symbol}`);
  };

  return (
    <div className="create-pool">
      <select value={pool.baseToken.symbol} onChange={handleBaseTokenChange} name="" id="">
        {baseTokens.map((token, index) => {
          return (
            <option key={index} value={token.symbol}>
              {token.symbol}
            </option>
          );
        })}
      </select>
      <div>
        <Input onChange={handleInputChange} name={"amountCycle"} />
      </div>
      <div>
        <Input onChange={handleInputChange} name={"cycleDuration"} />
      </div>
      <div>
        <Input onChange={handleInputChange} name={"totalCycles"} />
      </div>
      <div>
        <Input onChange={handleInputChange} name={"startInterval"} />
      </div>

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
  );
};

export default CreatePool;
