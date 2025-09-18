import React, { useState, useEffect } from 'react'
import { StandardPageLayout, StandardTable, StatusBadge, CurrencyFormat, DateFormat } from '../components'
import { invoicesAPI } from '../utils/apiClient'

const Invoice = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // Default kepada all
  const [showHistory, setShowHistory] = useState(false) // Toggle untuk sejarah

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        // const response = await invoicesAPI.getAll()
        
        // if (response && response.success) {
        //   // Transform data untuk frontend
        //   const transformedInvoices = response.data.invoices.map(invoice => ({
        //     id: invoice.id,
        //     invoiceNumber: invoice.invoiceNumber,
        //     customerName: invoice.customer?.name || 'N/A',
        //     amount: parseFloat(invoice.total),
        //     status: invoice.status.toLowerCase(),
        //     date: invoice.createdAt,
        //     dueDate: invoice.dueDate
        //   }))
        //   // Jika tidak ada data dari API, gunakan mock data
        //   if (transformedInvoices.length === 0) {
        //     throw new Error('No data from API')
        //   }
          
        //   setInvoices(transformedInvoices)
        // } else {
        //   throw new Error('API response not successful')
        // }
      } catch (error) {
        // console.error('Error fetching invoices:', error)
        // Fallback ke mock data jika API gagal
        // const mockInvoices = [
        //   {
        //     id: 1,
        //     invoiceNumber: 'INV-2024-001',
        //     customerName: 'Syarikat ABC Sdn Bhd',
        //     amount: 2500.00,
        //     status: 'paid',
        //     date: '2024-01-15',
        //     dueDate: '2024-02-15'
        //   },
        //   {
        //     id: 2,
        //     invoiceNumber: 'INV-2024-002',
        //     customerName: 'XYZ Enterprise',
        //     amount: 1800.50,
        //     status: 'pending',
        //     date: '2024-01-16',
        //     dueDate: '2024-02-16'
        //   },
        //   {
        //     id: 3,
        //     invoiceNumber: 'INV-2024-003',
        //     customerName: 'Tech Solutions Sdn Bhd',
        //     amount: 3200.75,
        //     status: 'overdue',
        //     date: '2024-01-10',
        //     dueDate: '2024-01-25'
        //   },
        //   {
        //     id: 4,
        //     invoiceNumber: 'INV-2024-004',
        //     customerName: 'Digital Corp',
        //     amount: 1500.00,
        //     status: 'pending',
        //     date: '2024-01-20',
        //     dueDate: '2024-02-20'
        //   }
        // ]
        // setInvoices(mockInvoices)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Jika showHistory true, gunakan filter status yang dipilih
    if (showHistory) {
      const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus
      return matchesSearch && matchesFilter
    }
    
    // Jika showHistory false, hanya tunjukkan invoice yang belum dibayar
    const isUnpaid = invoice.status === 'pending' || invoice.status === 'overdue'
    return matchesSearch && isUnpaid
  })

  // Debug logging (remove in production)
  // console.log('Invoices:', invoices)
  // console.log('Filtered invoices:', filteredInvoices)
  // console.log('Show history:', showHistory)
  // console.log('Filter status:', filterStatus)

  // Table columns configuration
  const columns = [
    {
      key: 'invoiceNumber',
      header: 'No. Invois',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'customerName',
      header: 'Pelanggan'
    },
    {
      key: 'amount',
      header: 'Jumlah',
      render: (value) => <CurrencyFormat amount={value} />
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'date',
      header: 'Tarikh',
      render: (value) => <DateFormat date={value} />
    }
  ]

  // Table actions configuration
  const actions = [
    {
      label: 'Lihat',
      className: 'text-blue-600 hover:text-blue-900',
      onClick: (row) => console.log('View invoice:', row.id)
    },
    {
      label: 'Edit',
      className: 'text-green-600 hover:text-green-900',
      onClick: (row) => window.location.href = `/invoices/${row.id}/edit`
    },
    {
      label: 'Padam',
      className: 'text-red-600 hover:text-red-900',
      onClick: (row) => console.log('Delete invoice:', row.id)
    }
  ]

  // Stats configuration
  const stats = [
    {
      label: 'Total Invois',
      value: invoices.length,
      icon: '📄',
      bgGradient: 'bg-blue-500',
      textColor: 'text-white',
      subtitle: '+12% dari bulan lepas'
    },
    {
      label: 'Dibayar',
      value: invoices.filter(inv => inv.status === 'paid').length,
      icon: '✅',
      bgGradient: 'bg-green-500',
      textColor: 'text-white',
      subtitle: 'Pembayaran selesai'
    },
    {
      label: 'Menunggu',
      value: invoices.filter(inv => inv.status === 'pending').length,
      icon: '⏳',
      bgGradient: 'bg-yellow-500',
      textColor: 'text-white',
      subtitle: 'Menunggu pembayaran'
    },
    {
      label: 'Tertunggak',
      value: invoices.filter(inv => inv.status === 'overdue').length,
      icon: '⚠️',
      bgGradient: 'bg-red-500',
      textColor: 'text-white',
      subtitle: 'Perlu tindakan segera'
    }
  ]

  // Filter options for history mode
  const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'overdue', label: 'Tertunggak' }
  ]

  return (
    <StandardPageLayout
      // Header props
      title="Pengurusan Invois"
      subtitle="Urus dan pantau semua invois anda di satu tempat"
      headerGradient="from-blue-500 to-blue-500"
      newItemLink="/invoices/new"
      newItemText="Buat Invois Baru"
      
      // Stats props
      stats={stats}
      
      // Filter props
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari invois atau pelanggan..."
      showHistory={showHistory}
      onToggleHistory={setShowHistory}
      historyButtonText="Tunjuk Sejarah"
      hideHistoryButtonText="Sembunyikan Sejarah"
      showFilter={true}
      filterValue={filterStatus}
      onFilterChange={setFilterStatus}
      filterOptions={filterOptions}
      infoMessage="📋 Menunjukkan hanya invoice yang belum dibayar. Klik 'Tunjuk Sejarah' untuk melihat semua invoice."
      
      // Loading state
      loading={loading}
      loadingText="Memuatkan invois..."
    >
      <StandardTable
        columns={columns}
        data={filteredInvoices}
        actions={actions}
        emptyMessage="Tiada invois untuk dipaparkan"
      />
    </StandardPageLayout>
  )
}

export default Invoice

