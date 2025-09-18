import React from 'react'

const StatusBadge = ({ status, statusConfig = {} }) => {
  const defaultConfig = {
    paid: { color: 'bg-green-100 text-green-800', text: 'Paid' },
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    overdue: { color: 'bg-red-100 text-red-800', text: 'Overdue' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
    dummy: { color: 'bg-yellow-100 text-yellow-800', text: 'Dummy' },
    rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
    expired: { color: 'bg-gray-100 text-gray-800', text: 'Expired' },
    sent: { color: 'bg-blue-100 text-blue-800', text: 'Sent' },
    draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
    active: { color: 'bg-green-100 text-green-800', text: 'Active' }
  }

  const config = { ...defaultConfig, ...statusConfig }
  const statusInfo = config[status] || config.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.text}
    </span>
  )
}

export default StatusBadge
