import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import storage from '../utils/storage'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const isLoggedIn = storage.isLoggedIn()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
