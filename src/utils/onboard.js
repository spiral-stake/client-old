import axios from "axios";
import { chainConfig } from "../config/chainConfig";
import { getTokens } from "./getTokens";
import { addTokenToWallet } from "./addTokensToWallet";

const amountYbt = "10";
const amountBase = "10";

export const onboard = async (chainId, userAddress) => {
  const amountNative = chainConfig[chainId].onboard.amountNative;

  await axios.post(chainConfig[chainId].api + "/onboard", {
    userAddress,
    amountNative,
    amountYbt,
    amountBase,
  });

  const { ybts, baseTokens } = await getTokens(chainId);
  const ybtPromises = ybts.map((ybt) => addTokenToWallet(ybt));
  const baseTokenPromises = baseTokens.map((baseToken) => addTokenToWallet(baseToken));
  await Promise.all([...ybtPromises, ...baseTokenPromises]);

  localStorage.setItem(userAddress, "onboarded");
};
