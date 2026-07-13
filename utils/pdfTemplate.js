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

const renderWhatsAppText = (text) => {
  if (!text) return ''

  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, wrap: '<strong>$1</strong>' },
    { regex: /\*([^*]+)\*/g, wrap: '<em>$1</em>' },
    { regex: /~~([^~]+)~~/g, wrap: '<del>$1</del>' },
    { regex: /`([^`]+)`/g, wrap: '<code>$1</code>' }
  ]

  return text.split('\n').map(line => {
    if (line.trim() === '') return '<div style="height:16px"></div>'

    let html = escapeHtml(line)
    patterns.forEach(({ regex, wrap }) => {
      html = html.replace(regex, wrap)
    })

    return `<div style="margin-bottom:0.25rem">${html}</div>`
  }).join('')
}

const escapeHtml = (str) => {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
@page { margin: 0; padding: 0; }
html, body { margin: 0; padding: 0; height: 100%; font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }

.sheet {
  padding: 15mm 20mm;
  width: 210mm;
  min-height: 277mm;
  box-sizing: border-box;
  margin: auto;
  background: white;
  line-height: 1.65;
  color: #212529;
  font-size: .9rem;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1 0 auto;
}

.closing-section {
  margin-top: auto;
  page-break-inside: avoid;
}

.clientinfo-container { display: flex; flex-direction: row; justify-content: space-between; gap: 2rem; margin-top: 0.2rem; }
.clientinfo, .docinfo { display: flex; flex-direction: column; }
.clientinfo { width: 50%; gap: 0.3rem; }
.clientinfo p, .docinfo p { font-size: .7rem; margin: 0; }
.clientinfo p:first-child { font-weight: 900; }
.docinfo { gap: 0.3rem; }
.docinfo p { width: 100%; display: grid; grid-template-columns: 40px 10px 1fr; font-size: 0.7rem; }
.docinfo p span { font-size: 0.7rem; margin: 0; }
.docinfo p span:last-child { text-align: right; }
.company-info { display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.3rem; }
.company-info p { line-height: 1.5; font-size: 0.65rem; margin: 0; }
hr { margin: .6rem 0 .8rem; border: none; border-bottom: 1px solid #080808; }

.issuence table { width: 100%; border-collapse: collapse; }
.issuence table td { padding: 0.4rem 0.3rem 0.2rem; vertical-align: top; font-size: 0.7rem; line-height: 1.5; }
.issuence table td:first-child { text-align: left; }
.issuence table td.amount-cell { text-align: right; white-space: nowrap; font-weight: 600; width: 1%; }
.issuence table td.qty-cell { text-align: center; white-space: nowrap; width: 1%; }
.issuence table td.price-cell { text-align: right; white-space: nowrap; width: 1%; }
.issuence table td div { line-height: 1.5; font-size: 0.8rem; }

.footer-two-col {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 0.4rem;
}
.footer-col { width: 50%; }

.pricing-table { width: 100%; border-collapse: collapse; }
.pricing-table td { padding: 0.15rem 0; vertical-align: middle; }
.pricing-table td:first-child { text-align: left; font-size: 0.7rem; color: #374151; }
.pricing-table td:last-child { text-align: right; font-size: 0.7rem; min-width: 90px; white-space: nowrap; }
.pricing-table .sep td { height: 0.2rem; }
.pricing-table .divider td { border-top: 1px solid #374151; padding-top: 0.3rem; }
.pricing-table .grand td { font-weight: 700; font-size: 0.8rem !important; }
.pricing-table .grand td:first-child { color: #000; }
.pricing-table .positive { color: #000; }
.pricing-table .negative { color: #dc2626; }

.issuedby-section {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.issuedby-section .label { font-size: 0.7rem; color: #374151; }
.issuedby-section .name { font-size: 0.8rem; font-weight: 600; margin: 0; }
.issuedby-section .signature-line {
  margin-top: 0.0rem;
  width: 160px;
  border-top: 1px solid #374151;
  padding-top: 0.25rem;
  font-size: 0.65rem;
  color: #6b7280;
  text-align: center;
}

.notes-section { margin-top: 0.8rem; font-size: 0.8rem; }
.notes-section p { margin: 0.15rem 0; }
.notes-section strong { font-weight: 600; }

.print-header table { width: 100%; margin-bottom: 0; }
.print-header table td { vertical-align: top; }
.logo-cell { width: 73px; padding: 0; }
.logo-cell img { width: 100%; margin-right: 1rem; display: block; }
.logo-placeholder { width: 73px; height: 55px; margin-right: 1rem; }
.company-cell { text-align: left; vertical-align: top; width: 70%; padding: 0; padding-left: 5px; }
.doctype-cell { text-align: right; vertical-align: top; padding: 0; }

.bank-details { margin-bottom: 0.6rem; }
.bank-details p { font-size: 0.65rem; font-weight: 600; margin-bottom: 0.2rem; }
.bank-details .grid { display: grid; grid-template-columns: auto auto 1fr; column-gap: .3rem; font-size: 0.65rem; line-height: 1.6; }

@media print {
  .sheet { margin: 0; box-shadow: none; }
  .closing-section { page-break-inside: avoid; }
}
`

const generateHTML = ({ documentType, company, customer, documentNumber, date, validUntil, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, bank, issuedBy, notes, logoData }) => {
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

  const itemRows = (items || []).map(item => {
    const show = showQtyPrice && needsQtyPrice(item)
    const qtyUnit = show ? (() => {
      const qty = Number(item.quantity) || ''
      const unit = item.unit || ''
      return unit ? `${qty}<br><span style="font-size:0.6rem;color:#666;display:inline-block">${unit}</span>` : qty
    })() : ''
    const priceVal = show && Number(item.unitPrice) ? formatCurrency(item.unitPrice) : ''
    return `
    <tr>
      <td><div>${renderWhatsAppText(item.description || '')}</div></td>
      ${showQtyPrice ? `<td class="qty-cell">${qtyUnit}</td>` : ''}
      ${showQtyPrice ? `<td class="price-cell">${priceVal}</td>` : ''}
      <td class="amount-cell">${Number(item.amount) ? formatCurrency(item.amount) : ''}</td>
    </tr>`
  }).join('')

  const logoHtml = logoData
    ? `<img src="${logoData}" alt="Logo" />`
    : `<div class="logo-placeholder"></div>`

  let pricingRows = ''
  if (showBreakdown) {
    pricingRows += `<tr><td>Subtotal</td><td class="positive">${formatCurrency(subtotal)}</td></tr>`

    if (hasDiscount) {
      const label = discountLabel || 'Discount'
      const pct = discountPercent > 0 ? ` (${discountPercent}%)` : ''
      pricingRows += `<tr><td style="white-space: nowrap;">${label}${pct}</td><td class="negative">${formatCurrency(-discountAmount)}</td></tr>`
    }

    if (hasTax) {
      pricingRows += `<tr><td>Tax</td><td class="positive">${formatCurrency(tax)}</td></tr>`
    }

    pricingRows += `<tr class="divider1 grand"><td>Grand Total</td><td>${formatCurrency(total)}</td></tr>`
  } else {
    pricingRows += `<tr class="grand"><td>Total</td><td>${formatCurrency(total)}</td></tr>`
  }

  const issuedByName = issuedBy || company?.manager || ''

  return `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>
<div class="sheet">
  <div class="main-content">
    <table class="print-header">
      <tr>
        <td class="logo-cell">${logoHtml}</td>
        <td class="company-cell">
          <div>
            <h1 style="font-family:Audiowide;font-size:1.1rem;margin:0;padding:0;color:#333">
              ${company?.name || ''}
              <span style="font-size:0.7rem;padding-left:.5rem;color:#666;font-family:Roboto">${company?.registration || ''}</span>
            </h1>
          </div>
          <div class="company-info">
            <p>${company?.address || ''}</p>
            <p style="display:flex;flex-direction:row;gap:1rem">
              <span>Email: ${company?.email || ''}</span>
              <span>Phone: ${company?.phone || ''}</span>
            </p>
          </div>
        </td>
        <td class="doctype-cell">
          <h1 style="font-family:Audiowide;font-size:1.1rem;margin:0;color:#333">${documentType}</h1>
        </td>
      </tr>
    </table>

    <hr />

    <div class="clientinfo-container">
      <div class="clientinfo">
        <p>${customer?.name || ''}</p>
        <p>${customer?.address || ''}</p>
        ${(customer?.phone || customer?.mobile) ? `<br /><p style="display:flex;flex-direction:row;gap:1rem">${customer.phone ? `<span>Tel: ${customer.phone}</span>` : ''}${customer.mobile ? `<span>Mobile: ${customer.mobile}</span>` : ''}</p>` : ''}
        ${customer?.attn ? `<p style="font-weight:800;margin-top:.4rem">Attn : ${customer.attn}</p>` : ''}
      </div>
      <div class="docinfo">
        <p style="font-weight:900;margin:0"><span>No</span><span>:</span><span>${documentNumber}</span></p>
        <p style="margin:0;color:#666"><span>Date</span><span>:</span><span>${formatDate(date)}</span></p>
        ${validUntil ? `<p style="margin:0;color:#666"><span>${isInvoice ? 'Due' : 'Validity'}</span><span>:</span><span>${formatDate(validUntil)}</span></p>` : ''}
      </div>
    </div>

    <hr />

    <div class="issuence">
      <table>${itemRows || `<tr><td style="text-align:center;color:#999;padding:2rem 0" colspan="${showQtyPrice ? 4 : 2}">No items</td></tr>`}</table>
    </div>
  </div>

  <div class="closing-section">
    <hr />

    <div class="footer-two-col">
      <div class="footer-col">
        ${hasBank ? `
          <div class="bank-details">
            <p>Bank Details</p>
            <div class="grid">
              <span>Acc No.</span><span>:</span><span>${bank.accountNumber || ''}</span>
              <span>Acc Name</span><span>:</span><span>${bank.bankName || ''}</span>
              <span>Acc Holder</span><span>:</span><span>${bank.accountHolder || ''}</span>
            </div>
          </div>
        ` : ''}
        <div class="issuedby-section">
          <p class="label">Issued By,</p>
          <p class="name" style="font-style: italic; margin-top:0.5rem; padding-bottom:1px">${issuedByName}</p>
          <div class="signature-line">(Signature)</div>
        </div>
      </div>
      <div class="footer-col">
        <table class="pricing-table">
          ${pricingRows}
        </table>
      </div>
    </div>

    ${notes ? `<div class="notes-section"><p><strong>Notes:</strong></p><div>${renderWhatsAppText(notes)}</div></div>` : ''}
  </div>
</div>
</body>
</html>`
}

module.exports = { generateHTML }
