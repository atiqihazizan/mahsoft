import React from 'react'

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  // Check if className contains background color classes
  const hasBackgroundColor = className.includes('bg-')
  const baseClasses = hasBackgroundColor 
    ? 'rounded-lg shadow-md border border-gray-200' 
    : 'bg-white rounded-lg shadow-md border border-gray-200'
  
  return (
    <div 
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  )
}

export default Card
