import { useEffect, useState } from "react";
import Input from "../components/input";
import TokenInput from "../components/TokenInput";
import { readYbt } from "../config/contractsData";
import ConnectWalletBtn from "../components/ConnectWalletBtn";
import { useAccount, useChainId } from "wagmi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleAsync } from "../utils/handleAsyncFunction";
import LoadingOverlay from "../components/LoadingOverlay";
import { chainConfig } from "../config/chainConfig";
import "../styles/createPool.css";
import { parseTime } from "../utils/time";
import { toastSuccess } from "../utils/toastWrapper";
import SY from "../contract-hooks/SY";
import { formatUnits } from "../utils/formatUnits";

const CreatePool = ({ ybts, poolFactory, setSwitchingNetwork }) => {
  const [pool, setPool] = useState({
    ybt: undefined,
    ybtExchangeRate: "",
    amountCycle: "",
    cycleDuration: "", // In minutes (Needs rework)
    cycleDurationUnit: "minutes",
    totalCycles: "",
    startInterval: "", // In minutes (Needs rework)
    startIntervalUnit: "minutes",
    cycleDepositAndBidDuration: "", // New field
    cycleDepositAndBidDurationUnit: "minutes", // New field
  });

  const [actionBtn, setActionBtn] = useState({ text: "", onClick: () => {}, disabled: false });
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState("");

  const appChainId = useChainId();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ybts.length) return;

    setPool({ ...pool, ybt: ybts[0] });
  }, [ybts]);

  useEffect(() => {
    if (!chainId) return;

    setApi(chainConfig[chainId].api + "/schedule-pool-cronjob");
  }, [chainId]);

  useEffect(() => {
    let {
      ybt,
      amountCycle,
      totalCycles,
      cycleDuration,
      cycleDurationUnit,
      startInterval,
      startIntervalUnit,
      cycleDepositAndBidDuration,
      cycleDepositAndBidDurationUnit,
    } = pool;

    cycleDuration = parseTime(cycleDuration, cycleDurationUnit);
    startInterval = parseTime(startInterval, startIntervalUnit);
    cycleDepositAndBidDuration = parseTime(
      cycleDepositAndBidDuration,
      cycleDepositAndBidDurationUnit
    );

    const errors = [
      { condition: !amountCycle, text: "Invalid Cycle Amount" },
      { condition: totalCycles < 2, text: "Invalid Total Cycles" },
      { condition: cycleDuration < 120, text: "Cycle duration too low" },
      { condition: startInterval < 60, text: "Start interval too low" },
      {
        condition: cycleDepositAndBidDuration < 60,
        text: "Invalid Pool Deposit and Bid duration",
      },
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
        () =>
          handleCreatePool(
            api,
            ybt,
            amountCycle,
            totalCycles,
            cycleDuration,
            cycleDepositAndBidDuration,
            startInterval
          ),
        setLoading
      ),
    });
  }, [pool]);

  const handleYbtChange = async (e) => {
    const _ybt = await readYbt(chainId || appChainId, e.target.value);
    const ybtExchangeRate = await new SY(_ybt.syToken.address).getYbtExchangeRate(_ybt);
    setPool({ ...pool, ybt: _ybt });
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value);

    const _pool = { ...pool };
    _pool[name] = value;

    setPool(_pool);
  };

  const handleCreatePool = async (
    api,
    ybt,
    amountCycle,
    totalCycles,
    cycleDuration,
    cycleDepositAndBidDuration,
    startInterval
  ) => {
    const poolAddress = await poolFactory.createSpiralPool(
      ybt.syToken,
      ybt.baseToken,
      amountCycle,
      totalCycles,
      cycleDuration,
      cycleDepositAndBidDuration,
      startInterval
    );

    await axios.post(api, { poolAddress });
    toastSuccess("Spiral Pool created successfully");
    navigate(`/pools/${poolAddress}?ybt=${ybt.symbol}&poolChainId=${chainId}`);
  };

  return (
    pool.ybt && (
      <div>
        <h2 className="page-heading" style={{ textAlign: "center", marginBottom: "25px" }}>
          Create a Spiral Pool
        </h2>{" "}
        <div className="create-pool">
          <div>
            <div style={{ marginBottom: "15px" }} className="token">
              <select value={pool.ybt.symbol} onChange={handleYbtChange} name={"ybt"} id="">
                {ybts.map((token, index) => {
                  return (
                    <option key={index} value={token.symbol}>
                      {token.symbol}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <Input
              label={"Cycle Deposit"}
              onChange={handleInputChange}
              name={"amountCycle"}
              value={pool.amountCycle}
              select={true}
              selectValue={pool.ybt.baseToken.symbol}
              selectOptions={[pool.ybt.baseToken.symbol]}
            />
          </div>

          <div>
            <Input label={"Total Cycles >= 2"} onChange={handleInputChange} name={"totalCycles"} />
          </div>
          <div>
            <Input
              label={"Cycle Duration >= 2 mins"}
              onChange={handleInputChange}
              name={"cycleDuration"}
              value={pool.cycleDuration}
              select={true}
              selectName={"cycleDurationUnit"}
              selectOnChange={handleInputChange}
              selectValue={pool.cycleDurationUnit}
              selectOptions={["minutes", "hours", "days", "months"]}
            />
          </div>
          <div>
            <Input
              label={"Cycle Deposit & Bid Duration >= 1 min"}
              onChange={handleInputChange}
              name={"cycleDepositAndBidDuration"}
              value={pool.cycleDepositAndBidDuration}
              select={true}
              selectName={"cycleDepositAndBidDurationUnit"}
              selectOnChange={handleInputChange}
              selectValue={pool.cycleDepositAndBidDurationUnit}
              selectOptions={["minutes", "hours", "days", "months"]}
            />
          </div>
          <div>
            <Input
              label={"Starting In >= 1 mins"}
              onChange={handleInputChange}
              name={"startInterval"}
              value={pool.startInterval}
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
