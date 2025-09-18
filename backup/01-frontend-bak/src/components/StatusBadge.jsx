import React from 'react'

const StatusBadge = ({ status, statusConfig = {} }) => {
  const defaultConfig = {
    paid: { color: 'bg-green-100 text-green-800', text: 'Dibayar' },
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' },
    overdue: { color: 'bg-red-100 text-red-800', text: 'Tertunggak' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Selesai' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' },
    accepted: { color: 'bg-green-100 text-green-800', text: 'Diterima' },
    rejected: { color: 'bg-red-100 text-red-800', text: 'Ditolak' },
    expired: { color: 'bg-gray-100 text-gray-800', text: 'Tamat Tempoh' },
    sent: { color: 'bg-blue-100 text-blue-800', text: 'Dihantar' },
    draft: { color: 'bg-gray-100 text-gray-800', text: 'Draf' }
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
