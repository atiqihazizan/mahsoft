import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoImage from '../assets/logo/logo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Navigation routes configuration
  const navigationRoutes = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      activeClass: 'bg-blue-100 text-blue-700',
      inactiveClass: 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    },
    {
      path: '/invoices',
      label: 'Invoices',
      activeClass: 'bg-blue-100 text-blue-700',
      inactiveClass: 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
    },
    {
      path: '/quotes',
      label: 'Quotes',
      activeClass: 'bg-green-100 text-green-700',
      inactiveClass: 'text-gray-700 hover:text-green-700 hover:bg-gray-100'
    },
    {
      path: '/receipts',
      label: 'Receipts',
      activeClass: 'bg-purple-100 text-purple-700',
      inactiveClass: 'text-gray-700 hover:text-purple-700 hover:bg-gray-100'
    },
    {
      path: '/delivery-orders',
      label: 'Delivery Orders',
      activeClass: 'bg-orange-100 text-orange-700',
      inactiveClass: 'text-gray-700 hover:text-orange-700 hover:bg-gray-100'
    },
    // {
    //   path: '/settings',
    //   label: 'Settings',
    //   activeClass: 'bg-gray-100 text-gray-700',
    //   inactiveClass: 'text-gray-700 hover:text-gray-700 hover:bg-gray-100'
    // }
  ]

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src={logoImage} 
                alt="Mahsoft Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">MAHSOFT</span>
            </Link>
          </div>

          {/* Navigation */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationRoutes.map((route) => (
                <NavLink 
                  key={route.path}
                  to={route.path} 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? route.activeClass
                        : route.inactiveClass
                    }`
                  }
                >
                  {route.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 text-sm rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name || 'Admin User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role || 'Administrator'}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                      <span className="text-white font-bold text-lg">
                        {(user?.name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {(user?.name || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {user?.name || 'Admin User'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user?.email || 'admin@mahsoft.com'}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {user?.role || 'Administrator'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 mr-3 transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">Settings</div>
                          <div className="text-xs text-gray-500">Manage your preferences</div>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 mr-3 transition-colors">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">Logout</div>
                          <div className="text-xs text-gray-500">Sign out of system</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
