import React from 'react'
import Tooltip from './Tooltip'

const DataTable = ({
  data = [],
  columns = [],
  onView = null,
  onEdit = null,
  onDelete = null,
  onDuplicate = null,
  onPreview = null,
  // Quick actions (standardized)
  onPaid = null,
  onAccept = null,
  onReject = null,
  onDummy = null,
  onIssueReceipt = null,
  onIssue = null,
  actionLoading = {},
  loading = false,
  getButtonState = null, // Function to determine button state
  hideActionsForStatus = [], // Array of statuses to hide action buttons for
  customLabels = {}, // Custom labels for action buttons e.g. { view: 'Buka' }
  headerClassName = '', // Custom class for table header
  bodyClassName = '', // Custom class for table body
  rowClassName = '' // Custom class for table rows
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading data...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display
      </div>
    )
  }

  // Function to check if actions should be hidden for a row
  const shouldHideActions = (row) => {
    if (!hideActionsForStatus || hideActionsForStatus.length === 0) return false
    return hideActionsForStatus.includes(row.status)
  }

  // Determine availability of action columns (each column auto-hide jika tiada handler)
  const hasQuickActions = Boolean(onPaid || onAccept || onReject || onDummy || onIssueReceipt || onIssue)
  const hasStandardActions = Boolean(onView || onEdit || onDelete || onDuplicate || onPreview)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className={headerClassName || 'bg-gray-50'}>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`text-left py-2 pl-6 font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 ${column.headerClassName || ''}`}
              >
                {column.header}
              </th>
            ))}
            {/* Quick Actions Header */}
            {hasQuickActions && (
              <th className="text-center py-2 pl-6 font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 w-36">
                Quick Actions
              </th>
            )}
            {/* Standard Actions Header */}
            {hasStandardActions && (
              <th className="text-center py-2 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 w-32">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className={bodyClassName || 'bg-white divide-y divide-gray-200'}>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={`hover:bg-gray-50 transition-colors duration-150 ${rowClassName}`}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`py-4 pl-6 text-sm text-gray-900 whitespace-nowrap ${column.cellClassName || ''}`}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {/* Quick Actions Column */}
              {hasQuickActions && (
                <td className="py-4 pl-6 text-sm text-gray-900 whitespace-nowrap text-center">
                  <div className="flex space-x-2 justify-center">
                    {!shouldHideActions(row) && (
                      <>
                        {onPaid && (
                          <Tooltip 
                            content={getButtonState && !getButtonState(row, 'paid') ? 'Cannot mark as paid' : 'Mark invoice as paid'}
                            position="top"
                            delay={300}
                            offset={{ x: -10, y: 0 }}
                          >
                            <button
                              type="button"
                              onClick={() => onPaid(row)}
                              disabled={getButtonState ? !getButtonState(row, 'paid') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                                getButtonState && !getButtonState(row, 'paid')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-green-500 text-green-600 hover:bg-green-50'
                              }`}
                            >
                              Paid
                            </button>
                          </Tooltip>
                        )}
                        {onAccept && (
                          <Tooltip 
                            content={getButtonState && !getButtonState(row, 'accept') ? 'Cannot Accept' : 'Accept'}
                            position="top"
                            delay={300}
                            offset={{ x: -10, y: 0 }}
                          >
                            <button type="button"
                              onClick={() => onAccept(row)}
                              disabled={getButtonState ? !getButtonState(row, 'accept') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'accept')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                              Accept
                            </button>
                          </Tooltip>
                        )}
                        {onReject && (
                          <Tooltip 
                            content={getButtonState && !getButtonState(row, 'reject') ? 'Cannot Reject' : 'Reject'}
                            position="top"
                            delay={300}
                            offset={{ x: -10, y: 0 }}
                          >
                            <button type="button"
                              onClick={() => onReject(row)}
                              disabled={getButtonState ? !getButtonState(row, 'reject') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'reject')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-red-500 text-red-600 hover:bg-red-50'
                                }`}
                            >
                              Reject
                            </button>
                          </Tooltip>
                        )}
                        {onDummy && (
                          <Tooltip 
                            content={getButtonState && !getButtonState(row, 'dummy') ? 'Cannot Dummy' : 'Dummy'}
                            position="top"
                            delay={300}
                            offset={{ x: -10, y: 0 }}
                          >
                            <button type="button"
                              onClick={() => onDummy(row)}
                              disabled={getButtonState ? !getButtonState(row, 'dummy') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'dummy')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-purple-500 text-purple-600 hover:bg-purple-50'
                                }`}
                            >
                              Dummy
                            </button>
                          </Tooltip>
                        )}
                      </>
                    )}
                        {onIssue && row.status === 'draft' && (
                          <Tooltip content="Issue this receipt" position="top" delay={300} offset={{ x: -10, y: 0 }}>
                            <button
                              type="button"
                              onClick={() => onIssue(row)}
                              disabled={actionLoading[row.id]}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                                actionLoading[row.id]
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-purple-500 text-purple-600 hover:bg-purple-50'
                              }`}
                            >
                              {actionLoading[row.id] ? '...' : 'Issue'}
                            </button>
                          </Tooltip>
                        )}
                    {onIssueReceipt && row.status === 'paid' && !row.hasReceipt && (
                      <Tooltip content="Issue Receipt for this invoice" position="top" delay={300} offset={{ x: -10, y: 0 }}>
                        <button
                          type="button"
                          onClick={() => onIssueReceipt(row)}
                          disabled={actionLoading[row.id]}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            actionLoading[row.id]
                              ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                              : 'border-teal-500 text-teal-600 hover:bg-teal-50'
                          }`}
                        >
                          {actionLoading[row.id] ? '...' : 'Issue Receipt'}
                        </button>
                      </Tooltip>
                    )}
                    {onIssueReceipt && row.status === 'paid' && row.hasReceipt && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 text-gray-400 bg-gray-50">
                        Receipt Issued
                      </span>
                    )}
                  </div>
                </td>
              )}
              {/* Standard Actions Column */}
              {hasStandardActions && (
                <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap text-center">
                  <div className="flex space-x-2 justify-center">
                    {onView && (
                      <Tooltip
                        content={getButtonState && !getButtonState(row, 'view') ? 'Cannot View' : customLabels.view || 'View'}
                        position="top"
                        delay={300}
                      >
                        <button type="button"
                          onClick={() => onView(row)}
                          disabled={getButtonState ? !getButtonState(row, 'view') : false}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'view')
                              ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                              : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                          {customLabels.view || 'Open'}
                        </button>
                      </Tooltip>
                    )}
                    {!shouldHideActions(row) && (
                      <>
                        {onEdit && (
                          <Tooltip
                            content={getButtonState && !getButtonState(row, 'edit') ? 'Cannot Edit' : 'Edit'}
                            position="top"
                            delay={300}
                          >
                            <button type="button"
                              onClick={() => onEdit(row)}
                              disabled={getButtonState ? !getButtonState(row, 'edit') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'edit')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-green-500 text-green-600 hover:bg-green-50'
                                }`}
                            >
                              Edit
                            </button>
                          </Tooltip>
                        )}
                        {onPreview && (
                          <Tooltip
                            content={getButtonState && !getButtonState(row, 'preview') ? 'Cannot Preview' : 'Preview'}
                            position="top"
                            delay={300}
                          >
                            <button type="button"
                              onClick={() => onPreview(row)}
                              disabled={getButtonState ? !getButtonState(row, 'preview') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'preview')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                              Preview
                            </button>
                          </Tooltip>
                        )}
                        {onDuplicate && (
                          <Tooltip
                            content={getButtonState && !getButtonState(row, 'duplicate') ? 'Cannot Duplicate' : 'Duplicate'}
                            position="top"
                            delay={300}
                          >
                            <button type="button"
                              onClick={() => onDuplicate(row)}
                              disabled={getButtonState ? !getButtonState(row, 'duplicate') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'duplicate')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-purple-500 text-purple-600 hover:bg-purple-50'
                                }`}
                            >
                              Copy
                            </button>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip
                            content={getButtonState && !getButtonState(row, 'delete') ? 'Cannot Delete' : 'Delete'}
                            position="top"
                            delay={300}
                          >
                            <button type="button"
                              onClick={() => onDelete(row)}
                              disabled={getButtonState ? !getButtonState(row, 'delete') : false}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getButtonState && !getButtonState(row, 'delete')
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                  : 'border-red-500 text-red-600 hover:bg-red-50'
                                }`}
                            >
                              Del
                            </button>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
