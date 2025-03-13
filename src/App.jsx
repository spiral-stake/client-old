import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import { readYbts } from "./config/contractsData.js";
import PoolFactory from "./contract-hooks/PoolFactory.js";
import OnboardingOverlay from "./components/OnboardingOverlay.jsx";
import ERC20 from "./contract-hooks/ERC20.js";

function App() {
  const [ybts, setYbts] = useState([]);
  const [poolFactory, setPoolFactory] = useState();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [onboarding, setOnboarding] = useState();

  const appChainId = useChainId();
  const { address, chainId } = useAccount();

  useEffect(() => {
    const onboardUser = async () => {
      if (!address || chainId !== appChainId || !ybts.length) return setOnboarding(false);

      const { address: tokenAddress, name, symbol, decimals } = ybts[0];

      const ybt = new ERC20(tokenAddress, name, symbol, decimals);
      const ybtBalance = await ybt.balanceOf(address);

      if (ybtBalance.isZero()) {
        setOnboarding(true);
      } else {
        setOnboarding(false);
      }
    };

    onboardUser();
  }, [address, chainId, appChainId, ybts]);

  useEffect(() => {
    async function handleChainChange() {
      const [_ybts, _poolFactory] = await Promise.all([
        readYbts(appChainId),
        PoolFactory.createInstance(appChainId),
      ]);

      setYbts(_ybts);
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
                ybts={ybts}
                setSwitchingNetwork={setSwitchingNetwork}
              />
            }
          />
          <Route path={"/pools/:address"} element={<PoolPage />} />
          <Route path={"/pools"} element={<Pools ybts={ybts} poolFactory={poolFactory} />} />
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
