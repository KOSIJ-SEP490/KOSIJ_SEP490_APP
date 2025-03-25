import React from 'react'
import { View, Text } from 'react-native'
import { Order } from '../types/Order/Order.type'

interface OrderDetailCardProps {
  order?: Order | null
}

const statusColors: Record<string, { text: string; bg: string; border: string }> = {
  Unpackaged: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  Packaged: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Delivering: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  Delivered: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
}

// Function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const OrderDetailCard: React.FC<OrderDetailCardProps> = ({ order }) => {
  if (!order) {
    return (
      <View className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
        <Text className='text-xl font-semibold text-center text-gray-500'>No Order Data Available</Text>
      </View>
    )
  }

  const statusStyle = statusColors[order.orderStatus] || {
    text: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  }

  return (
    <View className='bg-white px-2 mx-4 my-4'>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-base font-bold text-gray-800'>Order Information</Text>
        <View className={`px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.border} border`}>
          <Text className={`text-sm font-semibold ${statusStyle.text}`}>{order.orderStatus || 'Unknown'}</Text>
        </View>
      </View>

      <View className='space-y-3 rounded-lg border border-gray-300 px-4 py-5'>
        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs text-gray-500 mb-1'>ORDER ID</Text>
            <Text className='text-sm font-medium text-gray-800'>{order.orderId || 'N/A'}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-xs text-gray-500 mb-1'>ORDER TIME</Text>
            <Text className='text-sm font-medium text-gray-800'>{formatDate(order.createdTime)}</Text>
          </View>
        </View>

        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs text-gray-500 mb-1'>EXPECTED DELIVERY DATE</Text>
            <Text className='text-sm font-medium text-gray-800'>{formatDate(order.expectedDeliveryDate)}</Text>
          </View>
        </View>

        <View className='mt-2'>
          <Text className='text-xs text-gray-500 mb-1'>DELIVERY ADDRESS</Text>
          <Text className='text-sm font-medium text-gray-800'>{order.deliveryAddress || 'N/A'}</Text>
        </View>

        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs text-gray-500 mb-1'>PHONE NUMBER</Text>
            <Text className='text-sm font-medium text-gray-800'>{order.phoneNumber || 'N/A'}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-xs text-gray-500 mb-1'>FARM NAME</Text>
            <Text className='text-sm font-medium text-gray-800'>{order.farmName || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default OrderDetailCard
