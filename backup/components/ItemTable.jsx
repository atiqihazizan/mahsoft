import React from 'react'
import { CurrencyFormat } from './index'

const ItemTable = ({ 
  items = [], 
  onItemChange, 
  onAddItem, 
  onRemoveItem, 
  errors = {},
  canRemove = true 
}) => {
  const handleItemChange = (itemId, field, value) => {
    onItemChange(itemId, field, value)
  }

  const handleRemoveItem = (itemId) => {
    if (canRemove && items.length > 1) {
      onRemoveItem(itemId)
    }
  }

  return (
    <div>
      {/* Header dengan butang tambah item */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Item & Perkhidmatan</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-200"
        >
          + Tambah Item
        </button>
      </div>

      {/* Table untuk item */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perihalan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Kuantiti
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Harga Unit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Jumlah
              </th>
              {canRemove && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Tindakan
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* Perihalan */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan perihalan item..."
                  />
                  {errors[`item_${index}_description`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                  )}
                </td>

                {/* Kuantiti */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`item_${index}_quantity`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                  )}
                </td>

                {/* Harga Unit */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`item_${index}_unitPrice`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                  )}
                </td>

                {/* Jumlah */}
                <td className="px-4 py-3">
                  <div className="text-right font-medium text-gray-900">
                    <CurrencyFormat amount={item.amount} />
                  </div>
                </td>

                {/* Tindakan */}
                {canRemove && (
                  <td className="px-4 py-3">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors duration-200"
                        title="Padam item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2">Tiada item ditambah</p>
          <p className="text-sm">Klik "Tambah Item" untuk mula menambah item</p>
        </div>
      )}
    </div>
  )
}

// Component untuk item row yang boleh digunakan secara berasingan
export const ItemRow = ({ 
  item, 
  index, 
  onItemChange, 
  onRemove, 
  errors = {},
  canRemove = true 
}) => {
  const handleItemChange = (field, value) => {
    onItemChange(item.id, field, value)
  }

  return (
    <tr className="hover:bg-gray-50">
      {/* Perihalan */}
      <td className="px-4 py-3">
        <input
          type="text"
          value={item.description}
          onChange={(e) => handleItemChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            errors[`item_${index}_description`] ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Masukkan perihalan item..."
        />
        {errors[`item_${index}_description`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
        )}
      </td>

      {/* Kuantiti */}
      <td className="px-4 py-3">
        <input
          type="number"
          step="0.01"
          min="0"
          value={item.quantity}
          onChange={(e) => handleItemChange('quantity', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors[`item_${index}_quantity`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
        )}
      </td>

      {/* Harga Unit */}
      <td className="px-4 py-3">
        <input
          type="number"
          step="0.01"
          min="0"
          value={item.unitPrice}
          onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors[`item_${index}_unitPrice`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
        )}
      </td>

      {/* Jumlah */}
      <td className="px-4 py-3">
        <div className="text-right font-medium text-gray-900">
          <CurrencyFormat amount={item.amount} />
        </div>
      </td>

      {/* Tindakan */}
      {canRemove && (
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors duration-200"
            title="Padam item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      )}
    </tr>
  )
}

// Component untuk summary total
export const TotalSummary = ({ 
  subtotal, 
  taxRate, 
  taxAmount, 
  total, 
  className = '' 
}) => (
  <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
    <div className="max-w-md ml-auto">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            <CurrencyFormat amount={subtotal} />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cukai ({taxRate}%):</span>
          <span className="font-medium">
            <CurrencyFormat amount={taxAmount} />
          </span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>Jumlah Keseluruhan:</span>
            <span className="text-blue-600">
              <CurrencyFormat amount={total} />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ItemTable
