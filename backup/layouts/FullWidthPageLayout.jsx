import React from 'react'
import MDBCard from '../components/MDBCard'
import MDBButton from '../components/MDBButton'

// Full Width Page Layout component - serupa dengan MDBPageLayout tetapi tanpa constraint max-width
const FullWidthPageLayout = ({
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
  
  // Content
  children,
  
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

  return (
    <div className={`min-h-screen bg-gray-50 font-['Roboto',sans-serif] ${className}`} {...props}>
      {/* Header Section dengan MDB Style - Full Width */}
      <div className={`bg-gradient-to-r ${headerGradient} text-white`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-normal text-white mb-2">{title}</h1>
              {subtitle && (
                <p className="text-blue-100 leading-relaxed">
                  {subtitle}
                </p>
              )}
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

      {/* Stats Cards - Full Width */}
      {showStats && stats.length > 0 && (
        <div className="w-full px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <MDBCard key={index} className="text-center">
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgGradient} ${stat.textColor} text-2xl mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#4f4f4f] mb-1">{stat.value}</h3>
                  <p className="text-[#757575] text-sm font-medium uppercase tracking-wide mb-1">{stat.label}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-[#9e9e9e]">{stat.subtitle}</p>
                  )}
                </div>
              </MDBCard>
            ))}
          </div>
        </div>
      )}

      {/* Filters Section - Full Width */}
      {(onSearchChange || onToggleHistory || showFilter) && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-6">
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
                      {filterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
              {infoMessage && !showHistory && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    {infoMessage}
                  </p>
                </div>
              )}
            </div>
          </MDBCard>
        </div>
      )}

      {/* Content Section - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
        <MDBCard>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b71ca] mx-auto mb-4"></div>
              <p className="text-[#757575]">{loadingText}</p>
            </div>
          ) : (
            children
          )}
        </MDBCard>
      </div>
    </div>
  )
}

// Full Width Table component untuk digunakan dengan FullWidthPageLayout
export const FullWidthTable = ({
  columns = [],
  data = [],
  actions = [],
  emptyMessage = 'Tiada data untuk dipaparkan',
  emptyIcon = '📄',
  className = '',
  ...props
}) => {
  
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">{emptyIcon}</div>
        <h3 className="text-lg font-medium text-[#4f4f4f] mb-2">{emptyMessage}</h3>
        <p className="text-[#757575]">Cuba ubah kriteria carian atau filter anda</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">
                Tindakan
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-[#4f4f4f]">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        className={`${action.className} font-medium hover:underline`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FullWidthPageLayout
