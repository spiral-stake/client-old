import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const PoolContribute = ({ pool, currentCycle, position, updatePosition, setActionBtn }) => {
  const [userBaseTokenBalance, setUserBaseTokenBalance] = useState();
  const [userBaseTokenAllowance, setUserBaseTokenAllowance] = useState();
  const [isCycleDepositWindowOpen, setIsCycleDepositWindowOpen] = useState();

  console.log(userBaseTokenBalance);

  const { address } = useAccount();

  useEffect(() => {
    setIsCycleDepositWindowOpen(pool.calcIsCycleDepositWindowOpen(currentCycle));
  }, [currentCycle]);

  useEffect(() => {
    if (!address) return;

    updateUserBaseTokenBalance();
    updateUserBaseTokenAllowance();
  }, [address]);

  useEffect(() => {
    if (!position) return;

    const updatingActionBtn = () => {
      if (position.cyclesDeposited[currentCycle] === true) {
        return setActionBtn({
          text: `Cycle Deposit Paid`,
          disabled: true,
        });
      }

      if (!isCycleDepositWindowOpen) {
        return setActionBtn({
          text: "Cycle Deposit Window Closed",
          disabled: true,
        });
      }

      if (userBaseTokenAllowance < pool.amountCycle) {
        return setActionBtn({
          text: `Approve ${pool.amountCycle.toFixed(5)} ${pool.baseToken.symbol}`,
          disabled: userBaseTokenBalance < pool.amountCycle ? true : false,
          onClick: () => handleTokenApprove(pool.baseToken, pool.address, pool.amountCycle),
        });
      }

      return setActionBtn({
        text: `Deposit Cycle Amount`,
        disabled: false,
        onClick: handleCycleDeposit,
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

  const handleTokenApprove = async (token, to, value) => {
    await token.approve(to, value);
    updateUserBaseTokenAllowance();
  };

  const handleCycleDeposit = async () => {
    await pool.depositCycle(position.id);

    updateUserBaseTokenBalance();
    updateUserBaseTokenAllowance();
    updatePosition(position.id);
  };

  return (
    position && (
      <div className="pool__interface-box">
        <span className="label">Cycle Deposit</span>
        <span className="input-box">
          <span className="input">
            {" "}
            {pool.amountCycle.toFixed(5)} {pool.baseToken.symbol}
          </span>
        </span>
      </div>
    )
  );
};

export default PoolContribute;
