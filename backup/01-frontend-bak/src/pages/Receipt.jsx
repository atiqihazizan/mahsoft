import React, { useState, useEffect } from 'react'
import { StandardPageLayout, StandardTable, StatusBadge, CurrencyFormat, DateFormat } from '../components'

const Receipt = () => {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data untuk demo
  useEffect(() => {
    const mockReceipts = [
      {
        id: 1,
        receiptNumber: 'RCP-2024-001',
        customerName: 'Syarikat ABC Sdn Bhd',
        amount: 2500.00,
        status: 'completed',
        date: '2024-01-15',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: 2,
        receiptNumber: 'RCP-2024-002',
        customerName: 'XYZ Enterprise',
        amount: 1800.50,
        status: 'pending',
        date: '2024-01-16',
        paymentMethod: 'Cash'
      },
      {
        id: 3,
        receiptNumber: 'RCP-2024-003',
        customerName: 'Tech Solutions Sdn Bhd',
        amount: 3200.75,
        status: 'completed',
        date: '2024-01-10',
        paymentMethod: 'Cheque'
      },
      {
        id: 4,
        receiptNumber: 'RCP-2024-004',
        customerName: 'Digital Corp',
        amount: 4500.00,
        status: 'cancelled',
        date: '2024-01-20',
        paymentMethod: 'Credit Card'
      }
    ]
    
    // setTimeout(() => {
      setReceipts(mockReceipts)
      setLoading(false)
    // }, 1000)
  }, [])

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || receipt.status === filterStatus
    return matchesSearch && matchesFilter
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

  // Table columns configuration
  const columns = [
    {
      key: 'receiptNumber',
      header: 'No. Resit',
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
      key: 'paymentMethod',
      header: 'Kaedah Bayar',
      render: (value) => (
        <div className="flex items-center">
          <span className="mr-2">{getPaymentMethodIcon(value)}</span>
          {value}
        </div>
      )
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
      className: 'text-purple-600 hover:text-purple-900',
      onClick: (row) => console.log('View receipt:', row.id)
    },
    {
      label: 'Edit',
      className: 'text-blue-600 hover:text-blue-900',
      onClick: (row) => window.location.href = `/receipts/${row.id}/edit`
    },
    {
      label: 'Cetak',
      className: 'text-green-600 hover:text-green-900',
      onClick: (row) => console.log('Print receipt:', row.id)
    },
    {
      label: 'Padam',
      className: 'text-red-600 hover:text-red-900',
      onClick: (row) => console.log('Delete receipt:', row.id)
    }
  ]

  // Stats configuration
  const stats = [
    {
      label: 'Total Resit',
      value: receipts.length,
      icon: '🧾',
      bgGradient: 'bg-purple-500',
      textColor: 'text-white',
      subtitle: '+15% dari bulan lepas'
    },
    {
      label: 'Selesai',
      value: receipts.filter(r => r.status === 'completed').length,
      icon: '✅',
      bgGradient: 'bg-green-500',
      textColor: 'text-white',
      subtitle: 'Pembayaran selesai'
    },
    {
      label: 'Menunggu',
      value: receipts.filter(r => r.status === 'pending').length,
      icon: '⏳',
      bgGradient: 'bg-yellow-500',
      textColor: 'text-white',
      subtitle: 'Menunggu pengesahan'
    },
    {
      label: 'Dibatalkan',
      value: receipts.filter(r => r.status === 'cancelled').length,
      icon: '❌',
      bgGradient: 'bg-red-500',
      textColor: 'text-white',
      subtitle: 'Tidak sah'
    }
  ]

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'completed', label: 'Selesai' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ]

  return (
    <StandardPageLayout
      // Header props
      title="Pengurusan Resit"
      subtitle="Urus dan pantau semua resit pembayaran anda di satu tempat"
      headerGradient="from-purple-500 to-purple-500"
      newItemLink="/receipts/new"
      newItemText="Buat Resit Baru"
      
      // Stats props
      stats={stats}
      
      // Filter props
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari resit atau pelanggan..."
      showFilter={true}
      filterValue={filterStatus}
      onFilterChange={setFilterStatus}
      filterOptions={filterOptions}
      
      // Loading state
      loading={loading}
      loadingText="Memuatkan resit..."
    >
      <StandardTable
        columns={columns}
        data={filteredReceipts}
        actions={actions}
        emptyMessage="Tiada resit untuk dipaparkan"
      />
    </StandardPageLayout>
  )
}

export default Receipt
