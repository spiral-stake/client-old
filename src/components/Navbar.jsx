import React from "react";
import { Link, useLocation } from "react-router-dom";
import ConnectWalletBtn from "./ConnectWalletBtn";
import spiralStakeLogo from "../assets/images/spiral-stake-logo.png";
import { useChainId } from "wagmi";
import dropdownSvg from "../assets/images/dropdown.svg";
import { chainConfig } from "../config/chainConfig.js";

const Navbar = ({ setSwitchingNetwork }) => {
  const location = useLocation();
  const { pathname } = location;

  const chainId = useChainId();

  return (
    <nav className="navbar">
      <Link to="/pools">
        <div className="logo">
          <img className="logo__img" src={spiralStakeLogo} alt="" />
          <span className="logo__text">Spiral Stake</span>
        </div>
      </Link>
      <div className="navbar__links navbar__links--bg">
        {/* <Link to="/">
          <button className={`navbar__link ${pathname === "/" && "navbar__link--selected"}`}>
            Home
          </button>
        </Link> */}
        <Link to="/pools">
          <button
            className={`navbar__link ${
              pathname.endsWith("/pools") ? "navbar__link--selected" : ""
            }`}
          >
            Pools
          </button>
        </Link>
        <Link to="/pools/create">
          <button
            className={`navbar__link ${
              pathname.endsWith("/pools/create") ? "navbar__link--selected" : ""
            }`}
          >
            Create
          </button>
        </Link>
        <Link to="/marketplace">
          <button
            className={`navbar__link ${
              pathname.includes("/marketplace") ? "navbar__link--selected" : ""
            }`}
          >
            MarketPlace
          </button>
        </Link>
        <Link to="/dashboard">
          <button
            className={`navbar__link ${
              pathname.includes("/dashboard") ? "navbar__link--selected" : ""
            }`}
          >
            Dashboard
          </button>
        </Link>
      </div>
      <div className="navbar__links">
        <div onClick={() => setSwitchingNetwork(true)} className="navbar__network">
          <img className="logo" src={chainConfig[chainId].logo} alt="" />
          <img className="dropdown" src={dropdownSvg} alt="" />
        </div>
        <ConnectWalletBtn className="btn btn--connect" />
      </div>
    </nav>
  );
};

export default Navbar;
