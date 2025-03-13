import { useEffect, useState } from "react";
import PoolCard from "../components/PoolCard";
import "../styles/pools.css";
import { readYbt } from "../config/contractsData";
import { useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useChainId } from "wagmi";
import Loader from "../components/Loader";

const Pools = ({ ybts, poolFactory }) => {
  const [ybt, setYbt] = useState();
  const [poolAddresses, setPoolAddresses] = useState();

  const navigate = useNavigate();
  const appChainId = useChainId();
  const ybtSymbol = useSearchParams()[0].get("ybt");

  useEffect(() => {
    setYbt(undefined);

    async function initializeYbt() {
      if (ybtSymbol) {
        const _ybt = await readYbt(appChainId, ybtSymbol);
        return setYbt(_ybt);
      }
      return setYbt(ybts[0]);
    }

    initializeYbt();
  }, [ybts]);

  useEffect(() => {
    if (!ybt || !poolFactory) return;

    setPoolAddresses(undefined);

    const fetchPoolAddresses = async () => {
      const _poolAddresses = await poolFactory.getSpiralPoolsForSYToken(ybt.syToken);
      setPoolAddresses(_poolAddresses);
    };

    fetchPoolAddresses();
  }, [ybt, poolFactory]);

  const handleYbtChange = (token) => {
    setYbt(token);
    const newUrl = `/pools?ybt=${token.symbol}  `;
    navigate(newUrl, { replace: true });
  };

  return (
    <div className="pools">
      <div className="pools__select-box">
        {ybts.map((token, index) => (
          <div key={index} style={{ display: "inline-block", marginRight: "8px" }}>
            {ybt ? (
              <button
                onClick={() => handleYbtChange(token)}
                className={token.address === ybt.address ? "btn btn--selected" : "btn"}
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
            <PoolCard key={index} poolAddress={poolAddress} ybt={ybt} />
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Pools;
