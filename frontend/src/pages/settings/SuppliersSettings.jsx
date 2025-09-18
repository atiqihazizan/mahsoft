import React, { useState, useEffect } from 'react'
import { suppliersAPI } from '../../utils/apiClient'
import SettingsTable from '../../components/SettingsTable'
import SettingsDialog from '../../components/SettingsDialog'

const SuppliersSettings = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDialog, setShowDialog] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: ''
  })

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await suppliersAPI.getAll()
      
      if (response?.success) {
        const suppliersData = response.data.suppliers || response.data || []
        setSuppliers(suppliersData)
      } else {
        console.error('Error fetching suppliers:', response?.message)
        setSuppliers([])
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (isEdit) {
        response = await suppliersAPI.update(editingSupplier.id, formData)
      } else {
        response = await suppliersAPI.create(formData)
      }
      
      if (response?.success) {
        resetForm()
        fetchSuppliers() // Refresh suppliers list
      } else {
        alert(response?.message || `Failed to ${isEdit ? 'update' : 'create'} supplier`)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} supplier:`, error)
      alert(`Error ${isEdit ? 'updating' : 'creating'} supplier. Please try again.`)
    }
  }

  const handleDelete = async (supplierId) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await suppliersAPI.delete(supplierId)
        
        if (response?.success) {
          fetchSuppliers() // Refresh suppliers list
        } else {
          alert(response?.message || 'Failed to delete supplier')
        }
      } catch (error) {
        console.error('Error deleting supplier:', error)
        alert('Error deleting supplier. Please try again.')
      }
    }
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      taxNumber: supplier.taxNumber || ''
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
      email: '',
      phone: '',
      address: '',
      taxNumber: ''
    })
    setEditingSupplier(null)
    setIsEdit(false)
    setShowDialog(false)
  }

  // Define form fields configuration
  const formFields = [
    {
      name: 'name',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'Enter company name'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      placeholder: 'Enter address',
      fullWidth: true
    },
    {
      name: 'taxNumber',
      label: 'Tax Number (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter tax number'
    }
  ]

  // Define table columns
  const columns = [
    {
      key: 'supplier',
      header: 'Supplier',
      render: (supplier) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{supplier.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{supplier.address || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (supplier) => (
        <div>
          <div className="text-sm text-gray-900">{supplier.email || 'N/A'}</div>
          <div className="text-sm text-gray-500">{supplier.phone || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'taxNumber',
      header: 'Tax Number',
      render: (supplier) => (
        <div className="text-sm text-gray-900">
          {supplier.taxNumber || 'N/A'}
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Supplier Dialog */}
      <SettingsDialog
        isOpen={showDialog}
        onClose={resetForm}
        title="Supplier"
        isEdit={isEdit}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
      />

      {/* Suppliers Table */}
      <SettingsTable
        title="Supplier Management"
        description="Manage your supplier information and contacts"
        addButtonText="Add Supplier"
        onAddClick={handleAddNew}
        columns={columns}
        data={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No suppliers found"
      />
    </div>
  )
}

export default SuppliersSettings
