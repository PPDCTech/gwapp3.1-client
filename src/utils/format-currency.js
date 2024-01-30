export const getCurrencySign = (currency) => {
  switch (currency) {
    case "NGN":
      return "₦";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "";
  }
};

export const formatAmount = (amount) => {
  if (amount !== null && amount !== undefined) {
    return amount.toLocaleString("en-NG");
  }
  return null;
};
