import React from 'react'
import { useParams } from 'react-router-dom'
import { DocumentPreview } from '../components'
import { quotesAPI } from '../utils/apiClient'

const QuotePreview = () => {
  const { id } = useParams()
  return (
    <DocumentPreview
      id={id}
      documentType="QUOTATION"
      backPath="/quotes"
      editPath={(docId) => `/quotes/${docId}/edit`}
      apiGetById={quotesAPI.getById}
      apiGeneratePdf={quotesAPI.generatePdf}
      apiGetPdfUrl={quotesAPI.getPdfUrl}
    />
  )
}

export default QuotePreview
