import React from 'react'

// MDB-style Button component menggunakan Tailwind CSS
const MDBButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Base classes yang sama seperti MDB
  const baseClasses = [
    'relative',           // untuk ripple effect
    'overflow-hidden',    // untuk ripple effect  
    'inline-block',       // display
    'text-center',        // text alignment
    'no-underline',       // text-decoration: none
    'align-bottom',       // vertical-align: bottom
    'cursor-pointer',     // cursor
    'select-none',        // user-select: none
    // Background akan ditentukan oleh variant
    'border-2',           // border width seperti MDB (.125rem = 2px)
    // Border akan ditentukan oleh variant
    'rounded',            // border-radius: .25rem
    'uppercase',          // text-transform: uppercase
    'font-medium',        // font-weight: 500
    'transition-all',     // transition untuk semua properties
    'duration-150',       // transition duration .15s
    'ease-in-out',        // transition timing
    'focus:outline-none', // focus handling
    // MDB specific shadow
    'shadow-[0_2px_5px_0_rgba(0,0,0,0.2),0_2px_10px_0_rgba(0,0,0,0.1)]',
    'hover:shadow-[0_4px_9px_-4px_rgba(0,0,0,0.35)]',
    'active:shadow-[0_2px_5px_0_rgba(0,0,0,0.2)]',
  ].join(' ')
  
  // MDB color variants dengan warna yang tepat
  const variants = {
    primary: [
      'bg-[#3b71ca]',      // --mdb-primary: #3b71ca
      'text-white',
      'border-[#3b71ca]',
      'hover:bg-[#326abc]', // slightly darker
      'active:bg-[#2d5ba3]',
      'focus:ring-2',
      'focus:ring-[#3b71ca]',
      'focus:ring-opacity-50',
      // MDB specific shadow untuk primary
      'shadow-[0_4px_9px_-4px_#3b71ca]',
      'hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]',
    ].join(' '),
    
    secondary: [
      'bg-[#9fa6b2]',      // --mdb-secondary
      'text-white',
      'border-[#9fa6b2]',
      'hover:bg-[#8e96a3]',
      'active:bg-[#7d8694]',
      'focus:ring-2',
      'focus:ring-[#9fa6b2]',
      'focus:ring-opacity-50',
      // MDB specific shadow untuk secondary
      'shadow-[0_4px_9px_-4px_#9fa6b2]',
      'hover:shadow-[0_8px_9px_-4px_rgba(159,166,178,0.3),0_4px_18px_0_rgba(159,166,178,0.2)]',
    ].join(' '),
    
    success: [
      'bg-[#14a44d]',      // --mdb-success
      'text-white',
      'border-[#14a44d]',
      'hover:bg-[#119441]',
      'active:bg-[#0e7d37]',
      'focus:ring-2',
      'focus:ring-[#14a44d]',
      'focus:ring-opacity-50',
    ].join(' '),
    
    danger: [
      'bg-[#dc4c64]',      // --mdb-danger
      'text-white', 
      'border-[#dc4c64]',
      'hover:bg-[#d63c56]',
      'active:bg-[#c73650]',
      'focus:ring-2',
      'focus:ring-[#dc4c64]',
      'focus:ring-opacity-50',
    ].join(' '),
    
    warning: [
      'bg-[#e4a11b]',      // --mdb-warning
      'text-white',
      'border-[#e4a11b]',
      'hover:bg-[#d89a17]',
      'active:bg-[#c28a14]',
      'focus:ring-2',
      'focus:ring-[#e4a11b]',
      'focus:ring-opacity-50',
    ].join(' '),
    
    info: [
      'bg-[#54b4d3]',      // --mdb-info
      'text-white',
      'border-[#54b4d3]',
      'hover:bg-[#4aa8c9]',
      'active:bg-[#429bb8]',
      'focus:ring-2',
      'focus:ring-[#54b4d3]',
      'focus:ring-opacity-50',
    ].join(' '),
    
    // Outline variants
    outline: [
      'bg-transparent',
      'text-[#3b71ca]',
      'border-[#3b71ca]',
      'hover:bg-[#3b71ca]',
      'hover:text-white',
      'focus:ring-2',
      'focus:ring-[#3b71ca]',
      'focus:ring-opacity-50',
    ].join(' '),
    
    'outline-secondary': [
      'bg-transparent',
      'text-[#9fa6b2]',
      'border-[#9fa6b2]',
      'hover:bg-[#9fa6b2]',
      'hover:text-white',
      'focus:ring-2',
      'focus:ring-[#9fa6b2]',
      'focus:ring-opacity-50',
    ].join(' '),
  }
  
  // MDB sizes yang tepat
  const sizes = {
    sm: 'px-4 py-2 text-xs leading-6',        // smaller version
    md: 'px-6 py-2.5 text-xs leading-6',     // .625rem 1.5rem .5rem, font-size: .75rem, line-height: 1.5
    lg: 'px-8 py-3 text-sm leading-7',       // larger version
  }
  
  // Disabled state
  const disabledClasses = disabled ? [
    'opacity-50',
    'cursor-not-allowed',
    'pointer-events-none'
  ].join(' ') : ''
  
  // Gabungkan semua classes
  const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`.trim()
  
  return (
    <button
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default MDBButton
