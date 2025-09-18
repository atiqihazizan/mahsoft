import React, { useState, useEffect } from 'react'
import { customersAPI } from '../../utils/apiClient'
import SettingsTable from '../../components/SettingsTable'
import SettingsDialog from '../../components/SettingsDialog'

const CustomersSettings = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    short: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    attn: '',
    taxNumber: ''
  })

  // Function to truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      short: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      attn: '',
      taxNumber: ''
    })
    setShowDialog(false)
    setIsEdit(false)
    setEditingCustomer(null)
  }

  // Handle edit
  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name || '',
      short: customer.short || '',
      email: customer.email || '',
      phone: customer.phone || '',
      mobile: customer.mobile || '',
      address: customer.address || '',
      attn: customer.attn || '',
      taxNumber: customer.taxNumber || ''
    })
    setIsEdit(true)
    setShowDialog(true)
  }

  // Handle add new
  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customersAPI.getAll()
      
      if (response?.success) {
        const customersData = response.data.customers || response.data || []
        setCustomers(customersData)
      } else {
        console.error('Error fetching customers:', response?.message)
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Filter out empty strings and convert to null for optional fields
    const cleanedFormData = {
      name: formData.name,
      short: formData.short,
      email: formData.email || null,
      phone: formData.phone || null,
      mobile: formData.mobile || null,
      address: formData.address || null,
      attn: formData.attn || null,
      taxNumber: formData.taxNumber || null
    }
    
    try {
      let response
      if (isEdit) {
        response = await customersAPI.update(editingCustomer.id, cleanedFormData)
      } else {
        response = await customersAPI.create(cleanedFormData)
      }
      
      if (response?.success) {
        resetForm()
        fetchCustomers() // Refresh customers list
      } else {
        console.error('Error:', response?.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await customersAPI.delete(customerId)
        
        if (response?.success) {
          fetchCustomers() // Refresh customers list
        } else {
          // Show detailed error message if customer has related records
          const errorMessage = response?.message || 'Failed to delete customer'
          alert(errorMessage)
          // console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Error deleting customer. Please try again.')
      }
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
      name: 'short',
      label: 'Short Name',
      type: 'text',
      required: true,
      placeholder: 'Enter short name'
    },
    {
      name: 'email',
      label: 'Email (Optional)',
      type: 'email',
      required: false,
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      label: 'Phone (Optional)',
      type: 'tel',
      required: false,
      placeholder: 'Enter phone number'
    },
    {
      name: 'mobile',
      label: 'Mobile (Optional)',
      type: 'tel',
      required: false,
      placeholder: 'Enter mobile number'
    },
    {
      name: 'taxNumber',
      label: 'Tax Number (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter tax number'
    },
    {
      name: 'address',
      label: 'Address (Optional)',
      type: 'textarea',
      required: false,
      placeholder: 'Enter address',
      fullWidth: true,
      rows: 3
    },
    {
      name: 'attn',
      label: 'Attention (Attn) (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Contact person name',
      fullWidth: true
    }
  ]

  // Define table columns
  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
          <div className="text-sm text-gray-500" title={customer.address}>
            {truncateText(customer.address, 40)}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      width: 'w-32',
      render: (customer) => (
        <div>
          <div className="text-sm text-gray-900 truncate" title={customer.email}>
            {customer.email}
          </div>
          <div className="text-sm text-gray-500 truncate" title={customer.phone}>
            {customer.phone}
          </div>
        </div>
      )
    },
    {
      key: 'attn',
      header: 'Attn',
      render: (customer) => (
        customer.attn && customer.attn.trim() !== '' ? (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {customer.attn}
          </span>
        ) : (
          <span className="text-gray-400 italic">-</span>
        )
      )
    }
  ]

  return (
    <div>

      {/* Customer Dialog */}
      <SettingsDialog
        isOpen={showDialog}
        onClose={resetForm}
        title="Customer"
        isEdit={isEdit}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
      />

      {/* Customers Table */}
      <SettingsTable
        title="Customer Management"
        description="Manage your customer information and contacts"
        addButtonText="Add Customer"
        onAddClick={handleAddNew}
        columns={columns}
        data={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No customers found"
      />
    </div>
  )
}

export default CustomersSettings
