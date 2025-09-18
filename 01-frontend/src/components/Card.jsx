import React from 'react'

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  // Material Design Card with elevation and hover effects
  const hasBackgroundColor = className.includes('bg-')
  const baseClasses = hasBackgroundColor 
    ? 'rounded-lg shadow-lg border-0 transition-all duration-300 hover:shadow-xl' 
    : 'bg-white rounded-lg shadow-lg border-0 transition-all duration-300 hover:shadow-xl'
  
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
      {/* {children} */}
    </div>
  )
}

export default Card
