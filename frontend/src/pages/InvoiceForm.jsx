import React from 'react'
import { useParams } from 'react-router-dom'
import DocumentInlineEditor from '../components/DocumentInlineEditor'

const InvoiceForm = () => {
  const { id } = useParams()
  return <DocumentInlineEditor id={id} docType="INVOICE" />
}

export default InvoiceForm
