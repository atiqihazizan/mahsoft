import React, { useEffect, useRef, useMemo } from 'react'
import { CurrencyFormat, DateFormat } from './index'
import { renderWhatsAppText } from './TextFormatting'
import logoImage from '../assets/logo/logo.png'

const printStyles = `
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
@page { margin: 0; padding: 0; }
body { margin: 0; padding: 0; }
.print-content { width: 100%; }
html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
    font-feature-settings: normal;
    font-variation-settings: normal;
    -webkit-tap-highlight-color: transparent;
    padding:0;
    margin:0;
}
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {margin: 0; padding:0}
ol, ul, menu { list-style: none; margin: 0; padding: 0; }

.display-inline { display: inline; }
.text-bold { font-weight: bold; }
.text-center { text-align: center; }
.text-start { text-align: start; }
.text-end { text-align: end; }
.weight-400 { font-weight: 400; }
.weight-600 { font-weight: 600; }
.uppertext { text-transform: uppercase; }

.pre { white-space: pre-wrap; }
.font-bold { font-weight: bold; }
.list-decimal { list-style-type: decimal; }
.list-disc {list-style-type: disc;}

.small, small { font-size: 80%; font-weight: 400; }
.paper .sheet { margin: auto; font-size: .9rem; background-color: white; line-height: 1.65; color: #212529; text-align: left; }
.paper .sheet table td { font-size: 0.7rem; font-weight: 300; }
.sheet .hr--major { margin: .8rem 0 1rem; border: none; border-bottom: 1px solid rgba(0,0,0,0.45); }
.sheet .hr--minor { margin: .8rem 0 1rem; border: none; border-bottom: 1px solid rgba(0,0,0,0.08); }

.font-audiowide { font-family: 'Audiowide', 'Roboto', system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif; }
.w-100 { width: 100%; }
.m0 { margin: 0; }
.ml-4 { margin-left: 1rem; }
.mb-2 { margin-bottom: .5rem; }

.print-header table { width: 100%; margin-bottom: 0; border: 0; border-collapse: collapse; border-spacing: 0; }
.print-header table td { vertical-align: top; }
.logo-cell { width: 73px; padding: 0; }
.logo-cell img { width: 100%; margin-right: 1rem; display: block; }
.logo-placeholder { width: 73px; height: 55px; margin-right: 1rem; }
.company-cell { text-align: left; vertical-align: top; width: 70%; padding: 0; padding-left: 5px; }
.doctype-cell { text-align: right; vertical-align: top; padding: 0; }

.clientinfo table tr td:first-child { width: auto; vertical-align: top; }
.clientinfo table tr td:last-child { width: 20%; vertical-align: top; }

.issuence { margin-top: 2rem; }
.issuence table { width: 100%; border-collapse: collapse; }
.issuence table th { text-align: left; font-weight: 600; font-size: 0.6rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.25rem 0.3rem 0.4rem; border-bottom: 1px solid rgba(0,0,0,0.08); }
.issuence table th.amount-cell { text-align: right; }
.issuence table th.qty-cell { text-align: center; }
.issuence table th.price-cell { text-align: right; }
.issuence .rowbody { width: 100%; border-collapse: collapse; }
.issuence .rowbody td { padding: 0.4rem 0.3rem 0.2rem; vertical-align: top; font-size: 0.7rem; line-height: 1.5; }
.issuence .rowbody td:first-child { text-align: left; }
.issuence .rowbody td.amount-cell { text-align: right; white-space: nowrap; font-weight: 600; }
.issuence .rowbody td.qty-cell { text-align: center; white-space: nowrap; }
.issuence .rowbody td.price-cell { text-align: right; white-space: nowrap; }
.issuence .rowbody td div { line-height: 1.5; }
.issuence .rowbody tr.last-billable td { border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 0.5rem; }

.footer-two-col {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 0.4rem;
}
.footer-col { width: 48%; }

.pricing-table { width: 100%; border-collapse: collapse; }
.pricing-table td { padding: 0.15rem 0; vertical-align: middle; }
.pricing-table td:first-child { text-align: left; font-size: 0.7rem; color: #374151; }
.pricing-table td:last-child { text-align: right; font-size: 0.7rem; min-width: 90px; }
.pricing-table .sep td { height: 0.2rem; }
.pricing-table .divider td { border-top: 1px solid #374151; padding-top: 0.3rem; }
.pricing-table .grand td { font-weight: 700; font-size: 0.8rem !important; }
.pricing-table .grand td:first-child { color: #000; }
.pricing-table .positive { color: #000; }
.pricing-table .negative { color: #dc2626; }

.fra-body { min-height: 500px; }
.issuedby { width: 13rem; display: inline-block; margin-top: 1rem; text-align: center; }
.issuedby p { margin: 0; }
.separator-line { border-bottom: 1px solid #e5e7eb !important; }
.table-signature tr.font-big th { font-size: .9rem; padding: 2px 0; }
.issuedby p, .remark p { font-size: 10pt; }
.company-info { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.4rem; }
.company-info p { line-height: 1.5; font-size: 0.65rem; }
.clientinfo-container { display: flex; flex-direction: row; justify-content: space-between; gap: 2rem; margin-top: 0.2rem; }
.clientinfo ,.docinfo { display: flex; flex-direction: column; }
.clientinfo { width: 50%; gap: 0.3rem; }
.clientinfo p, .docinfo p { font-size: .7rem; margin: 0; }
.clientinfo p:first-child { font-weight: 900; }
.docinfo { gap: 0.3rem; }
.docinfo p { width: 100%; display: grid; grid-template-columns: 40px 10px 1fr; font-size: 0.7rem; margin: 0; }
.docinfo p span { font-size: 0.7rem; margin: 0; }
.docinfo p span:last-child { text-align: right; }

.paper.A3 .sheet { width: 297mm; height: 419mm; }
.paper.A3.landscape .sheet { width: 420mm; height: 296mm; }
.paper.A4 .sheet { width: 210mm; }
.paper.A4.landscape .sheet { width: 297mm; height: 209mm; }
.paper.A5 .sheet { width: 148mm; height: 209mm; }
.paper.A5.landscape .sheet { width: 210mm; height: 147mm; }
.paper.letter .sheet { width: 216mm; height: 279mm; }
.paper.letter.landscape .sheet { width: 280mm; height: 215mm; }
.paper.legal .sheet { width: 216mm; height: 356mm; }
.paper.legal.landscape .sheet { width: 357mm; height: 215mm; }

.sheet.padding-5mm { padding: 5mm; }
.sheet.padding-10mm { padding: 10mm; }
.sheet.padding-15mm { padding: 15mm; }
.sheet.padding-20mm { padding: 20mm; }
.sheet.padding-25mm { padding: 25mm; }

.btntop { position: absolute; display: flex; width: 100%; top: 0; left: 0; right: 0; justify-content: space-between; padding: 10px; }
.signiture { position: absolute; bottom: 50px; width: 100%; color: #a9a9a9b5; text-align: center; font-style: italic; font-size: .75rem; }

.print-header { background-color: #3b82f6; color: white; padding: 1rem; margin-bottom: 0; }
.print-header h1 { font-size: 2rem; font-weight: bold; margin: 0; }
.print-header .invoice-number { font-size: 1rem; opacity: 0.9; margin-top: 0.5rem; }
.print-dates { text-align: right; color: white; opacity: 0.9; }
.print-dates p { margin: 0.25rem 0; font-size: 0.9rem; }
.print-content { padding: 2rem; }
.print-section { margin-bottom: 2rem; }
.print-section h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: #374151; }
.print-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
.print-table th, .print-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
.print-table th { background-color: #f9fafb; font-weight: 600; font-size: 0.875rem; color: #374151; }
.print-table .text-right { text-align: right; }
.print-table .text-center { text-align: center; }
.print-totals { margin-top: 1rem; margin-left: auto; width: 300px; }
.print-totals .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb; }
.print-totals .total-row.final { font-weight: bold; font-size: 1.1rem; border-top: 2px solid #374151; margin-top: 0.5rem; padding-top: 0.75rem; }
.print-notes { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
.print-notes h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151; }
.print-notes p { font-size: 0.8rem; line-height: 1.5; color: #6b7280; margin: 0; }

/* === Page layout (flexbox) === */
.sheet-page {
  display: flex;
  flex-direction: column;
  height: 297mm;
  overflow: hidden;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.items-section {
  flex: 1;
}

.closing-section {
  margin-top: auto;
  page-break-inside: avoid;
}

.page-footer {
  text-align: center;
  font-size: 0.7rem;
  color: #666;
  padding-top: 0.5rem;
  margin-top: 0.3rem;
  border-top: 0.5px solid #999;
}

.continuation-note {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
  margin: 0.5rem 0;
}

.multi-page .sheet-page {
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  margin-bottom: 2rem;
}
.multi-page .sheet-page:last-child { margin-bottom: 0; }

@media print {
  .btntop, #background { display: none; }
  .paper.A3.landscape { width: 420mm; }
  .paper.A3, .paper.A4.landscape { width: 297mm; }
  .paper.A4, .paper.A5.landscape { width: 210mm; }
  .paper.A5 { width: 148mm; }
  .paper.letter, .paper.legal { width: 216mm; }
  .paper.letter.landscape { width: 280mm; }
  .paper.legal.landscape { width: 357mm; }
  .paper { background-color: white; padding: 0; }
  .sheet { box-shadow: none; margin: 0; background: white; }
  * { color: black !important; background: white !important; }
  table, th, td { border-color: black !important; }
  h1, h2, h3, h4, h5, h6 { color: black !important; }
  .gradient, .shadow { background: white !important; box-shadow: none !important; }
  
  .sheet-page {
    height: auto;
    min-height: 297mm;
    overflow: visible;
    page-break-after: always;
  }
  .sheet-page:last-child {
    page-break-after: avoid;
  }
}
`

const ITEMS_PER_PAGE = 7
const MAX_ITEMS_ON_CLOSING_PAGE = 3

const PrintA4 = ({
  documentType = 'DOCUMENT',
  customer = {},
  documentNumber = '',
  date = '',
  validUntil = '',
  items = [],
  subtotal = 0,
  discountPercent = 0,
  discountAmount = 0,
  discountLabel = '',
  tax = 0,
  total = 0,
  company = {},
  bank = {},
  issuedBy = '',
  notes = '',
  previewData,
  setPreviewRequest,
  loading = false,
  error = null,
  visible = false
}) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    if (!visible && previewData && !loading) {
      handlePrint()
    }
  }, [visible, previewData, loading])

  const handlePrint = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${printStyles}</style>
        </head>
        <body>
          ${document.getElementById('print-content').innerHTML}
        </body>
        </html>
      `
      iframeDoc.open()
      iframeDoc.write(printContent)
      iframeDoc.close()

      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        setPreviewRequest(null)
      }
    }
  }

  const renderHeader = (companyLogo) => (
    <>
      <table className="print-header">
        <tbody>
          <tr>
            <td className="logo-cell">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" style={{ width: '100%', display: 'block' }} />
              ) : (
                <div className="logo-placeholder" />
              )}
            </td>
            <td className="company-cell">
              <div>
                <h1 style={{ fontFamily: 'Audiowide', fontSize: '1.1rem', margin: '0', padding: '0', color: '#333' }}>
                  {company.name}
                  <span style={{ fontSize: '0.7rem', paddingLeft: '.5rem', color: '#666', fontFamily: 'Roboto' }}>
                    {company.registration}
                  </span>
                </h1>
              </div>
              <div className="company-info">
                <p>{company.address}</p>
                <p style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                  <span>Email: {company.email}</span>
                  <span>Phone: {company.phone}</span>
                </p>
              </div>
            </td>
            <td className="doctype-cell">
              <h1 style={{ fontFamily: 'Audiowide', fontSize: '1.1rem', margin: '0', color: '#333' }}>{documentType}</h1>
            </td>
          </tr>
        </tbody>
      </table>

      <hr className="hr--major" />

      <div className="clientinfo-container">
        <div className="clientinfo">
          <p style={{ fontWeight: '900' }}>{customer.name}</p>
          <p>{customer.address}</p>
          {(customer.phone || customer.mobile) && (
            <>
              <br />
              <p style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                {customer.phone && <span>Tel: {customer.phone}</span>}
                {customer.mobile && <span>Mobile: {customer.mobile}</span>}
              </p>
            </>
          )}
          {customer.attn && (
            <p style={{ fontWeight: '800', marginTop: '.5rem' }}>
              Attn : {customer.attn}
            </p>
          )}
        </div>

        <div className="docinfo">
          <p style={{ fontWeight: '900', margin: '0' }}>
            <span>No</span>
            <span>:</span>
            <span>{documentNumber}</span>
          </p>
          <p style={{ margin: '0', color: '#666' }}>
            <span>Date</span>
            <span>:</span>
            <DateFormat date={date} />
          </p>
          {validUntil && (
            documentType === 'QUOTATION' ? (
              <p style={{ margin: '0', color: '#666' }}>
                <span>Validity</span>
                <span>:</span>
                <DateFormat date={validUntil} />
              </p>
            ) : documentType === 'INVOICE' ? (
              <p style={{ margin: '0', color: '#666' }}>
                <span>Due</span>
                <span>:</span>
                <DateFormat date={validUntil} />
              </p>
            ) : null
          )}
        </div>
      </div>

      <hr className="hr--minor" />
    </>
  )

  const isBillable = (item) => Number(item.amount) > 0

  const needsQtyPrice = (item) => {
    if (!isBillable(item)) return false
    const qty = Number(item.quantity)
    const price = Number(item.unitPrice)
    return qty > 1 || (qty && price && Number(item.amount) !== price * qty)
  }

  const showQtyPrice = (items || []).some(needsQtyPrice)

  const billableItems = useMemo(() => (items || []).filter(isBillable), [items])
  const infoItems = useMemo(() => (items || []).filter(item => !isBillable(item)), [items])

  const renderInfoSection = () => {
    if (infoItems.length === 0) return null
    return (
      <div style={{ marginTop: '1.5rem' }}>
        {infoItems.map((item, idx) => (
          <div key={item.id || idx} style={{ marginBottom: '0.5rem', fontSize: '0.7rem', lineHeight: 1.6, color: '#374151' }}>
            {renderWhatsAppText(item.description || '')}
          </div>
        ))}
      </div>
    )
  }

  const renderItemsTable = (pageItems, isLastPage) => (
    <div className="issuence">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            {showQtyPrice && <th className="qty-cell">Qty</th>}
            {showQtyPrice && <th className="price-cell">Price</th>}
            <th className="amount-cell">Amount</th>
          </tr>
        </thead>
        <tbody className="rowbody">
          {pageItems.map((item, index) => {
            const isLast = isLastPage && index === pageItems.length - 1
            const need = showQtyPrice && needsQtyPrice(item)
            const qtyNum = need ? Number(item.quantity) : ''
            const qtyUnit = need ? (
              item.unit
                ? <>{qtyNum}<br /><span style={{ fontSize: '0.6rem', color: '#666', display: 'inline-block' }}>{item.unit}</span></>
                : qtyNum
            ) : ''
            const priceVal = need && Number(item.unitPrice) ? <CurrencyFormat amount={item.unitPrice} /> : ''
            return (
              <React.Fragment key={item.id || index}>
                <tr className={isLast ? 'last-billable' : ''}>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      {renderWhatsAppText(item.description || '')}
                    </div>
                  </td>
                  {showQtyPrice && <td className="qty-cell">{qtyUnit}</td>}
                  {showQtyPrice && <td className="price-cell">{priceVal}</td>}
                  <td className="amount-cell">{Number(item.amount) ? <CurrencyFormat amount={item.amount} /> : ''}</td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderClosingSection = () => {
    const hasDiscount = Number(discountAmount) > 0
    const hasTax = Number(tax) > 0
    const showBreakdown = hasDiscount || hasTax
    const isInvoice = documentType === 'INVOICE'
    const hasBank = isInvoice && (bank?.accountNumber || bank?.bankName || bank?.accountHolder)
    const issuedByName = issuedBy || company?.manager || ''

    return (
      <div className="closing-section">
        <hr className="hr--major" />

        <div className="footer-two-col">
          <div className="footer-col">
            {hasBank && (
              <div style={{ marginBottom: '0.6rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.2rem' }}>Bank Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: '.3rem', fontSize: '0.65rem', lineHeight: 1.6 }}>
                  <span>Acc No.</span><span>:</span><span>{bank.accountNumber}</span>
                  <span>Acc Name</span><span>:</span><span>{bank.bankName}</span>
                  <span>Acc Holder</span><span>:</span><span>{bank.accountHolder}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#374151', margin: 0 }}>Issued By,</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{issuedByName}</p>
              <div style={{ marginTop: '0.6rem', width: '160px', borderTop: '1px solid #374151', paddingTop: '0.25rem', fontSize: '0.65rem', color: '#6b7280', textAlign: 'center' }}>
                (Signature)
              </div>
            </div>
          </div>

          <div className="footer-col">
            <table className="pricing-table">
              <tbody>
                {showBreakdown ? (
                  <>
                    <tr><td>Subtotal</td><td className="positive"><CurrencyFormat amount={subtotal} /></td></tr>
                    {hasDiscount && (
                      <tr>
                        <td>{discountLabel || 'Discount'}{discountPercent > 0 ? ` (${discountPercent}%)` : ''}</td>
                        <td className="negative"><CurrencyFormat amount={-discountAmount} /></td>
                      </tr>
                    )}
                    {hasTax && (
                      <tr><td>Tax</td><td className="positive"><CurrencyFormat amount={tax} /></td></tr>
                    )}
                    <tr className="divider grand"><td>Grand Total</td><td><CurrencyFormat amount={total} /></td></tr>
                  </>
                ) : (
                  <tr className="grand"><td>Total</td><td><CurrencyFormat amount={total} /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {notes && (
          <div className="notes-section" style={{ marginTop: '0.8rem', fontSize: '0.8rem' }}>
            <p><strong>Notes:</strong></p>
            <div>{renderWhatsAppText(notes)}</div>
          </div>
        )}
      </div>
    )
  }

  const renderFooter = (pageIndex, totalPages) => (
    <div className="page-footer">
      {totalPages > 1 && <>Page {pageIndex + 1} of {totalPages}</>}
    </div>
  )

  const itemPages = useMemo(() => {
    const pages = []
    if (billableItems.length > 0) {
      for (let i = 0; i < billableItems.length; i += ITEMS_PER_PAGE) {
        pages.push(billableItems.slice(i, i + ITEMS_PER_PAGE))
      }
    } else {
      pages.push([])
    }

    const lastPageItems = pages[pages.length - 1]
    if (lastPageItems && lastPageItems.length > MAX_ITEMS_ON_CLOSING_PAGE) {
      pages.push([])
    }

    return pages
  }, [billableItems])

  const totalPageCount = itemPages.length

  const renderPage = (pageItems, pageIndex) => (
    <div key={pageIndex} className={`sheet padding-20mm ${visible ? 'sheet-page' : ''}`}>
      {renderHeader(logoImage)}
      {pageIndex > 0 && <p className="continuation-note">Continued from previous page...</p>}
      <div className="page-content">
        <div className="items-section">
          {pageItems.length > 0 && renderItemsTable(pageItems, pageIndex === totalPageCount - 1)}
          {pageIndex === totalPageCount - 1 && renderInfoSection()}
        </div>
        {pageIndex === totalPageCount - 1 && renderClosingSection()}
      </div>
      {renderFooter(pageIndex, totalPageCount)}
    </div>
  )

  if (visible) {
    return (
      <>
        <style>{printStyles}</style>
        <div id="print-content" className="paper A4 multi-page">
          {itemPages.map((pageItems, i) => renderPage(pageItems, i))}
        </div>
      </>
    )
  }

  return (
    <>
      <style>{printStyles}</style>

      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />

      <div className="hidden">
        <div id="print-content" className="paper A4">
          {itemPages.map((pageItems, i) => renderPage(pageItems, i))}
        </div>
      </div>
    </>
  )
}

export default PrintA4
