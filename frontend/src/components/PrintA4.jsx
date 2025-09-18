import React, { useEffect, useRef } from 'react'
import { CurrencyFormat, DateFormat } from './index'
import { renderStructuredText, renderSimpleText, renderWhatsAppText } from './TextFormatting'
import logoImage from '../assets/logo/logo.png'

const PrintA4 = ({
  // Document type untuk header (QUOTATION, INVOICE, RECEIPT, etc.)
  documentType = 'DOCUMENT',

  // Customer information
  customer = {
    name: '',
    address: '',
    phone: '',
    mobile: '',
    attn: ''
  },

  // Document number and dates
  documentNumber = '',
  date = '',
  validUntil = '',

  // Items/body content
  items = [],

  // Totals
  subtotal = 0,
  tax = 0,
  total = 0,

  // Company information
  company = {
    name: '',
    registration: '',
    address: '',
    email: '',
    phone: '',
    manager: ''
  },

  // Bank information (optional)
  bank = {
    accountNumber: '',
    bankName: '',
    accountHolder: ''
  },

  // Additional fields
  issuedBy = '',
  notes = '',

  // Actions
  previewData,
  setPreviewRequest,

  // Loading state
  loading = false,
  error = null
}) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    if (previewData && !loading) {
      handlePrint()
    }
  }, [previewData, loading])

  const handlePrint = () => {
    if (iframeRef.current) {
      // const iframe = window.open('', '_blank')
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="preload" href="/fonts/Audiowide-Regular.ttf" as="font" type="font/ttf" crossorigin>
          <link rel="preload" href="/fonts/Roboto-Regular.ttf" as="font" type="font/ttf" crossorigin>
          <style>
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
            @font-face { font-family: audiowide; src: url(/fonts/Audiowide-Regular.ttf); font-display: swap; }
            @font-face { font-family: roboto; src: url(/fonts/Roboto-Regular.ttf); font-display: swap; }
            /* Base Styles */
            .paper .sheet { margin: auto; font-size: .9rem; background-color: white; line-height: 1.65; color: #212529; text-align: left; }
            .paper .sheet table td { font-size: 0.7rem; font-weight: 300; }
            .sheet hr { margin: .1rem 0; border-bottom: 1px solid #e5e7eb; }

            /* Utility Classes */
            .font-audiowide { font-family: audiowide, roboto, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif; }
            .w-100 { width: 100%; }
            .m0 { margin: 0; }
            .ml-4 { margin-left: 1rem; }
            .mb-2 { margin-bottom: .5rem; }

            /* Letter Head */
            .letter-head table p { padding: 0; margin: 0; }
            .vtable { border: 0; border-collapse: collapse; border-spacing: 0; }
            .fwb td { font-weight: 600; }
            .letter-head table tr th, .letter-head table tr td { vertical-align: top; }
            .letter-head table, .clientinfo table, .issuence table, .footer-bottom table { width: 100%; border: 0; border-collapse: collapse; border-spacing: 0; }

            /* Letter Head Layout */
            .letter-head table tr td:first-child { width: 80px; vertical-align: top; }
            .letter-head table tr td:nth-child(2) { width: auto; padding-left: 1rem; }
            .letter-head table tr td:last-child { width: 120px; text-align: right; vertical-align: top; }

            /* Client Info Layout */
            .clientinfo table tr td:first-child { width: auto; vertical-align: top; }
            .clientinfo table tr td:last-child { width: 20%; vertical-align: top; }

            /* Issuance Section */
            .issuence { margin-top: 1rem; min-height: 140px; }
            .issuence .col-bold td { font-weight: 600; }
            .issuence table tr th, .issuence table tr td { padding: 0.1rem 0.3rem; }
            .issuence .header.line { margin-top: .5rem; }
            .issuence .linebottom { padding: 0; width: 99.9%; }
            .issuence .header tr th:nth-child(1), .issuence .rowbody tr td:nth-child(1) { width: auto; text-align: left; padding-left: 0 !important; }
            .issuence .header tr th:nth-child(2), .issuence .rowbody tr td:nth-child(2) { width: 60px; text-align: center; }
            .issuence .header tr th:nth-child(3), .issuence .rowbody tr td:nth-child(3) { width: 75px; text-align: right; }
            .issuence .header th, .issuence .footer tr th { font-weight: 500; font-size: .85rem; }
            .issuence .footer tr th { text-align: right !important; }

            .issuence .rowbody td:nth-child(4), .issuence .header th:nth-child(4), .issuence .footer tr th:last-child, .inv-amt th:last-child, .inv-amt td:last-child { width: 80px; text-align: right; }

            /* Issuance Header */
            .issuence .header th { font-weight: 600; font-size: 0.8rem; text-align: left; }
            .issuence .header th:nth-child(2) { text-align: center; width: 80px; }
            .issuence .header th:nth-child(3) { text-align: right; width: 80px; }

            /* Issuance Row Body */
            .issuence .rowbody { width: 100%; border-collapse: collapse; border-spacing: 0; }
            .issuence .rowbody td { vertical-align: top; }
            .issuence .rowbody td p, .issuence .rowbody td span, .issuence .rowbody td, .issuence .rowbody td li { font-size: 0.7rem; }
            .issuence .rowbody td li, .issuence .rowbody td div { line-height: 1.2; }
            .issuence .rowbody tr.fwb td { font-weight: 600; }
            .issuence .rowbody td:nth-child(2) { text-align: center; width: 80px; }
            .issuence .rowbody td:nth-child(3) { text-align: right; width: 80px; }
            .issuence .rowbody td:nth-child(4) { font-weight: 600; }
            .issuence .body td { vertical-align: top; padding-top: 1rem; }
            .issuence .body td, .footer-bottom { margin-top: 1rem; }
            .issuence .rowbody td, .issuence .header th { padding: 0.5rem 0.1rem; }

            /* Footer */
            .footer-bottom { width: 100%; }
            .bankinfo { float: right; border: 1px solid #e5e7eb; border-radius: 3px; padding: .6rem; }
            .bankinfo p { margin: 0; padding: 0; font-weight: bold; font-size: 8pt; }

            /* Table Signature */
            .table-signature { width: 100%; border-collapse: collapse; }
            .table-signature tr { align-items: center; }
            .table-signature td:first-child { align-self: center; }
            .table-signature td:nth-child(2) { align-self: center; }

            /* Bank Info */
            .bank-info { display: grid; grid-template-columns: auto auto 1fr; column-gap: .5rem; align-items: center; }
            .bank-info td { white-space: nowrap; font-size: 9pt; }
            .bank-info td:first-child { width: 65px; }
            .bank-info td:nth-child(2) { width: 0px; text-align: center; }
            .bank-info td:last-child { width: auto; padding-left: 0.5rem; font-size: 0.7rem; }

            /* Invoice Amount */
            .inv-amt td { font-size: 9pt !important; }
            .inv-amt td:first-child { width: 60px; }
            .inv-amt tr.font-big th { font-size: 0.9rem; font-weight: 600; padding: 0.3rem 0; border-top: 1px solid #e5e7eb; }

            /* Body Content */
            .fra-body { min-height: 500px; }
            .issuedby { width: 13rem; display: inline-block; margin-top: 1rem; text-align: center; }
            .issuedby p { margin: 0; }
            .separator-line { border-bottom: 1px solid #e5e7eb !important; }
            .table-signature tr.font-big th { font-size: .9rem; padding: 2px 0; }
            .issuedby p, .remark p { font-size: 10pt; }
            .company-info { display: flex; flex-direction: column; }
            .company-info p { line-height: 1.2; font-size: 0.65rem; }
            .clientinfo-container { display: flex; flex-direction: row; justify-content: space-between; }
            .clientinfo ,.docinfo { display: flex; flex-direction: column; }

            .clientinfo { width: 50%;}
            .clientinfo p, .clientinfo table tr th, .clientinfo table tr td, .clientinfo span, .docinfo p { font-size: .7rem; }
            .clientinfo table tr th, .clientinfo table tr td, .table-signature th, .table-signature td { vertical-align: top; }
            .clientinfo p:nth-child(2) { line-height: 1.2; }
            .bank-info td, .sign-info td { white-space: nowrap; }
            .table-signature tr th, .table-signature tr td, .bank-info td, .sign-info td { font-size: 9pt; }

            .docinfo p { width: 100%; display: grid; grid-template-columns: 40px 10px 1fr; font-size: 0.7rem; margin: 0; }
            .docinfo p span { font-size: 0.7rem; margin: 0; }
            .docinfo p span:last-child { text-align: right; }

            /* Paper Sizes */
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

            /* Padding Options */
            .sheet.padding-5mm { padding: 5mm; }
            .sheet.padding-10mm { padding: 10mm; }
            .sheet.padding-15mm { padding: 15mm; }
            .sheet.padding-20mm { padding: 20mm; }
            .sheet.padding-25mm { padding: 25mm; }

            /* Print Controls */
            .btntop { position: absolute; display: flex; width: 100%; top: 0; left: 0; right: 0; justify-content: space-between; padding: 10px; }

            /* Signature */
            .signiture { position: absolute; bottom: 50px; width: 100%; color: #a9a9a9b5; text-align: center; font-style: italic; font-size: .75rem; }

            /* Custom Styles untuk Mahsoft */
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

            /* Print Media Queries */
            @page { margin: 0; padding: 0; }

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
            }
          </style>
        </head>
        <body>
          ${document.getElementById('print-content').innerHTML}
        </body>
        </html>
      `
      // iframe.document.write(printContent)
      // iframe.document.close()
      // return;

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

  return (
    <>
      {/* Hidden iframe for printing */}
      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />

      <div className="hidden">
        {/* Print Content */}
        <div id="print-content" className="paper A4">

          {/* Print Content */}
          <div className="sheet padding-15mm">
            {/* Header */}
            <table style={{ width: '100%', marginBottom: '0' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left', width: '55px', padding: 0 }}>
                    <img src={logoImage} alt="Mahsoft Logo" style={{ width: '100%', marginRight: '1rem' }} />
                  </td>
                  <td style={{ textAlign: 'left', verticalAlign: 'top', width: '68%', padding: 0 }}>
                    <div>
                      <h1 style={{ fontFamily: 'audiowide', fontSize: '1.1rem', margin: '0', padding: '0', color: '#333' }}>
                        {company.name}
                        <span style={{ fontSize: '0.7rem', paddingLeft: '.5rem', color: '#666', fontFamily: 'roboto' }}>
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
                  <td style={{ textAlign: 'right', verticalAlign: 'top', padding: 0 }}>
                    <h1 style={{ fontFamily: 'audiowide', fontSize: '1.1rem', margin: '0', color: '#333' }}>{documentType}</h1>
                  </td>
                </tr>
              </tbody>
            </table>

            <hr />
            <br />

            <div className="clientinfo-container">
              {/* Client Info */}
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

            {/* <br /> */}

            {/* Items Table */}
            {items && items.length > 0 && (
              <div className="issuence">
                <table className="header">
                  <tbody>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </tbody>
                </table>

                <hr />

                <table className="rowbody">
                  <tbody>
                    {items.map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        <tr>
                          <td><div style={{ fontSize: '0.8rem' }}>{/* {renderStructuredText(item.description || '')} */}
                            {
                              item?.variant === 'whatsapp'
                                ? renderWhatsAppText(item.description || '')
                                : item?.variant === 'simple'
                                  ? renderSimpleText(item.description || '')
                                  : renderStructuredText(item.description || '', { listType: item?.listType || 'ul', spacing: item?.spacing || 'normal' })
                            }
                          </div></td>
                          <td>{item.quantity || 0}</td>
                          <td><CurrencyFormat amount={item.unitPrice || item.price || 0} /></td>
                          <td><CurrencyFormat amount={item.amount || 0} /></td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <hr />

            {/* Footer */}
            <div className="footer-bottom">
              <table className="table-signature">
                <tbody>
                  <tr style={{ display: 'flex' }}>
                    {(documentType === 'INVOICE' && (bank?.accountNumber || bank?.bankName || bank?.accountHolder)) ? (
                      <>
                        <td style={{ alignSelf: 'center' }}>
                          <div className="bank-info">
                            <span>Acc No.</span><span>:</span><span>{bank.accountNumber}</span>
                            <span>Acc Name</span><span>:</span><span>{bank.bankName}</span>
                            <span>Acc Holder</span><span>:</span><span>{bank.accountHolder}</span>
                          </div>
                        </td>
                        <td style={{ alignSelf: 'center', flex: 1 }}>
                          <div style={{ margin: 'auto', width: '150px', textAlign: 'center' }}>
                            <i>{issuedBy || company.manager}</i>
                            <hr />
                            Issued By
                          </div>
                        </td>
                      </>
                    ) : (
                      <td style={{ alignSelf: 'left', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '150px', textAlign: 'left' }}>
                          <span>Issued By,</span>
                          <i>{issuedBy || company.manager}</i>
                        </div>
                      </td>
                    )}
                    <td style={{ alignSelf: 'center' }}>
                      <table className="inv-amt">
                        <tbody>
                          {documentType === 'INVOICE' && (
                            <>
                              <tr>
                                <td style={{ textAlign: 'right' }}>Subtotal</td>
                                <td ><CurrencyFormat amount={subtotal} /></td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: 'right' }}>Tax</td>
                                <td><CurrencyFormat amount={tax} /></td>
                              </tr>
                            </>
                          )}
                          <tr className="">
                            <th style={{ border: '0', textAlign: 'right' }}>Total</th>
                            <th style={{ border: '0', textAlign: 'right' }}><CurrencyFormat amount={total} /></th>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {notes && (
              <div style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                <p><strong>Notes:</strong></p>
                <p>{renderStructuredText(notes)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PrintA4
