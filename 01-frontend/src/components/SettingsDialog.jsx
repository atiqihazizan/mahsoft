import React from 'react'
import { 
  Label, 
  TextInput, 
  EmailInput, 
  TelInput, 
  Textarea, 
  Select, 
  Checkbox, 
  RadioGroup, 
  NumberInput, 
  DateInput, 
  PasswordInput 
} from './FormFields'

const SettingsDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  isEdit = false, 
  formData = {}, 
  onFormChange, 
  onSubmit, 
  fields = [], 
  loading = false 
}) => {
  if (!isOpen) return null

  const handleInputChange = (fieldName, value) => {
    onFormChange({
      ...formData,
      [fieldName]: value
    })
  }

  const renderField = (field) => {
    const { 
      name, 
      label, 
      type = 'text', 
      required = false, 
      placeholder = '', 
      options = [], 
      disabled = false,
      className = '',
      ...fieldProps 
    } = field

    const value = formData[name] || ''
    const commonProps = {
      value,
      onChange: (e) => handleInputChange(name, e.target.value),
      required,
      placeholder,
      disabled,
      className
    }

    switch (type) {
      case 'email':
        return <EmailInput {...commonProps} {...fieldProps} />
      
      case 'tel':
      case 'phone':
        return <TelInput {...commonProps} {...fieldProps} />
      
      case 'textarea':
        return <Textarea {...commonProps} {...fieldProps} />
      
      case 'select':
        return <Select {...commonProps} options={options} {...fieldProps} />
      
      case 'checkbox':
        return (
          <Checkbox
            checked={value}
            onChange={(e) => handleInputChange(name, e.target.checked)}
            label={label}
            disabled={disabled}
            className={className}
            {...fieldProps}
          />
        )
      
      case 'radio':
        return (
          <RadioGroup
            name={name}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            options={options}
            disabled={disabled}
            className={className}
            {...fieldProps}
          />
        )
      
      case 'number':
        return <NumberInput {...commonProps} {...fieldProps} />
      
      case 'date':
        return <DateInput {...commonProps} {...fieldProps} />
      
      case 'password':
        return <PasswordInput {...commonProps} {...fieldProps} />
      
      default:
        return <TextInput {...commonProps} {...fieldProps} />
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? `Edit ${title}` : `Add New ${title}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div 
              key={field.name || index} 
              className={field.fullWidth ? 'md:col-span-2' : ''}
            >
              {field.type !== 'checkbox' && field.type !== 'radio' && (
                <Label required={field.required}>
                  {field.label}
                </Label>
              )}
              {renderField(field)}
            </div>
          ))}
          
          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsDialog
