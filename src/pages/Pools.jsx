import { useEffect, useState } from "react";
import PoolCard from "../components/pools/PoolCard";
import "../styles/pools.css";
import { Link } from "react-router-dom";
import { readBaseTokens } from "../config/contractsData";
import PoolFactory from "../contract-hooks/PoolFactory";

const baseTokens = readBaseTokens();
const poolFactory = new PoolFactory();

const Pools = () => {
  const [underlyingToken, setUnderlyingToken] = useState(baseTokens[0]);
  const [poolAddresses, setPoolAddresses] = useState();

  useEffect(() => {
    const fetchPoolAddresses = async () => {
      const [_poolAddresses] = await Promise.all([
        poolFactory.getPoolsForUnderlying(underlyingToken.address),
      ]);

      setPoolAddresses(_poolAddresses);
    };

    fetchPoolAddresses();
  }, [underlyingToken]);

  return poolAddresses ? (
    <div className="pools">
      <div className="pools__select-box">
        {baseTokens.map((token, index) => (
          <button
            onClick={() => setUnderlyingToken(token)}
            key={index}
            className={token.address === underlyingToken.address ? "btn btn--selected" : "btn"}
          >
            {token.symbol === "wETH" ? "ETH" : token.symbol}
          </button>
        ))}
      </div>

      <div className="pools__list">
        {poolAddresses.map((poolAddress, index) => (
          <PoolCard key={index} poolAddress={poolAddress} baseToken={underlyingToken} />
        ))}
      </div>
    </div>
  ) : null;
};

export default Pools;
