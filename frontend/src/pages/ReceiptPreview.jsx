import React from 'react'
import { useParams } from 'react-router-dom'
import ReceiptInlineEditor from '../components/ReceiptInlineEditor'

const ReceiptPreview = () => {
  const { id } = useParams()
  return <ReceiptInlineEditor id={id} />
}

export default ReceiptPreview
