import { useEffect, useState } from "react";
import Input from "../components/input";
import TokenInput from "../components/TokenInput";
import { readBaseToken } from "../config/contractsData";
import ConnectWalletBtn from "../components/ConnectWalletBtn";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAsync } from "../utils/handleAsyncFunction";
import LoadingOverlay from "../components/LoadingOverlay";
import { chainConfig } from "../config/chainConfig";
import "../styles/createPool.css";
import { parseTime } from "../utils/time";

const CreatePool = ({ baseTokens, poolFactory, setSwitchingNetwork }) => {
  const [pool, setPool] = useState({
    baseToken: undefined,
    amountCycle: "",
    cycleDuration: "", // In minutes (Needs rework)
    cycleDurationUnit: "minutes",
    totalCycles: "",
    startInterval: "", // In minutes (Needs rework)
    startIntervalUnit: "minutes",
  });

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });
  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!baseTokens.length) return;

    setPool({ ...pool, baseToken: baseTokens[0] });
  }, [baseTokens]);

  useEffect(() => {
    let {
      baseToken,
      amountCycle,
      totalCycles,
      cycleDuration,
      cycleDurationUnit,
      startInterval,
      startIntervalUnit,
    } = pool;

    cycleDuration = parseTime(cycleDuration, cycleDurationUnit);
    startInterval = parseTime(startInterval, startIntervalUnit);

    const errors = [
      { condition: !amountCycle, text: "Invalid Cycle Amount" },
      { condition: totalCycles < 2, text: "Invalid Total Cycles" },
      { condition: cycleDuration < 240, text: "Cycle duration too low" },
      { condition: startInterval < 120, text: "Start interval too low" },
    ];

    const error = errors.find((err) => err.condition);

    if (error) {
      return setActionBtn({
        disabled: true,
        text: error.text,
      });
    }

    return setActionBtn({
      disabled: false,
      text: "Create Spiral Pool",
      onClick: handleAsync(
        () => handleCreatePool(baseToken, amountCycle, totalCycles, cycleDuration, startInterval),
        setLoading
      ),
    });
  }, [pool]);

  const handleBaseTokenChange = async (e) => {
    const baseToken = await readBaseToken(chainId, e.target.value);
    setPool({ ...pool, baseToken });
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value);

    const _pool = { ...pool };
    _pool[name] = value;

    setPool(_pool);
  };

  const handleCreatePool = async (
    baseToken,
    amountCycle,
    totalCycles,
    cycleDuration,
    startInterval
  ) => {
    const poolAddress = await poolFactory.createSpiralPool(
      baseToken,
      amountCycle,
      totalCycles,
      cycleDuration,
      startInterval
    );

    await axios.post(chainConfig[chainId].api + "/schedule-pool-cronjob", { poolAddress });
    navigate(`/pools/${poolAddress}?baseToken=${baseToken.symbol}&poolChainId=${chainId}`);
  };

  return (
    pool.baseToken && (
      <div>
        <h2 className="page-heading" style={{ textAlign: "center", marginBottom: "25px" }}>
          Create a Spiral Pool
        </h2>{" "}
        <div className="create-pool">
          <TokenInput
            label={"Cycle Deposit"}
            inputTokens={baseTokens}
            selectedToken={pool.baseToken}
            handleTokenChange={handleBaseTokenChange}
            selectName={"baseToken"}
            value={pool.amountCycle}
            onChange={handleInputChange}
            name={"amountCycle"}
          />
          <div>
            <Input label={"Total Cycles >= 2"} onChange={handleInputChange} name={"totalCycles"} />
          </div>
          <div>
            <Input
              label={"Cycle Duration >= 4 mins"}
              onChange={handleInputChange}
              name={"cycleDuration"}
              select={true}
              selectName={"cycleDurationUnit"}
              selectOnChange={handleInputChange}
              selectValue={pool.cycleDurationUnit}
              selectOptions={["minutes", "hours", "days", "months"]}
            />
          </div>
          <div>
            <Input
              label={"Start Interval >= 2 mins"}
              onChange={handleInputChange}
              name={"startInterval"}
              select={true}
              selectName={"startIntervalUnit"}
              selectOnChange={handleInputChange}
              selectValue={pool.startIntervalUnit}
              selectOptions={["minutes", "hours", "days", "months"]}
            />
          </div>
          {address ? (
            chainConfig[chainId] ? (
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
                onClick={() => setSwitchingNetwork(true)}
                className="btn btn--primary"
              >
                {`Switch Chain`}
              </button>
            )
          ) : (
            <ConnectWalletBtn className="btn btn--primary" />
          )}
        </div>
        <LoadingOverlay loading={loading} />
      </div>
    )
  );
};

export default CreatePool;
