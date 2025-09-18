import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { authAPI } from '../utils/apiClient'
import storage from '../utils/storage'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Define handleLogout first
  const handleLogout = useCallback(() => {
    if (isLoggingOut) return // Prevent multiple logout calls
    
    setIsLoggingOut(true)
    
    // Clear storage
    storage.logout()
    
    // Clear state
    setUser(null)
    setIsLoggedIn(false)
    
    // Redirect to login using window.location
    window.location.href = '/login'
  }, [isLoggingOut])

  // Load user data on mount
  useEffect(() => {
    if (isLoggingOut) return // Don't load data if logging out
    
    const loadUserData = async () => {
      const token = storage.getToken()
      const savedUser = storage.getUser()
      
      if (token && savedUser) {
        try {
          // Verify token with server
          const response = await authAPI.getCurrentUser()
          if (response.success) {
            setUser(response.data)
            storage.setUser(response.data)
            setIsLoggedIn(true)
          } else {
            // Token invalid, clear data and redirect
            storage.logout()
            setUser(null)
            setIsLoggedIn(false)
            window.location.href = '/login'
          }
        } catch (error) {
          // Check if it's an authentication error (401)
          if (error.message && error.message.includes('401')) {
            // Token expired or invalid, clear data and redirect
            storage.logout()
            setUser(null)
            setIsLoggedIn(false)
            window.location.href = '/login'
          } else {
            // Fallback to saved user data if server is down
            setUser(savedUser)
            setIsLoggedIn(true)
          }
        }
      } else {
        // No token or user data, just set loading to false
        setUser(null)
        setIsLoggedIn(false)
      }
      setIsLoading(false)
    }

    loadUserData()
  }, [isLoggingOut]) // Add isLoggingOut dependency

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(credentials)
      
      if (response.success) {
        const { token, user: userData } = response.data
        
        // Save to storage
        storage.setToken(token)
        storage.setUser(userData)
        
        // Update state
        setUser(userData)
        setIsLoggedIn(true)
        
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Ralat berlaku semasa log masuk' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    handleLogout()
  }, [handleLogout])

  const updateUser = useCallback((userData) => {
    setUser(userData)
    storage.setUser(userData)
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    updateUser
  }), [user, isLoading, isLoggedIn, login, logout, updateUser])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext