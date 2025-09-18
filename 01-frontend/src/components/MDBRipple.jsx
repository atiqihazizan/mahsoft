import React, { useState } from 'react'

// MDB Ripple Effect component
const MDBRipple = ({ children, className = '', color = 'rgba(255,255,255,0.5)', ...props }) => {
  const [ripples, setRipples] = useState([])

  const createRipple = (event) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now() + Math.random()
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  return (
    <div
      className={`relative overflow-hidden inline-block align-bottom ${className}`}
      onMouseDown={createRipple}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            transform: 'scale(0)',
            animation: 'mdb-ripple 0.6s linear',
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes mdb-ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// MDB Button dengan Ripple Effect
export const MDBRippleButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  rippleColor,
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Determine ripple color based on variant
  const getRippleColor = () => {
    if (rippleColor) return rippleColor
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'danger':
      case 'warning':
      case 'info':
        return 'rgba(255,255,255,0.3)'
      case 'outline':
        return 'rgba(59,113,202,0.3)'
      default:
        return 'rgba(255,255,255,0.3)'
    }
  }

  // Base classes yang sama seperti MDB
  const baseClasses = [
    'text-center',        // text alignment
    'no-underline',       // text-decoration: none
    'align-bottom',       // vertical-align: bottom
    'cursor-pointer',     // cursor
    'select-none',        // user-select: none
    'bg-transparent',     // background default
    'border-2',           // border width seperti MDB (.125rem = 2px)
    'border-transparent', // border default
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
  
  // MDB color variants
  const variants = {
    primary: [
      'bg-[#3b71ca]',
      'text-white',
      'border-[#3b71ca]',
      'hover:bg-[#326abc]',
      'active:bg-[#2d5ba3]',
      'shadow-[0_4px_9px_-4px_#3b71ca]',
      'hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]',
    ].join(' '),
    
    secondary: [
      'bg-[#9fa6b2]',
      'text-white',
      'border-[#9fa6b2]',
      'hover:bg-[#8e96a3]',
      'active:bg-[#7d8694]',
    ].join(' '),
    
    success: [
      'bg-[#14a44d]',
      'text-white',
      'border-[#14a44d]',
      'hover:bg-[#119441]',
      'active:bg-[#0e7d37]',
    ].join(' '),
    
    danger: [
      'bg-[#dc4c64]',
      'text-white', 
      'border-[#dc4c64]',
      'hover:bg-[#d63c56]',
      'active:bg-[#c73650]',
    ].join(' '),
    
    outline: [
      'bg-transparent',
      'text-[#3b71ca]',
      'border-[#3b71ca]',
      'hover:bg-[#3b71ca]',
      'hover:text-white',
    ].join(' '),
  }
  
  // MDB sizes
  const sizes = {
    sm: 'px-4 py-2 text-xs leading-6',
    md: 'px-6 py-2.5 text-xs leading-6',
    lg: 'px-8 py-3 text-sm leading-7',
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`.trim()
  
  return (
    <MDBRipple 
      color={getRippleColor()}
      className="inline-block"
    >
      <button
        className={finalClasses}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </MDBRipple>
  )
}

export default MDBRipple
