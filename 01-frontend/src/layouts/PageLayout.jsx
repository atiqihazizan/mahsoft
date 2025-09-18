import React, { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar, MDBCard, MDBButton, Footer, PrintPreview, Button } from '../components'
import usePrintPreview from '../hooks/usePrintPreview'

const PageLayout = ({
  // Header props
  title,
  subtitle,
  headerGradient = 'from-[#3b71ca] to-[#326abc]', // Default MDB primary gradient
  newItemLink,
  newItemText,
  onNewItemClick,
  headerButtonVariant = 'outline', // Customize header button variant
  headerButtonClassName = '', // Custom classes for header button

  // Stats props
  stats = [],
  showStats = true,

  // Search and filter props
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  showHistory = false,
  onToggleHistory,
  historyButtonText = 'Sejarah',
  hideHistoryButtonText = 'Sembunyikan',
  showFilter = false,
  filterValue = 'all',
  onFilterChange,
  filterOptions = [],
  infoMessage,

  // Loading state
  loading = false,
  loadingText = 'Memuatkan...',

  // Additional props
  className = '',
  ...props
}) => {

  const handleNewItemClick = () => {
    if (onNewItemClick) {
      onNewItemClick()
    } else if (newItemLink) {
      window.location.href = newItemLink
    }
  }

  // Preview state dikongsi untuk pages (table) melalui Outlet context
  const [previewRequest, setPreviewRequest] = useState(null)
  const [triggerPrint, setTriggerPrint] = useState(0)
  const { data: preview, loading: previewLoading, error: previewError } = usePrintPreview(
    previewRequest?.type,
    previewRequest?.id
  )

  const onPreview = (type, id) => setPreviewRequest({ type, id })
  const closePreview = () => setPreviewRequest(null)
  const handlePrint = () => setTriggerPrint(i=>i+1);

  return (
    <div className={`min-h-screen bg-gray-50 font-['Roboto',sans-serif] flex flex-col ${className}`} {...props}>
      <Navbar />

      {/* Header Section dengan MDB Style */}
      {(title || newItemText || newItemLink || onNewItemClick) && (
        <div className={`bg-gradient-to-r ${headerGradient} text-white`}>
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                {title && <h1 className="text-3xl font-normal text-white mb-2">{title}</h1>}
                {subtitle && <p className="text-blue-100 leading-relaxed">{subtitle}</p>}
              </div>
              {(newItemText || newItemLink || onNewItemClick) && (
                <div className="flex-shrink-0">
                  <MDBButton
                    variant={headerButtonVariant}
                    className={`border-white text-white hover:bg-white hover:text-gray-800 focus:ring-white focus:ring-opacity-50 ${headerButtonClassName}`}
                    onClick={handleNewItemClick}
                  >
                    {newItemText}
                  </MDBButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showStats && stats.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <MDBCard key={index} className="text-center">
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgGradient} ${stat.textColor} text-2xl mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#4f4f4f] mb-1">{stat.value}</h3>
                  <p className="text-[#757575] text-sm font-medium uppercase tracking-wide mb-1">{stat.label}</p>
                  {stat.subtitle && <p className="text-xs text-[#9e9e9e]">{stat.subtitle}</p>}
                </div>
              </MDBCard>
            ))}
          </div>
        </div>
      )}

      {/* Filters Section */}
      {(onSearchChange || onToggleHistory || showFilter) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <MDBCard>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                {onSearchChange && (
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-[#3b71ca] focus:outline-none transition-colors"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter Status (only show when showHistory is true and showFilter is true) */}
                {showFilter && showHistory && filterOptions.length > 0 && (
                  <div className="flex-shrink-0">
                    <select
                      value={filterValue}
                      onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-300 rounded-md focus:border-[#3b71ca] focus:outline-none transition-colors bg-white"
                    >
                      {filterOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </select>
                  </div>
                )}

                {/* Toggle History Button */}
                {onToggleHistory && (
                  <div className="flex-shrink-0">
                    <MDBButton
                      variant={showHistory ? "secondary" : "primary"}
                      onClick={() => onToggleHistory(!showHistory)}
                    >
                      {showHistory ? hideHistoryButtonText : historyButtonText}
                    </MDBButton>
                  </div>
                )}
              </div>

              {/* Info Message */}
              {infoMessage && !showHistory && (<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md"><p className="text-sm text-blue-800">{infoMessage}</p></div>)}
            </div>
          </MDBCard>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b71ca] mx-auto mb-4"></div>
              <p className="text-[#757575]">{loadingText}</p>
            </div>
          </div>
        ) : (
          <Outlet context={{ onPreview, preview, previewLoading, previewError, closePreview }} />
        )}
      </main>

      {previewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          {/* <div className="bg-white w-full max-w-5xl h-[calc(100vh-100px)] overflow-auto rounded-lg shadow-xl relative"> */}
          <div className="bg-white w-[210mm] h-[calc(100vh-100px)] overflow-auto rounded-lg shadow-xl relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <Button variant="primary" size="sm" onClick={handlePrint}>Print</Button>
              <Button variant="outline-secondary" size="sm" onClick={closePreview}>Close</Button>
            </div>
            
            <PrintPreview
              documentType={preview?.documentType || previewRequest?.type || ''}
              customer={preview?.customer || {}}
              documentNumber={preview?.documentNumber || ''}
              date={preview?.date || ''}
              validUntil={preview?.validUntil || ''}
              items={preview?.items || []}
              subtotal={preview?.subtotal || 0}
              tax={preview?.tax || 0}
              total={preview?.total || 0}
              company={preview?.company || {}}
              bank={preview?.bank || {}}
              issuedBy={preview?.issuedBy || preview?.company?.manager || ''}
              notes={preview?.notes || ''}
              // onEdit={() => {
              //   const id = previewRequest?.id
              //   const type = (previewRequest?.type || '').toUpperCase()
              //   if (type === 'INVOICE') window.location.href = `/invoices/${id}/edit`
              //   else if (type === 'QUOTATION' || type === 'QUOTE') window.location.href = `/quotes/${id}/edit`
              //   else if (type === 'RECEIPT') window.location.href = `/receipts/${id}/edit`
              // }}
              // showEditButton={showEditButton}
              triggerPrint={triggerPrint}
              loading={previewLoading}
              error={previewError}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default PageLayout
