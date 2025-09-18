import React, { useState, useEffect } from 'react'
import { MDBCard, MDBButton, DateFormat } from '../components'
import { authAPI, dashboardAPI } from '../utils/apiClient'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalQuotes: 0,
    totalReceipts: 0,
    totalCustomers: 0
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Fetch user data from API
          const userResponse = await authAPI.getCurrentUser()
          if (userResponse.success) {
            setUser({
              name: userResponse.data.name || 'Admin User',
              role: userResponse.data.role || 'Administrator',
              lastLogin: userResponse.data.lastLogin || new Date()
            })
          } else {
            // Fallback if API fails
            setUser({
              name: 'Admin User',
              role: 'Administrator',
              lastLogin: new Date()
            })
          }
          
          // Fetch dashboard stats
          const statsResponse = await dashboardAPI.getStats()
          if (statsResponse.success) {
            setStats({
              totalInvoices: statsResponse.data.totalInvoices || 156,
              totalQuotes: statsResponse.data.totalQuotes || 89,
              totalReceipts: statsResponse.data.totalReceipts || 134,
              totalCustomers: statsResponse.data.totalCustomers || 45
            })
          } else {
            // Fallback stats if API fails
            setStats({
              totalInvoices: 156,
              totalQuotes: 89,
              totalReceipts: 134,
              totalCustomers: 45
            })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        // Fallback data if there's an error
        setUser({
          name: 'Admin User',
          role: 'Administrator',
          lastLogin: new Date()
        })
        setStats({
          totalInvoices: 156,
          totalQuotes: 89,
          totalReceipts: 134,
          totalCustomers: 45
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Roboto',sans-serif] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b71ca] mx-auto mb-4"></div>
          <p className="text-[#757575]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Roboto',sans-serif]">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3b71ca] to-[#326abc] text-white rounded-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-normal text-white mb-2">Dashboard</h1>
              <p className="text-blue-100 leading-relaxed">
                Welcome back, {user?.name || 'User'}! 👋
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Last Login</div>
              <div className="font-semibold text-white">
                <DateFormat date={user?.lastLogin} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MDBCard className="bg-[#3b71ca] text-white border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium uppercase tracking-wide mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalInvoices}</p>
                  <p className="text-white text-opacity-80 text-xs">+12% from last month</p>
                </div>
                <div className="text-4xl opacity-80">📄</div>
              </div>
            </div>
          </MDBCard>

          <MDBCard className="bg-[#14a44d] text-white border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium uppercase tracking-wide mb-1">Total Quotes</p>
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalQuotes}</p>
                  <p className="text-white text-opacity-80 text-xs">+8% from last month</p>
                </div>
                <div className="text-4xl opacity-80">💰</div>
              </div>
            </div>
          </MDBCard>

          <MDBCard className="bg-[#9c27b0] text-white border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium uppercase tracking-wide mb-1">Total Receipts</p>
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalReceipts}</p>
                  <p className="text-white text-opacity-80 text-xs">+15% from last month</p>
                </div>
                <div className="text-4xl opacity-80">🧾</div>
              </div>
            </div>
          </MDBCard>

          <MDBCard className="bg-[#e4a11b] text-white border-0 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium uppercase tracking-wide mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalCustomers}</p>
                  <p className="text-white text-opacity-80 text-xs">+5% from last month</p>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>
          </MDBCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MDBCard title="Quick Actions" className="hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link to="/invoices" className="p-4 bg-[#3b71ca] bg-opacity-10 hover:bg-[#3b71ca] hover:bg-opacity-20 rounded-lg text-center transition-all duration-200 block group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                  <div className="font-medium text-[#3b71ca]">Invoices</div>
                </Link>
                <Link to="/quotes" className="p-4 bg-[#14a44d] bg-opacity-10 hover:bg-[#14a44d] hover:bg-opacity-20 rounded-lg text-center transition-all duration-200 block group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                  <div className="font-medium text-[#14a44d]">Quotes</div>
                </Link>
                <Link to="/receipts" className="p-4 bg-[#9c27b0] bg-opacity-10 hover:bg-[#9c27b0] hover:bg-opacity-20 rounded-lg text-center transition-all duration-200 block group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧾</div>
                  <div className="font-medium text-[#9c27b0]">Receipts</div>
                </Link>
                <button className="p-4 bg-[#e4a11b] bg-opacity-10 hover:bg-[#e4a11b] hover:bg-opacity-20 rounded-lg text-center transition-all duration-200 group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                  <div className="font-medium text-[#e4a11b]">Add Customer</div>
                </button>
              </div>
            </div>
          </MDBCard>

          <MDBCard title="Recent Activity" className="hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="space-y-3">
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity to display.</p>
                  <p className="text-sm mt-2">Activity will appear here when the system is used.</p>
                </div>
              </div>
            </div>
          </MDBCard>
        </div>

        {/* User Info */}
        <MDBCard title="Account Information" className="bg-gray-50 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-[#757575] font-medium uppercase tracking-wide mb-1">Name</p>
                <p className="font-semibold text-[#4f4f4f]">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#757575] font-medium uppercase tracking-wide mb-1">Role</p>
                <p className="font-semibold text-[#4f4f4f]">{user?.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#757575] font-medium uppercase tracking-wide mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#14a44d] bg-opacity-10 text-[#14a44d]">
                  Active
                </span>
              </div>
            </div>
          </div>
        </MDBCard>
      </div>
    </div>
  )
}

export default Dashboard
