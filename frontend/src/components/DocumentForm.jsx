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
  const [newCustomer, setNewCustomer] = useState({ name: '', short: '', email: '', phone: '', mobile: '' })
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
        short: newCustomer.short.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
        mobile: newCustomer.mobile.trim()
      })
      if (res?.success) {
        const created = res.data
        setExtraCustomers(prev => [...prev, created])
        handleInputChange('customerId', created.id)
        setShowCustomerForm(false)
        setNewCustomer({ name: '', short: '', email: '', phone: '', mobile: '' })
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

  const formTitle = getFormTitle()
  const formSubtitle = {
    invoice: initialData && initialData.id ? 'Update invoice details and manage line items' : 'Create a new invoice for your customer',
    quote: initialData && initialData.id ? 'Update quote details and manage quotation items' : 'Create a new quotation for your customer',
    receipt: initialData && initialData.id ? 'Update payment receipt details' : 'Create a new payment receipt for your customer',
    delivery_order: initialData && initialData.id ? 'Update delivery order details' : 'Create a new delivery order for your customer'
  }[type] || ''

  const actionLabel = isSubmitting || loading ? 'Saving...' : (initialData && initialData.id ? 'Update' : 'Save')
  const isEdit = initialData && initialData.id

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky Page Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 min-w-0">
              <button
                type="button"
                onClick={handleCancelClick}
                className="flex-shrink-0 p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{formTitle}</h1>
                <p className="text-sm text-gray-500 truncate">{formSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {typeof onPreview === 'function' && (
                <button
                  type="button"
                  onClick={() => onPreview(formData)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              )}
              <button
                type="submit"
                form="document-form"
                disabled={isSubmitting || loading}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isSubmitting || loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form id="document-form" onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Left Column - Main Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Quotation Information Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Quotation Information</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Manage quotation details and pricing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Customer Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Customer <span className="text-red-500">*</span>
                      <button
                        type="button"
                        onClick={() => setShowCustomerForm(true)}
                        className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
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
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: errors.customerId ? '#ef4444' : state.isFocused ? '#10b981' : '#e5e7eb',
                          boxShadow: state.isFocused ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
                          '&:hover': { borderColor: '#10b981' },
                          borderRadius: '10px',
                          minHeight: '44px',
                          padding: '0 4px'
                        }),
                        placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
                        menu: (base) => ({ ...base, borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' })
                      }}
                      isClearable
                    />
                    {errors.customerId && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
                    )}

                    {/* Customer Creation Modal */}
                    {showCustomerForm && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
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
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
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
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="customer@email.com"
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="03-1234 5678"
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile (for WhatsApp)</label>
                              <input
                                type="tel"
                                value={newCustomer.mobile}
                                onChange={(e) => setNewCustomer(prev => ({ ...prev, mobile: e.target.value }))}
                                placeholder="012-345 6789"
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => { setShowCustomerForm(false); setNewCustomer({ name: '', short: '', email: '', phone: '', mobile: '' }) }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={createCustomer}
                              disabled={customerCreating || !newCustomer.name.trim() || !newCustomer.short.trim()}
                              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={safeCompanies.find(c => c.id === formData.companyId) ? { value: formData.companyId, label: safeCompanies.find(c => c.id === formData.companyId).label } : null}
                      onChange={(option) => handleInputChange('companyId', option ? option.value : '')}
                      options={safeCompanies.map(c => ({ value: c.id, label: c.label }))}
                      placeholder="Select company..."
                      isSearchable
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: errors.companyId ? '#ef4444' : state.isFocused ? '#10b981' : '#e5e7eb',
                          boxShadow: state.isFocused ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
                          '&:hover': { borderColor: '#10b981' },
                          borderRadius: '10px',
                          minHeight: '44px',
                          padding: '0 4px'
                        }),
                        placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
                        menu: (base) => ({ ...base, borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' })
                      }}
                      isClearable
                    />
                    {errors.companyId && (
                      <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                        errors.date ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject ?? ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter subject/title..."
                      className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                        errors.subject ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Due Date (Invoice only) */}
                  {type === 'invoice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate ?? ''}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                          errors.dueDate ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                      )}
                    </div>
                  )}

                  {/* Valid Until (Quote only) */}
                  {type === 'quote' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Valid Until <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil ?? ''}
                        onChange={(e) => handleInputChange('validUntil', e.target.value)}
                        className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                          errors.validUntil ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {errors.validUntil && (
                        <p className="text-red-500 text-xs mt-1">{errors.validUntil}</p>
                      )}
                    </div>
                  )}

                  {/* Delivery Date (Delivery Order only) */}
                  {type === 'delivery_order' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.deliveryDate ?? ''}
                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                        className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                          errors.deliveryDate ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {errors.deliveryDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
                      )}
                    </div>
                  )}

                  {/* Tax Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.taxRate ?? 0}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                    />
                  </div>

                  {/* Discount Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Discount Label
                    </label>
                    <input
                      type="text"
                      value={formData.discountLabel || ''}
                      onChange={(e) => {
                        setIsDirty(true)
                        setFormData(prev => ({ ...prev, discountLabel: e.target.value }))
                      }}
                      placeholder="e.g. One-Time Goodwill Discount"
                      className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                    />
                  </div>

                  {/* Discount Value */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Discount Amount
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.discountPercent || ''}
                        onChange={(e) => {
                          const pct = parseFloat(e.target.value) || 0
                          const amount = formData.subtotal > 0 ? Math.round(pct * formData.subtotal * 100 / 100) / 100 : 0
                          setIsDirty(true)
                          setFormData(prev => ({ ...prev, discountPercent: Math.round(pct * 100) / 100, discountAmount: amount }))
                        }}
                        min={0}
                        max={100}
                        step="0.01"
                        placeholder="%"
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                      />
                      <input
                        type="number"
                        value={formData.discountAmount || ''}
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value) || 0
                          const pct = formData.subtotal > 0 ? Math.round(amount / formData.subtotal * 100 * 100) / 100 : 0
                          setIsDirty(true)
                          setFormData(prev => ({ ...prev, discountPercent: pct, discountAmount: Math.round(amount * 100) / 100 }))
                        }}
                        min={0}
                        step="0.01"
                        placeholder="RM"
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Order specific fields */}
              {type === 'delivery_order' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage delivery details and contact information.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.deliveryAddress ?? ''}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm resize-none ${
                          errors.deliveryAddress ? 'border-red-400' : 'border-gray-200'
                        }`}
                        rows={3}
                        placeholder="Enter delivery address..."
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson ?? ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className={`w-full h-11 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                          errors.contactPerson ? 'border-red-400' : 'border-gray-200'
                        }`}
                        placeholder="Enter contact person name..."
                      />
                      {errors.contactPerson && (
                        <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone ?? ''}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                        placeholder="Enter contact phone number..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Items & Services Section */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Items & Services</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Manage quotation line items.</p>
                </div>

                <div className="space-y-5">
                  {formData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Item Card Header */}
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400 cursor-grab" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">Item {index + 1}</span>
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Item Card Body */}
                      <div className="p-5 space-y-4">
                        <div>
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
                              className={`w-full h-10 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                                errors[`item_${index}_quantity`] ? 'border-red-400' : 'border-gray-200'
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
                              className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
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
                              className={`w-full h-10 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm ${
                                errors[`item_${index}_unitPrice`] ? 'border-red-400' : 'border-gray-200'
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
                            <div className="w-full h-10 px-3 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-end font-semibold text-gray-900 text-sm">
                              <CurrencyFormat amount={item.amount} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Item Dashed Card */}
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/40 transition-all p-8 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-green-700 transition-colors">Add New Item</span>
                      <span className="text-xs text-gray-400">Click to add another line item</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Any extra information for this document.</p>
                </div>
                <DescriptionField
                  value={formData.notes ?? ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  label=""
                  placeholder="Enter additional notes (optional)..."
                />
              </div>
            </div>

            {/* Right Column - Sticky Summary */}
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">
                        <CurrencyFormat amount={formData.subtotal} />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tax ({formData.taxRate}%)</span>
                      <span className="text-sm font-medium text-gray-900">
                        <CurrencyFormat amount={formData.taxAmount} />
                      </span>
                    </div>
                    {formData.discountAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{formData.discountLabel || 'Discount'}</span>
                        <span className="text-sm font-medium text-red-500">
                          -<CurrencyFormat amount={formData.discountAmount} />
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-green-600">
                          <CurrencyFormat amount={formData.total} />
                        </span>
                      </div>
                    </div>
                    {formData.discountAmount > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        You save <CurrencyFormat amount={formData.discountAmount} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Sticky Footer Action Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-end gap-3 h-16">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {typeof onPreview === 'function' && (
              <button
                type="button"
                onClick={() => onPreview(formData)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            )}
            <button
              type="submit"
              form="document-form"
              disabled={isSubmitting || loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting || loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentForm
