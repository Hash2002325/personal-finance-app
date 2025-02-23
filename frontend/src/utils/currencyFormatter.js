const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  LKR: 'Rs.',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$'
};

export const formatCurrency = (amount, currencyCode = 'LKR') => {
  const symbol = currencySymbols[currencyCode] || currencyCode;
  const formattedAmount = Number(amount).toFixed(2);
  return `${symbol} ${formattedAmount}`;
}; 