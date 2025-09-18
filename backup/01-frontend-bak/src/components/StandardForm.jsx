import React, { useState, useEffect } from 'react'
import { CurrencyFormat, DateFormat } from './index'

const StandardForm = ({ 
  type = 'invoice', // 'invoice', 'quote', 'receipt'
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  customers = [],
  companies = []
}) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    // Header information
    customerId: '',
    companyId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: type === 'invoice' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '', // 30 hari untuk invoice
    validUntil: type === 'quote' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '', // 30 hari untuk quote
    notes: '',
    
    // Items
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    
    // Totals
    subtotal: 0,
    taxRate: 6, // Default 6% GST
    taxAmount: 0,
    total: 0
  })

  // State untuk UI
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form dengan data sedia ada
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = (subtotal * formData.taxRate) / 100
    const total = subtotal + taxAmount

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          
          // Calculate amount for this item
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
          }
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const addItem = () => {
    const newId = Math.max(...formData.items.map(item => item.id), 0) + 1
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ]
    }))
  }

  const removeItem = (itemId) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.customerId) newErrors.customerId = 'Sila pilih pelanggan'
    if (!formData.companyId) newErrors.companyId = 'Sila pilih syarikat'
    if (!formData.date) newErrors.date = 'Sila masukkan tarikh'
    
    if (type === 'invoice' && !formData.dueDate) {
      newErrors.dueDate = 'Sila masukkan tarikh tamat tempoh'
    }
    
    if (type === 'quote' && !formData.validUntil) {
      newErrors.validUntil = 'Sila masukkan tarikh sah hingga'
    }

    // Items validation
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Sila masukkan perihalan item'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Kuantiti mesti lebih daripada 0'
      }
      if (item.unitPrice < 0) {
        newErrors[`item_${index}_unitPrice`] = 'Harga unit tidak boleh negatif'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFormTitle = () => {
    switch (type) {
      case 'invoice': return 'Buat Invois Baru'
      case 'quote': return 'Buat Sebut Harga Baru'
      case 'receipt': return 'Buat Resit Baru'
      default: return 'Buat Dokumen Baru'
    }
  }

  const getFormIcon = () => {
    switch (type) {
      case 'invoice': return '📄'
      case 'quote': return '💰'
      case 'receipt': return '🧾'
      default: return '📝'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 rounded-t-lg">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{getFormIcon()}</span>
            <div>
              <h1 className="text-2xl font-bold">{getFormTitle()}</h1>
              <p className="text-white text-opacity-90">
                {type === 'invoice' && 'Buat invois untuk pelanggan anda'}
                {type === 'quote' && 'Buat sebut harga untuk pelanggan anda'}
                {type === 'receipt' && 'Buat resit pembayaran untuk pelanggan anda'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pelanggan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih pelanggan...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
              )}
            </div>

            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syarikat <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => handleInputChange('companyId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.companyId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih syarikat...</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && (
                <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarikh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Due Date (Invoice only) */}
            {type === 'invoice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarikh Tamat Tempoh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            )}

            {/* Valid Until (Quote only) */}
            {type === 'quote' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sah Hingga <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.validUntil ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.validUntil && (
                  <p className="text-red-500 text-sm mt-1">{errors.validUntil}</p>
                )}
              </div>
            )}

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kadar Cukai (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Item & Perkhidmatan</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                + Tambah Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perihalan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Kuantiti
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Harga Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Masukkan perihalan item..."
                        />
                        {errors[`item_${index}_description`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`item_${index}_unitPrice`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-right">
                          <CurrencyFormat amount={item.amount} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="max-w-md ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    <CurrencyFormat amount={formData.subtotal} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cukai ({formData.taxRate}%):</span>
                  <span className="font-medium">
                    <CurrencyFormat amount={formData.taxAmount} />
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Jumlah Keseluruhan:</span>
                    <span className="text-blue-600">
                      <CurrencyFormat amount={formData.total} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan catatan tambahan (pilihan)..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StandardForm
