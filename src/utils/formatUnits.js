import { formatUnits as formatUnitsWagmi, parseUnits as parseUnitsWagmi } from "viem";

export const formatUnits = (value, decimals = 18) => {
  return Number(formatUnitsWagmi(value, decimals));
};

export const parseUnits = (value, decimals = 18) => {
  return parseUnitsWagmi(value, decimals);
};
