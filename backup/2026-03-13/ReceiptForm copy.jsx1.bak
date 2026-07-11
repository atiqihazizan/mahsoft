import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { DocumentForm } from '../components'
import { validateForm } from '../utils/formValidation'
import { customersAPI, companiesAPI, receiptsAPI } from '../utils/apiClient'
import { useAuth } from '../contexts/AuthContext'

const ReceiptForm = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Untuk edit mode
  const isEditMode = Boolean(id)
  const { onPreview } = useOutletContext?.() || {}
  const { user } = useAuth()

  // State untuk data
  const [customers, setCustomers] = useState([])
  const [companies, setCompanies] = useState([])
  const [receiptData, setReceiptData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Transform receipt data untuk form
  const transformReceiptData = (receipt) => {
    if (!receipt) return null

    return {
      id: receipt.id, // Pastikan ID dikekalkan untuk edit mode
      customerId: receipt.customerId,
      companyId: receipt.companyId,
      date: new Date(receipt.date).toISOString().split('T')[0],
      subject: receipt.subject || '',
      notes: receipt.notes || '',
      items: receipt.items?.map((item, index) => ({
        id: index + 1,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
        // DescriptionField properties
        variant: item.variant || 'structured',
        listType: item.listType || 'ul',
        spacing: item.spacing || 'normal'
      })) || [
        {
          id: 1,
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
          // DescriptionField properties
          variant: 'structured',
          listType: 'ul',
          spacing: 'normal'
        }
      ],
      subtotal: parseFloat(receipt.subtotal) || 0,
      taxRate: receipt.taxAmount && receipt.subtotal ? 
        ((parseFloat(receipt.taxAmount) / parseFloat(receipt.subtotal)) * 100) : 6,
      taxAmount: parseFloat(receipt.taxAmount) || 0,
      total: parseFloat(receipt.total) || 0
    }
  }

  // Load data dari API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Prepare API calls
        const apiCalls = [
          customersAPI.getAll({ limit: 1000 }), // Get all customers
          companiesAPI.getAll({ limit: 1000 })  // Get all companies
        ]

        // Add receipt data fetch if in edit mode
        if (isEditMode && id) {
          apiCalls.push(receiptsAPI.getById(id))
        }

        // Fetch data secara parallel
        const responses = await Promise.all(apiCalls)

        // Set customers data
        if (responses[0].success) {
          setCustomers(responses[0].data.customers || responses[0].data)
        } else {
          console.error('Error fetching customers:', responses[0].error)
          setCustomers([])
        }

        // Set companies data
        if (responses[1].success) {
          setCompanies(responses[1].data.companies || responses[1].data)
        } else {
          console.error('Error fetching companies:', responses[1].error)
          setCompanies([])
        }

        // Set receipt data if in edit mode
        if (isEditMode && responses[2]) {
          if (responses[2].success) {
            const transformedData = transformReceiptData(responses[2].data)
            setReceiptData(transformedData)
          } else {
            console.error('Error fetching receipt:', responses[2].error)
            alert('Error loading receipt data. Please try again.')
            navigate('/receipts')
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Set empty arrays jika ada error
        setCustomers([])
        setCompanies([])
        if (isEditMode) {
          alert('Error loading data. Please try again.')
          navigate('/receipts')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isEditMode, id, navigate])

  // Handler untuk submit form
  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      // Validate form
      const errors = validateForm(formData, 'receipt')
      if (Object.keys(errors).length > 0) {
        return
      }

      // Transform form data untuk API
      const apiData = {
        companyId: formData.companyId,
        customerId: formData.customerId,
        date: formData.date,
        subject: formData.subject,
        taxRate: typeof formData.taxRate === 'number' ? formData.taxRate : 0,
        notes: formData.notes,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          // DescriptionField properties
          variant: item.variant || 'structured',
          listType: item.listType || 'ul',
          spacing: item.spacing || 'normal'
        }))
      }

      // Add userId for create mode
      if (!isEditMode) {
        if (!user?.id) {
          alert('User information not found. Please login again.')
          navigate('/login')
          return
        }
        apiData.userId = user.id
      }

      let response
      if (isEditMode) {
        // Update existing receipt
        response = await receiptsAPI.update(id, apiData)
      } else {
        // Create new receipt
        response = await receiptsAPI.create(apiData)
      }

      if (response.success) {
        // Show success message
        // alert(isEditMode ? 'Receipt updated successfully!' : 'Receipt created successfully!')
        
        if (isEditMode) {
          // Refresh data untuk edit mode tanpa navigate
          try {
            const refreshResponse = await receiptsAPI.getById(id)
            if (refreshResponse.success) {
              const transformedData = transformReceiptData(refreshResponse.data)
              setReceiptData(transformedData)
            }
          } catch (refreshError) {
            console.error('Error refreshing receipt data:', refreshError)
          }
        } else {
          // Navigate back to receipts list untuk create mode
          navigate('/receipts', { state: { refresh: true } })
        }
      } else {
        alert(response.error || 'An error occurred while saving receipt. Please try again.')
      }
    } catch (error) {
      console.error('Error saving receipt:', error)
      alert('An error occurred while saving receipt. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handler untuk cancel form
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/receipts')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isEditMode ? 'Loading receipt data...' : 'Loading data...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    // <div className="min-h-screen bg-gray-50">
      <DocumentForm
        type="receipt"
        initialData={receiptData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onPreview={isEditMode ? (() => onPreview('RECEIPT', id)) : undefined}
        loading={submitting}
        customers={customers}
        companies={companies}
      />
    // </div>
  )
}

export default ReceiptForm
