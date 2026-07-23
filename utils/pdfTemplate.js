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
.hr--minor { margin: .6rem 0 .8rem; border: none; border-bottom: 1px solid #ebebeb; }

.issuence table { width: 100%; border-collapse: collapse; }
.issuence table th { text-align: left; font-weight: 600; font-size: 0.6rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.25rem 0.3rem 0.4rem; border-bottom: 1px solid #e6e6e6;border-top: 1px solid #8c8c8c; }
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
.pricing-table .paid td { color: #15803d; }
.pricing-table .balance-due td { font-weight: 700; font-size: 0.8rem !important; color: #b45309; border-top: 1px solid #f59e0b; padding-top: 0.3rem; }
.pricing-table .balance-due td:first-child { color: #b45309; }

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

/* Receipt (A5) - resit lazimnya ringkas, jadi ruang lebih padat berbanding invois/quotation A4 */
.receipt-sheet { font-size: 0.85rem; }
.receipt-sheet .clientinfo p, .receipt-sheet .docinfo p { font-size: 0.68rem; }
.receipt-sheet .issuence table th, .receipt-sheet .issuence table td { font-size: 0.68rem; }
.receipt-sheet .company-info p { white-space: normal; font-size: 0.6rem; }
.receipt-sheet .company-cell { width: 60%; }
.payment-info { margin-top: 0.6rem; padding: 0.5rem 0.6rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; page-break-inside: avoid; }
.payment-info table { width: 100%; border-collapse: collapse; }
.payment-info table td { font-size: 0.68rem; padding: 1px 0; vertical-align: top; }
.payment-info table td:first-child { color: #6b7280; white-space: nowrap; padding-right: 6px; }
.payment-info table td:nth-child(2) { padding-right: 6px; }
.payment-info .paid-amount td { font-weight: 700; font-size: 0.85rem !important; color: #15803d; padding-top: 0.3rem; }
`

const generateHTML = ({ documentType, company, customer, documentNumber, date, validUntil, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, bank, issuedBy, notes, logoData, audiowideFontPath, paidAmount }) => {
  const isInvoice = documentType === 'INVOICE'
  const hasDiscount = Number(discountAmount) > 0
  const hasTax = Number(tax) > 0 || (isInvoice && Number(tax) !== 0)
  const showBreakdown = hasDiscount || hasTax

  // Ansuran/partial payment - papar baki tertunggak jika ada bayaran tapi belum settle penuh
  const paid = Number(paidAmount) || 0
  const balanceDue = Math.max(Number(total) - paid, 0)
  const showBalanceDue = isInvoice && paid > 0 && balanceDue > 0.005

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

  if (showBalanceDue) {
    pricingRows += `<tr class="paid"><td>Telah Dibayar (Paid)</td><td>${formatCurrency(paid)}</td></tr>`
    pricingRows += `<tr class="balance-due"><td>Baki (Amount Due)</td><td>${formatCurrency(balanceDue)}</td></tr>`
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

    ${notes ? `<div class="notes-section"><div>${renderWhatsAppText(notes)}</div></div>` : ''}

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

const PAYMENT_METHOD_LABELS = {
  CASH: 'Tunai',
  BANK_TRANSFER: 'Pindahan Bank',
  CHEQUE: 'Cek',
  CREDIT_CARD: 'Kad Kredit',
  DEBIT_CARD: 'Kad Debit',
  EWALLET: 'E-Dompet'
}

// Template PDF Resit (Receipt) - saiz A5, ringkas berbanding invois/quotation A4.
const numberToMalayWords = (amount) => {
  const ones = ['', 'SATU', 'DUA', 'TIGA', 'EMPAT', 'LIMA', 'ENAM', 'TUJUH', 'LAPAN', 'SEMBILAN',
    'SEPULUH', 'SEBELAS', 'DUA BELAS', 'TIGA BELAS', 'EMPAT BELAS', 'LIMA BELAS',
    'ENAM BELAS', 'TUJUH BELAS', 'LAPAN BELAS', 'SEMBILAN BELAS']
  const tens = ['', '', 'DUA PULUH', 'TIGA PULUH', 'EMPAT PULUH', 'LIMA PULUH',
    'ENAM PULUH', 'TUJUH PULUH', 'LAPAN PULUH', 'SEMBILAN PULUH']

  const toWords = (n) => {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) {
      const h = Math.floor(n / 100)
      const r = n % 100
      const prefix = h === 1 ? 'SERATUS' : ones[h] + ' RATUS'
      return prefix + (r ? ' ' + toWords(r) : '')
    }
    if (n < 1000000) {
      const t = Math.floor(n / 1000)
      const r = n % 1000
      const prefix = t === 1 ? 'SERIBU' : toWords(t) + ' RIBU'
      return prefix + (r ? ' ' + toWords(r) : '')
    }
    if (n < 1000000000) {
      const m = Math.floor(n / 1000000)
      const r = n % 1000000
      return toWords(m) + ' JUTA' + (r ? ' ' + toWords(r) : '')
    }
    return n.toString()
  }

  const total = Math.round(parseFloat(amount) * 100)
  const ringgit = Math.floor(total / 100)
  const sen = total % 100

  if (ringgit === 0 && sen === 0) return 'SIFAR SAHAJA'

  let words = ''
  if (ringgit > 0) words += toWords(ringgit) + ' RINGGIT'
  if (sen > 0) words += (ringgit > 0 ? ' DAN ' : '') + toWords(sen) + ' SEN'
  return words + ' SAHAJA'
}

const generateReceiptHTML = ({ company, customer, documentNumber, date, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, payments, notes, logoData, audiowideFontPath, issuedBy }) => {

  const logoHtml = logoData
    ? `<img src="${logoData}" alt="Logo" style="max-width:70px;max-height:70px;object-fit:contain;" />`
    : `<div style="width:70px;height:70px;border:1px solid #ccc;"></div>`

  const fontFace = audiowideFontPath
    ? `<style>@font-face{font-family:'Audiowide';src:url('file://${audiowideFontPath}') format('truetype');}</style>`
    : ''

  const amountWords = numberToMalayWords(total)

  const formattedDate = (() => {
    const d = new Date(date)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  })()

  const formattedTotal = (() => {
    const n = parseFloat(total)
    const cents = Math.round((n % 1) * 100)
    return `RM ${Math.floor(n).toLocaleString()}${cents ? `.${String(cents).padStart(2,'0')}` : ''}/=`
  })()

  const untukBayaran = (() => {
    if (items && items.length > 0) {
      return items.map(item => item.description || '').filter(Boolean).join('\n')
    }
    return notes || ''
  })()

  const bayaranLines = untukBayaran.split('\n').filter(Boolean)

  const companySsm = company?.ssm ? `(${company.ssm})` : ''

  return `<!DOCTYPE html>
<html>
<head>
${fontFace}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    background: white;
    color: #000;
  }
  .receipt-wrap {
    width: 148mm;
    min-height: 210mm;
    margin: 0 auto;
    padding: 12mm 14mm;
    position: relative;
  }
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6mm;
  }
  .header-table td { vertical-align: middle; }
  .logo-td { width: 22mm; }
  .company-td { text-align: center; padding: 0 4mm; }
  .company-name {
    font-size: 13pt;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .company-ssm {
    font-size: 8.5pt;
    font-weight: normal;
  }
  .company-address {
    font-size: 8pt;
    margin-top: 3px;
    line-height: 1.5;
  }
  .title-row {
    text-align: center;
    margin: 4mm 0 6mm 0;
  }
  .title-row h2 {
    font-size: 14pt;
    font-weight: bold;
    letter-spacing: 2px;
    text-decoration: underline;
  }
  .no-date-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 5mm;
  }
  .no-date-table td { padding: 1mm 0; font-size: 10.5pt; }
  .no-date-table .label-col { width: 55%; }
  .no-date-table .value-col { border-bottom: 1px solid #000; padding-left: 3mm; min-width: 35mm; }
  .field-row {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 5mm;
  }
  .field-row td { font-size: 10.5pt; vertical-align: bottom; }
  .field-label { white-space: nowrap; padding-right: 3mm; width: 1%; }
  .field-value {
    border-bottom: 1px solid #000;
    padding-bottom: 1px;
    padding-left: 3mm;
    width: 100%;
  }
  .bayaran-section { margin-bottom: 8mm; }
  .bayaran-label { font-size: 10.5pt; margin-bottom: 2mm; }
  .bayaran-line {
    border-bottom: 1px solid #000;
    min-height: 7mm;
    margin-bottom: 2mm;
    padding-left: 3mm;
    font-size: 10.5pt;
    display: flex;
    align-items: flex-end;
    padding-bottom: 1px;
  }
  .bayaran-empty {
    border-bottom: 1px solid #000;
    min-height: 7mm;
    margin-bottom: 2mm;
  }
  .ringgit-section { margin-bottom: 10mm; }
  .ringgit-section td { font-size: 10.5pt; vertical-align: bottom; }
  .ringgit-label { white-space: nowrap; padding-right: 5mm; }
  .ringgit-value { font-size: 11pt; font-weight: bold; }
  .issued-section { margin-top: 8mm; }
  .issued-section .label { font-size: 10.5pt; margin-bottom: 15mm; }
  .issued-section .sig-line {
    border-top: 1px solid #000;
    width: 50mm;
    margin-top: 2mm;
    padding-top: 1mm;
    font-size: 8pt;
    text-align: center;
  }
  .hr-main {
    border: none;
    border-top: 1.5px solid #000;
    margin: 3mm 0;
  }
</style>
</head>
<body>
<div class="receipt-wrap">

  <table class="header-table">
    <tr>
      <td class="logo-td">${logoHtml}</td>
      <td class="company-td">
        <div class="company-name">
          ${company?.name || ''}
          ${companySsm ? `<span class="company-ssm">${companySsm}</span>` : ''}
        </div>
        <div class="company-address">
          ${(company?.address || '').replace(/\n/g, '<br>')}
        </div>
      </td>
    </tr>
  </table>

  <hr class="hr-main" />

  <div class="title-row"><h2>RESIT</h2></div>

  <table class="no-date-table">
    <tr>
      <td class="label-col"></td>
      <td style="text-align:right; padding-right:3mm; white-space:nowrap;">No :</td>
      <td class="value-col">${documentNumber}</td>
    </tr>
    <tr>
      <td class="label-col"></td>
      <td style="text-align:right; padding-right:3mm; white-space:nowrap;">Tarikh :</td>
      <td class="value-col">${formattedDate}</td>
    </tr>
  </table>

  <table class="field-row" style="margin-bottom:5mm;">
    <tr>
      <td class="field-label">Diterima Dari :</td>
      <td class="field-value">${customer?.name || ''}</td>
    </tr>
  </table>

  <table class="field-row" style="margin-bottom:6mm;">
    <tr>
      <td class="field-label">Wang Yang Diterima :</td>
      <td class="field-value">${amountWords}</td>
    </tr>
  </table>

  <div class="bayaran-section">
    <div class="bayaran-label">Untuk Bayaran :</div>
    ${bayaranLines.length > 0
      ? bayaranLines.map(line => `<div class="bayaran-line">${line}</div>`).join('')
      : '<div class="bayaran-empty"></div><div class="bayaran-empty"></div>'
    }
    ${bayaranLines.length < 2 ? '<div class="bayaran-empty"></div>' : ''}
  </div>

  <table class="ringgit-section" style="width:auto;">
    <tr>
      <td class="ringgit-label">Ringgit :</td>
      <td class="ringgit-value">${formattedTotal}</td>
    </tr>
  </table>

  <div class="issued-section">
    <div class="label">Dikeluarkan :</div>
    <div class="sig-line">(Tandatangan / Cop Syarikat)</div>
  </div>

</div>
</body>
</html>`
}

module.exports = { generateHTML, generateReceiptHTML }
