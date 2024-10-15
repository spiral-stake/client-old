import React from "react";
import { Link, useLocation } from "react-router-dom";
import ConnectWalletBtn from "./ConnectWalletBtn";

const Navbar = ({}) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="navbar">
      <div className="navbar__links">
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
            Create a Pool
          </button>
        </Link>
        <a target="blank" href="">
          <button className={`navbar__link`}>Follow On Twitter</button>
        </a>
      </div>
      <div className="navbar__links">
        <ConnectWalletBtn className="btn btn--connect" />
      </div>
    </nav>
  );
};

export default Navbar;
