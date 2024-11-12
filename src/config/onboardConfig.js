import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

export const onboard = {
  theme: "light",
  connect: {
    autoConnectLastWallet: true,
  },
  wallets: [injected],
  chains: [
    {
      id: "0x5535072",
      token: "ETH",
      label: "Reya Cronos",
      rpcUrl: "https://rpc.reya-cronos.gelato.digital",
    },
  ],
};
