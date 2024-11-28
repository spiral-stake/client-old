export const readBaseTokens = async (chainId) => {
  const { baseTokens: baseTokensObj } = await import(`../addresses/${chainId}.json`);

  const baseTokens = [];

  for (let baseTokenObj of Object.values(baseTokensObj)) {
    baseTokens.unshift({
      address: baseTokenObj.address,
      name: baseTokenObj.name,
      symbol: baseTokenObj.symbol === "wETH" ? "ETH" : baseTokenObj.symbol,
      decimals: baseTokenObj.decimals,
    });
  }

  return baseTokens;
};

export const readBaseToken = async (chainId, baseTokenSymbol) => {
  const { baseTokens: baseTokensObj } = await import(`../addresses/${chainId}.json`);

  if (baseTokenSymbol === "ETH") baseTokenSymbol = "wETH";

  const baseTokenObj = baseTokensObj[baseTokenSymbol];

  const ybts = [];
  for (let ybtObj of Object.values(baseTokenObj.YBTs)) {
    ybts.push({ ...ybtObj });
  }

  return {
    address: baseTokenObj.address,
    name: baseTokenObj.name,
    symbol: baseTokenObj.symbol === "wETH" ? "ETH" : baseTokenObj.symbol,
    decimals: baseTokenObj.decimals,
    ybts,
  };
};
