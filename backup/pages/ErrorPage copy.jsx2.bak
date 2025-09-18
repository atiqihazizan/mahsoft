import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate()
  const error = useRouteError()

  // Function to get error message based on error type
  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: 'Halaman Tidak Ditemui',
        message: 'Maaf, halaman yang anda cari tidak wujud.',
        icon: '⚠️'
      }
    } else if (error?.status === 403) {
      return {
        title: 'Akses Ditolak',
        message: 'Anda tidak mempunyai kebenaran untuk mengakses halaman ini.',
        icon: '⚠️'
      }
    } else if (error?.status === 500) {
      return {
        title: 'Ralat Pelayan',
        message: 'Terdapat masalah dengan pelayan. Sila cuba lagi kemudian.',
        icon: '⚠️'
      }
    } else {
      return {
        title: 'Oops! Something went wrong',
        message: 'We\'re sorry, but something unexpected happened. Please try refreshing the page.',
        icon: '⚠️'
      }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">{errorInfo.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h2>
        <p className="text-gray-600 mb-6">
          {errorInfo.message}
        </p>
        
        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
            <pre className="text-xs text-red-700 whitespace-pre-wrap">
              {error.statusText || error.message || 'Unknown error'}
            </pre>
          </div>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
