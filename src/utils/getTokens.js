export const getTokens = async (chainId) => {
  const ybts = [];
  const baseTokens = [];

  const data = await import(`../addresses/${chainId}.json`);

  Object.keys(data.underlying).forEach((baseTokenKey) => {
    const baseToken = data.underlying[baseTokenKey];
    baseTokens.push(baseToken);

    Object.keys(baseToken.YBTs).forEach((ybtKey) => {
      const ybt = baseToken.YBTs[ybtKey];
      ybts.push(ybt);
    });
  });

  return { ybts, baseTokens };
};
