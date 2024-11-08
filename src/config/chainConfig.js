export const chainConfig = {
  89346162: {
    name: "Reya Cronos",
    id: 89346162,
    logo: "/logo/reya-logo.webp",
    api: "https://api.spiralstake.xyz",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    default: {
      http: ["https://rpc.reya-cronos.gelato.digital"],
      webSocket: ["wss://ws.reya-cronos.gelato.digital"],
    },
  },

  // 31337: {
  //   id: 31337,
  //   name: "Reya Testnet",
  //   logo: "/logo/reya-logo.webp",
  //   api: "http://localhost:5000",
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: "Ether",
  //     symbol: "ETH",
  //   },
  //   default: {
  //     http: ["http://127.0.0.1:8545"],
  //     webSocket: ["ws://127.0.0.1:8545"],
  //   },
  // },

  // 31338: {
  //   name: "Frax Testnet",
  //   id: 31338,
  //   logo: "/logo/frax-logo.svg",
  //   api: "http://localhost:5001",
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: "Ether",
  //     symbol: "ETH",
  //   },
  //   default: {
  //     http: ["http://127.0.0.1:8546"],
  //     webSocket: ["ws://127.0.0.1:8546"],
  //   },
  // },
};
