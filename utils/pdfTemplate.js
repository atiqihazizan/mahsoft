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


.audiowide-regular {
  font-family: "Audiowide", sans-serif;
  font-weight: 400;
  font-style: normal;
}

html, body { margin: 0; padding: 0; height: 100%; font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }

.sheet {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  background: white;
  line-height: 1.65;
  color: #212529;
  font-size: .9rem;
}

.main-content {
  width: 100%;
}

.closing-section {
  margin-top: 10px;
}

.clientinfo-container { width: 100%; margin-top: 0.2rem; }
.clientinfo { width: 50%; vertical-align: top; }
.clientinfo p, .docinfo p { font-size: .7rem; margin: 0; }
.clientinfo p:first-child { font-weight: 900; }
.docinfo { width: 50%; vertical-align: top; text-align: right; }
.docinfo table { margin-left: auto; border-collapse: collapse; }
.docinfo table td { font-size: 0.7rem; padding: 1px 0; }
.docinfo table td:first-child { text-align: left; min-width: 35px; }
.docinfo table td:nth-child(2) { text-align: center; padding: 0 4px; }
.docinfo table td:last-child { text-align: right; }
.company-info { margin-top: 0.3rem; }
.company-info p { line-height: 1.5; font-size: 0.65rem; margin: 0; white-space: nowrap; }
.hr--major { margin: .6rem 0 .8rem; border: none; border-bottom: 1px solid #8c8c8c; }
.hr--minor { margin: .6rem 0 .8rem; border: none; border-bottom: 1px solid rgba(0,0,0,0.08); }

.issuence table { width: 100%; border-collapse: collapse; }
.issuence table th { text-align: left; font-weight: 600; font-size: 0.6rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.25rem 0.3rem 0.4rem; border-bottom: 1px solid rgba(0,0,0,0.10);border-top: 1px solid #8c8c8c; }
.issuence table td { padding: 0.4rem 0.3rem 0.2rem; vertical-align: top; font-size: 0.7rem; line-height: 1.5; }
.issuence table td:first-child { text-align: left; }
.issuence table th.amount-cell, .issuence table td.amount-cell { text-align: right; white-space: nowrap; font-weight: 600; width: 1%; }
.issuence table th.qty-cell, .issuence table td.qty-cell { text-align: center; white-space: nowrap; width: 1%; }
.issuence table th.price-cell, .issuence table td.price-cell { text-align: right; white-space: nowrap; width: 1%; }
.issuence table td div { line-height: 1.5; font-size: 0.7rem; }
/*.issuence table tr.last-billable td { border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 0.5rem; }*/

.info-section { margin-top: 1.5rem; page-break-inside: avoid; }
.info-row { font-size: 0.6rem; line-height: 1.6; color: #374151; margin-bottom: 0.5rem; }

.footer-table { width: 100%; border-collapse: collapse; margin-top: 0.4rem; page-break-inside: avoid; }
.footer-table td { width: 50%; vertical-align: top; }
.footer-table td:last-child { text-align: right; }

.pricing-table { border-collapse: collapse; margin-left: auto; }
.pricing-table td { padding: 0.15rem 0; vertical-align: middle; }
.pricing-table td:first-child { text-align: left; font-size: 0.7rem; color: #374151; }
.pricing-table td:last-child { text-align: right; font-size: 0.7rem; min-width: 90px; white-space: nowrap; }
.pricing-table .sep td { height: 0.2rem; }
.pricing-table .divider td { border-top: 1px solid #374151; padding-top: 0.3rem; }
.pricing-table .grand td { font-weight: 700; font-size: 0.8rem !important; }
.pricing-table .grand td:first-child { color: #000; }
.pricing-table .positive { color: #000; }
.pricing-table .negative { color: #dc2626; }

.issuedby-section { margin-top: 0.8rem; page-break-inside: avoid; }
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
  font-style: italic;
}

.notes-section { margin-top: 0.8rem; font-size: 0.8rem; page-break-inside: avoid; }
.notes-section p { margin: 0.15rem 0; }
.notes-section strong { font-weight: 700; }

.print-header table { width: 100%; margin-bottom: 0; }
.print-header table td { vertical-align: top; }
.logo-cell { width: 58px; padding: 0; }
.logo-cell img { width: 100%; margin-right: 1rem; display: block; }
.logo-placeholder { width: 73px; height: 55px; margin-right: 1rem; }
.company-cell { text-align: left; vertical-align: top; width: 70%; padding: 0; padding-left: 5px; }
.doctype-cell { text-align: right; vertical-align: top; padding: 0; }

.bank-details { margin-bottom: 0.6rem; }
.bank-details p { font-size: 0.65rem; font-weight: 600; margin-bottom: 0.2rem; }
.bank-details table { border-collapse: collapse; }
.bank-details table td { font-size: 0.65rem; line-height: 1.6; padding: 1px 0; vertical-align: top; }
.bank-details table td:first-child { white-space: nowrap; padding-right: 4px; }
.bank-details table td:nth-child(2) { padding-right: 4px; }

@media print {
  .sheet { margin: 0; box-shadow: none; }
}
`

const generateHTML = ({ documentType, company, customer, documentNumber, date, validUntil, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, bank, issuedBy, notes, logoData, audiowideFontPath }) => {
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

  const billableCount = billableItems.length
  const itemRows = billableItems.map((item, i) => {
    const isLast = i === billableCount - 1
    const show = showQtyPrice && needsQtyPrice(item)
    const qtyUnit = show ? (() => {
      const qty = Number(item.quantity) || ''
      const unit = item.unit || ''
      return unit ? `${qty}<br><span style="font-size:0.6rem;color:#666;display:inline-block">${unit}</span>` : qty
    })() : ''
    const priceVal = show && Number(item.unitPrice) ? formatCurrency(item.unitPrice) : ''
    return `
    <tr${isLast ? ' class="last-billable"' : ''}>
      <td><div>${renderWhatsAppText(item.description || '')}</div></td>
      ${showQtyPrice ? `<td class="qty-cell">${qtyUnit}</td>` : ''}
      ${showQtyPrice ? `<td class="price-cell">${priceVal}</td>` : ''}
      <td class="amount-cell">${Number(item.amount) ? formatCurrency(item.amount) : ''}</td>
    </tr>`
  }).join('')

  const infoHtml = infoItems.length > 0 ? `
  <div class="info-section">
    ${infoItems.map(item => `
    <div class="info-row">${renderWhatsAppText(item.description || '')}</div>
    `).join('')}
  </div>
` : ''

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

  const fontFace = audiowideFontPath
    ? `<style>@font-face{font-family:'Audiowide';src:url('file://${audiowideFontPath}') format('truetype');}</style>`
    : `<link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">`

  return `<!DOCTYPE html>
<html>
<head>
${fontFace}
<style>${css}</style></head>
<body>
<div class="sheet">
  <div class="main-content">
    <table class="print-header" style="width:100% !important;">
      <tr>
        <td class="logo-cell">${logoHtml}</td>
        <td class="company-cell">
          <div>
            <h1 class="audiowide-regular" style="font-size:1.1rem;font-weight:700;margin:0;padding:0;color:#333;">
              ${company?.name || ''}
              <span style="font-family: ui-sans-serif, system-ui, sans-serif; font-weight:400; font-size:0.6rem;padding-left:.2rem;color:#666">${company?.registration || ''}</span>
            </h1>
          </div>
          <div class="company-info">
            <p>${company?.address || ''}</p>
            <p>Email: ${company?.email || ''}  Phone: ${company?.phone || ''}</p>
          </div>
        </td>
        <td class="doctype-cell" align="right">
          <h1 class="audiowide-regular" style="font-size:1rem;font-weight:700;margin:0;text-align:center !important;width:100%;color:#333">${documentType}</h1>
        </td>
      </tr>
    </table>

    <hr class="hr--major" />

    <table class="clientinfo-container">
      <tr>
        <td class="clientinfo">
          <p>${customer?.name || ''}</p>
          <p>${customer?.address || ''}</p>
          ${(customer?.phone || customer?.mobile) ? `<p style="margin-top:8px">${customer.phone ? `Tel: ${customer.phone}` : ''}${customer.mobile ? `  Mobile: ${customer.mobile}` : ''}</p>` : ''}
          ${customer?.attn ? `<p style="font-weight:800;margin-top:6px">Attn : ${customer.attn}</p>` : ''}
        </td>
        <td class="docinfo">
          <table>
            <tr><td style="font-weight:900">No</td><td>:</td><td>${documentNumber}</td></tr>
            <tr><td style="color:#666">Date</td><td style="color:#666">:</td><td style="color:#666">${formatDate(date)}</td></tr>
            ${validUntil ? `<tr><td style="color:#666">${isInvoice ? 'Due' : 'Validity'}</td><td style="color:#666">:</td><td style="color:#666">${formatDate(validUntil)}</td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!--hr class="hr--minor" /-->

    <div class="issuence">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            ${showQtyPrice ? '<th class="qty-cell">Qty</th><th class="price-cell">Price</th>' : ''}
            <th class="amount-cell">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows || `<tr><td style="text-align:center;color:#999;padding:2rem 0" colspan="${showQtyPrice ? 4 : 2}">No items</td></tr>`}
        </tbody>
      </table>
    </div>
    ${infoHtml}
  </div>

  <div class="closing-section">
    <hr class="hr--major" />

    <table class="footer-table">
      <tr>
        <td>
          ${hasBank ? `
            <div class="bank-details">
              <p>Bank Details</p>
              <table>
                <tr><td>Acc No.</td><td>:</td><td>${bank.accountNumber || ''}</td></tr>
                <tr><td>Acc Name</td><td>:</td><td>${bank.bankName || ''}</td></tr>
                <tr><td>Acc Holder</td><td>:</td><td>${bank.accountHolder || ''}</td></tr>
              </table>
            </div>
          ` : ''}
        </td>
        <td>
          <table class="pricing-table">
            ${pricingRows}
          </table>
        </td>
      </tr>
    </table>

    ${notes ? `<div class="notes-section"><p><strong>Notes:</strong></p><div>${renderWhatsAppText(notes)}</div></div>` : ''}

    <div class="issuedby-section">
      <p class="label">Issued By,</p>
      <p class="name" style="font-style: italic; margin-top:0.5rem; padding-bottom:1px">${issuedByName}</p>
      <div class="signature-line">(Signature)</div>
    </div>
  </div>
</div>
</body>
</html>`
}

module.exports = { generateHTML }
