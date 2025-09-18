import React from 'react'
import { Card } from '../components'
import { Link } from 'react-router-dom'

const StandardPageLayoutV2 = ({
  // Header props
  title,
  subtitle,
  headerGradient = 'from-blue-600 to-purple-600',
  newItemLink,
  newItemText = 'Buat Baru',
  
  // Stats cards props (optional, more compact)
  stats = [],
  showStats = true,
  
  // Filter props
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  showHistory = false,
  onToggleHistory,
  historyButtonText = 'Tunjuk Sejarah',
  hideHistoryButtonText = 'Sembunyikan Sejarah',
  showFilter = false,
  filterValue,
  onFilterChange,
  filterOptions = [],
  infoMessage,
  
  // Table props
  children,
  
  // Loading state
  loading = false,
  loadingText = 'Memuatkan data...'
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className={`bg-gradient-to-r ${headerGradient} rounded-lg p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-white text-opacity-90 text-sm">
              {subtitle}
            </p>
          </div>
          {newItemLink && (
            <Link
              to={newItemLink}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>{newItemText}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Compact Stats Cards (optional) */}
      {showStats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgGradient} text-white border-0 hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-white text-xs font-medium">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <div className="text-2xl opacity-80">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Compact Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2">
            {onToggleHistory && (
              <button
                onClick={() => {
                  onToggleHistory(!showHistory)
                  if (!showHistory && onFilterChange) {
                    onFilterChange('all') // Reset filter apabila masuk ke mode sejarah
                  }
                }}
                className={`px-3 py-2 rounded-md font-medium transition-colors text-sm ${
                  showHistory 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showHistory ? hideHistoryButtonText : historyButtonText}
              </button>
            )}
            {showFilter && showHistory && (
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        {infoMessage && !showHistory && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              {infoMessage}
            </p>
          </div>
        )}
      </Card>

      {/* Main Table Content - More Space */}
      <Card className="p-0">
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  )
}

export default StandardPageLayoutV2
