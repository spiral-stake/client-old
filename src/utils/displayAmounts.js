export const displayAmount = (amount) => {
  if (amount === undefined) return;

  if (amount == 0) return "0.00";
  if (amount.toFixed(4) > 0) return amount.toFixed(3);

  return "< 0.00001";
};
