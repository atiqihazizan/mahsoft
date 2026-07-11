import React from 'react'

// Component untuk field pelanggan
export const CustomerField = ({ 
  value, 
  onChange, 
  customers = [], 
  error = '', 
  required = true 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Pelanggan {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Pilih pelanggan...</option>
      {customers.map(customer => (
        <option key={customer.id} value={customer.id}>
          {customer.name}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field syarikat
export const CompanyField = ({ 
  value, 
  onChange, 
  companies = [], 
  error = '', 
  required = true 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Syarikat {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Pilih syarikat...</option>
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field tarikh
export const DateField = ({ 
  value, 
  onChange, 
  label = 'Tarikh',
  error = '', 
  required = true 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field kadar cukai
export const TaxRateField = ({ 
  value, 
  onChange, 
  error = '' 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Kadar Cukai (%)
    </label>
    <input
      type="number"
      step="0.01"
      min="0"
      max="100"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field catatan
export const NotesField = ({ 
  value, 
  onChange, 
  rows = 3,
  placeholder = 'Masukkan catatan tambahan (pilihan)...'
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Catatan
    </label>
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
)

// Component untuk field input text umum
export const TextField = ({ 
  value, 
  onChange, 
  label,
  placeholder = '',
  error = '', 
  required = false,
  type = 'text'
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field input number
export const NumberField = ({ 
  value, 
  onChange, 
  label,
  placeholder = '',
  error = '', 
  required = false,
  min = 0,
  max = null,
  step = '0.01'
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field select umum
export const SelectField = ({ 
  value, 
  onChange, 
  label,
  options = [],
  placeholder = 'Pilih...',
  error = '', 
  required = false
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
)

// Component untuk field status
export const StatusField = ({ 
  value, 
  onChange, 
  type = 'invoice', // 'invoice', 'quote', 'receipt'
  error = '' 
}) => {
  const getStatusOptions = () => {
    switch (type) {
      case 'invoice':
        return [
          { value: 'DRAFT', label: 'Draf' },
          { value: 'SENT', label: 'Dihantar' },
          { value: 'PAID', label: 'Dibayar' },
          { value: 'OVERDUE', label: 'Tertunggak' },
          { value: 'CANCELLED', label: 'Dibatalkan' }
        ]
      case 'quote':
        return [
          { value: 'DRAFT', label: 'Draf' },
          { value: 'SENT', label: 'Dihantar' },
          { value: 'ACCEPTED', label: 'Diterima' },
          { value: 'REJECTED', label: 'Ditolak' },
          { value: 'EXPIRED', label: 'Tamat Tempoh' }
        ]
      case 'receipt':
        return [
          { value: 'DRAFT', label: 'Draf' },
          { value: 'PENDING', label: 'Menunggu' },
          { value: 'COMPLETED', label: 'Selesai' },
          { value: 'CANCELLED', label: 'Dibatalkan' }
        ]
      default:
        return []
    }
  }

  return (
    <SelectField
      value={value}
      onChange={onChange}
      label="Status"
      options={getStatusOptions()}
      placeholder="Pilih status..."
      error={error}
    />
  )
}

// Component untuk field kaedah pembayaran (untuk resit)
export const PaymentMethodField = ({ 
  value, 
  onChange, 
  error = '' 
}) => {
  const paymentMethods = [
    { value: 'CASH', label: 'Tunai' },
    { value: 'BANK_TRANSFER', label: 'Pemindahan Bank' },
    { value: 'CHEQUE', label: 'Cek' },
    { value: 'CREDIT_CARD', label: 'Kad Kredit' },
    { value: 'DEBIT_CARD', label: 'Kad Debit' },
    { value: 'ONLINE_PAYMENT', label: 'Pembayaran Online' }
  ]

  return (
    <SelectField
      value={value}
      onChange={onChange}
      label="Kaedah Pembayaran"
      options={paymentMethods}
      placeholder="Pilih kaedah pembayaran..."
      error={error}
    />
  )
}

export default {
  CustomerField,
  CompanyField,
  DateField,
  TaxRateField,
  NotesField,
  TextField,
  NumberField,
  SelectField,
  StatusField,
  PaymentMethodField
}
