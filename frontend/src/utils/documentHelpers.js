export const createCompanyData = (company) => ({
  name: company?.name || '',
  registration: company?.ssm || '',
  address: company?.address || '',
  email: company?.email || '',
  phone: company?.phone || '',
  manager: company?.manager || ''
})

export const createCustomerData = (customer) => ({
  name: customer?.name || '',
  address: customer?.address || '',
  phone: customer?.phone || '',
  mobile: customer?.mobile || '',
  attn: customer?.attn || customer?.attention || ''
})

export const createItemsData = (items) => {
  if (!Array.isArray(items) || items.length === 0) return []
  return items.map((item, index) => ({
    id: item.id || index + 1,
    description: item.description || '',
    details: [],
    unitPrice: parseFloat(item.unitPrice ?? item.price ?? 0),
    quantity: parseFloat(item.quantity ?? 0),
    amount: parseFloat(
      item.amount ?? (
        parseFloat(item.quantity ?? 0) * parseFloat(item.unitPrice ?? item.price ?? 0)
      )
    ),
    variant: item.variant || 'structured',
    listType: item.listType || undefined,
    spacing: item.spacing || undefined
  }))
}

export const createBankData = (company) => ({
  accountNumber: company?.bankacc || '',
  bankName: company?.bankname || '',
  accountHolder: company?.bankholder || ''
})

export const createDocumentData = (data, type) => {
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
    },
    'DELIVERY_ORDER': {
      documentType: 'DELIVERY_ORDER',
      documentNumber: data.doNumber || '',
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

export const apiMap = {
  INVOICE: 'invoicesAPI',
  QUOTATION: 'quotesAPI',
  RECEIPT: 'receiptsAPI',
  DELIVERY_ORDER: 'deliveryOrdersAPI'
}
