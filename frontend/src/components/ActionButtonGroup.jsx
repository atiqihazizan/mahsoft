import React from 'react'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  PrinterIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const ActionButtonGroup = ({
  // Data untuk action
  data = null,
  
  // Configuration untuk button mana yang diperlukan
  showView = true,
  showEdit = true,
  showDelete = true,
  showPrint = true,
  showDuplicate = false,
  showApprove = false,
  showReject = false,
  showDummy = false,
  showPaid = false,
  showCancel = false,
  showDownload = false,
  showShare = false,
  showConvert = false,
  
  // Custom labels untuk buttons
  customLabels = {},
  
  // Loading states
  loading = {},
  
  // Event handlers
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onPrint = () => {},
  onDuplicate = () => {},
  onApprove = () => {},
  onReject = () => {},
  onDummy = () => {},
  onPaid = () => {},
  onCancel = () => {},
  onDownload = () => {},
  onShare = () => {},
  onConvert = () => {},
  
  // Styling
  size = 'sm',
  className = '',
  
  // Disabled state
  disabled = false
}) => {
  
  const buttonSizes = {
    xs: 'p-1 text-xs',
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-2.5 text-lg'
  }
  
  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  const baseButtonClasses = `
    inline-flex items-center justify-center
    rounded-md border border-gray-300
    bg-white text-gray-700
    hover:bg-gray-50 hover:text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${buttonSizes[size]}
  `.trim()
  
  const actionButtons = [
    // View Button
    {
      key: 'view',
      show: showView,
      icon: EyeIcon,
      label: customLabels.view || 'Lihat',
      onClick: onView,
      loading: loading.view,
      className: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
    },
    
    // Edit Button
    {
      key: 'edit',
      show: showEdit,
      icon: PencilIcon,
      label: customLabels.edit || 'Edit',
      onClick: onEdit,
      loading: loading.edit,
      className: 'text-green-600 hover:bg-green-50 hover:text-green-700'
    },
    
    // Delete Button
    {
      key: 'delete',
      show: showDelete,
      icon: TrashIcon,
      label: customLabels.delete || 'Padam',
      onClick: onDelete,
      loading: loading.delete,
      className: 'text-red-600 hover:bg-red-50 hover:text-red-700'
    },
    
    // Print Button
    {
      key: 'print',
      show: showPrint,
      icon: PrinterIcon,
      label: customLabels.print || 'Cetak',
      onClick: onPrint,
      loading: loading.print,
      className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
    },
    
    // Duplicate Button
    {
      key: 'duplicate',
      show: showDuplicate,
      icon: DocumentDuplicateIcon,
      label: customLabels.duplicate || 'Salin',
      onClick: onDuplicate,
      loading: loading.duplicate,
      className: 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
    },
    
    // Approve Button
    {
      key: 'approve',
      show: showApprove,
      icon: CheckIcon,
      label: customLabels.approve || 'Lulus',
      onClick: onApprove,
      loading: loading.approve,
      className: 'text-green-600 hover:bg-green-50 hover:text-green-700'
    },
    
    // Reject Button
    {
      key: 'reject',
      show: showReject,
      icon: XMarkIcon,
      label: customLabels.reject || 'Tolak',
      onClick: onReject,
      loading: loading.reject,
      className: 'text-red-600 hover:bg-red-50 hover:text-red-700'
    },
    
    // Dummy Button
    {
      key: 'dummy',
      show: showDummy,
      icon: ExclamationTriangleIcon,
      label: customLabels.dummy || 'Mark as Dummy',
      onClick: onDummy,
      loading: loading.dummy,
      className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700'
    },
    
    // Paid Button
    {
      key: 'paid',
      show: showPaid,
      icon: CheckIcon,
      label: customLabels.paid || 'Mark as Paid',
      onClick: onPaid,
      loading: loading.paid,
      className: 'text-green-600 hover:bg-green-50 hover:text-green-700'
    },
    
    // Cancel Button
    {
      key: 'cancel',
      show: showCancel,
      icon: XMarkIcon,
      label: customLabels.cancel || 'Cancel Invoice',
      onClick: onCancel,
      loading: loading.cancel,
      className: 'text-red-600 hover:bg-red-50 hover:text-red-700'
    },
    
    // Download Button
    {
      key: 'download',
      show: showDownload,
      icon: ArrowDownTrayIcon,
      label: customLabels.download || 'Muat Turun',
      onClick: onDownload,
      loading: loading.download,
      className: 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
    },
    
    // Share Button
    {
      key: 'share',
      show: showShare,
      icon: ShareIcon,
      label: customLabels.share || 'Kongsi',
      onClick: onShare,
      loading: loading.share,
      className: 'text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700'
    },
    
    // Convert Button (untuk convert quote ke invoice, dll)
    {
      key: 'convert',
      show: showConvert,
      icon: ClockIcon,
      label: customLabels.convert || 'Tukar ke Invoice',
      onClick: onConvert,
      loading: loading.convert,
      className: 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
    }
  ]
  
  const visibleButtons = actionButtons.filter(button => button.show)
  
  if (visibleButtons.length === 0) {
    return null
  }
  
  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {visibleButtons.map((button) => {
        const IconComponent = button.icon
        const isLoading = button.loading || false
        
        return (
          <button
            key={button.key}
            type="button"
            className={`${baseButtonClasses} ${button.className}`}
            onClick={() => button.onClick(data)}
            disabled={disabled || isLoading}
            title={button.label}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" 
                   style={{ width: iconSizes[size].split(' ')[0], height: iconSizes[size].split(' ')[1] }}>
              </div>
            ) : (
              <IconComponent className={iconSizes[size]} />
            )}
            <span className="sr-only">{button.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Preset configurations untuk pelbagai jenis dokumen
export const ActionButtonPresets = {
  // Untuk Quote
  quote: {
    showView: false,
    showEdit: false,
    showDelete: false,
    showPrint: false,
    showDuplicate: false,
    showConvert: false, // Convert to Invoice
    showApprove: true,
    showReject: true,
    showDummy: true,
    customLabels: {
      convert: 'Tukar ke Invoice',
      approve: 'Terima Quote',
      reject: 'Tolak Quote',
      dummy: 'Mark as Dummy'
    }
  },
  
  // Untuk Invoice
  invoice: {
    showView: false,
    showEdit: false,
    showDelete: false,
    showPrint: false,
    showDuplicate: false,
    showDownload: false,
    showShare: false,
    showPaid: true,
    showCancel: true,
    showConvert: true, // Convert to Delivery Order
    customLabels: {
      paid: 'Mark as Paid',
      cancel: 'Cancel Invoice',
      convert: 'Create DO'
    }
  },
  
  // Untuk Receipt
  receipt: {
    showView: true,
    showEdit: true,
    showDelete: true,
    showPrint: true,
    showDuplicate: true,
    showDownload: true,
    customLabels: {
      duplicate: 'Salin Receipt',
      download: 'Muat Turun PDF'
    }
  },
  
  // Untuk Delivery Order
  delivery_order: {
    showView: false,
    showEdit: false,
    showDelete: false,
    showPrint: false,
    showDuplicate: false,
    showDownload: false,
    showShare: false,
    showConfirm: true,
    showDeliver: true,
    showCancel: true,
    customLabels: {
      confirm: 'Confirm DO',
      deliver: 'Mark as Delivered',
      cancel: 'Cancel DO'
    }
  },
  
  // Untuk table rows (minimal actions)
  tableRow: {
    showView: true,
    showEdit: true,
    showDelete: true,
    customLabels: {
      view: 'Lihat Detail',
      edit: 'Edit Item',
      delete: 'Padam Item'
    }
  },
  
  // Untuk view only (read-only)
  viewOnly: {
    showView: true,
    showPrint: true,
    showDownload: true,
    customLabels: {
      view: 'Lihat Detail',
      print: 'Cetak Dokumen',
      download: 'Muat Turun'
    }
  }
}

export default ActionButtonGroup
