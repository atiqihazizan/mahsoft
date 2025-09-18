import React from 'react'
import { Navigate } from 'react-router-dom'

const Settings = () => {
  // Redirect to companies as default
  return <Navigate to="/settings/companies" replace />
}

export default Settings
