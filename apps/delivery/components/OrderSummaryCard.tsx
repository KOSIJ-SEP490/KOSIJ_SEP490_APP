import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Order } from '../types/Order/Order.type'

interface OrderSummaryProps {
  order?: Order | null
}

const formatCurrency = (amount?: number) => {
  return (amount ?? 0).toLocaleString('vi-VN') + ' VND'
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View className='bg-white border border-gray-300 rounded-lg p-4 mx-5 mb-6 mt-2'>
      <View className='flex-row justify-between mb-2'>
        <Text className='text-gray-600 text-base'>Total Amount</Text>
        <Text className='text-gray-800 text-base'>{formatCurrency(order?.totalOrderAmount)}</Text>
      </View>

      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className='flex-row justify-between items-center'>
        <Text className='text-gray-600 text-base'>Deposit Amount (Paid)</Text>
        <Text className='text-gray-800 text-base text-right'>{formatCurrency(order?.paidAmount)}</Text>
      </TouchableOpacity>

      <View className='flex-row justify-between mt-3'>
        <Text className='text-gray-600 text-base'>Amount to collect</Text>
        <Text className='text-red-600 text-base font-bold'>{formatCurrency(order?.totalDeliveringAmount)}</Text>
      </View>
    </View>
  )
}

export default OrderSummary
