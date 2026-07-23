import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DescriptionField } from './FormFields'
import CurrencyFormat from './CurrencyFormat'
import DateFormat from './DateFormat'
import StatusBadge from './StatusBadge'
import { customersAPI, companiesAPI, invoicesAPI, quotesAPI, receiptsAPI } from '../utils/apiClient'
import { useAuth } from '../contexts/AuthContext'

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  const sign = num < 0 ? '-' : ''
  return sign + 'RM ' + new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2 }).format(Math.abs(num))
}

const isBillable = (item) => Number(item.amount) > 0 || Number(item.unitPrice) > 0

const renderMarkdown = (text) => {
  if (!text) return ''
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, wrap: '<strong>$1</strong>' },
    { regex: /\*([^*]+)\*/g, wrap: '<em>$1</em>' },
    { regex: /~~([^~]+)~~/g, wrap: '<del>$1</del>' },
    { regex: /`([^`]+)`/g, wrap: '<code>$1</code>' }
  ]
  return text.split('\n').map(line => {
    if (!line.trim()) return '<div style="height:14px"></div>'
    let html = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    patterns.forEach(({ regex, wrap }) => { html = html.replace(regex, wrap) })
    return `<div style="margin-bottom:0.2rem">${html}</div>`
  }).join('')
}

const DocumentInlineEditor = ({ id, docType }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isCreateMode = !id
  const isInvoice = docType === 'INVOICE'
  const isReceipt = docType === 'RECEIPT'

  const config = {
    api: isInvoice ? invoicesAPI : isReceipt ? receiptsAPI : quotesAPI,
    docLabel: isInvoice ? 'INVOICE' : isReceipt ? 'RECEIPT' : 'QUOTATION',
    docNumberField: isInvoice ? 'invoiceNumber' : isReceipt ? 'receiptNumber' : 'quoteNumber',
    dueDateField: isInvoice ? 'dueDate' : isReceipt ? null : 'validUntil',
    dueDateLabel: isInvoice ? 'Due' : isReceipt ? null : 'Validity',
    dueDateSidebarLabel: isInvoice ? 'Due Date' : isReceipt ? null : 'Valid Until',
    createLabel: isInvoice ? 'Create Invoice' : isReceipt ? 'Create Receipt' : 'Create Quote',
    newLabel: isInvoice ? 'New Invoice' : isReceipt ? 'New Receipt' : 'New Quotation',
    navigatePath: isInvoice ? '/invoices' : isReceipt ? '/receipts' : '/quotes',
    errorTitle: isInvoice ? 'Invoice not found' : isReceipt ? 'Receipt not found' : 'Quote not found',
    showBankDetails: isInvoice,
    showPartialPayment: isInvoice,
    showConvertDO: isInvoice,
    showIssueInvoice: !isInvoice && !isReceipt,
    showRevise: !isReceipt,
  }

  const [doc, setDoc] = useState(null)
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeRowIdx, setActiveRowIdx] = useState(null)
  const [qtyEditValue, setQtyEditValue] = useState('')
  const [priceEditValue, setPriceEditValue] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [editingDocNo, setEditingDocNo] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(false)
  const [editingDiscountLabel, setEditingDiscountLabel] = useState(false)
  const [editingTax, setEditingTax] = useState(false)

  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [docDate, setDocDate] = useState('')
  const [docSecondDate, setDocSecondDate] = useState('')
  const [editingDate, setEditingDate] = useState(false)
  const [editingSecondDate, setEditingSecondDate] = useState(false)
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [company, setCompany] = useState(null)

  const subtotal = items.reduce((sum, item) => {
    if (item.variant === 'section') return sum
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)
  const taxAmount = doc ? Number(doc.tax || doc.taxAmount || 0) : 0
  const discountAmount = doc ? Number(doc.discountAmount || 0) : 0
  const total = subtotal + taxAmount - discountAmount
  const paidAmount = Number(doc?.paidAmount) || 0
  const balanceDue = Math.max(total - paidAmount, 0)
  const isPartiallyPaid = !isCreateMode && paidAmount > 0 && balanceDue > 0.005

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        if (isCreateMode) {
          const [custRes, compRes] = await Promise.all([
            customersAPI.getAll({ limit: 1000 }),
            companiesAPI.getAll({ limit: 1000 })
          ])
          const custList = custRes?.data?.customers || custRes?.data || []
          const compList = compRes?.data?.companies || compRes?.data || []
          const defaultCompany = compList.find(c => c.is_default === true) || compList[0] || {}
          setCustomers(custList)
          setCompanies(compList)
          setSelectedCompanyId(defaultCompany.id || null)
          setCompany({
            name: defaultCompany.name || '',
            registration: defaultCompany.ssm || '',
            address: defaultCompany.address || '',
            email: defaultCompany.email || '',
            phone: defaultCompany.phone || '',
            manager: defaultCompany.manager || '',
            logo: defaultCompany.logo || null,
            ...(isInvoice && {
              bankacc: defaultCompany.bankacc || '',
              bankname: defaultCompany.bankname || '',
              bankholder: defaultCompany.bankholder || ''
            })
          })
          setDoc({ customer: null, status: 'draft', discountPercent: 0, discountAmount: 0, discountLabel: '', taxAmount: 0 })
          const today = new Date().toISOString().slice(0, 10)
          const secondDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10)
          setDocDate(today)
          setDocSecondDate(secondDate)
          setItems([{ id: Date.now(), description: '', quantity: 1, unitPrice: 0, amount: 0, variant: 'structured', listType: 'ul', spacing: 'normal' }])
          setNotes('')
          setLoading(false)
          return
        }

        const [res, custRes] = await Promise.all([
          config.api.getById(id),
          customersAPI.getAll({ limit: 1000 })
        ])
        const custList = custRes?.data?.customers || custRes?.data || []
        setCustomers(custList)

        if (res?.success && res?.data) {
          const data = res.data
          setDoc(data)
          if (data.company) {
            setCompany({
              name: data.company.name || '',
              registration: data.company.ssm || data.company.registration || '',
              address: data.company.address || '',
              email: data.company.email || '',
              phone: data.company.phone || '',
              manager: data.company.manager || '',
              logo: data.company.logo || null,
              ...(isInvoice && {
                bankacc: data.company.bankacc || '',
                bankname: data.company.bankname || '',
                bankholder: data.company.bankholder || ''
              })
            })
          }
          setSelectedCustomerId(data.customerId)
          setSelectedCompanyId(data.companyId)
          setDocDate(data.date?.slice(0,10) || '')
          setDocSecondDate(config.dueDateField ? (data[config.dueDateField]?.slice(0,10) || '') : '')
          setItems(data.items?.map(item => ({
            id: item.id,
            description: item.description || '',
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0,
            amount: Number(item.amount) || 0,
            variant: item.variant || 'structured',
            listType: item.listType || 'ul',
            spacing: item.spacing || 'normal'
          })) || [])
          setNotes(data.notes || '')
        } else {
          setError(`Failed to load ${config.docLabel.toLowerCase()}`)
        }
      } catch (err) {
        setError(err?.message || `Error loading ${config.docLabel.toLowerCase()}`)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isCreateMode, user, isInvoice, isReceipt, config.api, config.dueDateField])

  const markDirty = useCallback(() => setIsDirty(true), [])

  const handleQtyChange = (index, value) => {
    const qty = Math.max(0, parseInt(value) || 0)
    setItems(prev => prev.map((item, i) =>
      i === index ? {
        ...item,
        quantity: qty,
        amount: item.variant === 'section' ? 0 : qty * Number(item.unitPrice)
      } : item
    ))
    markDirty()
  }

  const handlePriceChange = (index, value) => {
    const price = Math.max(0, parseFloat(value) || 0)
    setItems(prev => prev.map((item, i) =>
      i === index ? {
        ...item,
        unitPrice: price,
        amount: item.variant === 'section' ? 0 : Number(item.quantity) * price
      } : item
    ))
    markDirty()
  }

  const handleDescriptionChange = (index, value) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, description: value } : item
    ))
    markDirty()
  }

  const handleNotesChange = (value) => {
    setNotes(value)
    markDirty()
  }

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      variant: 'structured',
      listType: 'ul',
      spacing: 'normal'
    }])
    markDirty()
  }

  const handleAddSection = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      description: 'New Section',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      variant: 'section',
      listType: 'ul',
      spacing: 'normal'
    }])
    markDirty()
  }

  const handleDeleteItem = (index) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
    markDirty()
  }

  const handleCustomerSelect = (e) => {
    const custId = e.target.value
    if (!custId) return
    setSelectedCustomerId(custId)
    const selected = customers.find(c => String(c.id) === String(custId))
    if (selected) {
      setDoc(prev => ({ ...prev, customer: selected }))
    }
    setEditingCustomer(false)
    markDirty()
  }

  const handleDateChange = (value) => {
    setDocDate(value)
    setEditingDate(false)
    markDirty()
  }

  const handleSecondDateChange = (value) => {
    setDocSecondDate(value)
    setEditingSecondDate(false)
    markDirty()
  }

  const handleSave = async () => {
    if (isCreateMode && !selectedCustomerId) {
      alert('Please select a customer')
      return
    }

    setSaving(true)
    try {
      const payload = {
        customerId: selectedCustomerId || doc?.customerId,
        companyId: selectedCompanyId || doc?.companyId,
        date: docDate,
        ...(config.dueDateField && { [config.dueDateField]: docSecondDate }),
        notes: notes,
        discountPercent: doc?.discountPercent || 0,
        discountAmount: doc?.discountAmount || 0,
        discountLabel: doc?.discountLabel || '',
        ...(isReceipt
          ? {
              taxRate: subtotal > 0 ? (taxAmount / subtotal * 100) : 0,
              subtotal: subtotal,
              total: total,
            }
          : {
              taxAmount: taxAmount,
              subtotal: subtotal,
              total: total,
            }
        ),
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.variant === 'section' ? 0 : Number(item.quantity) * Number(item.unitPrice),
          variant: item.variant || 'structured',
          listType: item.listType || 'ul',
          spacing: item.spacing || 'normal'
        }))
      }

      let res
      if (isCreateMode) {
        payload.userId = user?.id
        res = await config.api.create(payload)
        if (res?.success) {
          const newId = res.data?.id || res.data?.receipt?.id || res.data?.invoice?.id || res.data?.quote?.id
          navigate(`${config.navigatePath}/${newId}`)
        }
      } else {
        if (doc?.[config.docNumberField]?.trim()) payload[config.docNumberField] = doc[config.docNumberField]
        res = await config.api.update(id, payload)
        if (res?.success) {
          setIsDirty(false)
          setDoc(prev => ({ ...prev, customer: customers.find(c => String(c.id) === String(selectedCustomerId)) || prev.customer, ...payload }))
        }
      }

      if (!res?.success) {
        alert(res?.message || `Failed to save ${config.docLabel.toLowerCase()}`)
      }
    } catch (err) {
      alert(err?.message || `Error saving ${config.docLabel.toLowerCase()}`)
    } finally {
      setSaving(false)
    }
  }

  const handleViewPdf = async () => {
    setPdfLoading(true)
    try {
      await config.api.generatePdf(id)
      const pdfUrl = config.api.getPdfUrl(id)
      const a = document.createElement('a')
      a.href = pdfUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleIssueInvoice = async () => {
    try {
      const res = await config.api.convertToInvoice(id, {})
      if (res?.success) {
        const createdInvoice = res.data?.invoice || res.data
        navigate(`/invoices/${createdInvoice.id}`)
      } else {
        alert(res?.message || 'Ralat menukar sebut harga kepada invois')
      }
    } catch (err) {
      alert(err?.message || 'Ralat menukar sebut harga kepada invois')
    }
  }

  const handleRevise = async () => {
    if (!window.confirm('Revisi akan mencipta dokumen baru dan menandakan dokumen ini sebagai REVISED. Teruskan?')) return
    try {
      const res = await config.api.revise(id, {})
      if (res?.success) {
        navigate(`${config.navigatePath}/${res.data.id}`)
      }
    } catch (err) {
      alert(err?.message || 'Ralat mencipta revisi')
    }
  }

  const needsQtyPrice = (item) => {
    if (!isBillable(item)) return false
    const qty = Number(item.quantity)
    const price = Number(item.unitPrice)
    return qty > 1 || (qty && price && Number(item.amount) !== price * qty)
  }
  const showQtyPrice = items.some(needsQtyPrice)
  const billableItems = items.filter(isBillable)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if ((error || !doc) && !isCreateMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 font-medium mb-1">{config.errorTitle}</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate(config.navigatePath)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Back to list
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-199px)] flex flex-col bg-gray-100">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(config.navigatePath)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <StatusBadge status={doc?.status || 'draft'} />
              <span className="text-sm font-medium text-gray-700">
                {isCreateMode ? config.newLabel : doc?.[config.docNumberField]}
              </span>
              {config.showPartialPayment && isPartiallyPaid && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Sebahagian Dibayar
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[210mm] mx-auto bg-white shadow-sm border border-gray-200" style={{ minHeight: '297mm' }}>
              <div className="px-6 py-5">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-[58px] align-top p-0">
                        <img
                          src="/logo/logo.png"
                          alt="Logo"
                          className="w-full"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </td>
                      <td className="align-top pl-1" style={{ width: '70%' }}>
                        <h1 className="text-lg font-bold text-gray-800 m-0" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                          {company?.name || ''}
                          <span className="text-xs text-gray-500 pl-1" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontWeight: 400 }}>
                            {company?.registration || ''}
                          </span>
                        </h1>
                        <div className="mt-1" style={{ lineHeight: 1.5 }}>
                          <p className="text-[0.65rem] text-gray-700 m-0 whitespace-nowrap">{company?.address || ''}</p>
                          <p className="text-[0.65rem] text-gray-700 m-0">Email: {company?.email || ''} Phone: {company?.phone || ''}</p>
                        </div>
                      </td>
                      <td className="align-top text-right p-0">
                        <h1 className="text-base font-bold text-gray-800 m-0 text-center" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                          {config.docLabel}
                        </h1>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr className="my-3 border-gray-400" />

                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/2 align-top">
                        {editingCustomer ? (
                          <div>
                            <select
                              value={selectedCustomerId || ''}
                              onChange={handleCustomerSelect}
                              className="w-full text-xs border border-green-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                              autoFocus
                            >
                              <option value="">Select customer...</option>
                              {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingCustomer(false)}
                              className="mt-1 px-2 py-0.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="cursor-pointer group" onClick={() => setEditingCustomer(true)}>
                            {doc?.customer ? (
                              <>
                                <p className="font-bold text-xs m-0 group-hover:text-green-700">{doc.customer.name}</p>
                                <p className="text-xs text-gray-700 m-0">{doc.customer.address || ''}</p>
                                {(doc.customer.phone || doc.customer.mobile) && (
                                  <p className="text-xs text-gray-700 mt-2">
                                    {doc.customer.phone ? `Tel: ${doc.customer.phone}` : ''}
                                    {doc.customer.mobile ? `  Mobile: ${doc.customer.mobile}` : ''}
                                  </p>
                                )}
                                {doc.customer?.attn && (
                                  <p className="text-xs font-bold text-gray-700 mt-1.5">Attn : {doc.customer.attn}</p>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 italic text-xs">Click to select customer</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="w-1/2 align-top text-right">
                        <table className="ml-auto border-collapse">
                          <tbody>
                            <tr>
                              <td className="text-left text-xs align-top whitespace-nowrap pr-1 font-black">No</td>
                              <td className="text-center text-xs px-1">:</td>
                              <td className="text-right text-xs whitespace-nowrap">
                                {isCreateMode ? (
                                  <span className="text-gray-400">(auto)</span>
                                ) : editingDocNo ? (
                                  <input
                                    type="text"
                                    value={doc?.[config.docNumberField] || ''}
                                    onChange={(e) => { setDoc(d => ({ ...d, [config.docNumberField]: e.target.value })); setIsDirty(true) }}
                                    onBlur={() => setEditingDocNo(false)}
                                    className="w-28 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500 text-right"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingDocNo(true)}>
                                    {doc?.[config.docNumberField] || '—'}
                                  </span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-left text-xs align-top whitespace-nowrap pr-1 text-gray-500">Date</td>
                              <td className="text-center text-xs px-1 text-gray-500">:</td>
                              <td className="text-right text-xs whitespace-nowrap text-gray-500">
                                {editingDate ? (
                                  <input
                                    type="date"
                                    value={docDate}
                                    onChange={(e) => setDocDate(e.target.value)}
                                    onBlur={() => handleDateChange(docDate)}
                                    className="w-28 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingDate(true)}>
                                    {formatDate(docDate)}
                                  </span>
                                )}
                              </td>
                            </tr>
                            {config.dueDateField && (
                              <tr>
                                <td className="text-left text-xs align-top whitespace-nowrap pr-1 text-gray-500">{config.dueDateLabel}</td>
                                <td className="text-center text-xs px-1 text-gray-500">:</td>
                                <td className="text-right text-xs whitespace-nowrap text-gray-500">
                                  {editingSecondDate ? (
                                    <input
                                      type="date"
                                      value={docSecondDate}
                                      onChange={(e) => setDocSecondDate(e.target.value)}
                                      onBlur={() => handleSecondDateChange(docSecondDate)}
                                      className="w-28 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingSecondDate(true)}>
                                      {formatDate(docSecondDate)}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4">
                  <hr className="border-gray-400 mb-0" />
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left font-semibold text-[0.6rem] text-gray-500 uppercase tracking-wider px-1 pt-1.5 pb-1">
                          DESCRIPTION
                        </th>
                        {showQtyPrice && (
                          <th className="text-center font-semibold text-[0.6rem] text-gray-500 uppercase tracking-wider px-1 pt-1.5 pb-1 w-[1%] whitespace-nowrap">
                            QTY
                          </th>
                        )}
                        {showQtyPrice && (
                          <th className="text-right font-semibold text-[0.6rem] text-gray-500 uppercase tracking-wider px-1 pt-1.5 pb-1 w-[1%] whitespace-nowrap">
                            PRICE
                          </th>
                        )}
                        <th className="text-right font-semibold text-[0.6rem] text-gray-500 uppercase tracking-wider px-1 pt-1.5 pb-1 w-[1%] whitespace-nowrap">
                          AMOUNT
                        </th>
                        <th className="w-6" />
                      </tr>
                      <tr>
                        <td colSpan={showQtyPrice ? 5 : 3} className="p-0">
                          <hr className="border-gray-400 m-0" />
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        const isSection = item.variant === 'section'
                        const isActive = activeRowIdx === index

                        return (
                          <React.Fragment key={item.id || index}>
                            <tr
                              className={`group ${isActive ? 'bg-green-50' : 'hover:bg-gray-50'} ${isSection ? 'bg-gray-50' : ''} cursor-pointer`}
                              onClick={() => {
                                if (!isSection) {
                                  setActiveRowIdx(isActive ? null : index)
                                  if (!isActive) {
                                    setQtyEditValue(String(item.quantity))
                                    setPriceEditValue(String(item.unitPrice))
                                  }
                                }
                              }}
                            >
                              {isSection ? (
                                <>
                                  <td className="py-2 px-1 align-top text-xs leading-relaxed font-bold text-sm" colSpan={showQtyPrice ? 4 : 2}>
                                    <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.description) || 'Section' }} />
                                  </td>
                                  <td className="py-2 px-1 text-right text-xs align-top whitespace-nowrap w-[1%] font-semibold">
                                    <span className="text-gray-300">-</span>
                                  </td>
                                  <td className="py-2 px-1 text-center align-top w-6" />
                                </>
                              ) : (
                                <>
                                  <td className="py-2 px-1 align-top text-xs leading-relaxed">
                                    {isActive ? (
                                      <textarea
                                        value={item.description}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full text-xs border border-green-500 rounded px-2 py-1 focus:outline-none resize-none mt-1"
                                        rows={3}
                                        autoFocus
                                        placeholder="Description..."
                                      />
                                    ) : item.description ? (
                                      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(item.description) }} />
                                    ) : (
                                      <span className="text-gray-400 italic">Click to edit</span>
                                    )}
                                  </td>
                                  {showQtyPrice && (
                                    <td className="py-2 px-1 text-center text-xs align-top whitespace-nowrap w-[1%]">
                                      {isActive ? (
                                        <input
                                          type="number"
                                          min="0"
                                          step="1"
                                          value={qtyEditValue}
                                          onChange={(e) => setQtyEditValue(e.target.value)}
                                          onBlur={() => handleQtyChange(index, qtyEditValue)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleQtyChange(index, qtyEditValue)
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-16 text-center border border-green-500 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                      ) : (
                                        <span className="hover:text-green-700 hover:font-semibold">
                                          {Number(item.quantity) || ''}
                                        </span>
                                      )}
                                    </td>
                                  )}
                                  {showQtyPrice && (
                                    <td className="py-2 px-1 text-right text-xs align-top whitespace-nowrap w-[1%]">
                                      {isActive ? (
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={priceEditValue}
                                          onChange={(e) => setPriceEditValue(e.target.value)}
                                          onBlur={() => handlePriceChange(index, priceEditValue)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handlePriceChange(index, priceEditValue)
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-20 text-right border border-green-500 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                      ) : (
                                        <span className="hover:text-green-700 hover:font-semibold">
                                          {Number(item.unitPrice) ? formatCurrency(item.unitPrice) : ''}
                                        </span>
                                      )}
                                    </td>
                                  )}
                                  <td className="py-2 px-1 text-right text-xs align-top whitespace-nowrap w-[1%] font-semibold">
                                    {Number(item.amount) ? formatCurrency(item.amount) : ''}
                                  </td>
                                  <td className="py-2 px-1 text-center align-top w-6">
                                    {isActive ? (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setActiveRowIdx(null) }}
                                        className="text-green-600 hover:text-green-800 text-xs font-bold"
                                      >
                                        ✓
                                      </button>
                                    ) : (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteItem(index) }}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity text-sm leading-none"
                                        title="Delete item"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                  <button
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Add Section
                  </button>
                </div>

                <hr className="my-4 border-gray-400" />

                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-1/2 align-top">
                        {config.showBankDetails && (company?.bankacc || company?.bankname || company?.bankholder) && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Bank Details</p>
                            <table className="border-collapse">
                              <tbody>
                                <tr>
                                  <td className="text-[0.65rem] leading-relaxed align-top whitespace-nowrap pr-1">Acc No.</td>
                                  <td className="text-[0.65rem] leading-relaxed pr-1">:</td>
                                  <td className="text-[0.65rem] leading-relaxed">{company?.bankacc || ''}</td>
                                </tr>
                                <tr>
                                  <td className="text-[0.65rem] leading-relaxed align-top whitespace-nowrap pr-1">Acc Name</td>
                                  <td className="text-[0.65rem] leading-relaxed pr-1">:</td>
                                  <td className="text-[0.65rem] leading-relaxed">{company?.bankname || ''}</td>
                                </tr>
                                <tr>
                                  <td className="text-[0.65rem] leading-relaxed align-top whitespace-nowrap pr-1">Acc Holder</td>
                                  <td className="text-[0.65rem] leading-relaxed pr-1">:</td>
                                  <td className="text-[0.65rem] leading-relaxed">{company?.bankholder || ''}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                      <td className="w-1/2 align-top text-right">
                        <table className="ml-auto border-collapse">
                          <tbody>
                            <tr>
                              <td className="text-left text-[0.7rem] text-gray-600 py-0.5 pr-4">Subtotal</td>
                              <td className="text-right text-[0.7rem] py-0.5 min-w-[90px]">{formatCurrency(subtotal)}</td>
                            </tr>
                            <tr>
                              <td className="text-left text-[0.7rem] text-gray-600 py-0.5 pr-4 whitespace-nowrap">
                                {editingDiscountLabel ? (
                                  <input
                                    type="text"
                                    value={doc?.discountLabel || ''}
                                    placeholder="Discount"
                                    onChange={(e) => { setDoc(d => ({ ...d, discountLabel: e.target.value })); setIsDirty(true) }}
                                    onBlur={() => setEditingDiscountLabel(false)}
                                    className="w-20 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingDiscountLabel(true)}>
                                    {doc?.discountLabel || 'Discount'}
                                  </span>
                                )}
                                {editingDiscount ? (
                                  <input
                                    type="number"
                                    min="0" max="100" step="0.1"
                                    value={doc?.discountPercent || 0}
                                    onChange={(e) => {
                                      const pct = parseFloat(e.target.value) || 0
                                      const amt = (subtotal * pct) / 100
                                      setDoc(d => ({ ...d, discountPercent: pct, discountAmount: amt }))
                                      setIsDirty(true)
                                    }}
                                    onBlur={() => setEditingDiscount(false)}
                                    className="w-14 text-xs border border-green-500 rounded px-1 py-0.5 ml-1 focus:outline-none"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="cursor-pointer hover:text-green-700 ml-1" onClick={() => setEditingDiscount(true)}>
                                    ({doc?.discountPercent || 0}%)
                                  </span>
                                )}
                              </td>
                              <td className="text-right text-[0.7rem] py-0.5 text-red-600">
                                {discountAmount > 0 ? formatCurrency(-discountAmount) : '—'}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-left text-[0.7rem] text-gray-600 py-0.5 pr-4">Tax</td>
                              <td className="text-right text-[0.7rem] py-0.5">
                                {editingTax ? (
                                  <input
                                    type="number"
                                    min="0" step="0.01"
                                    value={doc?.tax || doc?.taxAmount || 0}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0
                                      setDoc(d => ({ ...d, tax: val, taxAmount: val }))
                                      setIsDirty(true)
                                    }}
                                    onBlur={() => setEditingTax(false)}
                                    className="w-20 text-right text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingTax(true)}>
                                    {taxAmount > 0 ? formatCurrency(taxAmount) : '—'}
                                  </span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-t border-gray-700 pt-1" />
                              <td className="border-t border-gray-700 pt-1" />
                            </tr>
                            <tr className="font-bold text-sm">
                              <td className="text-left text-gray-900 py-0.5 pr-4">
                                {(discountAmount > 0 || taxAmount > 0) ? 'Grand Total' : 'Total'}
                              </td>
                              <td className="text-right text-gray-900 py-0.5">{formatCurrency(total)}</td>
                            </tr>
                            {config.showPartialPayment && isPartiallyPaid && (
                              <>
                                <tr>
                                  <td className="text-left text-[0.7rem] text-green-700 py-0.5 pr-4">Telah Dibayar (Paid)</td>
                                  <td className="text-right text-[0.7rem] py-0.5 text-green-700">{formatCurrency(paidAmount)}</td>
                                </tr>
                                <tr className="font-bold">
                                  <td className="border-t border-amber-400 pt-1 text-left text-[0.7rem] text-amber-700 py-0.5 pr-4">Baki (Amount Due)</td>
                                  <td className="border-t border-amber-400 pt-1 text-right text-[0.7rem] py-0.5 text-amber-700">{formatCurrency(balanceDue)}</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4">
                  {editingNotes ? (
                    <div data-color-mode="light">
                      <DescriptionField
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        minHeight={80}
                        placeholder="Click to add notes..."
                      />
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="mt-1 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-xs text-gray-600 cursor-pointer hover:text-green-700"
                      onClick={() => setEditingNotes(true)}
                    >
                      {notes ? (
                        <span dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }} />
                      ) : (
                        <span className="text-gray-400 italic">Click to add notes...</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-[0.7rem] text-gray-600">Issued By,</p>
                  <div className="inline-block mt-2">
                    <p className="text-sm font-semibold italic pb-0.5">
                      {company?.manager || doc?.issuedBy || ''}
                    </p>
                    <div className="border-t border-gray-700 pt-1 text-[0.65rem] text-gray-500 text-center italic">
                      (Signature)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-5">
            {isCreateMode && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company</h3>
                <select
                  value={selectedCompanyId || ''}
                  onChange={(e) => {
                    const comp = companies.find(c => c.id === e.target.value) || {}
                    setSelectedCompanyId(comp.id || null)
                    setCompany({
                      name: comp.name || '',
                      registration: comp.ssm || '',
                      address: comp.address || '',
                      email: comp.email || '',
                      phone: comp.phone || '',
                      manager: comp.manager || '',
                      logo: comp.logo || null,
                      ...(isInvoice && {
                        bankacc: comp.bankacc || '',
                        bankname: comp.bankname || '',
                        bankholder: comp.bankholder || ''
                      })
                    })
                    markDirty()
                  }}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                >
                  <option value="">Select company...</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</h3>
              {isCreateMode ? (
                <>
                  <select
                    value={selectedCustomerId || ''}
                    onChange={(e) => {
                      const cust = customers.find(c => c.id === e.target.value)
                      if (!cust) { setSelectedCustomerId(null); setDoc(prev => ({ ...prev, customer: null })); return }
                      setSelectedCustomerId(cust.id)
                      setDoc(prev => ({ ...prev, customer: cust }))
                      markDirty()
                    }}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                  >
                    <option value="">Select customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {selectedCustomerId && doc?.customer && (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs font-medium text-gray-900">{doc.customer.name}</p>
                      {doc.customer.address && <p className="text-xs text-gray-500">{doc.customer.address}</p>}
                      {doc.customer.phone && <p className="text-xs text-gray-500">Tel: {doc.customer.phone}</p>}
                      {doc.customer.mobile && <p className="text-xs text-gray-500">Mobile: {doc.customer.mobile}</p>}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">{doc?.customer?.name}</p>
                  {doc?.customer?.address && <p className="text-xs text-gray-500 mt-0.5">{doc.customer.address}</p>}
                  {doc?.customer?.phone && <p className="text-xs text-gray-500 mt-0.5">Tel: {doc.customer.phone}</p>}
                  {doc?.customer?.mobile && <p className="text-xs text-gray-500">Mobile: {doc.customer.mobile}</p>}
                  {doc?.customer?.attn && <p className="text-xs text-gray-500 mt-0.5">Attn: {doc.customer.attn}</p>}
                </>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dates</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-900"><DateFormat date={docDate} /></span>
                </div>
                {config.dueDateField && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{config.dueDateSidebarLabel}</span>
                    <span className="text-gray-900"><DateFormat date={docSecondDate} /></span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Summary</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="text-gray-900">{billableItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900"><CurrencyFormat amount={subtotal} /></span>
                </div>
                {(discountAmount > 0) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {doc?.discountLabel || 'Discount'}{doc?.discountPercent > 0 ? ` (${doc.discountPercent}%)` : ''}
                    </span>
                    <span className="text-red-600"><CurrencyFormat amount={-discountAmount} /></span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900"><CurrencyFormat amount={taxAmount} /></span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-900"><CurrencyFormat amount={total} /></span>
                </div>
                {config.showPartialPayment && isPartiallyPaid && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Telah Dibayar</span>
                      <span className="text-green-700"><CurrencyFormat amount={paidAmount} /></span>
                    </div>
                    <div className="border-t border-amber-200 pt-1.5 flex justify-between text-sm font-semibold">
                      <span className="text-amber-700">Baki Tertunggak</span>
                      <span className="text-amber-700"><CurrencyFormat amount={balanceDue} /></span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isCreateMode ? config.createLabel : 'Save'}
                  </>
                )}
              </button>
              {!isCreateMode && (
                <button
                  onClick={handleViewPdf}
                  disabled={pdfLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {pdfLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View PDF
                    </>
                  )}
                </button>
              )}
              {!isCreateMode && !['draft', 'revised'].includes(doc?.status?.toLowerCase()) && (
                <button
                  onClick={handleRevise}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Revise
                </button>
              )}
              {config.showIssueInvoice && !isCreateMode && doc?.status?.toLowerCase() === 'accepted' && !(doc?.invoices?.length > 0) && (
                <button
                  onClick={handleIssueInvoice}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Issue Invoice
                </button>
              )}
              {config.showIssueInvoice && !isCreateMode && doc?.invoices?.length > 0 && (
                <button
                  onClick={() => navigate(`/invoices/${doc.invoices[0].id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Invoice ({doc.invoices[0].invoiceNumber})
                </button>
              )}
              {config.showConvertDO && !isCreateMode && doc?.status === 'accepted' && (
                <button
                  onClick={() => navigate(`/delivery-orders/new?fromInvoice=${id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Convert to Delivery Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentInlineEditor