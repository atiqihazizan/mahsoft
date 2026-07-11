import React, { useRef, useCallback, useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

// Label component
export const Label = ({ children, required = false, className = "" }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
)

// Text Input component
export const TextInput = ({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  className = "",
  helperText, // digunakan di luar, jangan pass ke DOM
  ...props 
}) => (
  <div className="w-full">
    <input
      type="text"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">
        {helperText}
      </p>
    )}
  </div>
)

// Email Input component
export const EmailInput = ({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  className = "",
  helperText,
  ...props 
}) => (
  <div className="w-full">
    <input
      type="email"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">
        {helperText}
      </p>
    )}
  </div>
)

// Tel Input component
export const TelInput = ({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  className = "",
  helperText,
  ...props 
}) => (
  <div className="w-full">
    <input
      type="tel"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">
        {helperText}
      </p>
    )}
  </div>
)

// Textarea component with auto-resize
export const Textarea = React.forwardRef(({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  rows = 3,
  className = "",
  autoResize = true,
  helperText,
  ...props 
}, ref) => {
  const internalRef = useRef(null)

  const mergedRef = (el) => {
    internalRef.current = el
    if (ref) {
      if (typeof ref === 'function') ref(el)
      else ref.current = el
    }
  }

  const adjustHeight = useCallback(() => {
    if (internalRef.current && autoResize) {
      internalRef.current.style.height = 'auto'
      internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
    }
  }, [autoResize])

  // Effect untuk adjust height apabila value berubah
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  // Handle onChange dengan auto-resize
  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
    // Auto-resize akan trigger melalui useEffect
  }

  return (
    <div className="w-full">
      <textarea
        ref={mergedRef}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-[11pt] overflow-hidden ${className}`}
        style={{ minHeight: `${rows * 1.5}rem` }}
        {...props}
      />
      {helperText && (
        <p className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select component
export const Select = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option...", 
  required = false, 
  disabled = false,
  className = "",
  ...props 
}) => (
  <select
    value={value || ''}
    onChange={onChange}
    required={required}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

// Checkbox component
export const Checkbox = ({ 
  checked, 
  onChange, 
  label = "", 
  disabled = false,
  className = "",
  ...props 
}) => (
  <div className={`flex items-center ${className}`}>
    <input
      type="checkbox"
      checked={checked || false}
      onChange={onChange}
      disabled={disabled}
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      {...props}
    />
    {label && (
      <label className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    )}
  </div>
)

// Radio component
export const Radio = ({ 
  name, 
  value, 
  checked, 
  onChange, 
  label = "", 
  disabled = false,
  className = "",
  ...props 
}) => (
  <div className={`flex items-center ${className}`}>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked || false}
      onChange={onChange}
      disabled={disabled}
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
      {...props}
    />
    {label && (
      <label className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    )}
  </div>
)

// Radio Group component
export const RadioGroup = ({ 
  name, 
  value, 
  onChange, 
  options = [], 
  disabled = false,
  className = "",
  ...props 
}) => (
  <div className={`space-y-2 ${className}`}>
    {options.map((option, index) => (
      <Radio
        key={index}
        name={name}
        value={option.value}
        checked={value === option.value}
        onChange={onChange}
        label={option.label}
        disabled={disabled}
        {...props}
      />
    ))}
  </div>
)

// Number Input component
export const NumberInput = ({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  min,
  max,
  step,
  className = "",
  helperText,
  ...props 
}) => (
  <div className="w-full">
    <input
      type="number"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">
        {helperText}
      </p>
    )}
  </div>
)

// Date Input component
export const DateInput = ({ 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  className = "",
  ...props 
}) => (
  <input
    type="date"
    value={value || ''}
    onChange={onChange}
    required={required}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
)

// Password Input component
export const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "", 
  required = false, 
  disabled = false,
  className = "",
  helperText = "",
  ...props 
}) => (
  <div>
    <input
      type="password"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
    )}
  </div>
)

// Description Field component with auto-resize Markdown Editor
export const DescriptionField = ({ 
  value, 
  onChange, 
  label = "", 
  placeholder = "", 
  required = false, 
  disabled = false,
  className = "",
  error = '',
  minHeight = 90,
  ...props 
}) => {
  const handleChange = (val) => {
    onChange({ target: { value: val || '' } })
  }

  return (
    <div className={className} data-color-mode="light">
      {label && (
        <Label required={required}>{label}</Label>
      )}
      <div style={{ minHeight: `${minHeight}px` }}>
        <MDEditor
          value={value || ''}
          onChange={handleChange}
          preview="edit"
          visibleDragbar={false}
          height="auto"
          textareaProps={{
            placeholder: placeholder,
            disabled: disabled,
          }}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    </div>
  )
}