import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { Order } from '../types/Order/Order.type'

interface FishOrderProps {
  order?: Order | null
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN') + ' VND'
}

const FishOrderTable: React.FC<FishOrderProps> = ({ order }) => {
  if (!order || !order.orderDetails.length) {
    return (
      <View className='p-4'>
        <Text className='text-center text-gray-500'>No fish orders available.</Text>
      </View>
    )
  }

  const totalAmount = order.orderDetails.reduce((sum, detail) => sum + detail.koiPrice * detail.quantity, 0)

  return (
    <View>
      <View className='bg-white mx-4 my-2 rounded-lg border border-gray-200 overflow-hidden'>
        <ScrollView horizontal>
          <View>
            <View className='bg-gray-100 px-4 py-3 flex-row border-b border-gray-300'>
              <Text className='w-10 text-sm font-bold text-gray-700 text-center'>No</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Image</Text>
              <Text className='w-32 text-sm font-bold text-gray-700 text-center'>Name</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Quantity</Text>
              <Text className='w-24 text-sm font-bold text-gray-700 text-center'>Unit</Text>
              <Text className='w-32 text-sm font-bold text-gray-700 text-center'>Total</Text>
            </View>

            <ScrollView>
              {order.orderDetails.map((item, index) => {
                const imageUrl =
                  item.orderDetailImages.length > 0
                    ? item.orderDetailImages[0].imageUrl
                    : 'https://via.placeholder.com/50'

                return (
                  <View key={item.id} className='flex-row items-center px-4 py-3 border-b border-gray-200'>
                    <Text className='w-10 text-gray-700 text-center'>{index + 1}</Text>
                    <View className='w-24 flex items-center'>
                      <Image source={{ uri: imageUrl }} className='w-20 h-20 rounded-md' />
                    </View>
                    <Text className='w-32 text-gray-800 font-medium text-center'>{item.variety}</Text>
                    <Text className='w-24 text-gray-800 text-center'>{item.quantity}</Text>
                    <Text className='w-24 text-gray-800 text-center'>{formatCurrency(item.koiPrice)}</Text>
                    <Text className='w-32 text-gray-800 text-center'>
                      {formatCurrency(item.koiPrice * item.quantity)}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <View className='flex-row justify-end px-4 py-3 mb-5'>
        <Text className='text-base font-semibold'>Total Amount: </Text>
        <Text className='text-base font-bold text-red-600'>{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  )
}

export default FishOrderTable
