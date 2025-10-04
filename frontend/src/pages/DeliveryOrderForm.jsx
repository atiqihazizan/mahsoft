import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom'
import { DocumentForm } from '../components'
import { deliveryOrdersAPI, customersAPI, companiesAPI } from '../utils/apiClient'
import { useAuth } from '../contexts/AuthContext'
import { validateForm } from '../utils/formValidation'

const DeliveryOrderForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { onPreview } = useOutletContext?.() || {}
  const { user } = useAuth()
  
  const isEditMode = Boolean(id)
  const fromInvoice = searchParams.get('fromInvoice')
  
  const [submitting, setSubmitting] = useState(false)
  const [customers, setCustomers] = useState([])
  const [companies, setCompanies] = useState([])
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load customers and companies
        const [customersRes, companiesRes] = await Promise.all([
          customersAPI.getAll(),
          companiesAPI.getAll()
        ])
        
        if (customersRes?.success) {
          setCustomers(customersRes.data.customers || [])
        }
        
        if (companiesRes?.success) {
          setCompanies(companiesRes.data.companies || [])
        }

        // Load existing delivery order data for edit mode
        if (isEditMode) {
          const doRes = await deliveryOrdersAPI.getById(id)
          if (doRes?.success) {
            const doData = doRes.data
            
            // Transform delivery order data to form format
            const transformedData = {
              id: doData.id,
              customerId: doData.customerId,
              companyId: doData.companyId,
              date: doData.date ? new Date(doData.date).toISOString().split('T')[0] : '',
              deliveryDate: doData.deliveryDate ? new Date(doData.deliveryDate).toISOString().split('T')[0] : '',
              deliveryAddress: doData.deliveryAddress || '',
              contactPerson: doData.contactPerson || '',
              contactPhone: doData.contactPhone || '',
              notes: doData.notes || '',
              items: doData.details?.map(detail => ({
                id: detail.id,
                description: detail.description,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                amount: detail.amount,
                deliveredQty: detail.deliveredQty || 0,
                // DescriptionField properties
                variant: 'structured',
                listType: 'ul',
                spacing: 'normal'
              })) || [],
              subtotal: parseFloat(doData.subtotal || 0),
              taxAmount: parseFloat(doData.taxAmount || 0),
              total: parseFloat(doData.total || 0)
            }
            
            setInitialData(transformedData)
          }
        }
        
        // Load invoice data if creating from invoice
        if (fromInvoice && !isEditMode) {
          // This would be handled by the parent component or API
          // For now, we'll set default values
          const defaultData = {
            date: new Date().toISOString().split('T')[0],
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            items: [
              {
                id: 1,
                description: '',
                quantity: 1,
                unitPrice: 0,
                amount: 0,
                deliveredQty: 0,
                variant: 'structured',
                listType: 'ul',
                spacing: 'normal'
              }
            ],
            subtotal: 0,
            taxRate: 6,
            taxAmount: 0,
            total: 0
          }
          setInitialData(defaultData)
        }
        
      } catch (error) {
        console.error('Error loading initial data:', error)
        alert('Error loading data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [id, isEditMode, fromInvoice])

  // Handler untuk submit form
  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      // Validate form
      const errors = validateForm(formData, 'delivery_order')
      if (Object.keys(errors).length > 0) {
        return
      }

      // Transform form data untuk API
      const apiData = {
        companyId: formData.companyId,
        customerId: formData.customerId,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        deliveryAddress: formData.deliveryAddress,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        notes: formData.notes,
        details: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.quantity * item.unitPrice,
          deliveredQty: item.deliveredQty || 0
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
        // Update existing delivery order
        response = await deliveryOrdersAPI.update(id, apiData)
      } else {
        // Create new delivery order
        response = await deliveryOrdersAPI.create(apiData)
      }

      if (response.success) {
        // Show success message
        const action = isEditMode ? 'updated' : 'created'
        alert(`Delivery Order ${response.data.doNumber} ${action} successfully!`)
        
        // Navigate back to delivery orders list
        navigate('/delivery-orders')
      } else {
        const errorMessage = response?.message || response?.error || 'Unknown error'
        alert(`Failed to ${isEditMode ? 'update' : 'create'} delivery order: ${errorMessage}`)
      }
    } catch (error) {
      alert(`Error ${isEditMode ? 'updating' : 'creating'} delivery order: ${error.message}`)
      console.error('Error submitting delivery order:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handler untuk cancel
  const handleCancel = () => {
    navigate('/delivery-orders')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isEditMode ? 'Loading delivery order data...' : 'Loading data...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <DocumentForm
      type="delivery_order"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onPreview={isEditMode ? (() => onPreview('DELIVERY_ORDER', id)) : undefined}
      loading={submitting}
      customers={customers}
      companies={companies}
    />
  )
}

export default DeliveryOrderForm
