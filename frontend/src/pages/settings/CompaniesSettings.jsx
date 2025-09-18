import React, { useState, useEffect } from 'react'
import { companiesAPI } from '../../utils/apiClient'
import SettingsTable from '../../components/SettingsTable'
import SettingsDialog from '../../components/SettingsDialog'

const CompaniesSettings = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDialog, setShowDialog] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    address: '',
    phone: '',
    email: '',
    taxNumber: '',
    bankholder: '',
    bankname: '',
    bankacc: '',
    bankbranch: '',
    ssm: '',
    manager: '',
    assist: '',
    accountant: '',
    technical: ''
  })

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await companiesAPI.getAll()
      
      if (response?.success) {
        const companiesData = response.data.companies || response.data || []
        setCompanies(companiesData)
      } else {
        console.error('Error fetching companies:', response?.message)
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (isEdit) {
        response = await companiesAPI.update(editingCompany.id, formData)
      } else {
        response = await companiesAPI.create(formData)
      }
      
      if (response?.success) {
        resetForm()
        fetchCompanies() // Refresh companies list
      } else {
        alert(response?.message || `Failed to ${isEdit ? 'update' : 'create'} company`)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} company:`, error)
      alert(`Error ${isEdit ? 'updating' : 'creating'} company. Please try again.`)
    }
  }

  const handleDelete = async (companyId) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        const response = await companiesAPI.delete(companyId)
        
        if (response?.success) {
          fetchCompanies() // Refresh companies list
        } else {
          alert(response?.message || 'Failed to delete company')
        }
      } catch (error) {
        console.error('Error deleting company:', error)
        alert('Error deleting company. Please try again.')
      }
    }
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name || '',
      label: company.label || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      taxNumber: company.taxNumber || '',
      bankholder: company.bankholder || '',
      bankname: company.bankname || '',
      bankacc: company.bankacc || '',
      bankbranch: company.bankbranch || '',
      ssm: company.ssm || '',
      manager: company.manager || '',
      assist: company.assist || '',
      accountant: company.accountant || '',
      technical: company.technical || ''
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
      label: '',
      address: '',
      phone: '',
      email: '',
      taxNumber: '',
      bankholder: '',
      bankname: '',
      bankacc: '',
      bankbranch: '',
      ssm: '',
      manager: '',
      assist: '',
      accountant: '',
      technical: ''
    })
    setEditingCompany(null)
    setIsEdit(false)
    setShowDialog(false)
  }

  // Define form fields configuration
  const formFields = [
    // Basic Information
    {
      name: 'name',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'Enter company name'
    },
    {
      name: 'label',
      label: 'Label',
      type: 'text',
      required: true,
      placeholder: 'Enter company label/description'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
      placeholder: 'Enter company address',
      fullWidth: true,
      rows: 3
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'taxNumber',
      label: 'Tax Number (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter tax number'
    },
    
    // Bank Information
    {
      name: 'bankholder',
      label: 'Bank Account Holder',
      type: 'text',
      required: true,
      placeholder: 'Enter bank account holder name'
    },
    {
      name: 'bankname',
      label: 'Bank Name',
      type: 'text',
      required: true,
      placeholder: 'Enter bank name'
    },
    {
      name: 'bankacc',
      label: 'Bank Account Number',
      type: 'text',
      required: true,
      placeholder: 'Enter bank account number'
    },
    {
      name: 'bankbranch',
      label: 'Bank Branch',
      type: 'text',
      required: true,
      placeholder: 'Enter bank branch'
    },
    
    // Company Details
    {
      name: 'ssm',
      label: 'SSM Registration Number',
      type: 'text',
      required: true,
      placeholder: 'Enter SSM registration number'
    },
    {
      name: 'manager',
      label: 'Manager Name',
      type: 'text',
      required: true,
      placeholder: 'Enter manager name'
    },
    {
      name: 'assist',
      label: 'Assistant Name (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter assistant name'
    },
    {
      name: 'accountant',
      label: 'Accountant Name (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter accountant name'
    },
    {
      name: 'technical',
      label: 'Technical Person Name (Optional)',
      type: 'text',
      required: false,
      placeholder: 'Enter technical person name'
    }
  ]

  // Define table columns
  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (company) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{company.name}</div>
          {company.label && (
            <div className="text-xs text-blue-600 font-medium">{company.label}</div>
          )}
          {company.address && (
            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{company.address}</div>
          )}
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (company) => (
        <div>
          {company.email && (
            <div className="text-sm text-gray-900">{company.email}</div>
          )}
          {company.phone && (
            <div className="text-sm text-gray-500">{company.phone}</div>
          )}
          {company.ssm && (
            <div className="text-xs text-gray-400 mt-1">SSM: {company.ssm}</div>
          )}
        </div>
      )
    },
    {
      key: 'bank',
      header: 'Bank Details',
      render: (company) => (
        <div>
          {company.bankholder && (
            <div className="text-sm font-medium text-gray-900">{company.bankholder}</div>
          )}
          {company.bankname && (
            <div className="text-sm text-gray-500">{company.bankname}</div>
          )}
          {company.bankacc && (
            <div className="text-xs text-gray-400">Acc: {company.bankacc}</div>
          )}
        </div>
      )
    },
    {
      key: 'created',
      header: 'Created',
      render: (company) => (
        <div className="text-sm text-gray-500">
          {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Company Dialog */}
      <SettingsDialog
        isOpen={showDialog}
        onClose={resetForm}
        title="Company"
        isEdit={isEdit}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        fields={formFields}
        loading={loading}
      />

      {/* Companies Table */}
      <SettingsTable
        title="Company Management"
        description="Manage your company information and settings"
        addButtonText="Add Company"
        onAddClick={handleAddNew}
        columns={columns}
        data={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No companies found"
      />
    </div>
  )
}

export default CompaniesSettings
