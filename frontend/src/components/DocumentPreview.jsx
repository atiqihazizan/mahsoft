import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PDFViewer from './PDFViewer'
import CurrencyFormat from './CurrencyFormat'
import DateFormat from './DateFormat'
import StatusBadge from './StatusBadge'
import { createDocumentData } from '../utils/documentHelpers'

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
              <span className="text-sm font-medium text-gray-700">
                {doc.documentNumber || doc.quoteNumber || doc.invoiceNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                  </div>
                </div>

                <div className="pt-2 space-y-2">
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

                {doc.notes && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
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
