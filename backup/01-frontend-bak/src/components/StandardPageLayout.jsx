import React from 'react'
import { Card } from './index'
import { Link } from 'react-router-dom'

const StandardPageLayout = ({
  // Header props
  title,
  subtitle,
  headerGradient = 'from-blue-600 to-purple-600',
  newItemLink,
  newItemText = 'Buat Baru',
  
  // Stats cards props
  stats = [],
  
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
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-blue-100">
              {subtitle}
            </p>
          </div>
          {newItemLink && (
            <Link
              to={newItemLink}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>{newItemText}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgGradient} text-white border-0 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-white text-opacity-80 text-xs">{stat.subtitle}</p>
                  )}
                </div>
                <div className="text-4xl opacity-80">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {infoMessage}
            </p>
          </div>
        )}
      </Card>

      {/* Table Content */}
      <Card>
        {children}
      </Card>
    </div>
  )
}

export default StandardPageLayout
