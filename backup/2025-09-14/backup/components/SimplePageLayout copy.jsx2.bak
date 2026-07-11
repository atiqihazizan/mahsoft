import React from 'react'

const SimplePageLayout = ({ 
  title = "INVOICE",
  newButtonText = "+ NEW",
  onNewClick,
  filterOptions = ["ALL", "ACTIVE", "DONE"],
  activeFilter = "ALL",
  onFilterChange,
  buttonColor = "blue", // blue, green, purple
  children
}) => {
  // Button color configurations
  const getButtonClasses = (color) => {
    const colorConfigs = {
      blue: {
        bg: 'bg-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700',
        focus: 'focus:ring-blue-500',
        shadow: 'hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]'
      },
      green: {
        bg: 'bg-green-600',
        border: 'border-green-600',
        hover: 'hover:bg-green-700',
        focus: 'focus:ring-green-500',
        shadow: 'hover:shadow-[0_8px_9px_-4px_rgba(34,197,94,0.3),0_4px_18px_0_rgba(34,197,94,0.2)]'
      },
      purple: {
        bg: 'bg-purple-600',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700',
        focus: 'focus:ring-purple-500',
        shadow: 'hover:shadow-[0_8px_9px_-4px_rgba(147,51,234,0.3),0_4px_18px_0_rgba(147,51,234,0.2)]'
      }
    }
    
    const config = colorConfigs[color] || colorConfigs.blue
    return `relative overflow-hidden inline-block text-center no-underline align-bottom cursor-pointer select-none ${config.bg} text-white border-2 ${config.border} rounded uppercase font-medium transition-all duration-150 ease-in-out focus:outline-none shadow-[0_2px_5px_0_rgba(0,0,0,0.2),0_2px_10px_0_rgba(0,0,0,0.1)] ${config.hover} ${config.shadow} active:shadow-[0_2px_5px_0_rgba(0,0,0,0.2)] focus:ring-2 ${config.focus} focus:ring-opacity-50 px-4 py-2 text-sm`
  }

  return (
    // <div className="min-h-screen bg-gray-100 p-6">
    <div className="min-h-full">
      {/* <div className="bg-white rounded-lg shadow-sm"> */}
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {/* New Button */}
          <button
            onClick={onNewClick}
            className={getButtonClasses(buttonColor)}
          >
            {newButtonText}
          </button>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900">
            {title}
          </h1>

          {/* Filter Options */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFilterChange && onFilterChange(option)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeFilter === option
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {/* <div className="p-6"> */}
        <div className="">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SimplePageLayout
