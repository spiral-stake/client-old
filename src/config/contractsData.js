export const readBaseTokens = async (chainId) => {
  const { underlying: underlyingTokensObj } = await import(`../addresses/${chainId}.json`);

  const underlyingTokens = [];

  for (let underlyingObj of Object.values(underlyingTokensObj)) {
    underlyingTokens.push({
      address: underlyingObj.address,
      name: underlyingObj.name,
      symbol: underlyingObj.symbol === "wETH" ? "ETH" : underlyingObj.symbol,
      decimals: underlyingObj.decimals,
    });
  }

  return underlyingTokens;
};

export const readBaseToken = async (chainId, underlyingTokenSymbol) => {
  const { underlying: underlyingTokensObj } = await import(`../addresses/${chainId}.json`);

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
