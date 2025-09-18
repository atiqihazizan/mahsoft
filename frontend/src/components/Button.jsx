import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Material Design base classes with elevation and ripple effect
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg active:shadow-sm transform active:scale-95 relative overflow-hidden'
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500',
    // Outline variants
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
    'outline-secondary': 'border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-gray-500',
    'outline-success': 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-green-500',
    'outline-danger': 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
    'outline-warning': 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-yellow-500',
    'outline-info': 'border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white focus:ring-cyan-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`.trim()
  
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
