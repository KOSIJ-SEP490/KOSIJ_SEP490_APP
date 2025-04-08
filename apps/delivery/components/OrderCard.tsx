import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { OrderType } from '../types/Order/Order.type'

interface OrderCardProps {
  order?: OrderType
  onPress?: () => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'packaged':
        return 'text-orange-700 bg-orange-100'
      case 'delivering':
        return 'text-white bg-blue'
      case 'delivered':
        return 'text-green-700 bg-green-100'
      case 'pendingrefund':
        return 'text-cyan-700 bg-cyan-100'
      case 'refunded':
        return 'text-purple-700 bg-purple-100'
      default:
        return 'text-red-500 bg-red-100'
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '0 VND'
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    return `${formattedDate} ${formattedTime}`
  }

  return (
    <Pressable onPress={onPress} className='border border-gray-400 rounded-lg p-5 bg-white mb-4 active:opacity-75'>
      <View className='flex-row justify-between items-start'>
        <Text className='text-sm font-bold'>
          Order ID: <Text className='text-gray-700 font-semibold'>{order?.orderId}</Text>
        </Text>
        <Text className={`${getStatusStyle(order?.orderStatus)} font-bold px-3 py-1 rounded-full text-xs`}>
          {order?.orderStatus}
        </Text>
      </View>

      <View className='h-px bg-gray-100 my-3' />

      <View className='mt-1 space-y-2'>
        <View className='flex-row'>
          <Text className='font-semibold text-gray-800 w-2/5'>Trip Booking ID:</Text>
          <Text className='text-gray-700 flex-1'>{order?.tripBookingId}</Text>
        </View>

        <View className='flex-row'>
          <Text className='font-semibold text-gray-800 w-2/5'>Farm Name:</Text>
          <Text className='text-gray-700 flex-1'>{order?.farmName}</Text>
        </View>

        <View className='flex-row'>
          <Text className='font-semibold text-gray-800 w-2/5'>Expected Day:</Text>
          <Text className='text-gray-700 flex-1'>{formatDate(order?.expectedDeliveryDate)}</Text>
        </View>

        <View className='flex-row'>
          <Text className='font-semibold text-gray-800 w-2/5'>Address:</Text>
          <Text className='text-gray-700 flex-1'>{order?.deliveryAddress}</Text>
        </View>

        <View className='h-px bg-gray-100 my-1' />

        <View className='flex-row mt-1'>
          <Text className='font-semibold text-gray-800 w-2/5'>Amount to collect:</Text>
          <Text className='text-red-600 font-semibold flex-1'>{formatCurrency(order?.remaining)}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default OrderCard
