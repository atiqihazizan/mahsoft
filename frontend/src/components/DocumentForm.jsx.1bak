import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { CurrencyFormat, DateFormat } from './index'
import { DescriptionField, DiscountInput } from './FormFields'
import { customersAPI } from '../utils/apiClient'

const autoShort = (name) => {
  const words = name.trim().split(/\s+/)
  if (!words[0]) return ''
  const prefixes = ['sykt', 'ptd', 'sdn', 'bhd', 'pvt', 'ltd', 'inc', 'corp', 'm/s']
  if (words.length > 1 && (prefixes.includes(words[0].toLowerCase()) || words[0].length <= 2)) {
    return words.slice(0, 2).join(' ')
  }
  return words[0]
}

const DocumentForm = ({ 
  type = 'invoice', // 'invoice', 'quote', 'receipt', 'delivery_order'
  initialData = null,
  onSubmit,
  onCancel,
  onPreview,
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
    deliveryDate: type === 'delivery_order' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '', // 7 hari untuk delivery order
    deliveryAddress: '',
    contactPerson: '',
    contactPhone: '',
    subject: '',
    notes: '',
    
    // Items
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        unit: '',
        unitPrice: 0,
        amount: 0,
      }
    ],
    
    // Totals
    subtotal: 0,
    taxRate: 0, // Default 0% tax
    taxAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    discountLabel: '',
    total: 0
  })

  // State untuk UI
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // State untuk customer creation modal
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', short: '' })
  const [extraCustomers, setExtraCustomers] = useState([])
  const [customerCreating, setCustomerCreating] = useState(false)
  const [customerSearchInput, setCustomerSearchInput] = useState('')

  const safeCustomers = [...extraCustomers, ...(Array.isArray(customers) ? customers : [])]
  const safeCompanies = Array.isArray(companies) ? companies : []

  // Initialize form dengan data sedia ada
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  // Auto-select company dengan is_default=1
  useEffect(() => {
    if (safeCompanies.length > 0 && !formData.companyId) {
      const defaultCompany = safeCompanies.find(company => company.is_default === true)
      if (defaultCompany) {
        setFormData(prev => ({
          ...prev,
          companyId: defaultCompany.id
        }))
      }
    }
  }, [safeCompanies, formData.companyId])

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate, formData.discountAmount])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = (subtotal * formData.taxRate) / 100
    const total = subtotal + taxAmount - (formData.discountAmount || 0)

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }))
  }

  const handleInputChange = (field, value) => {
    setIsDirty(true)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleItemChange = (itemId, field, value) => {
    setIsDirty(true)
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          
          // Calculate amount for this item
          if (field === 'quantity' || field === 'unitPrice') updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const addItem = () => {
    setIsDirty(true)
    const newId = Math.max(...formData.items.map(item => item.id), 0) + 1
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: '',
          quantity: 1,
          unit: '',
          unitPrice: 0,
          amount: 0,
        }
      ]
    }))
  }

  const removeItem = (itemId) => {
    if (formData.items.length > 1) {
      setIsDirty(true)
      setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }))
    }
  }

  const createCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.short.trim()) return
    setCustomerCreating(true)
    try {
      const res = await customersAPI.create({
        name: newCustomer.name.trim(),
        short: newCustomer.short.trim()
      })
      if (res?.success) {
        const created = res.data
        setExtraCustomers(prev => [...prev, created])
        handleInputChange('customerId', created.id)
        setShowCustomerForm(false)
        setNewCustomer({ name: '', short: '' })
      } else {
        alert(res?.message || 'Failed to create customer')
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create customer')
    } finally {
      setCustomerCreating(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.customerId) newErrors.customerId = 'Please select a customer'
    if (!formData.companyId) newErrors.companyId = 'Please select a company'
    if (!formData.date) newErrors.date = 'Please enter date'
    if (type === 'invoice' && !formData.dueDate) newErrors.dueDate = 'Please enter due date'
    if (type === 'quote' && !formData.validUntil) newErrors.validUntil = 'Please enter valid until date'

    // Items validation
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) newErrors[`item_${index}_description`] = 'Please enter item description'
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      if (item.unitPrice < 0) newErrors[`item_${index}_unitPrice`] = 'Unit price cannot be negative'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      // Handle error silently
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelClick = () => {
    if (typeof onCancel !== 'function') return
    // Jika tiada perubahan, terus batal tanpa popup
    if (!isDirty) {
      onCancel()
      return
    }
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      onCancel()
    }
  }

  const getFormTitle = () => {
    const isEdit = initialData && initialData.id
    const action = isEdit ? 'Update' : 'Create'
    
    switch (type) {
      case 'invoice': return `${action} ${isEdit ? 'Invoice' : 'New Invoice'}`
      case 'quote': return `${action} ${isEdit ? 'Quote' : 'New Quote'}`
      case 'receipt': return `${action} ${isEdit ? 'Receipt' : 'New Receipt'}`
      case 'delivery_order': return `${action} ${isEdit ? 'Delivery Order' : 'New Delivery Order'}`
      default: return `${action} ${isEdit ? 'Document' : 'New Document'}`
    }
  }

  const getFormIcon = () => {
    switch (type) {
      case 'invoice': return '📄'
      case 'quote': return '💰'
      case 'receipt': return '🧾'
      case 'delivery_order': return '🚚'
      default: return '📝'
    }
  }

  // Computed options for customer dropdown
  const customerOptions = (() => {
    const opts = safeCustomers.map(c => ({ value: c.id, label: c.name }))
    const trimmed = customerSearchInput.trim()
    const hasExactMatch = trimmed && safeCustomers.some(c => c.name.toLowerCase() === trimmed.toLowerCase())
    if (trimmed && !hasExactMatch) {
      opts.push({ value: '__create__', label: `+ Add "${trimmed}"` })
    }
    return opts
  })()

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className={`text-white p-6 rounded-t-lg ${
          type === 'invoice' ? 'bg-blue-500' : 
          type === 'quote' ? 'bg-green-500' : 
          type === 'receipt' ? 'bg-purple-500' : 
          type === 'delivery_order' ? 'bg-orange-500' : 
          'bg-blue-500'
        }`}>
          <div className="flex items-center">
            <span className="text-3xl mr-3">{getFormIcon()}</span>
            <div>
              <h1 className="text-2xl font-bold">{getFormTitle()}</h1>
              <p className="text-white text-opacity-90">
                {type === 'invoice' && (initialData && initialData.id ? 'Update invoice details' : 'Create invoice for your customers')}
                {type === 'quote' && (initialData && initialData.id ? 'Update quote details' : 'Create quote for your customers')}
                {type === 'receipt' && (initialData && initialData.id ? 'Update payment receipt details' : 'Create payment receipt for your customers')}
                {type === 'delivery_order' && (initialData && initialData.id ? 'Update delivery order details' : 'Create delivery order for your customers')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer <span className="text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(true)}
                  className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  title="Add new customer"
                >
                  + New
                </button>
              </label>
              <Select
                value={safeCustomers.find(c => c.id === formData.customerId) ? { value: formData.customerId, label: safeCustomers.find(c => c.id === formData.customerId).name } : null}
                onChange={(option) => {
                  if (option && option.value === '__create__') {
                    const trimmed = customerSearchInput.trim()
                    setNewCustomer({ name: trimmed, short: autoShort(trimmed) })
                    setShowCustomerForm(true)
                    return
                  }
                  handleInputChange('customerId', option ? option.value : '')
                }}
                onInputChange={(value) => setCustomerSearchInput(value)}
                options={customerOptions}
                placeholder="Select customer..."
                isSearchable
                classNamePrefix="react-select"
                className={`${errors.customerId ? 'border-red-500' : ''}`}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.customerId ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.5)' : 'none',
                    '&:hover': { borderColor: '#3b82f6' },
                    minHeight: '38px'
                  })
                }}
                isClearable
              />
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
              )}

              {/* Customer Creation Modal */}
              {showCustomerForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Customer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCustomer.name}
                          onChange={(e) => {
                            const name = e.target.value
                            setNewCustomer(prev => {
                              const short = prev.short || autoShort(name)
                              return { name, short }
                            })
                          }}
                          placeholder="Enter customer name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Short Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCustomer.short}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, short: e.target.value }))}
                          placeholder="Enter short name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => { setShowCustomerForm(false); setNewCustomer({ name: '', short: '' }) }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={createCustomer}
                        disabled={customerCreating || !newCustomer.name.trim() || !newCustomer.short.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {customerCreating ? 'Creating...' : 'Create Customer'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <Select
                value={safeCompanies.find(c => c.id === formData.companyId) ? { value: formData.companyId, label: safeCompanies.find(c => c.id === formData.companyId).label } : null}
                onChange={(option) => handleInputChange('companyId', option ? option.value : '')}
                options={safeCompanies.map(c => ({ value: c.id, label: c.label }))}
                placeholder="Select company..."
                isSearchable
                classNamePrefix="react-select"
                className={`${errors.companyId ? 'border-red-500' : ''}`}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.companyId ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.5)' : 'none',
                    '&:hover': { borderColor: '#3b82f6' },
                    minHeight: '38px'
                  })
                }}
                isClearable
              />
              {errors.companyId && (
                <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject ?? ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter subject/title..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Due Date (Invoice only) */}
            {type === 'invoice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate ?? ''}
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
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil ?? ''}
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

            {/* Delivery Date (Delivery Order only) */}
            {type === 'delivery_order' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate ?? ''}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                )}
              </div>
            )}

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate ?? 0}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <DiscountInput
                discountPercent={formData.discountPercent}
                discountAmount={formData.discountAmount}
                discountLabel={formData.discountLabel}
                subtotal={formData.subtotal}
                onChange={({ discountPercent, discountAmount, discountLabel }) => {
                  setIsDirty(true)
                  setFormData(prev => ({ ...prev, discountPercent, discountAmount, discountLabel }))
                }}
              />
            </div>

            {/* Totals Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-4 h-full border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      <CurrencyFormat amount={formData.subtotal} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                    <span className="font-medium">
                      <CurrencyFormat amount={formData.taxAmount} />
                    </span>
                  </div>
                  {formData.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-red-500">
                        -<CurrencyFormat amount={formData.discountAmount} />
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        <CurrencyFormat amount={formData.total} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items - Card Layout */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items & Services</h3>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
                >
                  {/* Section 1: Description */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Description
                    </label>
                    <DescriptionField
                      value={item.description ?? ''}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      label=""
                      placeholder="Enter item description..."
                      error={errors[`item_${index}_description`]}
                      minHeight={40}
                    />
                  </div>

                  {/* Section 2: Qty / Unit / Unit Price / Amount */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.quantity ?? 0}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={item.unit ?? ''}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        placeholder="pcs"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice ?? 0}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Amount
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-right font-semibold text-gray-900">
                        <CurrencyFormat amount={item.amount} />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Delete */}
                  <div className="flex justify-end mt-3">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Item
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Item Card */}
              <button
                type="button"
                onClick={addItem}
                className="w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all p-6 cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Add New Item</span>
                  <span className="text-xs text-gray-400">Click to add another item</span>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Order specific fields */}
          {type === 'delivery_order' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.deliveryAddress ?? ''}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Enter delivery address..."
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson ?? ''}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact person name..."
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone ?? ''}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact phone number..."
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes - Using DescriptionField */}
          <div className="mb-8">
            <DescriptionField
              value={formData.notes ?? ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              label="Additional Notes"
              placeholder="Enter additional notes (optional)..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {typeof onPreview === 'function' && (
              <button
                type="button"
                onClick={() => onPreview(formData)}
                className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Preview
              </button>
            )}
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? 'Saving...' : (initialData && initialData.id ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentForm
