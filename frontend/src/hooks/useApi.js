import { useState, useCallback } from 'react'
import { authAPI } from '../utils/apiClient'

// Custom hook untuk API calls dengan loading dan error states
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      return response
    } catch (err) {
      setError(err.message || 'An error occurred')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    execute,
    reset
  }
}

// Custom hook untuk authentication
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { loading, error, execute } = useApi()

  const login = useCallback(async (credentials) => {
    const response = await execute(() => authAPI.login(credentials))
    
    if (response.success) {
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
    }
    
    return response
  }, [execute])

  const logout = useCallback(() => {
    authAPI.logout()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const getCurrentUser = useCallback(async () => {
    const response = await execute(() => authAPI.getCurrentUser())
    
    if (response.success) {
      setUser(response.data)
      setIsAuthenticated(true)
    } else {
      logout()
    }
    
    return response
  }, [execute, logout])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    getCurrentUser
  }
}

// Custom hook untuk data fetching
export const useData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const { loading, error, execute } = useApi()

  const fetchData = useCallback(async () => {
    const response = await execute(apiCall)
    
    if (response.success) {
      setData(response.data)
    }
    
    return response
  }, [execute, apiCall])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    fetchData,
    refetch
  }
}
