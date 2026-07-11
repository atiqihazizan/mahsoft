import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { PageWrapper, DataTable, StatusBadge, CurrencyFormat, DateFormat, TableCell } from '../components'
import { deliveryOrdersAPI } from '../utils/apiClient'
import { formatText } from '../utils/textFormatting'

const DeliveryOrder = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { onPreview } = useOutletContext?.() || {}
  const [deliveryOrders, setDeliveryOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('active') // Default kepada active
  const [actionLoading, setActionLoading] = useState({})

  // Function to handle delivery order status change
  const handleDeliveryOrderStatusChange = async (doId, action) => {
    const actionText = action === 'confirm' ? 'confirm' : action === 'deliver' ? 'mark as delivered' : 'cancel'
    const confirmMessage = `Are you sure you want to ${actionText} this delivery order?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, [doId]: true }))
      
      let response
      if (action === 'confirm') {
        response = await deliveryOrdersAPI.update(doId, { status: 'CONFIRMED' })
      } else if (action === 'deliver') {
        response = await deliveryOrdersAPI.update(doId, { status: 'DELIVERED' })
      } else if (action === 'cancel') {
        response = await deliveryOrdersAPI.update(doId, { status: 'CANCELLED' })
      }

      if (response?.success) {
        const newStatus = action === 'confirm' ? 'confirmed' : action === 'deliver' ? 'delivered' : 'cancelled'
        setDeliveryOrders(prev => prev.map(deliveryOrder => deliveryOrder.id === doId ? { ...deliveryOrder, status: newStatus } : deliveryOrder))
      } else {
        const errorMessage = response?.message || response?.error || 'Unknown error'
        alert(`Failed to ${action} delivery order: ${errorMessage}`)
      }
    } catch (error) {
      alert(`Error ${action}ing delivery order: ${error.message}`)
      console.error(`Error ${action}ing delivery order:`, error)
    } finally {
      setActionLoading(prev => ({ ...prev, [doId]: false }))
    }
  }

  // Function to fetch delivery orders
  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true)
      const response = await deliveryOrdersAPI.getAll()
      
      if (response?.success) {
        const transformedDOs = (response.data.deliveryOrders || []).map(deliveryOrder => ({
          id: deliveryOrder.id,
          doNumber: deliveryOrder.doNumber,
          customerName: deliveryOrder.customer?.name || 'N/A',
          invoiceNumber: deliveryOrder.invoice?.invoiceNumber || 'N/A',
          amount: parseFloat(deliveryOrder.total),
          status: deliveryOrder.status.toLowerCase(),
          date: deliveryOrder.date,
          deliveryDate: deliveryOrder.deliveryDate,
          deliveryAddress: deliveryOrder.deliveryAddress || 'N/A',
          contactPerson: deliveryOrder.contactPerson || 'N/A'
        }))
        
        setDeliveryOrders(transformedDOs)
      } else {
        throw new Error('API response not successful')
      }
    } catch (error) {
      console.error('Error loading delivery orders:', error)
      // Set empty array instead of throwing error
      setDeliveryOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch delivery orders from API
  useEffect(() => {
    let mounted = true
    if (mounted) fetchDeliveryOrders()
    return () => { mounted = false }
  }, [])

  // Filter delivery orders based on search term and status
  const filteredDeliveryOrders = deliveryOrders.filter(deliveryOrder => {
    const matchesSearch = 
      deliveryOrder.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryOrder.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryOrder.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryOrder.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && ['draft', 'confirmed', 'in_transit'].includes(deliveryOrder.status)) ||
      (filterStatus === 'completed' && deliveryOrder.status === 'delivered') ||
      (filterStatus === 'cancelled' && deliveryOrder.status === 'cancelled')

    return matchesSearch && matchesStatus
  })

  // Button state function
  const getButtonState = (row) => {
    const isLoading = actionLoading[row.id] || false
    return { isLoading }
  }

  // Table columns configuration
  const columns = [
    {
      key: 'doNumber',
      header: 'DO No',
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
      key: 'invoiceNumber',
      header: 'Invoice No',
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
      headerClassName: 'text-right w-24',
      cellClassName: 'text-right',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'date',
      header: 'Date',
      headerClassName: 'text-center w-24',
      cellClassName: 'text-center',
      render: (value) => <DateFormat date={value} />
    },
    {
      key: 'deliveryDate',
      header: 'Delivery Date',
      headerClassName: 'text-center w-24',
      cellClassName: 'text-center',
      render: (value) => <DateFormat date={value} />
    },
    {
      key: 'deliveryAddress',
      header: 'Delivery Address',
      render: (value) => <TableCell value={value} className="text-sm text-gray-600" title={value} />
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      render: (value) => <TableCell value={value} className="text-sm text-gray-600" title={value} />
    }
  ]

  return (
    <PageWrapper
      title="DELIVERY ORDER MANAGEMENT"
      newButtonText="+ CREATE NEW DELIVERY ORDER"
      onNewClick={() => navigate('/delivery-orders/new')}
      buttonColor="orange"
      filterOptions={["ALL", "ACTIVE", "COMPLETED", "CANCELLED"]}
      activeFilter={{ 'all': 'ALL', 'active': 'ACTIVE', 'completed': 'COMPLETED', 'cancelled': 'CANCELLED' }[filterStatus] || 'ACTIVE'}
      onFilterChange={(filter) => {
        const statusMap = { 'ALL': 'all', 'ACTIVE': 'active', 'COMPLETED': 'completed', 'CANCELLED': 'cancelled' }
        setFilterStatus(statusMap[filter] || 'active')
      }}
      additionalActions={[
        {
          label: 'Refresh',
          onClick: fetchDeliveryOrders,
          className: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm'
        }
      ]}
    >
      <DataTable
        data={filteredDeliveryOrders}
        columns={columns}
        loading={loading}
        getButtonState={getButtonState}
        onEdit={(row) => {
          const isActive = row.status === 'draft' || row.status === 'confirmed'
          isActive ? navigate(`/delivery-orders/${row.id}/edit`) : alert('Hanya delivery order yang aktif boleh diedit')
        }}
        onPreview={(row) => {
          onPreview('DELIVERY_ORDER', row.id)
        }}
        onConfirm={(row) => handleDeliveryOrderStatusChange(row.id, 'confirm')}
        onDeliver={(row) => handleDeliveryOrderStatusChange(row.id, 'deliver')}
        onCancel={(row) => handleDeliveryOrderStatusChange(row.id, 'cancel')}
        onDelete={async (row) => {
          const isActive = row.status === 'draft' || row.status === 'confirmed'
          if (isActive && confirm('Are you sure you want to delete this delivery order?')) {
            try {
              const response = await deliveryOrdersAPI.delete(row.id)
              if (response?.success) {
                setDeliveryOrders(prev => prev.filter(deliveryOrder => deliveryOrder.id !== row.id))
              } else {
                alert('Failed to delete delivery order')
              }
            } catch (error) {
              alert(`Error deleting delivery order: ${error.message}`)
              console.error('Error deleting delivery order:', error)
            }
          } else {
            alert('Hanya delivery order yang aktif boleh dipadam')
          }
        }}
        documentType="delivery_order"
        preset="delivery_order"
      />
    </PageWrapper>
  )
}

export default DeliveryOrder
