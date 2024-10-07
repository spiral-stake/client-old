import React from "react";
import "./page.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="glitch-text">
        <h1>SPIRAL STAKE</h1>
      </div>
      <p className="description">Unlock interest-free liquidity with your Yield Bearing Tokens</p>
      <div className="neon-border"></div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} spiralstake.xyz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ComingSoon;
