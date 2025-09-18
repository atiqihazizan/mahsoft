import React from 'react'

const CurrencyFormat = ({ amount, currency = 'MYR', locale = 'ms-MY' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value)
  }

  return <span>{formatCurrency(amount)}</span>
}

export default CurrencyFormat
