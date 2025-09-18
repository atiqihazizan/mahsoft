import React, { useState, useEffect } from 'react'
import { usersAPI } from '../../utils/apiClient'
import SettingsTable from '../../components/SettingsTable'
import SettingsDialog from '../../components/SettingsDialog'

const UsersSettings = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDialog, setShowDialog] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'USER'
  })

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll()
      
      if (response?.success) {
        const usersData = response.data.users || response.data || []
        setUsers(usersData)
      } else {
        console.error('Error fetching users:', response?.message)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (isEdit) {
        response = await usersAPI.update(editingUser.id, formData)
      } else {
        response = await usersAPI.create(formData)
      }
      
      if (response?.success) {
        resetForm()
        fetchUsers() // Refresh users list
      } else {
        alert(response?.message || `Failed to ${isEdit ? 'update' : 'create'} user`)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} user:`, error)
      alert(`Error ${isEdit ? 'updating' : 'creating'} user. Please try again.`)
    }
  }

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await usersAPI.delete(userId)
        
        if (response?.success) {
          fetchUsers() // Refresh users list
        } else {
          alert(response?.message || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user. Please try again.')
      }
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '', // Don't pre-fill password for security
      role: user.role || 'USER'
    })
    setIsEdit(true)
    setShowDialog(true)
  }

  const handleAddNew = () => {
    resetForm()
    setIsEdit(false)
    setShowDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'USER'
    })
    setEditingUser(null)
    setIsEdit(false)
    setShowDialog(false)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'USER':
        return 'bg-blue-100 text-blue-800'
      case 'VIEWER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Define form fields configuration
  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter full name'
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'USER', label: 'User' },
        { value: 'ADMIN', label: 'Administrator' },
        { value: 'VIEWER', label: 'Viewer' }
      ]
    },
    {
      name: 'password',
      label: isEdit ? 'New Password (Optional)' : 'Password',
      type: 'password',
      required: !isEdit,
      placeholder: isEdit ? 'Leave blank to keep current password' : 'Enter password'
    }
  ]

  // Define table columns
  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                      </div>
                    </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role || 'N/A'}
                    </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user) => (
        <div className="text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </div>
      )
    }
  ]

  return (
    <div>
      {/* User Dialog */}
      <SettingsDialog
        isOpen={showDialog}
        onClose={resetForm}
        title="User"
        isEdit={isEdit}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
      />

      {/* Users Table */}
      <SettingsTable
        title="User Management"
        description="Manage system users and their permissions"
        addButtonText="Add User"
        onAddClick={handleAddNew}
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No users found"
      />
    </div>
  )
}

export default UsersSettings
