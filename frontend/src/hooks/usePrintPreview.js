

import { useEffect, useMemo, useRef, useState } from 'react'
import { invoicesAPI, quotesAPI, receiptsAPI } from '../utils/apiClient'

// Helper functions untuk mengelakkan pengulangan kod
const createCompanyData = (company) => ({
  name: company?.name || '',
  registration: company?.ssm || '',
  address: company?.address || '',
  email: company?.email || '',
  phone: company?.phone || '',
  manager: company?.manager || ''
})

const createCustomerData = (customer) => ({
  name: customer?.name || '',
  address: customer?.address || '',
  phone: customer?.phone || '',
  mobile: customer?.mobile || '',
  attn: customer?.attn || customer?.attention || ''
})

const createItemsData = (items) => {
  if (!Array.isArray(items) || items.length === 0) return []
  
  return items.map((item, index) => ({
    id: item.id || index + 1,
    description: item.description || '',
    details: [],
    unitPrice: parseFloat(item.unitPrice ?? item.price ?? 0),
    quantity: parseFloat(item.quantity ?? 0),
    amount: parseFloat(
      item.amount ?? (
        (parseFloat(item.quantity ?? 0) * parseFloat(item.unitPrice ?? item.price ?? 0))
      )
    ),
    variant: item.variant || 'structured',
    listType: item.listType || undefined,
    spacing: item.spacing || undefined
  }))
}

const createBankData = (company) => ({
  accountNumber: company?.bankacc || '',
  bankName: company?.bankname || '',
  accountHolder: company?.bankholder || ''
})

// Helper function untuk membuat data dokumen yang generik
const createDocumentData = (data, type) => {
  const documentConfig = {
    INVOICE: {
      documentType: 'INVOICE',
      documentNumber: data.invoiceNumber || '',
      validUntil: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 10) : ''
    },
    QUOTATION: {
      documentType: 'QUOTATION', 
      documentNumber: data.quoteNumber || '',
      validUntil: data.validUntil ? new Date(data.validUntil).toISOString().slice(0, 10) : ''
    },
    RECEIPT: {
      documentType: 'RECEIPT',
      documentNumber: data.receiptNumber || '',
      validUntil: ''
    }
  }

  const config = documentConfig[type] || {}
  
  return {
    ...config,
    status: (data.status || '').toLowerCase(),
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
    company: createCompanyData(data.company),
    customer: createCustomerData(data.customer),
    items: createItemsData(data.items),
    subtotal: data.subtotal != null ? parseFloat(data.subtotal) : 0,
    tax: data.taxAmount != null ? parseFloat(data.taxAmount) : 0,
    total: data.total != null ? parseFloat(data.total) : 0,
    bank: createBankData(data.company),
    issuedBy: data.company?.manager || '',
    notes: data.notes || ''
  }
}

// Hook generik untuk ambil data Print Preview bagi INVOICE/QUOTATION/RECEIPT
export default function usePrintPreview(documentType, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasFetchedRef = useRef(false)

  const normalizedType = useMemo(() => (documentType || '').toUpperCase(), [documentType])

  useEffect(() => {
    setError(null)
    setData(null)
    hasFetchedRef.current = false
  }, [normalizedType, id])

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      if (!id) {
        setLoading(false)
        return
      }

      try {
        // Mapping untuk API calls
        const apiMap = {
          'INVOICE': invoicesAPI.getById,
          'QUOTATION': quotesAPI.getById,
          // 'QUOTE': quotesAPI.getById,
          'RECEIPT': receiptsAPI.getById
        }

        const apiCall = apiMap[normalizedType]
        if (!apiCall) {
          setError('Dokumen tidak disokong')
          return
        }

        const res = await apiCall(id)
        if (!res?.success || !res?.data) {
          setData(null)
          setLoading(false)
          return
        }

        const documentData = res.data
        setData(createDocumentData(documentData, normalizedType))
      } catch (err) {
        setError(err?.message || 'Ralat semasa mengambil data')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetcher()
  }, [normalizedType, id])

  return { data, loading, error }
}

/*
Kod lama dikekalkan (dikomen) untuk rujukan.
*/