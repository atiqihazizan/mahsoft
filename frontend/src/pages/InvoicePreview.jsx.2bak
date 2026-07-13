import React from 'react'
import { useParams } from 'react-router-dom'
import { DocumentPreview } from '../components'
import { invoicesAPI } from '../utils/apiClient'

const InvoicePreview = () => {
  const { id } = useParams()
  return (
    <DocumentPreview
      id={id}
      documentType="INVOICE"
      backPath="/invoices"
      editPath={(docId) => `/invoices/${docId}/edit`}
      apiGetById={invoicesAPI.getById}
    />
  )
}

export default InvoicePreview
