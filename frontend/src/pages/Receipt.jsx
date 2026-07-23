import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components'
import { DataTable, StatusBadge, CurrencyFormat, DateFormat, TableCell } from '../components'
import { receiptsAPI } from '../utils/apiClient'
import { formatText } from '../utils/textFormatting'

const Receipt = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('active') // Default kepada active
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const currentYear = new Date().getFullYear()

  // Function to fetch receipts
  const fetchReceipts = async () => {
    try {
      setLoading(true)
      const response = await receiptsAPI.getAll()

      if (response?.success) {
        // Handle both possible response structures dan pastikan sentiasa array
        const rawReceipts = response.data?.receipts ?? response.data
        const receiptsData = Array.isArray(rawReceipts) ? rawReceipts : []

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
          details: Array.isArray(receipt.details) ? receipt.details : [],
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

  const availableYears = (() => {
    const historyReceipts = receipts.filter(r =>
      r.status === 'issued' || r.status === 'cancelled'
    )
    const years = new Set(historyReceipts.map(r => new Date(r.date).getFullYear()))
    years.add(currentYear)
    return [...years].sort((a, b) => b - a)
  })()

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.notes && receipt.notes.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterStatus === 'active') return matchesSearch && receipt.status === 'draft'

    if (filterStatus === 'history') {
      const receiptYear = new Date(receipt.date).getFullYear()
      const isDone = receipt.status === 'issued' || receipt.status === 'cancelled'
      return matchesSearch && isDone && receiptYear === selectedYear
    }

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

  return (
    <PageWrapper
      title="RECEIPT MANAGEMENT"
      newButtonText="+ CREATE NEW RECEIPT"
      onNewClick={() => navigate('/receipts/new')}
      buttonColor="purple"
      filterOptions={["ACTIVE", "HISTORY"]}
      activeFilter={{ 'active': 'ACTIVE', 'history': 'HISTORY' }[filterStatus] || 'ACTIVE'}
      onFilterChange={(filter) => {
        const statusMap = { 'ACTIVE': 'active', 'HISTORY': 'history' }
        setFilterStatus(statusMap[filter] || 'active')
      }}
      historyYearAddon={filterStatus === 'history' ? (
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="text-xs border-0 bg-transparent p-0 focus:outline-none focus:ring-0 cursor-pointer"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      ) : null}
    >
      <DataTable
        data={filteredReceipts}
        columns={columns}
        loading={loading}
        onView={(row) => navigate(`/receipts/${row.id}`)}
        onDuplicate={(row) => {
          const duplicateData = { ...row }
          delete duplicateData.id
          localStorage.setItem('duplicateReceiptData', JSON.stringify(duplicateData))
          navigate('/receipts/new?duplicate=1')
        }}
        onDelete={filterStatus === 'active' ? async (row) => {
          const isActive = row.status === 'draft' || row.status === 'issued'
          if (isActive && confirm(`Are you sure you want to delete receipt ${row.receiptNumber}?`)) {
            try {
              const response = await receiptsAPI.delete(row.id)
              if (response.success) {
                alert('Receipt deleted successfully')
                fetchReceipts()
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
        } : null}
        getButtonState={(row, action) => {
          const isActive = row.status === 'draft' || row.status === 'issued'

          // For non-active receipts, only allow view and duplicate
          if (!isActive) {
            return action === 'view' || action === 'duplicate'
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