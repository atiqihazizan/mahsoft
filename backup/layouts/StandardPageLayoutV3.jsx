import React from 'react'
import { Card } from '../components'
import { Link } from 'react-router-dom'

const StandardPageLayoutV3 = ({
  // Header props
  title,
  subtitle,
  headerGradient = 'from-blue-600 to-purple-600',
  newItemLink,
  newItemText = 'Buat Baru',
  
  // Stats cards props (optional, very compact)
  stats = [],
  showStats = true,
  
  // Filter props
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  showHistory = false,
  onToggleHistory,
  historyButtonText = 'Sejarah',
  hideHistoryButtonText = 'Sembunyikan',
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
    <div className="space-y-3">
      {/* Minimal Header */}
      <div className={`bg-gradient-to-r ${headerGradient} rounded-lg p-3 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-white text-opacity-80 text-xs">
                {subtitle}
              </p>
            )}
          </div>
          {newItemLink && (
            <Link
              to={newItemLink}
              className="bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors flex items-center space-x-1"
            >
              <span>+</span>
              <span>{newItemText}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Very Compact Stats Cards (optional) - COMMENTED FOR MAXIMUM TABLE SPACE */}
      {/* {showStats && stats.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgGradient} text-white border-0 hover:shadow-sm transition-all duration-200`}>
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-white text-xs font-medium truncate">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
                <div className="text-lg opacity-80">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      )} */}

      {/* Inline Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-2">
          {onToggleHistory && (
            <button
              onClick={() => {
                onToggleHistory(!showHistory)
                if (!showHistory && onFilterChange) {
                  onFilterChange('all')
                }
              }}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
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
              className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
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

      {/* Info Message (if any) */}
      {infoMessage && !showHistory && (
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
          {infoMessage}
        </div>
      )}

      {/* Main Table Content - Full Width Height */}
      <Card className="p-0 h-full">
        <div className="p-0 h-full">
          {children}
        </div>
      </Card>
    </div>
  )
}

export default StandardPageLayoutV3
