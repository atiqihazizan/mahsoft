import React from 'react'

const DateFormat = ({ date, format = 'short', locale = 'ms-MY' }) => {
  const formatDate = (dateValue) => {
    const dateObj = new Date(dateValue)
    
    if (format === 'short') {
      return dateObj.toLocaleDateString(locale)
    } else if (format === 'long') {
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else if (format === 'datetime') {
      return dateObj.toLocaleString(locale)
    } else if (format === 'time') {
      return dateObj.toLocaleTimeString(locale)
    }
    
    return dateObj.toLocaleDateString(locale)
  }

  return <span>{formatDate(date)}</span>
}

export default DateFormat
