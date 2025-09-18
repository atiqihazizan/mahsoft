import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { PageWrapper } from '../components'
import { DataTable, StatusBadge, CurrencyFormat, DateFormat, TableCell } from '../components'
import { receiptsAPI } from '../utils/apiClient'
import { formatText } from '../utils/textFormatting'

const Receipt = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { onPreview } = useOutletContext?.() || {}
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('active') // Default kepada active
  const [showHistory, setShowHistory] = useState(false) // Toggle untuk sejarah


  // Function to fetch receipts
  const fetchReceipts = async () => {
    try {
      setLoading(true)
      const response = await receiptsAPI.getAll()

      if (response?.success) {
        // Handle both possible response structures
        const receiptsData = response.data.receipts || response.data || []

        const transformedReceipts = receiptsData.map(receipt => ({
          id: receipt.id,
          receiptNumber: receipt.receiptNumber,
          customerName: receipt.customer?.name || 'N/A',
          amount: parseFloat(receipt.total || 0),
          status: (receipt.status || 'draft').toLowerCase(),
          date: receipt.date,
          subject: receipt.subject || 'N/A',
          // Additional fields for better functionality
          companyName: receipt.company?.name || 'N/A',
          userName: receipt.user?.name || 'N/A',
          subtotal: parseFloat(receipt.subtotal || 0),
          taxAmount: parseFloat(receipt.taxAmount || 0),
          details: receipt.details || [],
          notes: receipt.notes || '',
          createdAt: receipt.createdAt,
          updatedAt: receipt.updatedAt
        }))

        setReceipts(transformedReceipts)
      } else {
        console.warn('API response not successful:', response)
        setReceipts([])
      }
    } catch (error) {
      console.error('Error fetching receipts:', error)
      setReceipts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch receipts from API
  useEffect(() => {
    fetchReceipts()
  }, [])

  // Refresh data when location changes (e.g., after edit)
  useEffect(() => {
    if (location.state?.refresh) fetchReceipts()
  }, [location])

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.notes && receipt.notes.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'active') return matchesSearch && (receipt.status === 'draft' || receipt.status === 'issued')
    if (filterStatus === 'done') return matchesSearch && receipt.status === 'cancelled'
    return matchesSearch
  })

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'Bank Transfer': '🏦',
      'Cash': '💵',
      'Cheque': '📝',
      'Credit Card': '💳'
    }
    return icons[method] || '💰'
  }

  // Debug logging removed for production

  // Table columns configuration
  const columns = [
    {
      key: 'receiptNumber',
      header: 'Receipt No.',
      headerClassName: 'text-center w-32',
      cellClassName: 'text-right',
      render: (value) => <TableCell value={value} className="font-medium text-gray-900" />
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (value) => <TableCell value={value} className="text-sm text-gray-900" title={value} />
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (value) => <TableCell value={value || 'N/A'} className="text-sm text-gray-600" title={value || 'N/A'} />
    },
    {
      key: 'amount',
      header: 'Total Amount',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-bold',
      render: (value) => <CurrencyFormat amount={value} />
    },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   render: (value) => <StatusBadge status={value} />
    // },
    {
      key: 'date',
      header: 'Date',
      cellClassName: 'text-center w-20',
      headerClassName: 'text-center w-20',
      render: (value) => <DateFormat date={value} />
    },
  ]

  // Quick actions tidak diperlukan untuk Resit (tiada paid/accept/reject/dummy)

  // Stats configuration
  const stats = [
    {
      label: 'Total Receipts',
      value: receipts.length,
      icon: '🧾',
      bgGradient: 'bg-purple-500',
      textColor: 'text-white',
      subtitle: `${receipts.length} receipts in total`
    },
    {
      label: 'Issued',
      value: receipts.filter(r => r.status === 'issued').length,
      icon: '✅',
      bgGradient: 'bg-green-500',
      textColor: 'text-white',
      subtitle: 'Issued receipts'
    },
    {
      label: 'Draft',
      value: receipts.filter(r => r.status === 'draft').length,
      icon: '📝',
      bgGradient: 'bg-blue-500',
      textColor: 'text-white',
      subtitle: 'Draft receipts'
    },
    {
      label: 'Cancelled',
      value: receipts.filter(r => r.status === 'cancelled').length,
      icon: '❌',
      bgGradient: 'bg-red-500',
      textColor: 'text-white',
      subtitle: 'Cancelled receipts'
    }
  ]

  // Filter options for history mode
  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <PageWrapper
      title="RECEIPT MANAGEMENT"
      newButtonText="+ CREATE NEW RECEIPT"
      onNewClick={() => navigate('/receipts/new')}
      buttonColor="purple"
      filterOptions={["ALL", "ACTIVE", "DONE"]}
      activeFilter={{ 'all': 'ALL', 'active': 'ACTIVE', 'done': 'DONE' }[filterStatus] || 'ACTIVE'}
      onFilterChange={(filter) => {
        const statusMap = { 'ALL': 'all', 'ACTIVE': 'active', 'DONE': 'done' }
        setFilterStatus(statusMap[filter] || 'active')
      }}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by receipt number, customer, or subject..."
      additionalActions={[
        {
          label: 'Refresh',
          onClick: fetchReceipts,
          className: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm'
        }
      ]}
      stats={stats}
    >
      <DataTable
        data={filteredReceipts}
        columns={columns}
        loading={loading}
        // Tiada quick actions untuk resit
        // onView={(row) => {
        //   // TODO: Implement view receipt functionality
        //   console.log('View receipt:', row.id)
        // }}
        onEdit={(row) => {
          const isActive = row.status === 'draft' || row.status === 'issued'
          isActive ? navigate(`/receipts/${row.id}/edit`) : alert('Only active receipts can be edited')
        }}
        onDuplicate={(row) => {
          const duplicateData = { ...row }
          delete duplicateData.id
          localStorage.setItem('duplicateReceiptData', JSON.stringify(duplicateData))
          navigate('/receipts/new?duplicate=1')
        }}
        onPreview={(row) => {
          onPreview('RECEIPT', row.id)
        }}
        onDelete={async (row) => {
          const isActive = row.status === 'draft' || row.status === 'issued'
          if (isActive && confirm(`Are you sure you want to delete receipt ${row.receiptNumber}?`)) {
            try {
              const response = await receiptsAPI.delete(row.id)
              if (response.success) {
                alert('Receipt deleted successfully')
                fetchReceipts() // Refresh data
              } else {
                alert(response.message || 'Failed to delete receipt')
              }
            } catch (error) {
              console.error('Error deleting receipt:', error)
              alert('Error deleting receipt. Please try again.')
            }
          } else if (!isActive) {
            alert('Only active receipts can be deleted')
          }
        }}
        getButtonState={(row, action) => {
          const isActive = row.status === 'draft' || row.status === 'issued'

          // For non-active receipts, only allow view and duplicate
          if (!isActive) {
            return action === 'view' || action === 'duplicate' || action === 'preview'
          }

          // For active receipts, allow all actions
          return true
        }}
        // Biarkan aksi ditunjukkan untuk semua status; kawal visibility melalui getButtonState
        hideActionsForStatus={[]}
      />
    </PageWrapper>
  )
}

export default Receipt