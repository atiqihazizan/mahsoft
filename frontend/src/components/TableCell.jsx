import React from 'react'

const TableCell = ({ 
  value, 
  className = "text-sm text-gray-900", 
  title, 
  children,
  ...props 
}) => {
  return (
    <span 
      className={className}
      title={title}
      {...props}
    >
      {children || value}
    </span>
  )
}

export default TableCell
