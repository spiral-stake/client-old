import { createConfig, http } from "wagmi";
import { mainnet, bsc, bscTestnet, sepolia, hardhat } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});
