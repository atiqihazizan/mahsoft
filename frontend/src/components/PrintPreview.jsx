import React, { useEffect, useRef } from 'react'
import { CurrencyFormat, DateFormat } from './index'
import { renderStructuredText, renderSimpleText, renderWhatsAppText } from './TextFormatting'
import logoImage from '../assets/logo/logo.png'
import '../styles/print.css'

const PrintPreview = ({
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
  triggerPrint,
  onPrint,
  onBack,
  onEdit,
  showEditButton = false,

  // Loading state
  loading = false,
  error = null
}) => {
  const iframeRef = useRef(null)

  // Dynamic import print.css hanya untuk print preview
  useEffect(() => {
    if (triggerPrint) {
      handlePrint()
    }
  }, [triggerPrint])


  // const handlePrint = () => {
  //   // Trigger print dalam PrintPreview component
  //   const printContent = document.getElementById('print-content')
  //   if (printContent) {
  //     const printWindow = window.open('', '_blank')
  //     const printContentHTML = printContent.outerHTML
      
  //     printWindow.document.write(`
  //       <!DOCTYPE html>
  //       <html>
  //       <head>
  //         <!-- <link rel="stylesheet" href="/src/index.css"> -->
  //         <link rel="stylesheet" href="/src/styles/print.css">
  //         <style>
  //           @page { margin: 0; padding: 0; }
  //           body { margin: 0; padding: 0; }
  //           .print-content { width: 100%; }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContentHTML}
  //       </body>
  //       </html>
  //     `)
      
  //     // printWindow.document.close()
  //     // printWindow.focus()
  //     // printWindow.print()
  //     // printWindow.close()
  //   } else {
  //     // Fallback ke window.print() jika print-content tiada
  //     window.print()
  //   }
  // }

  const handlePrint = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="/src/index.css">
          <link rel="stylesheet" href="/src/styles/print.css">
          <style>
            @page { margin: 0; padding: 0; }
            body { margin: 0; padding: 0; }
            .print-content { width: 100%; }
          </style>
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
      }
    }

    if (onPrint) {
      onPrint()
    }
  }

  if (loading || !documentNumber) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading document data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hidden iframe for printing */}
      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />

      <div className="">
        <div id="print-content" className="paper A4">
          <div className="sheet padding-15mm">
            {/* Header */}
            <table style={{ width: '100%', marginBottom: '.5rem' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left', width: '12%' }}>
                    <img src={logoImage} alt="Mahsoft Logo" style={{ height: '70px' }} />
                  </td>
                  <td style={{ textAlign: 'left', verticalAlign: 'top', width: '60%' }}>
                    <div>
                      <h1 className="font-audiowide" style={{ fontSize: '1.5rem', margin: '0', padding: '0', color: '#333' }}>
                        {company.name}
                        <span style={{ fontSize: '0.7rem', paddingLeft: '.5rem', color: '#666', fontFamily: 'roboto' }}>
                          {company.registration}
                        </span>
                      </h1>
                    </div>
                    <div className="company-info">
                      <p>{company.address}</p>
                      <p style={{display:'flex', flexDirection:'row', gap:'1rem'}}>
                        <span>Email: {company.email}</span>
                        <span>Phone: {company.phone}</span>
                      </p>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    <h1 className="font-audiowide" style={{ fontSize: '1.5rem', margin: '0', color: '#333' }}>{documentType}</h1>
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
                    <p style={{display:'flex', flexDirection:'row', gap:'1rem'}}>
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
                            <hr style={{ margin: '.5rem 0', borderBottom: '1px solid black' }} />
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

export default PrintPreview
