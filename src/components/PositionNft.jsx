import "../styles/positionNft.css";
import spiralStakeLogo from "../assets/images/spiral-stake-logo-2.png";
import truncateStr from "../utils/truncateStr";
import { useEffect, useState } from "react";
import { displayAmount } from "../utils/displayAmounts";
import { useAccount } from "wagmi";

const PositionNft = ({ pool, positionNft, updatePosition }) => {
  const [amountCollateralYield, setAmountCollateralYield] = useState();

  const { address } = useAccount();

  useEffect(() => {
    async function getCollateralYield() {
      setAmountCollateralYield(await pool.getCollateralYield(positionNft));
    }

    getCollateralYield();
  }, [positionNft]);

  const handleRedeemYield = async () => {
    await pool.redeemCollateralYield(positionNft.id);
    updatePosition(positionNft.id);
  };

  return (
    <div className="position-nft">
      <div className="nft-header">
        <h1>Position NFT</h1>
        <p>Id: {positionNft.id}</p>
      </div>
      <img className="nft-image" src={spiralStakeLogo} alt="" />
      <div className="pool-info">
        {/* <p>Pool: </p> */}
        <p>Owner: {truncateStr(positionNft.owner, 11)}</p>
        <p>
          YBT Collateral: {displayAmount(positionNft.amountCollateral)}{" "}
          {positionNft.collateralToken.symbol}
        </p>
        {address === positionNft.owner && (
          <p>
            YBT Yield: {displayAmount(amountCollateralYield)} {positionNft.collateralToken.symbol}
            {amountCollateralYield > 0 && (
              <span onClick={handleRedeemYield} className="btn btn--claim">
                Claim
              </span>
            )}
          </p>
        )}
        {/* <p>Cycles Deposited: </p> */}
        <p>Winning Cycle: {positionNft.winningCycle || "NF"}</p>
      </div>
    </div>
  );
};

export default PositionNft;
