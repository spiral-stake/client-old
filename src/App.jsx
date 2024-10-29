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

function App() {
  return (
    <div className="app">
      <Toaster />
      <Navbar />
      <div className="main">
        <Routes>
          <Route path={"/pools/create"} element={<CreatePool />} />
          <Route path={"/pools/:address"} element={<PoolPage />} />
          <Route path={"/pools"} element={<Pools />} />
          <Route path={"/marketplace"} element={<Marketplace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path={"/experiment"} element={<Experiment />} />
          {/* <Route path={"/"} element={<Home />} /> */}

          <Route
            path="*" // Redirect to
            element={<Navigate to="/pools" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
