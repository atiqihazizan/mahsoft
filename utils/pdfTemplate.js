const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  const sign = num < 0 ? '-' : ''
  return sign + 'RM ' + new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2 }).format(Math.abs(num))
}

const generateDocDefinition = ({ documentType, company, customer, documentNumber, date, validUntil, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, bank, issuedBy, notes, logoData }) => {
  const isInvoice = documentType === 'INVOICE'
  const hasDiscount = Number(discountAmount) > 0
  const hasTax = Number(tax) > 0 || (isInvoice && Number(tax) !== 0)
  const showBreakdown = hasDiscount || hasTax
  const hasBank = isInvoice && (bank?.accountNumber || bank?.bankName || bank?.accountHolder)

  const isBillable = (item) => Number(item.amount) > 0

  const needsQtyPrice = (item) => {
    if (!isBillable(item)) return false
    const qty = Number(item.quantity)
    const price = Number(item.unitPrice)
    return qty > 1 || (qty && price && Number(item.amount) !== price * qty)
  }

  const showQtyPrice = (items || []).some(needsQtyPrice)
  const billableItems = (items || []).filter(isBillable)
  const infoItems = (items || []).filter(item => !isBillable(item))
  const issuedByName = issuedBy || company?.manager || ''

  const hr = { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#b0b0b0' }], margin: [0, 6, 0, 8] }
  const hrLight = { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.3, lineColor: '#d0d0d0' }], margin: [0, 5, 0, 6] }

  const header = {
    columns: [
      {
        width: '70%',
        stack: [
          {
            columns: [
              logoData ? { image: logoData, width: 50, alignment: 'left', margin: [0, 0, 10, 0] } : { text: '', width: 60 },
              {
                stack: [
                  { text: company?.name || '', font: 'Audiowide', fontSize: 14, color: '#333' },
                  company?.registration ? { text: company.registration, fontSize: 7, color: '#666', margin: [0, 0, 0, 4] } : { text: '', margin: [0, 0, 0, 4] },
                  { text: company?.address || '', fontSize: 7, color: '#333' },
                  { text: `Email: ${company?.email || ''}    Phone: ${company?.phone || ''}`, fontSize: 7, color: '#333', margin: [0, 1, 0, 0] }
                ],
                width: '*'
              }
            ]
          }
        ]
      },
      {
        width: '30%',
        text: documentType,
        font: 'Audiowide',
        fontSize: 11,
        color: '#333',
        alignment: 'right',
        margin: [0, 4, 0, 0]
      }
    ]
  }

  const clientSection = {
    columns: [
      {
        width: '50%',
        stack: [
          { text: customer?.name || '', bold: true, fontSize: 7 },
          { text: customer?.address || '', fontSize: 7, color: '#333' },
          ...(customer?.phone || customer?.mobile ? [{
            text: [customer.phone ? `Tel: ${customer.phone}` : '', customer.mobile ? `Mobile: ${customer.mobile}` : ''].filter(Boolean).join('    '),
            fontSize: 7, color: '#333'
          }] : []),
          ...(customer?.attn ? [{ text: `Attn : ${customer.attn}`, bold: true, fontSize: 7, margin: [0, 4, 0, 0] }] : [])
        ]
      },
      {
        width: '50%',
        stack: [
          { text: `No : ${documentNumber}`, fontSize: 7, bold: true },
          { text: `Date : ${formatDate(date)}`, fontSize: 7, color: '#666' },
          ...(validUntil ? [{ text: `${isInvoice ? 'Due' : 'Validity'} : ${formatDate(validUntil)}`, fontSize: 7, color: '#666' }] : [])
        ],
        alignment: 'right'
      }
    ]
  }

  const itemTableHeader = () => {
    const cols = [
      { text: 'Description', style: 'tableHeader' }
    ]
    if (showQtyPrice) {
      cols.push({ text: 'Qty', style: 'tableHeader', alignment: 'center' })
      cols.push({ text: 'Price', style: 'tableHeader', alignment: 'right' })
    }
    cols.push({ text: 'Amount', style: 'tableHeader', alignment: 'right' })
    return cols
  }

  const itemTableWidths = () => {
    const widths = ['*']
    if (showQtyPrice) {
      widths.push(30)
      widths.push(50)
    }
    widths.push(70)
    return widths
  }

  const itemRows = billableItems.map((item, i) => {
    const show = showQtyPrice && needsQtyPrice(item)
    const qtyVal = show ? (Number(item.quantity) || '') + (item.unit ? ` ${item.unit}` : '') : ''
    const priceVal = show && Number(item.unitPrice) ? formatCurrency(item.unitPrice) : ''
    const row = [{ text: item.description || '', fontSize: 8 }]
    if (showQtyPrice) {
      row.push({ text: qtyVal, alignment: 'center', fontSize: 8 })
      row.push({ text: priceVal, alignment: 'right', fontSize: 8 })
    }
    row.push({ text: Number(item.amount) ? formatCurrency(item.amount) : '', alignment: 'right', bold: true, fontSize: 8 })
    return row
  })

  const itemTable = {
    table: {
      headerRows: 1,
      widths: itemTableWidths(),
      body: [itemTableHeader(), ...(itemRows.length ? itemRows : [[{ text: 'No items', alignment: 'center', color: '#999', margin: [0, 15, 0, 15], colSpan: showQtyPrice ? 4 : 2 }]])]
    },
    layout: {
      hLineWidth: (i) => (i === 0 || i === 1) ? 0.5 : 0,
      vLineWidth: () => 0,
      hLineColor: () => '#d0d0d0',
      paddingLeft: () => 3,
      paddingRight: () => 3,
      paddingTop: () => 3,
      paddingBottom: () => 2
    }
  }

  const infoSection = infoItems.length > 0 ? {
    stack: infoItems.map(item => ({
      text: item.description || '',
      fontSize: 7,
      color: '#374151',
      margin: [0, 0, 0, 4]
    })),
    margin: [0, 12, 0, 0]
  } : null

  const pricingRows = []
  if (showBreakdown) {
    pricingRows.push([{ text: 'Subtotal', alignment: 'left', fontSize: 7, color: '#374151' }, { text: formatCurrency(subtotal), alignment: 'right', fontSize: 7 }])
    if (hasDiscount) {
      const label = discountLabel || 'Discount'
      const pct = discountPercent > 0 ? ` (${discountPercent}%)` : ''
      pricingRows.push([{ text: `${label}${pct}`, alignment: 'left', fontSize: 7, color: '#374151' }, { text: formatCurrency(-discountAmount), alignment: 'right', fontSize: 7, color: '#dc2626' }])
    }
    if (hasTax) {
      pricingRows.push([{ text: 'Tax', alignment: 'left', fontSize: 7, color: '#374151' }, { text: formatCurrency(tax), alignment: 'right', fontSize: 7 }])
    }
    pricingRows.push([{ text: 'Grand Total', alignment: 'left', fontSize: 8, bold: true }, { text: formatCurrency(total), alignment: 'right', fontSize: 8, bold: true }])
  } else {
    pricingRows.push([{ text: 'Total', alignment: 'left', fontSize: 8, bold: true }, { text: formatCurrency(total), alignment: 'right', fontSize: 8, bold: true }])
  }

  const pricingTable = {
    table: {
      widths: ['*', 90],
      body: pricingRows.map((row, i) => {
        if (i === pricingRows.length - 1) {
          row[0].margin = [0, 3, 0, 0]
          row[1].margin = [0, 3, 0, 0]
        }
        return row
      })
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 1,
      paddingBottom: () => 1
    }
  }

  const bankSection = hasBank ? {
    stack: [
      { text: 'Bank Details', bold: true, fontSize: 7, margin: [0, 0, 0, 2] },
      {
        table: {
          widths: ['auto', 'auto', '*'],
          body: [
            ['Acc No.', ':', { text: bank.accountNumber || '', fontSize: 7 }],
            ['Acc Name', ':', { text: bank.bankName || '', fontSize: 7 }],
            ['Acc Holder', ':', { text: bank.accountHolder || '', fontSize: 7 }]
          ]
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 2,
          paddingTop: () => 0,
          paddingBottom: () => 0
        }
      }
    ],
    margin: [0, 0, 0, 6]
  } : null

  const issuedBySection = {
    stack: [
      { text: 'Issued By,', fontSize: 7, color: '#374151' },
      { text: issuedByName, italics: true, fontSize: 8, bold: true, margin: [0, 4, 0, 0] },
      { text: '(Signature)', fontSize: 7, color: '#6b7280', alignment: 'center', margin: [0, 2, 0, 0] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 110, y2: 0, lineWidth: 0.5, lineColor: '#374151' }], margin: [0, 1, 0, 0] }
    ]
  }

  const notesSection = notes ? {
    stack: [
      { text: 'Notes:', bold: true, fontSize: 8, margin: [0, 6, 0, 2] },
      { text: notes, fontSize: 8 }
    ]
  } : null

  const closingSection = {
    columns: [
      {
        width: '50%',
        stack: [
          ...(bankSection ? [bankSection] : []),
          issuedBySection
        ]
      },
      {
        width: '50%',
        stack: [pricingTable],
        alignment: 'right'
      }
    ],
    margin: [0, 4, 0, 0]
  }

  return {
    pageSize: 'A4',
    pageMargins: [57, 42, 57, 42],
    content: [
      header,
      hr,
      clientSection,
      hrLight,
      itemTable,
      ...(infoSection ? [infoSection] : []),
      hr,
      closingSection,
      ...(notesSection ? [notesSection] : [])
    ],
    footer: (currentPage, pageCount) => {
      if (pageCount <= 1) return null
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        fontSize: 9,
        color: '#666',
        margin: [57, 0, 57, 0]
      }
    },
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9,
      color: '#212529'
    },
    styles: {
      tableHeader: {
        fontSize: 7,
        color: '#6b7280',
        bold: true,
        fillColor: '#f9fafb'
      }
    }
  }
}

module.exports = { generateDocDefinition }
