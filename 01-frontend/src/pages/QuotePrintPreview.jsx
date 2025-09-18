import React, { useEffect, useState } from 'react'
import { PrintPreview } from '../components'
import { useParams } from 'react-router-dom'
import { quotesAPI } from '../utils/apiClient'
// import { renderStructuredText } from '../components/TextFormatting'

const QuotePrintPreview = () => {
  const { id } = useParams()

  const [quoteData, setQuoteData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Legacy print.css injection dipindahkan ke komponen PrintPreview
  // useEffect(() => {
  //   import('../styles/print.css')
  //   return () => {
  //     const existingLink = document.querySelector('link[href*="print.css"]')
  //     if (existingLink) existingLink.remove()
  //   }
  // }, [])

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true)
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const res = await quotesAPI.getById(id)
        if (!res?.success || !res?.data) {
          setQuoteData(null)
          setLoading(false)
          return
        }

        const q = res.data
        setQuoteData({
          quoteNumber: q.quoteNumber || '',
          status: (q.status || '').toLowerCase(),
          date: q.date ? new Date(q.date).toISOString().slice(0, 10) : '',
          validUntil: q.validUntil ? new Date(q.validUntil).toISOString().slice(0, 10) : '',
          company: {
            name: q.company?.name || '',
            registration: q.company?.registration || '',
            address: q.company?.address || '',
            email: q.company?.email || '',
            phone: q.company?.phone || '',
            manager: q.company?.manager || ''
          },
          customer: {
            name: q.customer?.name || '',
            address: q.customer?.address || '',
            phone: q.customer?.phone || '',
            mobile: q.customer?.mobile || '',
            attn: q.customer?.attn || q.customer?.attention || ''
          },
          items: Array.isArray(q.items) && q.items.length > 0
            ? q.items.map((item, index) => ({
              id: item.id || index + 1,
              description: item.description || '',
              unitPrice: parseFloat(item.unitPrice ?? item.price ?? 0),
              quantity: parseFloat(item.quantity ?? 0),
              amount: parseFloat(
                item.amount ?? (
                  (parseFloat(item.quantity ?? 0) * parseFloat(item.unitPrice ?? item.price ?? 0))
                )
              ),
              // Tambahan untuk kawal rendering description
              variant: item.variant || 'structured',
              listType: item.listType || undefined,
              spacing: item.spacing || undefined
            }))
            : [],
          subtotal: q.subtotal != null ? parseFloat(q.subtotal) : 0,
          tax: q.taxAmount != null ? parseFloat(q.taxAmount) : 0,
          total: q.total != null ? parseFloat(q.total) : 0,
          bank: {
            accountNumber: q.company?.bankacc || '',
            bankName: q.company?.bankname || '',
            accountHolder: q.company?.bankholder || ''
          },
          issuedBy: q.company?.manager || '',
          notes: q.notes || ''
        })
      } catch (error) {
        setQuoteData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [id])

  // Legacy handlers digantikan oleh PrintPreview
  // const handlePrint = () => {}
  // const handleBack = () => { window.history.back() }

  const isActive = ['draft', 'sent', 'expired'].includes(quoteData?.status)

  return (
    <PrintPreview
      documentType="QUOTATION"
      customer={quoteData?.customer}
      documentNumber={quoteData?.quoteNumber || ''}
      date={quoteData?.date || ''}
      validUntil={quoteData?.validUntil || ''}
      items={quoteData?.items || []}
      subtotal={quoteData?.subtotal || 0}
      tax={quoteData?.tax || 0}
      total={quoteData?.total || 0}
      company={quoteData?.company || {}}
      bank={quoteData?.bank || {}}
      issuedBy={quoteData?.issuedBy || quoteData?.company?.manager || ''}
      notes={quoteData?.notes || ''}
      onEdit={() => window.location.href = `/quotes/${id}/edit`}
      showEditButton={isActive}
      loading={loading}
      error={!loading && !quoteData ? 'Quote not found' : null}
    />
  )
}

export default QuotePrintPreview
