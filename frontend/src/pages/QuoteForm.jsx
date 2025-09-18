import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { DocumentForm } from '../components'
import { validateForm } from '../utils/formValidation'
import { customersAPI, companiesAPI, quotesAPI } from '../utils/apiClient'
import { useAuth } from '../contexts/AuthContext'

const QuoteForm = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Untuk edit mode
  const isEditMode = Boolean(id)
  const { onPreview } = useOutletContext?.() || {}
  const { user } = useAuth()

  // State untuk data
  const [customers, setCustomers] = useState([])
  const [companies, setCompanies] = useState([])
  const [quoteData, setQuoteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Transform quote data untuk form
  const transformQuoteData = (quote) => {
    if (!quote) return null

    return {
      id: quote.id, // Pastikan ID dikekalkan untuk edit mode
      customerId: quote.customerId,
      companyId: quote.companyId,
      date: new Date(quote.date).toISOString().split('T')[0],
      validUntil: new Date(quote.validUntil).toISOString().split('T')[0],
      subject: quote.subject || '',
      notes: quote.notes || '',
      items: quote.items?.map((item, index) => ({
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
      subtotal: parseFloat(quote.subtotal) || 0,
      taxRate: quote.taxAmount && quote.subtotal ? 
        ((parseFloat(quote.taxAmount) / parseFloat(quote.subtotal)) * 100) : 6,
      taxAmount: parseFloat(quote.taxAmount) || 0,
      total: parseFloat(quote.total) || 0
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

        // Add quote data fetch if in edit mode
        if (isEditMode && id) {
          apiCalls.push(quotesAPI.getById(id))
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

        // Set quote data if in edit mode
        if (isEditMode && responses[2]) {
          if (responses[2].success) {
            const transformedData = transformQuoteData(responses[2].data)
            setQuoteData(transformedData)
          } else {
            console.error('Error fetching quote:', responses[2].error)
            alert('Error loading quote data. Please try again.')
            navigate('/quotes')
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Set empty arrays jika ada error
        setCustomers([])
        setCompanies([])
        if (isEditMode) {
          alert('Error loading data. Please try again.')
          navigate('/quotes')
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
      const errors = validateForm(formData, 'quote')
      if (Object.keys(errors).length > 0) {
        return
      }

      // Transform form data untuk API
      const apiData = {
        companyId: formData.companyId,
        customerId: formData.customerId,
        date: formData.date,
        validUntil: formData.validUntil,
        subject: formData.subject,
        notes: formData.notes,
        taxRate: typeof formData.taxRate === 'number' ? formData.taxRate : 0,
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
        // Update existing quote
        response = await quotesAPI.update(id, apiData)
      } else {
        // Create new quote
        response = await quotesAPI.create(apiData)
      }

      if (response && response.success) {
        // Show success message
        // alert(isEditMode ? 'Quote updated successfully!' : 'Quote created successfully!')
        
        if (isEditMode) {
          // Refresh data untuk edit mode tanpa navigate
          try {
            const refreshResponse = await quotesAPI.getById(id)
            if (refreshResponse.success) {
              const transformedData = transformQuoteData(refreshResponse.data)
              setQuoteData(transformedData)
            }
          } catch (refreshError) {
            console.error('Error refreshing quote data:', refreshError)
          }
        } else {
          // Navigate back to quotes list untuk create mode
          navigate('/quotes', { state: { refresh: true } })
        }
      } else {
        throw new Error(response?.error || 'API response not successful')
      }
    } catch (error) {
      console.error('Error saving quote:', error)
      alert(`An error occurred while saving quote: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Handler untuk cancel form
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/quotes')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentForm
        type="quote"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onPreview={isEditMode ? (() => onPreview('QUOTATION', id)) : undefined}
        loading={submitting}
        customers={customers}
        companies={companies}
        initialData={quoteData}
      />
    </div>
  )
}

export default QuoteForm
