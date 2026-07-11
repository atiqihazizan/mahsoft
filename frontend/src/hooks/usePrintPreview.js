

import { useEffect, useMemo, useRef, useState } from 'react'
import { invoicesAPI, quotesAPI, receiptsAPI } from '../utils/apiClient'

import {
  createCompanyData,
  createCustomerData,
  createItemsData,
  createBankData,
  createDocumentData
} from '../utils/documentHelpers'

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
        setError(err?.message || 'Error fetching data')
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