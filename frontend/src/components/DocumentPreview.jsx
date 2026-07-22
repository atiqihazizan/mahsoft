import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PDFViewer from './PDFViewer'
import CurrencyFormat from './CurrencyFormat'
import DateFormat from './DateFormat'
import StatusBadge from './StatusBadge'
import { createDocumentData } from '../utils/documentHelpers'
import { invoicesAPI, quotesAPI, receiptsAPI, whatsAppAPI } from '../utils/apiClient'

// Pilih apiClient yang sepadan dengan jenis dokumen untuk hantar email/WhatsApp
const SEND_API_BY_TYPE = {
  INVOICE: invoicesAPI,
  QUOTATION: quotesAPI,
  RECEIPT: receiptsAPI
}

const DocumentPreview = ({
  id,
  documentType,
  backPath,
  editPath,
  apiGetById,
  apiGeneratePdf,
  apiGetPdfUrl
}) => {
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [regenerating, setRegenerating] = useState(false)
  const hasPdfSupport = Boolean(apiGetPdfUrl)

  const fetchDoc = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiGetById(id)
      if (res?.success && res?.data) {
        setDoc(createDocumentData(res.data, documentType))
      } else {
        setError('Failed to load document')
      }
    } catch (err) {
      setError(err?.message || 'Error loading document')
    } finally {
      setLoading(false)
    }
  }, [id, documentType, apiGetById])

  useEffect(() => {
    fetchDoc()
  }, [fetchDoc])

  useEffect(() => {
    if (!id || !apiGetPdfUrl) return
    setPdfLoading(true)
    const url = apiGetPdfUrl(id)
    setPdfUrl(`${url}?t=${Date.now()}`)
    setPdfLoading(false)
  }, [id, apiGetPdfUrl])

  const handleRegenerate = async () => {
    if (!apiGeneratePdf) return
    setRegenerating(true)
    try {
      const res = await apiGeneratePdf(id)
      if (res?.success) {
        setPdfUrl(`${apiGetPdfUrl(id)}?t=${Date.now()}`)
      }
    } catch (err) {
      console.error('Regenerate error:', err)
    } finally {
      setRegenerating(false)
    }
  }

  // Convert Quote -> Invoice (dan pilihan terus cipta Delivery Order sekali)
  const [showConvertDialog, setShowConvertDialog] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertCreateDO, setConvertCreateDO] = useState(false)
  const [convertDueDate, setConvertDueDate] = useState('')
  const [convertDeliveryDate, setConvertDeliveryDate] = useState('')
  const canConvertToInvoice = documentType === 'QUOTATION' && doc?.status === 'accepted'

  const openConvertDialog = () => {
    setConvertCreateDO(false)
    setConvertDueDate('')
    setConvertDeliveryDate('')
    setShowConvertDialog(true)
  }

  const handleConvertToInvoice = async () => {
    if (converting) return
    setConverting(true)
    try {
      const payload = {
        ...(convertDueDate && { dueDate: convertDueDate }),
        ...(convertCreateDO && { createDeliveryOrder: true }),
        ...(convertCreateDO && convertDeliveryDate && { deliveryDate: convertDeliveryDate })
      }
      const res = await quotesAPI.convertToInvoice(id, payload)
      if (res?.success) {
        setShowConvertDialog(false)
        const createdInvoice = res.data?.invoice || res.data
        const createdDO = res.data?.deliveryOrder
        if (createdDO) {
          alert(`Invois ${createdInvoice.invoiceNumber} dan Delivery Order ${createdDO.doNumber} berjaya dicipta`)
        }
        navigate(`/invoices/${createdInvoice.id}`)
      } else {
        alert(res?.message || 'Ralat menukar sebut harga kepada invois')
      }
    } catch (err) {
      alert(err?.message || 'Ralat menukar sebut harga kepada invois')
    } finally {
      setConverting(false)
    }
  }

  const [sending, setSending] = useState(null)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [whatsAppPhone, setWhatsAppPhone] = useState('')
  const [whatsAppQr, setWhatsAppQr] = useState(null)
  const [whatsAppAuthing, setWhatsAppAuthing] = useState(false)
  const whatsAppPollRef = useRef(null)

  const openEmailDialog = () => {
    setEmailTo(doc?.customer?.email || '')
    setShowEmailDialog(true)
  }

  const openWhatsAppDialog = () => {
    setWhatsAppPhone(doc?.customer?.mobile || doc?.customer?.phone || '')
    setWhatsAppQr(null)
    setWhatsAppAuthing(false)
    setShowWhatsAppDialog(true)
  }

  const handleEmailSend = async () => {
    if (!emailTo.trim() || sending) return
    setSending('email')
    setShowEmailDialog(false)
    try {
      const api = SEND_API_BY_TYPE[documentType] || quotesAPI
      const res = await api.sendEmail(id, { to: emailTo.trim() })
      if (res?.success) {
        alert('Emel berjaya dihantar')
      } else {
        alert(res?.message || 'Ralat menghantar emel')
      }
    } catch (err) {
      alert('Ralat menghantar emel')
    } finally {
      setSending(null)
    }
  }

  const handleWhatsAppSend = async () => {
    if (!whatsAppPhone.trim() || sending) return
    setSending('whatsapp')
    try {
      const api = SEND_API_BY_TYPE[documentType] || quotesAPI
      const res = await api.sendWhatsApp(id, { phone: whatsAppPhone.trim() })
      if (res?.data?.needsAuth) {
        setWhatsAppQr(res.data.qrCode)
        setWhatsAppAuthing(true)
        startWhatsAppPoll()
      } else if (res?.success) {
        setShowWhatsAppDialog(false)
        alert('PDF berjaya dihantar melalui WhatsApp')
      } else {
        alert(res?.message || 'Ralat menghantar melalui WhatsApp')
      }
    } catch (err) {
      alert('Ralat menghantar melalui WhatsApp')
    } finally {
      setSending(null)
    }
  }

  const startWhatsAppPoll = () => {
    if (whatsAppPollRef.current) clearInterval(whatsAppPollRef.current)
    whatsAppPollRef.current = setInterval(async () => {
      try {
        const res = await whatsAppAPI.getStatus()
        if (res?.success) {
          if (res.data.ready) {
            clearInterval(whatsAppPollRef.current)
            whatsAppPollRef.current = null
            setWhatsAppAuthing(false)
            setWhatsAppQr(null)
            handleWhatsAppSend()
          } else if (res.data.qrCode) {
            setWhatsAppQr(res.data.qrCode)
          }
        }
      } catch (e) {
        // ignore poll errors
      }
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (whatsAppPollRef.current) clearInterval(whatsAppPollRef.current)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 font-medium mb-1">Document not found</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate(backPath)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Back to list
          </button>
        </div>
      </div>
    )
  }

  // Ansuran/partial payment - invois yang ada bayaran tapi belum settle penuh
  const paidAmount = Number(doc.paidAmount) || 0
  const outstandingBalance = Math.max(Number(doc.total) - paidAmount, 0)
  const isPartiallyPaid = documentType === 'INVOICE' && paidAmount > 0 && outstandingBalance > 0.005

  return (
    // <div className="h-[calc(100vh-199px)] flex flex-col bg-gray-100">
    <div className="h-[calc(100vh-199px)] flex flex-col bg-gray-100">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(backPath)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status || doc.documentStatus} />
              {isPartiallyPaid && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Sebahagian Dibayar
                </span>
              )}
              <span className="text-sm font-medium text-gray-700">
                {doc.documentNumber || doc.quoteNumber || doc.invoiceNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canConvertToInvoice && (
              <button
                onClick={openConvertDialog}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Tukar kepada Invois
              </button>
            )}
            {hasPdfSupport && (
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {regenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {regenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
            )}
            <button
              onClick={() => navigate(editPath(id))}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {hasPdfSupport ? (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              {pdfLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Preparing PDF...</p>
                </div>
              ) : (
                pdfUrl && <PDFViewer pdfUrl={pdfUrl} />
              )}
            </div>

            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</h3>
                  <p className="text-sm font-medium text-gray-900">{doc.customer?.name}</p>
                  {doc.customer?.address && <p className="text-xs text-gray-500 mt-0.5">{doc.customer.address}</p>}
                  {doc.customer?.phone && <p className="text-xs text-gray-500 mt-0.5">Tel: {doc.customer.phone}</p>}
                  {doc.customer?.mobile && <p className="text-xs text-gray-500">Mobile: {doc.customer.mobile}</p>}
                  {doc.customer?.attn && <p className="text-xs text-gray-500 mt-0.5">Attn: {doc.customer.attn}</p>}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dates</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-900"><DateFormat date={doc.date} /></span>
                    </div>
                    {doc.validUntil && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{documentType === 'INVOICE' ? 'Due Date' : 'Valid Until'}</span>
                        <span className="text-gray-900"><DateFormat date={doc.validUntil} /></span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Summary</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Items</span>
                      <span className="text-gray-900">{doc.items?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900"><CurrencyFormat amount={doc.subtotal} /></span>
                    </div>
                    {(doc.discountAmount > 0) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {doc.discountLabel || 'Discount'}{doc.discountPercent > 0 ? ` (${doc.discountPercent}%)` : ''}
                        </span>
                        <span className="text-red-600"><CurrencyFormat amount={-doc.discountAmount} /></span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900"><CurrencyFormat amount={doc.tax || doc.taxAmount || 0} /></span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-semibold">
                      <span className="text-gray-700">Total</span>
                      <span className="text-gray-900"><CurrencyFormat amount={doc.total} /></span>
                    </div>
                    {isPartiallyPaid && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Telah Dibayar</span>
                          <span className="text-green-700"><CurrencyFormat amount={paidAmount} /></span>
                        </div>
                        <div className="border-t border-amber-200 pt-1.5 flex justify-between text-sm font-semibold">
                          <span className="text-amber-700">Baki Tertunggak</span>
                          <span className="text-amber-700"><CurrencyFormat amount={outstandingBalance} /></span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                  <div className="pt-2 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={openEmailDialog}
                      disabled={sending}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {sending === 'email' ? 'Menghantar...' : 'Email'}
                    </button>
                    <button
                      onClick={openWhatsAppDialog}
                      disabled={sending}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#1da851] disabled:opacity-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {sending === 'whatsapp' ? 'Memproses...' : 'WhatsApp'}
                    </button>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in new tab
                  </a>
                  <a
                    href={pdfUrl}
                    download={`${documentType === 'INVOICE' ? 'INV' : documentType === 'QUOTATION' ? 'QUO' : documentType === 'RECEIPT' ? 'RES' : 'DO'}-${doc?.documentNumber || 'document'}.pdf`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>

                {/* Convert to Invoice Dialog */}
                {showConvertDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tukar kepada Invois</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Tempoh Bayar (Due Date)</label>
                          <input
                            type="date"
                            value={convertDueDate}
                            onChange={(e) => setConvertDueDate(e.target.value)}
                            className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1.5">Kosongkan untuk default 30 hari dari hari ini.</p>
                        </div>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={convertCreateDO}
                            onChange={(e) => setConvertCreateDO(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">Turut cipta Delivery Order sekali (hantar barang serta-merta selepas invois dicipta)</span>
                        </label>
                        {convertCreateDO && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Penghantaran</label>
                            <input
                              type="date"
                              value={convertDeliveryDate}
                              onChange={(e) => setConvertDeliveryDate(e.target.value)}
                              className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">Kosongkan untuk default 7 hari dari hari ini. Alamat & kontak penghantaran akan guna maklumat pelanggan.</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowConvertDialog(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleConvertToInvoice}
                          disabled={converting}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          {converting ? 'Memproses...' : 'Tukar kepada Invois'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Dialog */}
                {showEmailDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hantar Email</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                          <input
                            type="email"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowEmailDialog(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleEmailSend}
                          disabled={!emailTo.trim() || sending === 'email'}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {sending === 'email' ? 'Menghantar...' : 'Hantar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Dialog */}
                {showWhatsAppDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hantar WhatsApp</h3>
                      {whatsAppAuthing ? (
                        <div className="text-center space-y-4">
                          <p className="text-sm text-gray-600">Imbas QR code ini dengan WhatsApp anda untuk menghantar fail terus.</p>
                          {whatsAppQr ? (
                            <img src={whatsAppQr} alt="QR Code" className="mx-auto w-64 h-64" />
                          ) : (
                            <div className="mx-auto w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                              <p className="text-sm text-gray-400 animate-pulse">Sedang menjana QR code...</p>
                            </div>
                          )}
                          <p className="text-sm text-green-600 animate-pulse">Menunggu imbasan...</p>
                          <button
                            onClick={() => { setShowWhatsAppDialog(false); if (whatsAppPollRef.current) clearInterval(whatsAppPollRef.current) }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                          >
                            Tutup
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nombor Telefon</label>
                              <input
                                type="tel"
                                value={whatsAppPhone}
                                onChange={(e) => setWhatsAppPhone(e.target.value)}
                                placeholder="012-345 6789"
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                                autoFocus
                              />
                              <p className="text-xs text-gray-400 mt-1.5">Gunakan format tempatan. Contoh: 012-345 6789</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <button
                              onClick={() => { setShowWhatsAppDialog(false); if (whatsAppPollRef.current) clearInterval(whatsAppPollRef.current) }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Batal
                            </button>
                            <button
                              onClick={handleWhatsAppSend}
                              disabled={!whatsAppPhone.trim() || sending === 'whatsapp'}
                              className="px-4 py-2 text-sm font-medium text-white bg-[#25D366] rounded-xl hover:bg-[#1da851] disabled:opacity-50 transition-colors"
                            >
                              {sending === 'whatsapp' ? 'Memproses...' : 'Hantar'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {doc.notes && (
                  <div>
                    {/* <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</h3> */}
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{doc.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <StatusBadge status={doc.status || doc.documentStatus} />
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {doc.documentNumber || doc.quoteNumber || doc.invoiceNumber}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{doc.customer?.name}</p>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                {doc.items?.map((item, i) => (
                  <div key={item.id || i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.description}</span>
                    <span className="text-gray-900 font-medium"><CurrencyFormat amount={item.amount} /></span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700"><CurrencyFormat amount={doc.subtotal} /></span>
                </div>
                {doc.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{doc.discountLabel || 'Discount'}</span>
                    <span className="text-red-600"><CurrencyFormat amount={-doc.discountAmount} /></span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-900"><CurrencyFormat amount={doc.total} /></span>
                </div>
              </div>

              {doc.notes && (
                <div className="border-t border-gray-200 mt-6 pt-4">
                  <p className="text-sm text-gray-500 italic">{doc.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentPreview
