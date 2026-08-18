export const formatCurrency = (amount: number, currency = 'RUB') =>
  new Intl.NumberFormat(currency === 'RUB' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
