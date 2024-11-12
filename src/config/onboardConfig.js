import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

export const onboard = {
  theme: "dark",
  connect: {
    autoConnectLastWallet: false,
  },
  wallets: [injected],
  chains: [
    {
      id: "0x7a69",
      token: "ETH",
      label: "Reya Local",
      rpcUrl: "http://127.0.0.1:8545",
    },
    {
      id: "0x7a6a",
      token: "ETH",
      label: "Fraxtal Local",
      rpcUrl: "http://127.0.0.1:8546",
    },
  ],
};
