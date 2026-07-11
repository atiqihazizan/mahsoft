import React from 'react'
import { useParams } from 'react-router-dom'
import { DocumentPreview } from '../components'
import { deliveryOrdersAPI } from '../utils/apiClient'

const DeliveryOrderPreview = () => {
  const { id } = useParams()
  return (
    <DocumentPreview
      id={id}
      documentType="DELIVERY_ORDER"
      backPath="/delivery-orders"
      editPath={(docId) => `/delivery-orders/${docId}/edit`}
      apiGetById={deliveryOrdersAPI.getById}
    />
  )
}

export default DeliveryOrderPreview
