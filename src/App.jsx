import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pools from "./pages/Pools.jsx";
import PoolPage from "./pages/Pool.jsx";
import Navbar from "./components/Navbar";
import CreatePool from "./pages/CreatePool.jsx";
import "./styles/App.css";
import Market from "./pages/Market.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useEffect, useState } from "react";
import AppNetworkOverlay from "./components/AppNetworkOverlay.jsx";
import { useAccount, useChainId } from "wagmi";
import { readBaseTokens } from "./config/contractsData.js";
import PoolFactory from "./contract-hooks/PoolFactory.js";
import OnboardingOverlay from "./components/OnboardingOverlay.jsx";
import ERC20 from "./contract-hooks/ERC20.js";

function App() {
  const [baseTokens, setBaseTokens] = useState([]);
  const [poolFactory, setPoolFactory] = useState();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [onboarding, setOnboarding] = useState();

  const appChainId = useChainId();

  const { address, chainId } = useAccount();

  useEffect(() => {
    const onboardUser = async () => {
      if (!address || chainId !== appChainId || !baseTokens.length) return setOnboarding(false);

      const { address: tokenAddress, name, symbol, decimals } = baseTokens[0];

      const baseToken = new ERC20(tokenAddress, name, symbol, decimals);
      const baseTokenBalance = await baseToken.balanceOf(address);

      if (baseTokenBalance.isZero()) {
        setOnboarding(true);
      } else {
        setOnboarding(false);
      }
    };

    onboardUser();
  }, [address, chainId, appChainId, baseTokens]);

  useEffect(() => {
    async function handleChainChange() {
      const [_baseTokens, _poolFactory] = await Promise.all([
        readBaseTokens(appChainId),
        PoolFactory.createInstance(appChainId),
      ]);

      setBaseTokens(_baseTokens);
      setPoolFactory(_poolFactory);
    }

    handleChainChange();
  }, [appChainId]);

  return (
    <div className="app">
      <AppNetworkOverlay
        switchingNetwork={switchingNetwork}
        setSwitchingNetwork={setSwitchingNetwork}
      />
      <Toaster />
      <Navbar setSwitchingNetwork={setSwitchingNetwork} />
      <div className="main">
        <Routes>
          <Route
            path={"/pools/create"}
            element={
              <CreatePool
                poolFactory={poolFactory}
                baseTokens={baseTokens}
                setSwitchingNetwork={setSwitchingNetwork}
              />
            }
          />
          <Route path={"/pools/:address"} element={<PoolPage />} />
          <Route
            path={"/pools"}
            element={<Pools baseTokens={baseTokens} poolFactory={poolFactory} />}
          />
          <Route path={"/marketplace"} element={<Market />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path={"/"} element={<Home />} /> */}

          <Route
            path="*" // Redirect to
            element={<Navigate to="/pools" />}
          />
        </Routes>
        <OnboardingOverlay onboarding={onboarding} setOnboarding={setOnboarding} />
      </div>
    </div>
  );
}

export default App;
