import React from 'react'
import { View, Text } from 'react-native'
import { Order } from '../types/Order/Order.type'

interface OrderDetailCardProps {
  order?: Order | null
}

const statusColors: Record<string, { text: string; bg: string; border: string }> = {
  Packaged: { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  Delivering: { text: 'text-white', bg: 'bg-blue', border: 'border-blue-400' },
  Delivered: { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  Cancelled: { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  Refunded: { text: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  Default: { text: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' }
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

  const statusStyle = statusColors[order.orderStatus] || statusColors.Default

  return (
    <View className='bg-white px-2 mx-4 my-4'>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-base font-bold text-gray-900'>Order Information</Text>
        <View className={`px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.border} border`}>
          <Text className={`text-sm font-semibold ${statusStyle.text}`}>{order.orderStatus || 'Unknown'}</Text>
        </View>
      </View>

      <View className='space-y-3 rounded-lg border border-gray-300 px-4 py-5'>
        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs font-semibold text-gray-900 mb-1'>ORDER ID</Text>
            <Text className='text-sm text-gray-500'>{order.orderId || 'N/A'}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-xs font-semibold text-gray-900 mb-1'>ORDER TIME</Text>
            <Text className='text-sm text-gray-500'>{formatDate(order.createdTime)}</Text>
          </View>
        </View>

        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs font-semibold text-gray-900 mb-1'>EXPECTED DELIVERY DATE</Text>
            <Text className='text-sm text-gray-500'>{formatDate(order.expectedDeliveryDate)}</Text>
          </View>
        </View>

        <View className='mt-2'>
          <Text className='text-xs font-semibold text-gray-900 mb-1'>DELIVERY ADDRESS</Text>
          <Text className='text-sm text-gray-500'>{order.deliveryAddress || 'N/A'}</Text>
        </View>

        <View className='flex-row mt-2'>
          <View className='flex-1'>
            <Text className='text-xs font-semibold text-gray-900 mb-1'>PHONE NUMBER</Text>
            <Text className='text-sm text-gray-500'>{order.phoneNumber || 'N/A'}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-xs font-semibold text-gray-900 mb-1'>FARM NAME</Text>
            <Text className='text-sm text-gray-500'>{order.farmName || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default OrderDetailCard
