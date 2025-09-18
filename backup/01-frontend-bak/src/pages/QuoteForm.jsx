import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StandardForm } from '../components'
import { validateForm } from '../utils/formValidation'

const QuoteForm = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Untuk edit mode
  const isEditMode = Boolean(id)

  // State untuk data
  const [customers, setCustomers] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Mock data untuk demo
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock customers data
        const mockCustomers = [
          { id: '1', name: 'Syarikat ABC Sdn Bhd' },
          { id: '2', name: 'XYZ Enterprise' },
          { id: '3', name: 'Tech Solutions Sdn Bhd' },
          { id: '4', name: 'Digital Corp' },
          { id: '5', name: 'Global Tech Malaysia' }
        ]

        // Mock companies data
        const mockCompanies = [
          { id: '1', name: 'Mahsoft Sdn Bhd' },
          { id: '2', name: 'Mahsoft Enterprise' },
          { id: '3', name: 'Mahsoft Holdings' }
        ]

        setCustomers(mockCustomers)
        setCompanies(mockCompanies)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handler untuk submit form
  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      // Validate form
      const errors = validateForm(formData, 'quote')
      if (Object.keys(errors).length > 0) {
        console.error('Validation errors:', errors)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Quote data to submit:', formData)
      
      // Show success message
      alert(isEditMode ? 'Sebut harga berjaya dikemaskini!' : 'Sebut harga berjaya dicipta!')
      
      // Navigate back to quotes list
      navigate('/quotes')
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Ralat berlaku semasa menyimpan sebut harga. Sila cuba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handler untuk cancel form
  const handleCancel = () => {
    if (window.confirm('Adakah anda pasti mahu membatalkan? Perubahan yang tidak disimpan akan hilang.')) {
      navigate('/quotes')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuatkan data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StandardForm
        type="quote"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
        customers={customers}
        companies={companies}
      />
    </div>
  )
}

export default QuoteForm
