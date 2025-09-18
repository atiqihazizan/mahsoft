import React from 'react'

// MDB-style Card component menggunakan Tailwind CSS
const MDBCard = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  // Base classes yang sama seperti MDB Card
  const baseClasses = [
    'relative',           // position: relative
    'flex',              // display: flex
    'flex-col',          // flex-direction: column
    'min-w-0',           // min-width: 0
    'break-words',       // word-wrap: break-word
    'bg-white',          // background-color: #fff
    'bg-clip-border',    // background-clip: border-box
    'border',            // border: 1px solid
    'border-[rgba(0,0,0,0.125)]', // border-color seperti MDB
    'rounded-lg',        // border-radius: .5rem (MDB menggunakan .5rem)
  ].join(' ')
  
  // Check if custom background color is provided
  const hasCustomBg = className.includes('bg-')
  const finalBaseClasses = hasCustomBg 
    ? baseClasses.replace('bg-white', '') 
    : baseClasses
  
  return (
    <div 
      className={`${finalBaseClasses} ${className}`}
      {...props}
    >
      {/* Card Header - jika ada title atau subtitle */}
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.125)]">
          {title && (
            <h5 className="text-lg font-medium text-[#4f4f4f] mb-0">
              {title}
            </h5>
          )}
          {subtitle && (
            <p className="text-sm text-[#757575] mt-1 mb-0">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

// MDB Card Body component
export const MDBCardBody = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// MDB Card Header component  
export const MDBCardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`px-6 py-4 border-b border-[rgba(0,0,0,0.125)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// MDB Card Footer component
export const MDBCardFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`px-6 py-4 border-t border-[rgba(0,0,0,0.125)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// MDB Card Title component
export const MDBCardTitle = ({ children, className = '', ...props }) => {
  return (
    <h5 
      className={`text-lg font-medium text-[#4f4f4f] mb-3 ${className}`}
      {...props}
    >
      {children}
    </h5>
  )
}

// MDB Card Text component
export const MDBCardText = ({ children, className = '', ...props }) => {
  return (
    <p 
      className={`text-[#4f4f4f] mb-3 last:mb-0 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}

export default MDBCard
