import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

export const onboard = {
  theme: "dark",
  connect: {
    autoConnectLastWallet: true,
  },
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Local Network",
      rpcUrl: "http://127.0.0.1:8545",
    },
  ],
};
