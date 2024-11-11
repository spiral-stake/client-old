import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pools from "./pages/Pools.jsx";
import PoolPage from "./pages/Pool.jsx";
import Navbar from "./components/Navbar";
import CreatePool from "./pages/CreatePool.jsx";
import "./styles/App.css";
import Marketplace from "./pages/Marketplace.jsx";
import Experiment from "./components/pools/Spiral.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useEffect, useState } from "react";
import NetworkOverlay from "./components/NetworkOverlay.jsx";
import { useAccount, useChainId } from "wagmi";
import { readBaseTokens } from "./config/contractsData.js";
import PoolFactory from "./contract-hooks/PoolFactory.js";
import { onboard } from "./utils/onboard.js";
import OnboardingOverlay from "./components/OnboardingOverlay.jsx";

function App() {
  const [baseTokens, setBaseTokens] = useState([]);
  const [poolFactory, setPoolFactory] = useState();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [onboarding, setOnboarding] = useState();

  const chainId = useChainId();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;

    if (localStorage.getItem(address) !== "onboarded") {
      setOnboarding(true);
    } else {
      setOnboarding(false);
    }
  }, [address]);

  useEffect(() => {
    async function handleChainChange() {
      const [_baseTokens, _poolFactory] = await Promise.all([
        readBaseTokens(chainId),
        PoolFactory.createInstance(chainId),
      ]);

      setBaseTokens(_baseTokens);
      setPoolFactory(_poolFactory);
    }

    handleChainChange();
  }, [chainId]);

  return (
    <div className="app">
      <NetworkOverlay
        switchingNetwork={switchingNetwork}
        setSwitchingNetwork={setSwitchingNetwork}
      />
      <Toaster />
      <Navbar setSwitchingNetwork={setSwitchingNetwork} />
      <div className="main">
        <Routes>
          <Route
            path={"/pools/create"}
            element={<CreatePool poolFactory={poolFactory} baseTokens={baseTokens} />}
          />
          <Route path={"/pools/:address"} element={<PoolPage />} />
          <Route
            path={"/pools"}
            element={<Pools baseTokens={baseTokens} poolFactory={poolFactory} />}
          />
          <Route path={"/marketplace"} element={<Marketplace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path={"/experiment"} element={<Experiment />} />
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
