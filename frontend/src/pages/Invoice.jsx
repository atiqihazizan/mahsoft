import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageWrapper, DataTable, StatusBadge, CurrencyFormat, DateFormat, TableCell, PaymentModal } from '../components'
import { invoicesAPI } from '../utils/apiClient'
import { formatText } from '../utils/textFormatting'

const Invoice = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('active') // Default kepada active
  const [actionLoading, setActionLoading] = useState({})
  const [paymentModal, setPaymentModal] = useState(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const currentYear = new Date().getFullYear()
  const availableYears = (() => {
    const historyInvoices = invoices.filter(inv => inv.status === 'paid' || inv.status === 'cancelled')
    const years = new Set(historyInvoices.map(inv => new Date(inv.date).getFullYear()))
    years.add(currentYear)
    return [...years].sort((a, b) => b - a)
  })()

  // Function to calculate overdue days
  const calculateOverdueDays = (dueDate) => {
    if (!dueDate) return 0
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today - due
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Function to check and update overdue status
  const checkAndUpdateOverdueStatus = async (invoices) => {
    const today = new Date()
    const overdueInvoices = []
    
    for (const invoice of invoices) {
      // Hanya check invoice yang status SENT dan belum overdue
      if (invoice.status === 'sent' && invoice.dueDate) {
        const dueDate = new Date(invoice.dueDate)
        if (today > dueDate) {
          overdueInvoices.push(invoice.id)
        }
      }
    }
    
    // Update status kepada OVERDUE untuk invoice yang lewat
    if (overdueInvoices.length > 0) {
      try {
        await Promise.all(
          overdueInvoices.map(id => 
            invoicesAPI.update(id, { status: 'OVERDUE' })
          )
        )
        console.log(`Updated ${overdueInvoices.length} invoices to OVERDUE status`)
        
        // Update local state untuk invoice yang telah diubah status
        setInvoices(prevInvoices => 
          prevInvoices.map(invoice => 
            overdueInvoices.includes(invoice.id) 
              ? { ...invoice, status: 'overdue' }
              : invoice
          )
        )
      } catch (error) {
        console.error('Error updating overdue status:', error)
      }
    }
  }

  // Function to handle invoice status change
  const handleInvoiceStatusChange = (invoiceId, action) => {
    if (action === 'paid') {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (invoice) setPaymentModal(invoice)
      return
    }

    if (action === 'cancel' && !window.confirm('Are you sure you want to cancel this invoice?')) return

    doAction(invoiceId, action)
  }

  const doAction = async (invoiceId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [invoiceId]: true }))
      
      let response
      if (action === 'cancel') {
        response = await invoicesAPI.update(invoiceId, { status: 'CANCELLED' })
      }

      if (response?.success) {
        const newStatus = action === 'cancel' ? 'cancelled' : action
        setInvoices(prev => prev.map(invoice => invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice))
      } else {
        const errorMessage = response?.message || response?.error || 'Unknown error'
        const statusMessages = { 400: `Invalid request: ${errorMessage}`, 404: 'Invoice not found', 500: `Server error: ${errorMessage}` }
      }
    } catch (error) {
      console.error(`Error ${action}ing invoice: ${error.message}`)
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceId]: false }))
    }
  }

  const handlePaymentConfirm = async ({ paidDate, paymentRef }) => {
    const invoice = paymentModal
    setPaymentModal(null)
    try {
      setActionLoading(prev => ({ ...prev, [invoice.id]: true }))
      const response = await invoicesAPI.markPaid(invoice.id, {
        paidAmount: invoice.amount,
        paidDate,
        paymentRef
      })
      if (response?.success) {
        setInvoices(prev => prev.map(inv =>
          inv.id === invoice.id ? { ...inv, status: 'paid' } : inv
        ))
        const receiptResponse = await invoicesAPI.issueReceipt(invoice.id)
        if (receiptResponse?.success) {
          setInvoices(prev => prev.map(inv =>
            inv.id === invoice.id ? { ...inv, hasReceipt: true } : inv
          ))
        }
      }
    } catch (err) {
      console.error('Error marking paid:', err)
    } finally {
      setActionLoading(prev => ({ ...prev, [invoice.id]: false }))
    }
  }

  const handleIssueReceipt = async (row) => {
    try {
      setActionLoading(prev => ({ ...prev, [row.id]: true }))
      const response = await invoicesAPI.issueReceipt(row.id)
      if (response?.success) {
        setInvoices(prev => prev.map(inv =>
          inv.id === row.id ? { ...inv, hasReceipt: true } : inv
        ))
      } else {
        alert(response?.message || response?.error || 'Gagal menerbitkan resit')
      }
    } catch (err) {
      console.error('Error issuing receipt:', err)
      alert('Ralat menerbitkan resit')
    } finally {
      setActionLoading(prev => ({ ...prev, [row.id]: false }))
    }
  }

  // Function to handle convert to delivery order
  const handleConvertToDeliveryOrder = async (invoiceId) => {
    const confirmMessage = 'Are you sure you want to create a Delivery Order from this invoice?'
    
    if (!window.confirm(confirmMessage)) {
      return // User cancelled, exit function
    }

    try {
      setActionLoading(prev => ({ ...prev, [invoiceId]: true }))
      
      const response = await invoicesAPI.convertToDeliveryOrder(invoiceId)
      
      if (response?.success) {
        alert(`Delivery Order ${response.data.doNumber} created successfully!`)
        // Optionally navigate to delivery orders page
        // navigate('/delivery-orders')
      } else {
        const errorMessage = response?.message || response?.error || 'Unknown error'
        alert(`Failed to create Delivery Order: ${errorMessage}`)
      }
    } catch (error) {
      alert(`Error creating Delivery Order: ${error.message}`)
      console.error('Error creating Delivery Order:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceId]: false }))
    }
  }

  // Function to fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await invoicesAPI.getAll()
      
      if (response?.success) {
        // Sokong pelbagai struktur respons dan pastikan sentiasa array
        const rawInvoices = response.data?.invoices ?? response.data
        const invoicesArray = Array.isArray(rawInvoices) ? rawInvoices : []

        const transformedInvoices = invoicesArray.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerName: invoice.customer?.name || 'N/A',
          subject: invoice.subject || 'N/A',
          amount: parseFloat(invoice.total),
          status: (invoice.status || 'draft').toLowerCase(),
          date: invoice.date,
          dueDate: invoice.dueDate,
          hasReceipt: (invoice.receipts && invoice.receipts.length > 0) || (invoice._count?.receipts > 0)
        }))
        
        if (transformedInvoices.length === 0) {
          console.warn('No invoice data from API, using empty list')
        }
        
        // Set invoices first
        setInvoices(transformedInvoices)
        
        // Check dan update overdue status selepas set state
        await checkAndUpdateOverdueStatus(transformedInvoices)
      } else {
        console.error('API response not successful when loading invoices:', response)
        setInvoices([])
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch invoices from API (elak double-fetch di StrictMode)
  useEffect(() => {
    let mounted = true
    if (mounted) fetchInvoices()
    return () => { mounted = false }
  }, [])

  // Refresh data when location changes (e.g., after edit)
  useEffect(() => {
    if (location.state?.refresh) fetchInvoices()
  }, [location])

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.subject.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === 'active') return matchesSearch &&
      (invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'overdue')

    if (filterStatus === 'history') {
      const invoiceYear = new Date(invoice.date).getFullYear()
      const isPaid = invoice.status === 'paid'
      const isCancelled = invoice.status === 'cancelled'
      return matchesSearch && (isPaid || isCancelled) && invoiceYear === selectedYear
    }

    return matchesSearch
  })

  // Function to determine button state based on invoice status
  const getButtonState = (row, action) => {
    if (action === 'paid') return row.status === 'draft' || row.status === 'sent' || row.status === 'overdue'
    if (action === 'edit' || action === 'delete') return row.status === 'draft' || row.status === 'sent' || row.status === 'overdue'
    return true
  }

  // Table columns configuration
  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice No',
      headerClassName: 'text-right w-32',
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
      render: (value) => <TableCell value={value} className="text-sm text-gray-600" title={value} />
    },
    {
      key: 'amount',
      header: 'Amount',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-bold',
      render: (value) => <CurrencyFormat amount={value} />
    },
    {
      key: 'status',
      header: 'Status',
      headerClassName: 'text-center',
      cellClassName: 'text-center text-sm',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'date',
      header: 'Date',
      headerClassName: 'text-center w-24',
      cellClassName: 'text-center',
      render: (value) => <DateFormat date={value} />
    },
    ...(filterStatus === 'active' ? [{
      key: 'dueDate',
      header: 'Outstanding',
      headerClassName: 'text-right w-24',
      cellClassName: 'text-right',
      render: (value, row) => {
        if (row.status === 'paid' || row.status === 'cancelled') {
          return <TableCell value="-" className="text-gray-500" />
        }
        const overdueDays = calculateOverdueDays(value)
        return overdueDays > 0 
          ? <TableCell value={`${overdueDays} days`} className="text-red-600 font-medium" />
          : <TableCell value="No overdue" className="text-green-600" />
      }
    }] : [])
  ]
  // Table actions configuration
  return (
    <PageWrapper
      title="INVOICE MANAGEMENT"
      newButtonText="+ CREATE NEW INVOICE"
      onNewClick={() => navigate('/invoices/new')}
      buttonColor="blue"
      filterOptions={["ACTIVE", "HISTORY"]}
      activeFilter={{ 'active': 'ACTIVE', 'history': 'HISTORY' }[filterStatus] || 'ACTIVE'}
      onFilterChange={(filter) => {
        const statusMap = { 'ACTIVE': 'active', 'HISTORY': 'history' }
        setFilterStatus(statusMap[filter] || 'active')
      }}
      additionalActions={[
        {
          label: 'Refresh',
          onClick: fetchInvoices,
          className: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm'
        }
      ]}
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
        data={filteredInvoices}
        columns={columns}
        loading={loading}
        actionLoading={actionLoading}
        getButtonState={getButtonState}
        onPaid={filterStatus !== 'history' ? (row) => handleInvoiceStatusChange(row.id, 'paid') : null}
        onIssueReceipt={(row) => handleIssueReceipt(row)}
        onView={(row) => navigate(`/invoices/${row.id}`)}
        customLabels={{ view: 'Open' }}
        onDuplicate={async (row) => {
          const duplicateData = { ...row }
          delete duplicateData.id
          localStorage.setItem('duplicateInvoiceData', JSON.stringify(duplicateData))
          navigate('/invoices/new?duplicate=1')
        }}
        onConvert={(row) => handleConvertToDeliveryOrder(row.id)}
        onDelete={filterStatus === 'active' ? async (row) => {
          const isActive = row.status === 'draft' || row.status === 'sent' || row.status === 'overdue'
          if (isActive && confirm('Are you sure you want to delete this invoice?')) {
            try {
              const response = await invoicesAPI.delete(row.id)
              if (response.success) {
                fetchInvoices()
              } else {
                alert(response.error || 'Failed to delete invoice. Please try again.')
              }
            } catch (error) {
              console.error('Error deleting invoice:', error)
              alert('An error occurred while deleting invoice. Please try again.')
            }
          } else if (!isActive) {
            alert('Only active invoices can be deleted')
          }
        } : null}
        hideActionsForStatus={['cancelled']}
      />
      {paymentModal && (
        <PaymentModal
          invoice={paymentModal}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setPaymentModal(null)}
        />
      )}
    </PageWrapper>
  )
}

export default Invoice

