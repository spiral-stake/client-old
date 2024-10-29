import addresses from "../../../v1-core/addresses/31337.json";
const underlyingTokensObj = addresses.underlying;

export const readUnderlyingTokens = () => {
  const underlyingTokens = [];

  for (let underlyingObj of Object.values(underlyingTokensObj)) {
    underlyingTokens.unshift({
      address: underlyingObj.address,
      name: underlyingObj.name,
      symbol: underlyingObj.symbol === "wETH" ? "ETH" : underlyingObj.symbol,
      decimals: underlyingObj.decimals,
    });
  }

  return underlyingTokens;
};

export const readUnderlyingToken = (underlyingTokenSymbol) => {
  if (underlyingTokenSymbol === "ETH") underlyingTokenSymbol = "wETH";

  const underlyingObj = underlyingTokensObj[underlyingTokenSymbol];

  const ybts = [];
  for (let ybtObj of Object.values(underlyingObj.YBTs)) {
    ybts.push({ ...ybtObj });
  }

  return {
    address: underlyingObj.address,
    name: underlyingObj.name,
    symbol: underlyingObj.symbol === "wETH" ? "ETH" : underlyingObj.symbol,
    decimals: underlyingObj.decimals,
    ybts,
  };
};
