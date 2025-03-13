export const getTokens = async (chainId) => {
  const ybts = [];
  const baseTokens = [];
  const baseTokensObj = {};

  const data = await import(`../addresses/${chainId}.json`);

  Object.keys(data.ybts).forEach((ybtKey) => {
    const ybt = data.ybts[ybtKey];
    const baseToken = ybt.baseToken;

    ybts.push(ybt);

    if (!baseTokensObj[baseToken.address]) {
      baseTokens.push(baseToken);
      baseTokensObj[baseToken.address] = true;
    }
  });

  return { ybts, baseTokens };
};
