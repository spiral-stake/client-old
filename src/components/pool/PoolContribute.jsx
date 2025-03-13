import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { handleAsync } from "../../utils/handleAsyncFunction";

const PoolContribute = ({
  pool,
  currentCycle,
  position,
  updatePosition,
  setActionBtn,
  setLoading,
}) => {
  const [userBaseTokenBalance, setUserBaseTokenBalance] = useState();
  const [userBaseTokenAllowance, setUserBaseTokenAllowance] = useState();
  const [isCycleDepositAndBidOpen, setIsCycleDepositAndBidOpen] = useState();

  const { address } = useAccount();

  useEffect(() => {
    setIsCycleDepositAndBidOpen(pool.calcIsCycleDepositAndBidWindowOpen(currentCycle));
  }, [currentCycle]);

  useEffect(() => {
    if (!address) return;

    updateUserBaseTokenBalance();
    updateUserBaseTokenAllowance();
  }, [address]);

  useEffect(() => {
    if (!position) {
      return setActionBtn({
        text: `Not Joined`,
        disabled: true,
      });
    }

    const updatingActionBtn = () => {
      if (position.cyclesDeposited[currentCycle] === true) {
        return setActionBtn({
          text: `Cycle Deposit Paid`,
          disabled: true,
        });
      }

      if (!isCycleDepositAndBidOpen) {
        return setActionBtn({
          text: "Cycle Deposit & Bid Window Closed",
          disabled: true,
        });
      }

      if (userBaseTokenBalance?.isLessThan(pool.amountCycle)) {
        return setActionBtn({
          text: `Insufficient ${pool.baseToken.symbol} Balance`,
          disabled: true,
        });
      }

      if (userBaseTokenAllowance?.isLessThan(pool.amountCycle)) {
        return setActionBtn({
          text: `Approve and Deposit`,
          disabled: false,
          onClick: handleAsync(
            () => handleApproveAndCycleDeposit(pool.baseToken, pool.address, pool.amountCycle),
            setLoading
          ),
        });
      }

      return setActionBtn({
        text: `Deposit Cycle Amount`,
        disabled: false,
        onClick: handleAsync(handleCycleDeposit, setLoading),
      });
    };

    updatingActionBtn();
  }, [userBaseTokenBalance, userBaseTokenAllowance, position, currentCycle]);

  const updateUserBaseTokenBalance = async () => {
    const balance = await pool.baseToken.balanceOf(address);
    setUserBaseTokenBalance(balance);
  };

  const updateUserBaseTokenAllowance = async () => {
    const allowance = await pool.baseToken.allowance(address, pool.address);
    setUserBaseTokenAllowance(allowance);
  };

  const handleApproveAndCycleDeposit = async (token, to, value) => {
    await token.approve(to, value);

    await Promise.all([updateUserBaseTokenAllowance(), handleCycleDeposit()]);
  };

  const handleCycleDeposit = async () => {
    await pool.depositCycle(position.id);

    await Promise.all([
      updateUserBaseTokenBalance(),
      updateUserBaseTokenAllowance(),
      updatePosition(position.id),
    ]);
  };

  return (
    position && (
      <div className="pool__interface-box">
        <span className="label">Cycle Deposit</span>
        <span className="input-box">
          <span className="input">
            {" "}
            {pool.amountCycle.toFixed(4)} {pool.baseToken.symbol}
          </span>
        </span>
      </div>
    )
  );
};

export default PoolContribute;
