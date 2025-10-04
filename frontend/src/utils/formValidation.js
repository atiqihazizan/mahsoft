// Utility functions untuk form validation

// Validation rules untuk field yang berbeza
export const validationRules = {
  required: (value, message = 'Field ini diperlukan') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message
    }
    return null
  },

  email: (value, message = 'Format email tidak sah') => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message
    }
    return null
  },

  phone: (value, message = 'Format telefon tidak sah') => {
    if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
      return message
    }
    return null
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Minimum ${min} aksara diperlukan`
    }
    return null
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Maksimum ${max} aksara dibenarkan`
    }
    return null
  },

  min: (min, message) => (value) => {
    if (value !== null && value !== undefined && value < min) {
      return message || `Nilai mesti sekurang-kurangnya ${min}`
    }
    return null
  },

  max: (max, message) => (value) => {
    if (value !== null && value !== undefined && value > max) {
      return message || `Nilai mesti tidak melebihi ${max}`
    }
    return null
  },

  positive: (value, message = 'Nilai mesti positif') => {
    if (value !== null && value !== undefined && value <= 0) {
      return message
    }
    return null
  },

  date: (value, message = 'Format tarikh tidak sah') => {
    if (value && isNaN(Date.parse(value))) {
      return message
    }
    return null
  },

  futureDate: (value, message = 'Tarikh mesti pada masa hadapan') => {
    if (value && new Date(value) <= new Date()) {
      return message
    }
    return null
  },

  pastDate: (value, message = 'Tarikh mesti pada masa lalu') => {
    if (value && new Date(value) >= new Date()) {
      return message
    }
    return null
  }
}

// Validation untuk form invoice
export const validateInvoiceForm = (formData) => {
  const errors = {}

  // Basic validation
  if (!formData.customerId) {
    errors.customerId = 'Sila pilih pelanggan'
  }

  if (!formData.companyId) {
    errors.companyId = 'Sila pilih syarikat'
  }

  if (!formData.date) {
    errors.date = 'Sila masukkan tarikh'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Format tarikh tidak sah'
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Sila masukkan tarikh tamat tempoh'
  } else if (validationRules.date(formData.dueDate)) {
    errors.dueDate = 'Format tarikh tidak sah'
  } else if (new Date(formData.dueDate) <= new Date(formData.date)) {
    errors.dueDate = 'Tarikh tamat tempoh mesti selepas tarikh invois'
  }

  // Tax rate validation
  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Kadar cukai mesti antara 0% hingga 100%'
  }

  // Items validation
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Sila tambah sekurang-kurangnya satu item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Sila masukkan perihalan item'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Kuantiti mesti lebih daripada 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Harga unit tidak boleh negatif'
      }
    })
  }

  return errors
}

// Validation untuk form quotation
export const validateQuoteForm = (formData) => {
  const errors = {}

  // Basic validation
  if (!formData.customerId) {
    errors.customerId = 'Sila pilih pelanggan'
  }

  if (!formData.companyId) {
    errors.companyId = 'Sila pilih syarikat'
  }

  if (!formData.date) {
    errors.date = 'Sila masukkan tarikh'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Format tarikh tidak sah'
  }

  if (!formData.validUntil) {
    errors.validUntil = 'Sila masukkan tarikh sah hingga'
  } else if (validationRules.date(formData.validUntil)) {
    errors.validUntil = 'Format tarikh tidak sah'
  } else if (new Date(formData.validUntil) <= new Date(formData.date)) {
    errors.validUntil = 'Tarikh sah hingga mesti selepas tarikh sebut harga'
  }

  // Tax rate validation
  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Kadar cukai mesti antara 0% hingga 100%'
  }

  // Items validation
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Sila tambah sekurang-kurangnya satu item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Sila masukkan perihalan item'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Kuantiti mesti lebih daripada 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Harga unit tidak boleh negatif'
      }
    })
  }

  return errors
}

// Validation untuk form receipt
export const validateReceiptForm = (formData) => {
  const errors = {}

  // Basic validation
  if (!formData.customerId) {
    errors.customerId = 'Sila pilih pelanggan'
  }

  if (!formData.companyId) {
    errors.companyId = 'Sila pilih syarikat'
  }

  if (!formData.date) {
    errors.date = 'Sila masukkan tarikh'
  } else if (validationRules.date(formData.date)) {
    errors.date = 'Format tarikh tidak sah'
  }

  // Payment method validation (if applicable)
  if (formData.paymentMethod && !formData.paymentMethod.trim()) {
    errors.paymentMethod = 'Sila pilih kaedah pembayaran'
  }

  // Tax rate validation
  if (formData.taxRate < 0 || formData.taxRate > 100) {
    errors.taxRate = 'Kadar cukai mesti antara 0% hingga 100%'
  }

  // Items validation
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Sila tambah sekurang-kurangnya satu item'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        errors[`item_${index}_description`] = 'Sila masukkan perihalan item'
      }

      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Kuantiti mesti lebih daripada 0'
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_unitPrice`] = 'Harga unit tidak boleh negatif'
      }
    })
  }

  return errors
}

// Validation untuk Delivery Order form
const validateDeliveryOrderForm = (formData) => {
  const errors = {}

  // Required fields
  if (!formData.customerId) errors.customerId = 'Pelanggan diperlukan'
  if (!formData.companyId) errors.companyId = 'Syarikat diperlukan'
  if (!formData.date) errors.date = 'Tarikh diperlukan'
  if (!formData.deliveryDate) errors.deliveryDate = 'Tarikh penghantaran diperlukan'
  if (!formData.deliveryAddress?.trim()) errors.deliveryAddress = 'Alamat penghantaran diperlukan'
  if (!formData.contactPerson?.trim()) errors.contactPerson = 'Nama kontak diperlukan'

  // Date validation
  if (formData.date && formData.deliveryDate) {
    const date = new Date(formData.date)
    const deliveryDate = new Date(formData.deliveryDate)
    if (deliveryDate < date) {
      errors.deliveryDate = 'Tarikh penghantaran tidak boleh lebih awal dari tarikh DO'
    }
  }

  // Phone validation (optional)
  if (formData.contactPhone && !validationRules.phone(formData.contactPhone)) {
    errors.contactPhone = 'Format telefon tidak sah'
  }

  // Items validation
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Sekurang-kurangnya satu item diperlukan'
  } else {
    formData.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors[`items.${index}.description`] = 'Penerangan item diperlukan'
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Kuantiti mesti lebih dari 0'
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        errors[`items.${index}.unitPrice`] = 'Harga unit tidak sah'
      }
    })
  }

  return errors
}

// Generic form validation function
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
