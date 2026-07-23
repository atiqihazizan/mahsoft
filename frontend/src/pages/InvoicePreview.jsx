import React from 'react'
import { useParams } from 'react-router-dom'
import DocumentInlineEditor from '../components/DocumentInlineEditor'

const InvoicePreview = () => {
  const { id } = useParams()
  return <DocumentInlineEditor id={id} docType="INVOICE" />
}

export default InvoicePreview
