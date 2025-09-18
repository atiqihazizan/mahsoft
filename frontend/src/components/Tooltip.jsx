import React, { useState, useRef, useEffect } from 'react'

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 200,
  disabled = false,
  className = '',
  offset = { x: 0, y: 0 } // Offset untuk menyesuaikan posisi
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: -9999, left: -9999 })
  const [isPositioned, setIsPositioned] = useState(false)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)

  const showTooltip = () => {
    if (disabled || !content) return
    
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setIsPositioned(false) // Reset positioning state
    }, delay)
  }

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
    setIsPositioned(false)
  }

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = triggerRect.bottom + scrollTop + 8
        left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = triggerRect.top + scrollTop + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8
        break
      case 'right':
        top = triggerRect.top + scrollTop + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.right + scrollLeft + 8
        break
      default:
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - (tooltipRect.width / 2)
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 8) left = 8
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8
    }
    if (top < 8) top = 8
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8
    }

    // Apply offset
    const finalTop = top + offset.y
    const finalLeft = left + offset.x

    setTooltipPosition({ top: finalTop, left: finalLeft })
    setIsPositioned(true)
  }

  useEffect(() => {
    if (isVisible && !isPositioned) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        updatePosition()
      })
    }
  }, [isVisible, isPositioned])

  useEffect(() => {
    if (isVisible && isPositioned) {
      const handleScroll = () => updatePosition()
      const handleResize = () => updatePosition()
      
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isVisible, isPositioned])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!content) return children

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        // className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200 ${!isPositioned ? 'opacity-0' : 'opacity-100'} ${className}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          />
        </div>
      )}
    </>
  )
}

export default Tooltip
