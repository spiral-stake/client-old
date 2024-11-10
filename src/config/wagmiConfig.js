import { createConfig, http } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { mainnet, bsc, bscTestnet, sepolia, anvil } from "wagmi/chains";
import { chainConfig } from "../config/chainConfig";

const chains = Object.values(chainConfig);

export const wagmiConfig = createConfig({
  chains: [...chains],
  transports: {
    [31337]: http("http://127.0.0.1:8545"),
    [31338]: http("http://127.0.0.1:8546"),
    [89346162]: http("https://rpc.reya-cronos.gelato.digital"),
    [421614]: http("https://arbitrum-sepolia.blockpi.network/v1/rpc/public"),
  },
});
