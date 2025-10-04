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
  loading = false,
  getButtonState = null, // Function to determine button state
  hideActionsForStatus = [], // Array of statuses to hide action buttons for
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
  const hasQuickActions = Boolean(onPaid || onAccept || onReject || onDummy)
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
                  {!shouldHideActions(row) && (
                    <div className="flex space-x-2 justify-center">
                      {onPaid && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'paid') ? 'Tidak boleh Paid' : 'Paid'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }} // Sesuaikan x untuk kiri/kanan, y untuk atas/bawah
                        >
                          <button type="button"
                            onClick={() => onPaid(row)}
                            disabled={getButtonState ? !getButtonState(row, 'paid') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'paid')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onAccept && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'accept') ? 'Tidak boleh Accept' : 'Accept'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onAccept(row)}
                            disabled={getButtonState ? !getButtonState(row, 'accept') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'accept')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onReject && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'reject') ? 'Tidak boleh Reject' : 'Reject'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onReject(row)}
                            disabled={getButtonState ? !getButtonState(row, 'reject') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'reject')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onDummy && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'dummy') ? 'Tidak boleh Dummy' : 'Dummy'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onDummy(row)}
                            disabled={getButtonState ? !getButtonState(row, 'dummy') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'dummy')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-purple-600 hover:text-purple-900 hover:bg-purple-50'
                              }`}
                          >
                            {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                            </svg> */}
                            Dummy
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </td>
              )}
              {/* Standard Actions Column */}
              {hasStandardActions && (
                <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap text-center">
                  {!shouldHideActions(row) && (
                    <div className="flex space-x-2 justify-center">
                      {onView && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'view') ? 'Tidak boleh lihat' : 'View'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onView(row)}
                            disabled={getButtonState ? !getButtonState(row, 'view') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'view')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'edit') ? 'Tidak boleh edit' : 'Edit'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }} // Sesuaikan x untuk kiri/kanan, y untuk atas/bawah
                        >
                          <button type="button"
                            onClick={() => onEdit(row)}
                            disabled={getButtonState ? !getButtonState(row, 'edit') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'edit')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onPreview && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'preview') ? 'Tidak boleh preview' : 'Preview'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onPreview(row)}
                            disabled={getButtonState ? !getButtonState(row, 'preview') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'preview')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onDuplicate && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'duplicate') ? 'Tidak boleh salin' : 'Duplicate'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onDuplicate(row)}
                            disabled={getButtonState ? !getButtonState(row, 'duplicate') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'duplicate')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-purple-600 hover:text-purple-900 hover:bg-purple-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip 
                          content={getButtonState && !getButtonState(row, 'delete') ? 'Tidak boleh padam' : 'Delete'}
                          position="top"
                          delay={300}
                          offset={{ x: -10, y: 0 }}
                        >
                          <button type="button"
                            onClick={() => onDelete(row)}
                            disabled={getButtonState ? !getButtonState(row, 'delete') : false}
                            className={`p-2 rounded-md transition-colors ${getButtonState && !getButtonState(row, 'delete')
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  )}
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
