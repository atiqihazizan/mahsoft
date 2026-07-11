// Form validation utilities

export const validationRules = {
  required: (value, message = 'This field is required') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message
    }
    return null
  },

  email: (value, message = 'Invalid email format') => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message
    }
    return null
  },

  phone: (value, message = 'Invalid phone format') => {
    if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
      return message
    }
    return null
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Minimum ${min} characters required`
    }
    return null
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Maximum ${max} characters allowed`
    }
    return null
  },

  min: (min, message) => (value) => {
    if (value !== null && value !== undefined && value < min) {
      return message || `Value must be at least ${min}`
    }
    return null
  },

  max: (max, message) => (value) => {
    if (value !== null && value !== undefined && value > max) {
      return message || `Value must not exceed ${max}`
    }
    return null
  },

  positive: (value, message = 'Value must be positive') => {
    if (value !== null && value !== undefined && value <= 0) {
      return message
    }
    return null
  },

  date: (value, message = 'Invalid date format') => {
    if (value && isNaN(Date.parse(value))) {
      return message
    }
    return null
  },

  futureDate: (value, message = 'Date must be in the future') => {
    if (value && new Date(value) <= new Date()) {
      return message
    }
    return null
  },

  pastDate: (value, message = 'Date must be in the past') => {
    if (value && new Date(value) >= new Date()) {
      return message
    }
    return null
  }
}

export const validateInvoiceForm = (formData) => {
  const errors = {}

  if (!formData.customerId) {
    errors.customerId = 'Please select a customer'
  }

  if (!formData.companyId) {
    errors.companyId = 'Please select a company'
  }

  if (!formData.date) {
    errors.date = 'Please enter a date'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Invalid date format'
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Please enter a due date'
  } else if (validationRules.date(formData.dueDate)) {
    errors.dueDate = 'Invalid date format'
  } else if (new Date(formData.dueDate) <= new Date(formData.date)) {
    errors.dueDate = 'Due date must be after invoice date'
  }

  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Tax rate must be between 0% and 100%'
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Please add at least one item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Please enter item description'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Unit price cannot be negative'
      }
    })
  }

  return errors
}

export const validateQuoteForm = (formData) => {
  const errors = {}

  if (!formData.customerId) {
    errors.customerId = 'Please select a customer'
  }

  if (!formData.companyId) {
    errors.companyId = 'Please select a company'
  }

  if (!formData.date) {
    errors.date = 'Please enter a date'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Invalid date format'
  }

  if (!formData.validUntil) {
    errors.validUntil = 'Please enter a valid until date'
  } else if (validationRules.date(formData.validUntil)) {
    errors.validUntil = 'Invalid date format'
  } else if (new Date(formData.validUntil) <= new Date(formData.date)) {
    errors.validUntil = 'Valid until date must be after quote date'
  }

  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Tax rate must be between 0% and 100%'
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Please add at least one item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Please enter item description'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Unit price cannot be negative'
      }
    })
  }

  return errors
}

export const validateReceiptForm = (formData) => {
  const errors = {}

  if (!formData.customerId) {
    errors.customerId = 'Please select a customer'
  }

  if (!formData.companyId) {
    errors.companyId = 'Please select a company'
  }

  if (!formData.date) {
    errors.date = 'Please enter a date'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Invalid date format'
  }

  if (formData.paymentMethod && !formData.paymentMethod.trim()) {
    errors.paymentMethod = 'Please select a payment method'
  }

  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Tax rate must be between 0% and 100%'
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Please add at least one item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Please enter item description'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Unit price cannot be negative'
      }
    })
  }

  return errors
}

const validateDeliveryOrderForm = (formData) => {
  const errors = {}

  if (!formData.customerId) errors.customerId = 'Customer is required'
  if (!formData.companyId) errors.companyId = 'Company is required'
  if (!formData.date) errors.date = 'Date is required'
  if (!formData.deliveryDate) errors.deliveryDate = 'Delivery date is required'
  if (!formData.deliveryAddress?.trim()) errors.deliveryAddress = 'Delivery address is required'
  if (!formData.contactPerson?.trim()) errors.contactPerson = 'Contact person is required'

  if (formData.date && formData.deliveryDate) {
    const date = new Date(formData.date)
    const deliveryDate = new Date(formData.deliveryDate)
    if (deliveryDate < date) {
      errors.deliveryDate = 'Delivery date cannot be earlier than DO date'
    }
  }

  if (formData.contactPhone && !validationRules.phone(formData.contactPhone)) {
    errors.contactPhone = 'Invalid phone format'
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'At least one item is required'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors[`items.${index}.description`] = 'Item description is required'
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Quantity must be greater than 0'
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        errors[`items.${index}.unitPrice`] = 'Invalid unit price'
      }
    })
  }

  return errors
}

export const validateForm = (formData, type = 'invoice') => {
  switch (type) {
    case 'invoice':
      return validateInvoiceForm(formData)
    case 'quote':
      return validateQuoteForm(formData)
    case 'receipt':
      return validateReceiptForm(formData)
    case 'delivery_order':
      return validateDeliveryOrderForm(formData)
    default:
      return {}
  }
}

// Helper function untuk check jika form valid
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0
}

// Helper function untuk get error message untuk field tertentu
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || ''
}

// Helper function untuk clear error untuk field tertentu
export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors }
  delete newErrors[fieldName]
  return newErrors
}

// Helper function untuk validate single field
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value)
    if (error) {
      return error
    }
  }
  return null
}

// Common validation rules untuk field yang sering digunakan
export const commonRules = {
  required: validationRules.required,
  email: validationRules.email,
  phone: validationRules.phone,
  positive: validationRules.positive,
  date: validationRules.date,
  futureDate: validationRules.futureDate,
  pastDate: validationRules.pastDate
}

export default {
  validationRules,
  validateInvoiceForm,
  validateQuoteForm,
  validateReceiptForm,
  validateForm,
  isFormValid,
  getFieldError,
  clearFieldError,
  validateField,
  commonRules
}
