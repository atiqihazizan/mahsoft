import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DescriptionField } from './FormFields'
import CurrencyFormat from './CurrencyFormat'
import DateFormat from './DateFormat'
import StatusBadge from './StatusBadge'
import { customersAPI, companiesAPI, receiptsAPI } from '../utils/apiClient'
import { useAuth } from '../contexts/AuthContext'

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

const fmtDDMMYYYY = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear()
}

const units = ['', 'ribu', 'juta', 'billion', 'trillion']
const nums = [
  '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan',
  'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
  'enam belas', 'tujuh belas', 'lapan belas', 'sembilan belas'
]
const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'lapan puluh', 'sembilan puluh']

const convertBelow1000 = (n) => {
  if (n === 0) return ''
  let result = ''
  if (n >= 100) {
    const h = Math.floor(n / 100)
    result += (h === 1 ? 'seratus' : nums[h] + ' ratus') + ' '
    n %= 100
  }
  if (n >= 20) {
    const t = Math.floor(n / 10)
    result += tens[t] + ' '
    n %= 10
  }
  if (n > 0) result += nums[n] + ' '
  return result.trim()
}

const numberToMalay = (num) => {
  if (num === 0) return 'Sifar Sahaja'
  let n = Math.round(Math.abs(num) * 100) / 100
  const sen = Math.round((n % 1) * 100)
  n = Math.floor(n)
  if (n === 0) return sen > 0 ? sen + ' sen Sahaja' : 'Sifar Sahaja'
  let result = ''
  let unitIdx = 0
  while (n > 0) {
    const chunk = n % 1000
    if (chunk > 0) {
      const prefix = convertBelow1000(chunk)
      const suffix = units[unitIdx] ? ' ' + units[unitIdx] : ''
      result = prefix + suffix + (result ? ' ' + result : '')
    }
    n = Math.floor(n / 1000)
    unitIdx++
  }
  if (sen > 0) result += ' dan ' + convertBelow1000(sen) + ' sen'
  if (result.startsWith('satu ribu')) result = 'seribu' + result.slice(9)
  return result.charAt(0).toUpperCase() + result.slice(1) + ' Sahaja'
}

const ReceiptInlineEditor = ({ id }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isCreateMode = !id

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
  const [amountEditValue, setAmountEditValue] = useState('')
  const [editingTotal, setEditingTotal] = useState(false)
  const [totalEditValue, setTotalEditValue] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [editingDocNo, setEditingDocNo] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(false)
  const [editingDiscountLabel, setEditingDiscountLabel] = useState(false)
  const [editingTaxRate, setEditingTaxRate] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [docDate, setDocDate] = useState('')
  const [editingDate, setEditingDate] = useState(false)
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [company, setCompany] = useState(null)

  const subtotal = items.reduce((sum, item) => {
    if (item.variant === 'section') return sum
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)
  const discountAmount = doc ? Number(doc.discountAmount || 0) : 0
  const taxRate = doc ? Number(doc.taxRate ?? (doc.taxAmount && subtotal > 0 ? (doc.taxAmount / subtotal) * 100 : 0)) : 0
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discountAmount
  const logoUrl = company?.logo ? `/uploads/${company.logo}` : '/logo/logo.png'

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
            logo: defaultCompany.logo || null
          })
          setDoc({ customer: null, status: 'DRAFT', discountPercent: 0, discountAmount: 0, discountLabel: '', taxRate: 0 })
          setDocDate(new Date().toISOString().slice(0, 10))
          setItems([{ id: Date.now(), description: '', quantity: 1, unitPrice: 0, amount: 0, variant: 'structured', listType: 'ul', spacing: 'normal' }])
          setNotes('')
          setLoading(false)
          return
        }

        const [res, custRes] = await Promise.all([
          receiptsAPI.getById(id),
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
              logo: data.company.logo || null
            })
          }
          setSelectedCustomerId(data.customerId)
          setSelectedCompanyId(data.companyId)
          setDocDate(data.date?.slice(0,10) || '')
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
          setError('Failed to load receipt')
        }
      } catch (err) {
        setError(err?.message || 'Error loading receipt')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isCreateMode, user])

  const markDirty = useCallback(() => setIsDirty(true), [])

  const descFieldRef = useRef(null)

  useEffect(() => {
    if (activeRowIdx !== null && descFieldRef.current) {
      const textarea = descFieldRef.current.querySelector('textarea')
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      }
    }
  }, [activeRowIdx])

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
        notes: notes,
        discountPercent: doc?.discountPercent || 0,
        discountAmount: doc?.discountAmount || 0,
        discountLabel: doc?.discountLabel || '',
        taxRate: taxRate,
        subtotal: subtotal,
        total: total,
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
        res = await receiptsAPI.create(payload)
        if (res?.success) {
          navigate(`/receipts/${res.data.id}`)
        }
      } else {
        if (doc?.receiptNumber?.trim()) payload.receiptNumber = doc.receiptNumber
        res = await receiptsAPI.update(id, payload)
        if (res?.success) {
          setIsDirty(false)
          setDoc(prev => ({ ...prev, customer: customers.find(c => String(c.id) === String(selectedCustomerId)) || prev.customer, ...payload }))
        }
      }

      if (!res?.success) {
        alert(res?.message || 'Failed to save receipt')
      }
    } catch (err) {
      alert(err?.message || 'Error saving receipt')
    } finally {
      setSaving(false)
    }
  }

  const receiptRef = useRef(null)

  const handleViewPdf = async () => {
    setPdfLoading(true)
    try {
      const el = receiptRef.current
      if (!el) throw new Error('Receipt element not found')

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{margin:0;padding:0}</style></head>
<body>${el.innerHTML}</body>
</html>`

      const res = await receiptsAPI.generatePdfFromHtml(id, html)
      if (!res?.success) throw new Error(res?.message || 'PDF generation failed')
      const pdfUrl = receiptsAPI.getPdfUrl(id)
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
          <p className="text-gray-700 font-medium mb-1">Receipt not found</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={() => navigate('/receipts')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">Back to list</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-199px)] flex flex-col bg-gray-100">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/receipts')} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <StatusBadge status={doc?.status || 'draft'} />
              <span className="text-sm font-medium text-gray-700">{isCreateMode ? 'New Receipt' : doc?.receiptNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-y-auto p-6">
            <div ref={receiptRef} className="max-w-[210mm] mx-auto bg-white shadow-sm border border-gray-200 p-8 md:p-10" style={{ fontFamily: "'Times New Roman', Times, serif", minHeight: '297mm' }}>
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold tracking-wide text-gray-900" style={{ fontFamily: "'Audiowide', cursive" }}>
                    {company?.name || '-'}
                    {company?.registration && <span className="text-xs font-normal text-gray-600 pl-1" style={{fontFamily:"arial"}}>{company.registration}</span>}
                  </h1>
                  {/* {company?.registration && <p className="text-xs text-gray-600">{company.registration}</p>} */}
                  {company?.address && (
                    <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {company.address}
                    </div>
                  )}
                  {(company?.phone || company?.email) && (
                    <div className="text-xs text-gray-600 mt-0.5">
                      {company.phone && <span>Tel: {company.phone}</span>}
                      {company.phone && company.email && <span className="mx-1">|</span>}
                      {company.email && <span>{company.email}</span>}
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-700 mb-4" />
              <h2 className="text-center text-base font-bold underline underline-offset-4 mb-5" style={{ fontFamily: "'Audiowide', cursive", letterSpacing: '0.2em' }}>RESIT</h2>

              {/* No + Tarikh */}
              <table className="w-full border-collapse mb-5">
                <tbody>
                  <tr>
                    <td className="w-[75%]" />
                    <td className="text-right text-sm whitespace-nowrap align-bottom pr-2 pb-0">No :</td>
                    <td className="border-b border-black text-sm px-2 min-w-[120px] text-center">
                      {isCreateMode ? (
                        <span className="text-gray-400 italic">(auto)</span>
                      ) : editingDocNo ? (
                        <input
                          type="text"
                          value={doc?.receiptNumber || ''}
                          onChange={(e) => { setDoc(d => ({ ...d, receiptNumber: e.target.value })); setIsDirty(true) }}
                          onBlur={() => setEditingDocNo(false)}
                          className="w-full text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingDocNo(true)}>
                          {doc?.receiptNumber || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td className="text-right text-sm whitespace-nowrap align-bottom pr-2 pb-0">Tarikh :</td>
                    <td className="border-b border-black text-sm px-2 pt-2 text-center">
                      {editingDate ? (
                        <input
                          type="date"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          onBlur={() => handleDateChange(docDate)}
                          className="w-full text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="cursor-pointer hover:text-green-700" onClick={() => setEditingDate(true)}>
                          {fmtDDMMYYYY(docDate)}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Diterima Dari + Wang Yang Diterima + Untuk Bayaran */}
              <table className="w-full border-collapse mb-3 text-sm">
                <tbody>
                  {/* Diterima Dari */}
                  <tr>
                    <td className="whitespace-nowrap pr-2 align-bottom w-[145px]">Diterima Dari :</td>
                    <td className="border-b border-black pt-1 align-bottom w-full">
                      {editingCustomer ? (
                        <select
                          value={selectedCustomerId || ''}
                          onChange={handleCustomerSelect}
                          className="text-xs border border-green-500 rounded px-2 py-1 focus:outline-none w-full"
                          autoFocus
                        >
                          <option value="">Select customer...</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="cursor-pointer hover:text-green-700" onClick={() => setEditingCustomer(true)}>
                          {doc?.customer?.name || '-'}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Wang Yang Diterima */}
                  <tr>
                    <td className="whitespace-nowrap pr-2 align-bottom">Wang Yang Diterima :</td>
                    <td className="border-b border-black pt-3 align-bottom leading-relaxed">
                      {numberToMalay(total)}
                    </td>
                  </tr>

                  {/* Untuk Bayaran */}
                  <tr>
                    <td className="whitespace-nowrap pr-2 align-top pt-3">Untuk Bayaran :</td>
                    <td className="border-b border-black align-top"
                      onClick={() => activeRowIdx === null && setActiveRowIdx(0)}>
                      {items.map((item, index) => (
                        <div key={item.id || index} className={index > 0 ? 'mt-1' : ''}>
                          {activeRowIdx === index ? (
                            <div
                              ref={descFieldRef}
                              onClick={(e) => e.stopPropagation()}
                              onBlur={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                  setActiveRowIdx(null)
                                }
                              }}
                              tabIndex={-1}
                            >
                              <DescriptionField
                                value={item.description}
                                onChange={(e) => { handleDescriptionChange(index, e.target.value); markDirty() }}
                                minHeight={60}
                                placeholder="Description..."
                              />
                            </div>
                          ) : (
                            <div
                              onClick={(e) => { e.stopPropagation(); setActiveRowIdx(index) }}
                              className="cursor-pointer hover:text-green-700 pt-3"
                              dangerouslySetInnerHTML={{
                                __html: renderMarkdown(item.description) ||
                                '<span class="text-gray-400 italic text-xs">Klik untuk edit</span>'
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/*
              <div className="flex gap-2 mt-2 mb-4">
                <button onClick={handleAddItem} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Item
                </button>
                <button onClick={handleAddSection} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  Add Section
                </button>
              </div>
              */}

              {/* FOOTER */}
              <div className="flex justify-between items-end mt-10">
                <div className="text-sm">
                  <p 
                    className="mb-2"
                    onClick={() => { setEditingTotal(true); setTotalEditValue(String(total || '')) }}
                  >Ringgit :
                    {editingTotal ? (
                      <input
                        type="number" min="0" step="0.01"
                        value={totalEditValue}
                        onChange={(e) => setTotalEditValue(e.target.value)}
                        onBlur={() => {
                          const val = parseFloat(totalEditValue) || 0
                          setItems(prev => prev.map((it, i) =>
                            i === 0 ? { ...it, unitPrice: val, amount: val, quantity: 1 } : it
                          ))
                          setEditingTotal(false)
                          markDirty()
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                        className="font-bold text-base border border-green-500 rounded px-2 py-0.5 w-36 focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="ml-2 font-bold text-base cursor-pointer hover:text-green-700"
                        onClick={() => { setEditingTotal(true); setTotalEditValue(String(total || '')) }}
                      >
                        {formatCurrency(total)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-center">
                  {company?.manager && <p className="text-sm mb-1">Dikeluarkan :</p>}
                  <div className="border-t border-black pt-1 min-w-[120px] text-center">
                    {company?.manager ? (
                      <p className="text-sm italic font-semibold">{company.manager}</p>
                    ) : (
                      <p className="border border-dashed border-gray-300 text-gray-400 text-xs px-6 py-2">Cop / Tandatangan</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
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
                      logo: comp.logo || null
                    })
                    markDirty()
                  }}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                >
                  <option value="">Select company...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                </>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dates</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900"><DateFormat date={docDate} /></span>
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
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{doc?.discountLabel || 'Discount'}{doc?.discountPercent > 0 ? ` (${doc.discountPercent}%)` : ''}</span>
                    <span className="text-red-600"><CurrencyFormat amount={-discountAmount} /></span>
                  </div>
                )}
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax ({taxRate}%)</span>
                    <span className="text-gray-900"><CurrencyFormat amount={taxAmount} /></span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-900"><CurrencyFormat amount={total} /></span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Receipt No</span>
                  {isCreateMode ? (
                    <span className="text-gray-400 italic">(auto)</span>
                  ) : (
                    <span className="cursor-pointer text-gray-900 hover:text-green-700" onClick={() => setEditingDocNo(true)}>
                      {doc?.receiptNumber || '—'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Discount Label</span>
                  {editingDiscountLabel ? (
                    <input type="text" value={doc?.discountLabel || ''} placeholder="Discount" onChange={(e) => { setDoc(d => ({ ...d, discountLabel: e.target.value })); setIsDirty(true) }} onBlur={() => setEditingDiscountLabel(false)} className="w-24 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none" autoFocus />
                  ) : (
                    <span className="cursor-pointer text-gray-900 hover:text-green-700" onClick={() => setEditingDiscountLabel(true)}>{doc?.discountLabel || 'Discount'}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Discount %</span>
                  {editingDiscount ? (
                    <input type="number" min="0" max="100" step="0.1" value={doc?.discountPercent || 0} onChange={(e) => { const pct = parseFloat(e.target.value) || 0; setDoc(d => ({ ...d, discountPercent: pct, discountAmount: (subtotal * pct) / 100 })); setIsDirty(true) }} onBlur={() => setEditingDiscount(false)} className="w-16 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none text-right" autoFocus />
                  ) : (
                    <span className="cursor-pointer text-gray-900 hover:text-green-700" onClick={() => setEditingDiscount(true)}>{doc?.discountPercent || 0}%</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Tax Rate</span>
                  {editingTaxRate ? (
                    <input type="number" min="0" step="0.1" value={taxRate} onChange={(e) => { setDoc(d => ({ ...d, taxRate: parseFloat(e.target.value) || 0 })); setIsDirty(true) }} onBlur={() => setEditingTaxRate(false)} className="w-16 text-xs border border-green-500 rounded px-1 py-0.5 focus:outline-none text-right" autoFocus />
                  ) : (
                    <span className="cursor-pointer text-gray-900 hover:text-green-700" onClick={() => setEditingTaxRate(true)}>{taxRate}%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button onClick={handleSave} disabled={!isDirty || saving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                {saving ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Saving...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{isCreateMode ? 'Create Receipt' : 'Save'}</>
                )}
              </button>
              {!isCreateMode && (
                <button onClick={handleViewPdf} disabled={pdfLoading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {pdfLoading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Processing...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>View PDF</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ReceiptInlineEditor
