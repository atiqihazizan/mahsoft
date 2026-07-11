// API Client utility untuk Mahsoft Frontend
import axios from 'axios'

class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Set token untuk authentication
  setToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`
    } else {
      delete this.defaultHeaders['Authorization']
    }
  }

  // Get token dari localStorage
  getToken() {
    return localStorage.getItem('token')
  }

  // Check if token is expired
  isTokenExpired(token) {
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  // Update headers dengan token semasa
  updateAuthHeader() {
    const token = this.getToken()
    
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      // Clear expired token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.setToken(null)
      return false
    }
    
    this.setToken(token)
    return true
  }

  // Generic request method
  async request(endpoint, options = {}) {
    // Only check token expiry for protected endpoints (not login/register)
    const isProtectedEndpoint = endpoint.includes('/auth/') && 
                               !endpoint.includes('/auth/login') && 
                               !endpoint.includes('/auth/register')
    
    if (isProtectedEndpoint) {
      const tokenValid = this.updateAuthHeader()
      
      // If token is expired, return error immediately
      if (!tokenValid) {
        return {
          success: false,
          error: 'Token expired',
          message: 'Token expired. Please login again.',
          status: 401
        }
      }
    } else {
      // For login/register, just update headers without expiry check
      this.updateAuthHeader()
    }
    
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    }

    try {
      const response = await axios(url, config)
      
      // Axios automatically parses JSON response
      const data = response.data

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
        status: response.status
      }
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const data = error.response.data || {}
        
        // Only log 500 errors (server/database errors) and 401 errors for debugging
        if (error.response.status === 500 || error.response.status === 401) {
          // Handle API error silently
        }
        
        return {
          success: false,
          error: data.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
          message: data.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
          status: error.response.status
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error occurred',
          message: 'Network error occurred'
        }
      } else {
        // Other error
        return {
          success: false,
          error: error.message,
          message: error.message || 'Request error occurred'
        }
      }
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    })
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data: data,
      ...options
    })
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data: data,
      ...options
    })
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    })
  }

  // PATCH request
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data: data,
      ...options
    })
  }
}

// Create API client instance with base URL
// In development, use proxy from vite.config.js
// In production, use environment variable or default to production URL
// const baseURL = import.meta.env.VITE_API_BASE_URL || 
//   (import.meta.env.DEV ? '' : 'https://invoice.mahsites.net')

// Use environment variable or default to empty string for proxy
const baseURL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '' : 'https://invoice.mahsites.net')
const apiClient = new ApiClient(baseURL)

// Auth API methods
export const authAPI = {
  // Login
  login: async (credentials) => {
    return apiClient.post('/api/v1/auth/login', credentials)
  },

  // Register
  register: async (userData) => {
    return apiClient.post('/api/v1/auth/register', userData)
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/api/v1/auth/me')
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiClient.post('/api/v1/auth/change-password', passwordData)
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token')
    apiClient.setToken(null)
  },

  // Refresh token
  refreshToken: async () => {
    return apiClient.post('/api/v1/auth/refresh')
  }
}

// Companies API methods
export const companiesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/companies${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/companies/${id}`)
  },

  create: async (companyData) => {
    return apiClient.post('/api/v1/companies', companyData)
  },

  update: async (id, companyData) => {
    return apiClient.put(`/api/v1/companies/${id}`, companyData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/companies/${id}`)
  }
}

// Customers API methods
export const customersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/customers${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/customers/${id}`)
  },

  create: async (customerData) => {
    return apiClient.post('/api/v1/customers', customerData)
  },

  update: async (id, customerData) => {
    return apiClient.put(`/api/v1/customers/${id}`, customerData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/customers/${id}`)
  }
}

// Invoices API methods
export const invoicesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/invoices${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/invoices/${id}`)
  },

  create: async (invoiceData) => {
    return apiClient.post('/api/v1/invoices', invoiceData)
  },

  update: async (id, invoiceData) => {
    return apiClient.put(`/api/v1/invoices/${id}`, invoiceData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/invoices/${id}`)
  },

  markPaid: async (id, data) => {
    return apiClient.post(`/api/v1/invoices/${id}/mark-paid`, data)
  },

  convertToDeliveryOrder: async (id, deliveryData = {}) => {
    return apiClient.post(`/api/v1/invoices/${id}/convert-to-delivery-order`, deliveryData)
  }
}

// Quotes API methods
export const quotesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/quotes${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/quotes/${id}`)
  },

  create: async (quoteData) => {
    return apiClient.post('/api/v1/quotes', quoteData)
  },

  update: async (id, quoteData) => {
    return apiClient.put(`/api/v1/quotes/${id}`, quoteData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/quotes/${id}`)
  },

  convertToInvoice: async (id, invoiceData) => {
    return apiClient.post(`/api/v1/quotes/${id}/convert-to-invoice`, invoiceData)
  },

  updateStatus: async (id, status) => {
    return apiClient.put(`/api/v1/quotes/${id}`, { status })
  }
}

// Receipts API methods
export const receiptsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/receipts${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/receipts/${id}`)
  },

  create: async (receiptData) => {
    return apiClient.post('/api/v1/receipts', receiptData)
  },

  update: async (id, receiptData) => {
    return apiClient.put(`/api/v1/receipts/${id}`, receiptData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/receipts/${id}`)
  }
}

// Suppliers API methods
export const suppliersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/suppliers${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/suppliers/${id}`)
  },

  create: async (supplierData) => {
    return apiClient.post('/api/v1/suppliers', supplierData)
  },

  update: async (id, supplierData) => {
    return apiClient.put(`/api/v1/suppliers/${id}`, supplierData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/suppliers/${id}`)
  }
}

// Payments API methods
export const paymentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/payments${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/payments/${id}`)
  },

  create: async (paymentData) => {
    return apiClient.post('/api/v1/payments', paymentData)
  },

  update: async (id, paymentData) => {
    return apiClient.put(`/api/v1/payments/${id}`, paymentData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/payments/${id}`)
  }
}

// Debtors API methods
export const debtorsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/debtors${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/debtors/${id}`)
  },

  getSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/debtors/summary${queryString ? `?${queryString}` : ''}`)
  },

  create: async (debtorData) => {
    return apiClient.post('/api/v1/debtors', debtorData)
  },

  update: async (id, debtorData) => {
    return apiClient.put(`/api/v1/debtors/${id}`, debtorData)
  },

  markPaid: async (id) => {
    return apiClient.post(`/api/v1/debtors/${id}/mark-paid`)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/debtors/${id}`)
  }
}

// Users API methods
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/users${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/users/${id}`)
  },

  create: async (userData) => {
    return apiClient.post('/api/v1/users', userData)
  },

  update: async (id, userData) => {
    return apiClient.put(`/api/v1/users/${id}`, userData)
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/users/${id}`)
  }
}

// Delivery Orders API methods
export const deliveryOrdersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/delivery-orders${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/delivery-orders/${id}`)
  },

  getSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/delivery-orders/summary${queryString ? `?${queryString}` : ''}`)
  },

  create: async (deliveryOrderData) => {
    return apiClient.post('/api/v1/delivery-orders', deliveryOrderData)
  },

  update: async (id, deliveryOrderData) => {
    return apiClient.put(`/api/v1/delivery-orders/${id}`, deliveryOrderData)
  },

  updateDelivery: async (id, details) => {
    return apiClient.post(`/api/v1/delivery-orders/${id}/update-delivery`, { details })
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/delivery-orders/${id}`)
  }
}

// Outstanding API methods
export const outstandingAPI = {
  getInvoices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/outstanding/invoices${queryString ? `?${queryString}` : ''}`)
  },

  getDebtors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/outstanding/debtors${queryString ? `?${queryString}` : ''}`)
  },

  getSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/outstanding/summary${queryString ? `?${queryString}` : ''}`)
  },

  getCustomerOutstanding: async (customerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`/api/v1/outstanding/customer/${customerId}${queryString ? `?${queryString}` : ''}`)
  }
}

// Dashboard API methods
export const dashboardAPI = {
  getStats: async () => {
    return apiClient.get('/api/v1/dashboard/stats')
  },

  getRecentActivity: async () => {
    return apiClient.get('/api/v1/dashboard/recent-activity')
  }
}

// Export default API client
export default apiClient
