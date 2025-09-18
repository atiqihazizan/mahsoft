import React from 'react'

const DateFormat = ({ date, format = 'short', locale = 'ms-MY' }) => {
  const formatDate = (dateValue) => {
    // Handle null, undefined, or empty values
    if (!dateValue) {
      return 'N/A'
    }

    let dateObj
    
    // Handle different date formats
    if (typeof dateValue === 'string') {
      // Handle ISO date strings (YYYY-MM-DD)
      if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Add timezone info to prevent timezone issues
        dateObj = new Date(dateValue + 'T00:00:00')
      } else {
        // Try parsing as is
        dateObj = new Date(dateValue)
      }
    } else if (dateValue instanceof Date) {
      dateObj = dateValue
    } else {
      // Fallback
      dateObj = new Date(dateValue)
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    
    if (format === 'short') {
      // Format as dd-mm-yyyy
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const year = dateObj.getFullYear()
      return `${day}-${month}-${year}`
    } else if (format === 'long') {
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else if (format === 'datetime') {
      // Format as dd-mm-yyyy HH:mm
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const year = dateObj.getFullYear()
      const hours = dateObj.getHours().toString().padStart(2, '0')
      const minutes = dateObj.getMinutes().toString().padStart(2, '0')
      return `${day}-${month}-${year} ${hours}:${minutes}`
    } else if (format === 'time') {
      return dateObj.toLocaleTimeString(locale)
    }
    
    // Default format as dd-mm-yyyy
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${day}-${month}-${year}`
  }

  return <span>{formatDate(date)}</span>
}

export default DateFormat
