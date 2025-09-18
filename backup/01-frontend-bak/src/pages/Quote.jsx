import React, { useState, useEffect } from 'react'
import { StandardPageLayout, StandardTable, StatusBadge, CurrencyFormat, DateFormat } from '../components'

const Quote = () => {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data untuk demo
  useEffect(() => {
    // const mockQuotes = [
    //   {
    //     id: 1,
    //     quoteNumber: 'QT-2024-001',
    //     customerName: 'Syarikat ABC Sdn Bhd',
    //     amount: 2500.00,
    //     status: 'accepted',
    //     date: '2024-01-15',
    //     validUntil: '2024-02-15'
    //   },
    //   {
    //     id: 2,
    //     quoteNumber: 'QT-2024-002',
    //     customerName: 'XYZ Enterprise',
    //     amount: 1800.50,
    //     status: 'pending',
    //     date: '2024-01-16',
    //     validUntil: '2024-02-16'
    //   },
    //   {
    //     id: 3,
    //     quoteNumber: 'QT-2024-003',
    //     customerName: 'Tech Solutions Sdn Bhd',
    //     amount: 3200.75,
    //     status: 'expired',
    //     date: '2024-01-10',
    //     validUntil: '2024-01-25'
    //   },
    //   {
    //     id: 4,
    //     quoteNumber: 'QT-2024-004',
    //     customerName: 'Digital Corp',
    //     amount: 4500.00,
    //     status: 'rejected',
    //     date: '2024-01-20',
    //     validUntil: '2024-02-20'
    //   }
    // ]
    
    // setTimeout(() => {
      // setQuotes(mockQuotes)
      setLoading(false)
    // }, 1000)
  }, [])

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || quote.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Table columns configuration
  const columns = [
    {
      key: 'quoteNumber',
      header: 'No. Sebut Harga',
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
    },
    {
      key: 'validUntil',
      header: 'Sah Hingga',
      render: (value) => <DateFormat date={value} />
    }
  ]

  // Table actions configuration
  const actions = [
    {
      label: 'Lihat',
      className: 'text-green-600 hover:text-green-900',
      onClick: (row) => console.log('View quote:', row.id)
    },
    {
      label: 'Edit',
      className: 'text-blue-600 hover:text-blue-900',
      onClick: (row) => window.location.href = `/quotes/${row.id}/edit`
    },
    {
      label: 'Tukar ke Invois',
      className: 'text-purple-600 hover:text-purple-900',
      onClick: (row) => console.log('Convert to invoice:', row.id)
    },
    {
      label: 'Padam',
      className: 'text-red-600 hover:text-red-900',
      onClick: (row) => console.log('Delete quote:', row.id)
    }
  ]

  // Stats configuration
  const stats = [
    {
      label: 'Total Sebut Harga',
      value: quotes.length,
      icon: '💰',
      bgGradient: 'bg-green-500',
      textColor: 'text-white',
      subtitle: '+8% dari bulan lepas'
    },
    {
      label: 'Diterima',
      value: quotes.filter(q => q.status === 'accepted').length,
      icon: '✅',
      bgGradient: 'bg-blue-500',
      textColor: 'text-white',
      subtitle: 'Diterima pelanggan'
    },
    {
      label: 'Menunggu',
      value: quotes.filter(q => q.status === 'pending').length,
      icon: '⏳',
      bgGradient: 'bg-yellow-500',
      textColor: 'text-white',
      subtitle: 'Menunggu respons'
    },
    {
      label: 'Tamat Tempoh',
      value: quotes.filter(q => q.status === 'expired').length,
      icon: '⚠️',
      bgGradient: 'bg-red-500',
      textColor: 'text-white',
      subtitle: 'Tidak sah lagi'
    }
  ]

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'accepted', label: 'Diterima' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'expired', label: 'Tamat Tempoh' },
    { value: 'rejected', label: 'Ditolak' }
  ]

  return (
    <StandardPageLayout
      // Header props
      title="Pengurusan Sebut Harga"
      subtitle="Urus dan pantau semua sebut harga anda di satu tempat"
      headerGradient="from-green-500 to-green-500"
      newItemLink="/quotes/new"
      newItemText="Buat Sebut Harga Baru"
      
      // Stats props
      stats={stats}
      
      // Filter props
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari sebut harga atau pelanggan..."
      showFilter={true}
      filterValue={filterStatus}
      onFilterChange={setFilterStatus}
      filterOptions={filterOptions}
      
      // Loading state
      loading={loading}
      loadingText="Memuatkan sebut harga..."
    >
      <StandardTable
        columns={columns}
        data={filteredQuotes}
        actions={actions}
        emptyMessage="Tiada sebut harga untuk dipaparkan"
      />
    </StandardPageLayout>
  )
}

export default Quote
