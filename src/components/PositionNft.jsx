import "../styles/positionNft.css";
import spiralStakeLogo from "../assets/images/spiral-stake-logo-2.png";
import truncateStr from "../utils/truncateStr";
import { useEffect, useState } from "react";
import { displayAmount } from "../utils/displayAmounts";
import { useAccount } from "wagmi";

const PositionNft = ({ pool, positionNft, updatePosition }) => {
  const [amountCollateralYield, setAmountCollateralYield] = useState();
  const [spiralYield, setSpiralYield] = useState({});

  const { address } = useAccount();

  useEffect(() => {
    async function getYields() {
      const [collateralYield, spiralYield] = await Promise.all([
        await pool.getCollateralYield(positionNft),
        await pool.getSpiralYield(positionNft),
      ]);

      setSpiralYield(spiralYield);
      setAmountCollateralYield(collateralYield);
    }

    getYields();
  }, [positionNft]);

  const handleClaimCollateralYield = async () => {
    await pool.claimCollateralYield(positionNft.id);
    updatePosition(positionNft.id);
  };

  const handleClaimSpiralYield = async () => {
    await pool.claimSpiralYield(positionNft.id);
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
        {/* <p>Owner: {truncateStr(positionNft.owner, 11)}</p> */}
        <p>
          YBT Collateral: {displayAmount(positionNft.amountCollateral.minus(amountCollateralYield))}{" "}
          {pool.ybt.symbol}
        </p>
        {address === positionNft.owner && (
          <>
            <p>
              YBT Yield: {displayAmount(amountCollateralYield)} {pool.ybt.symbol}
              {amountCollateralYield > 0 && (
                <span onClick={handleClaimCollateralYield} className="btn btn--claim">
                  Claim
                </span>
              )}
            </p>
            <p>
              Spiral Yield:{" "}
              {(spiralYield.amountBase > 0 || spiralYield.amountYbt > 0) && (
                <span onClick={handleClaimSpiralYield} className="btn btn--claim">
                  Claim
                </span>
              )}
              <p style={{ marginLeft: "20px" }}>
                {displayAmount(spiralYield.amountBase)} {pool.baseToken.symbol}
              </p>
              <p style={{ marginLeft: "20px" }}>
                {displayAmount(spiralYield.amountYbt)} {pool.ybt.symbol}
              </p>
            </p>
          </>
        )}
        {/* <p>Cycles Deposited: </p> */}
        <p>Winning Cycle: {positionNft.winningCycle || "NF"}</p>
      </div>
    </div>
  );
};

export default PositionNft;
