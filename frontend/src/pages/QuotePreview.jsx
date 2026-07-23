import React from 'react'
import { useParams } from 'react-router-dom'
import DocumentInlineEditor from '../components/DocumentInlineEditor'

const QuotePreview = () => {
  const { id } = useParams()
  return <DocumentInlineEditor id={id} docType="QUOTATION" />
}

export default QuotePreview
