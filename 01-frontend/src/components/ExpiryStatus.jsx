import React from 'react'

const ExpiryStatus = ({ validUntil, status, calculateDaysUntilExpiry }) => {
  // Jangan tunjukkan untuk status tertentu
  if (['all', 'dummy', 'accepted', 'rejected'].includes(status)) {
    return null
  }

  const daysUntilExpiry = calculateDaysUntilExpiry(validUntil)

  if (daysUntilExpiry > 0) {
    return (
      <span className="text-blue-600 font-medium">
        {daysUntilExpiry} days
      </span>
    )
  } else if (daysUntilExpiry === 0) {
    return (
      <span className="text-orange-600 font-medium">
        Last day
      </span>
    )
  } else {
    return (
      <span className="text-red-600 font-medium">
        Expired
      </span>
    )
  }
}

export default ExpiryStatus
