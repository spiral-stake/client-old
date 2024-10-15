import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pools from "./pages/Pools.jsx";
import Pool from "./pages/Pools.jsx";
import Navbar from "./components/Navbar";
import CreatePool from "./pages/CreatePool.jsx";
import "./styles/App.css";

function App() {
  return (
    <div className="app">
      <Toaster />
      <Navbar />
      <div className="main">
        <Routes>
          <Route path={"/pools/create"} element={<CreatePool />} />
          <Route path={"/pools/:address"} element={<Pool />} />
          <Route path={"/pools"} element={<Pools />} />
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
