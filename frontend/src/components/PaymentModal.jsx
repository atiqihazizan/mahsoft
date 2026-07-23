import React, { useState } from 'react'

const PaymentModal = ({ invoice, onConfirm, onCancel }) => {
  const today = new Date().toISOString().split('T')[0]
  const [paidDate, setPaidDate] = useState(today)
  const [paymentRef, setPaymentRef] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({ paidDate, paymentRef })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Mark as Paid</h2>
        <p className="text-sm text-gray-500 mb-4">Invoice <span className="font-medium text-gray-700">{invoice?.invoiceNumber}</span> — RM {Number(invoice?.amount).toFixed(2)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={paidDate}
              onChange={e => setPaidDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="text"
              value={paymentRef}
              onChange={e => setPaymentRef(e.target.value)}
              placeholder="e.g. CHQ-001, TRF-20240723"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Confirm Paid</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal
