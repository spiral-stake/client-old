export const readYbts = async (chainId) => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`);

  const ybtData = [];

  for (let ybt of Object.values(ybtsObj)) {
    ybtData.unshift({ ...ybt });
  }

  return ybtData;
};

export const readYbt = async (chainId, ybtSymbol) => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`);
  return { ...ybtsObj[ybtSymbol] };
};
