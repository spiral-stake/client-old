import { useEffect, useState } from "react";
import PoolCard from "../components/PoolCard";
import "../styles/pools.css";
import { readBaseToken, readBaseTokens } from "../config/contractsData";
import { useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useChainId } from "wagmi";
import Loader from "../components/Loader";

const Pools = ({ baseTokens, poolFactory }) => {
  const [baseToken, setBaseToken] = useState();
  const [poolAddresses, setPoolAddresses] = useState();

  const navigate = useNavigate();
  const appChainId = useChainId();
  const baseTokenSymbol = useSearchParams()[0].get("baseToken");

  useEffect(() => {
    setBaseToken(undefined);

    async function initializeBaseToken() {
      if (baseTokenSymbol) {
        const _baseToken = await readBaseToken(appChainId, baseTokenSymbol);
        return setBaseToken(_baseToken);
      }
      return setBaseToken(baseTokens[0]);
    }

    initializeBaseToken();
  }, [baseTokens]);

  useEffect(() => {
    if (!baseToken || !poolFactory) return;

    setPoolAddresses(undefined);

    const fetchPoolAddresses = async () => {
      const _poolAddresses = await poolFactory.getPoolsForBaseToken(baseToken.address);
      setPoolAddresses(_poolAddresses);
    };

    fetchPoolAddresses();
  }, [baseToken, poolFactory]);

  const handleBaseTokenChange = (token) => {
    setBaseToken(token);
    const newUrl = `/pools?baseToken=${token.symbol}  `;
    navigate(newUrl, { replace: true });
  };

  return (
    <div className="pools">
      <div className="pools__select-box">
        {baseTokens.map((token, index) => (
          <div key={index} style={{ display: "inline-block", marginRight: "8px" }}>
            {baseToken ? (
              <button
                onClick={() => handleBaseTokenChange(token)}
                className={token.address === baseToken.address ? "btn btn--selected" : "btn"}
              >
                {token.symbol === "wETH" ? "ETH" : token.symbol}
              </button>
            ) : (
              <Skeleton
                baseColor="#b1c2ff"
                width={100}
                height={30}
                style={{ borderRadius: "8px" }}
              />
            )}
          </div>
        ))}
      </div>

      {poolAddresses ? (
        <div className="pools__list">
          {poolAddresses.map((poolAddress, index) => (
            <PoolCard key={index} poolAddress={poolAddress} baseToken={baseToken} />
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Pools;
