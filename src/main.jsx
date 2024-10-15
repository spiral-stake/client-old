import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./config/wagmiConfig.js";
import { onboard } from "./config/onboardConfig";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const web3Onboard = init(onboard);
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3OnboardProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
