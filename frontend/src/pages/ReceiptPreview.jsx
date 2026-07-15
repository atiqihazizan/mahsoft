import React from 'react'
import { useParams } from 'react-router-dom'
import { DocumentPreview } from '../components'
import { receiptsAPI } from '../utils/apiClient'

const ReceiptPreview = () => {
  const { id } = useParams()
  return (
    <DocumentPreview
      id={id}
      documentType="RECEIPT"
      backPath="/receipts"
      editPath={(docId) => `/receipts/${docId}/edit`}
      apiGetById={receiptsAPI.getById}
      apiGeneratePdf={receiptsAPI.generatePdf}
      apiGetPdfUrl={receiptsAPI.getPdfUrl}
    />
  )
}

export default ReceiptPreview
