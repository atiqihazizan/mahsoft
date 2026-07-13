const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(num)
}

const renderWhatsAppText = (text) => {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br />')
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
@page { margin: 0; padding: 0; }
body { margin: 0; padding: 0; font-family: ui-sans-serif, system-ui, sans-serif; }
.print-content { width: 100%; }
html { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; margin: 0; padding: 0; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }
.clientinfo-container { display: flex; flex-direction: row; justify-content: space-between; gap: 2rem; margin-top: 0.2rem; }
.clientinfo, .docinfo { display: flex; flex-direction: column; }
.clientinfo { width: 50%; gap: 0.4rem; }
.clientinfo p, .docinfo p { font-size: .7rem; margin: 0; }
.clientinfo p:first-child { font-weight: 900; }
.docinfo { gap: 0.35rem; }
.docinfo p { width: 100%; display: grid; grid-template-columns: 40px 10px 1fr; font-size: 0.7rem; }
.docinfo p span { font-size: 0.7rem; margin: 0; }
.docinfo p span:last-child { text-align: right; }
.company-info { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.4rem; }
.company-info p { line-height: 1.5; font-size: 0.65rem; margin: 0; }
hr { margin: .8rem 0 1rem; border: none; border-bottom: 1px solid #080808; }
.sheet { padding: 20mm; width: 210mm; margin: auto; background: white; line-height: 1.65; color: #212529; font-size: .9rem; }
.issuence table { width: 100%; border-collapse: collapse; }
.issuence table td { padding: 0.5rem 0.5rem 0.3rem; vertical-align: top; font-size: 0.7rem; line-height: 1.6; }
.issuence table td:first-child { text-align: left; }
.issuence table td:last-child { text-align: right; width: 130px; font-weight: 600; }
.issuence table td div { line-height: 1.6; font-size: 0.8rem; }
.footer-bottom { width: 100%; }
.table-signature { width: 100%; border-collapse: collapse; }
.table-signature tr { display: flex; }
.table-signature td { font-size: 9pt; }
.inv-amt { border-collapse: collapse; margin-left: auto; }
.inv-amt td { font-size: 0.7rem !important; padding: 0.25rem 0; }
.inv-amt td:first-child { text-align: right; padding-right: 1rem; color: #374151; }
.inv-amt td:last-child { text-align: right; min-width: 80px; }
.inv-amt tr:last-child td { font-weight: 700; font-size: 0.8rem !important; padding-top: 0.4rem; }
.inv-amt tr:last-child td:first-child { color: #000; }
.page-footer { text-align: center; font-size: 0.7rem; color: #666; padding-top: 0.5rem; margin-top: 0.3rem; border-top: 0.5px solid #999; }
`

const generateHTML = ({ documentType, company, customer, documentNumber, date, validUntil, items, subtotal, discountPercent, discountAmount, discountLabel, tax, total, bank, issuedBy, notes }) => {
  const showTotals = documentType === 'INVOICE' || discountAmount > 0
  const isInvoice = documentType === 'INVOICE'

  const itemRows = (items || []).map(item => `
    <tr>
      <td><div>${renderWhatsAppText(item.description || '')}</div></td>
      <td>${formatCurrency(item.amount || 0)}</td>
    </tr>
  `).join('')

  const bankSection = isInvoice && (bank?.accountNumber || bank?.bankName || bank?.accountHolder) ? `
    <td style="align-self:center">
      <div style="display:grid;grid-template-columns:auto auto 1fr;column-gap:.5rem;align-items:center">
        <span>Acc No.</span><span>:</span><span>${bank.accountNumber || ''}</span>
        <span>Acc Name</span><span>:</span><span>${bank.bankName || ''}</span>
        <span>Acc Holder</span><span>:</span><span>${bank.accountHolder || ''}</span>
      </div>
    </td>
    <td style="align-self:center;flex:1">
      <div style="margin:auto;width:150px;text-align:center">
        <i>${issuedBy || company?.manager || ''}</i>
        <hr />
        Issued By
      </div>
    </td>
  ` : `
    <td style="align-self:left;flex:1">
      <div style="display:flex;flex-direction:column;width:150px;text-align:left">
        <span>Issued By,</span>
        <i>${issuedBy || company?.manager || ''}</i>
      </div>
    </td>
  `

  const totalsRows = []
  if (showTotals) {
    if (isInvoice) {
      totalsRows.push(`<tr><td>Subtotal</td><td>${formatCurrency(subtotal)}</td></tr>`)
      if (discountAmount > 0) {
        const label = discountLabel || 'Discount'
        const pct = discountPercent > 0 ? ` (${discountPercent}%)` : ''
        totalsRows.push(`<tr><td>${label}${pct}</td><td>${formatCurrency(-discountAmount)}</td></tr>`)
      }
      totalsRows.push(`<tr><td>Tax</td><td>${formatCurrency(tax)}</td></tr>`)
    } else {
      if (discountAmount > 0) {
        const label = discountLabel || 'Discount'
        const pct = discountPercent > 0 ? ` (${discountPercent}%)` : ''
        totalsRows.push(`<tr><td>${label}${pct}</td><td>${formatCurrency(-discountAmount)}</td></tr>`)
      }
    }
  }
  totalsRows.push(`<tr><td>Total</td><td>${formatCurrency(total)}</td></tr>`)

  return `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>
<div class="sheet">
  <table style="width:100%;margin-bottom:0">
    <tr>
      <td style="text-align:left;width:73px;padding:0">
        <img src="https://invoice.mahsites.com/assets/logo.png" alt="Logo" style="width:100%;margin-right:1rem" />
      </td>
      <td style="text-align:left;vertical-align:top;width:70%;padding:0;padding-left:5px">
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
      <td style="text-align:right;vertical-align:top;padding:0">
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
      ${customer?.attn ? `<p style="font-weight:800;margin-top:.5rem">Attn : ${customer.attn}</p>` : ''}
    </div>
    <div class="docinfo">
      <p style="font-weight:900;margin:0"><span>No</span><span>:</span><span>${documentNumber}</span></p>
      <p style="margin:0;color:#666"><span>Date</span><span>:</span><span>${formatDate(date)}</span></p>
      ${validUntil ? `<p style="margin:0;color:#666"><span>${isInvoice ? 'Due' : 'Validity'}</span><span>:</span><span>${formatDate(validUntil)}</span></p>` : ''}
    </div>
  </div>
  <hr />
  <div class="issuence">
    <table>${itemRows || '<tr><td>No items</td></tr>'}</table>
  </div>
  <div style="margin-top:auto">
    <hr />
    <div class="footer-bottom">
      <table class="table-signature">
        <tr>${bankSection}<td style="align-self:center"><table class="inv-amt">${totalsRows.join('')}</table></td></tr>
      </table>
    </div>
    ${notes ? `<div style="margin-top:1rem;font-size:0.8rem"><p><strong>Notes:</strong></p><div>${renderWhatsAppText(notes)}</div></div>` : ''}
  </div>
</div>
</body>
</html>`
}

module.exports = { generateHTML }
