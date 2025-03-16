import { useOrders } from '@apps/customer/hooks/useOrder'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

type RootStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
}

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchOrders } = useOrders()
  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (error) {
        console.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    getOrders()
  }, [])

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white p-4'>
      {/* Header */}
      <Text className='text-center text-lg font-semibold'>Order History</Text>

      {/* Search & Filter */}
      <View className='flex-row items-center mt-3'>
        <TextInput placeholder='Search' className='flex-1 p-2 border border-gray-300 rounded-lg' />
        <TouchableOpacity className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'>
          <Text>All ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.orderId })}
          >
            {/* Icon */}
            <View className='mr-3'>
              <Text>📦</Text>
            </View>

            {/* Order Details */}
            <View className='flex-1'>
              <Text className='font-semibold'>{item.farmName}</Text>
              <Text className='text-gray-500'>Order ID: {item.orderId}</Text>
              <Text className='text-gray-500'>Customer: {item.fullName}</Text>
              <Text className='text-blue-500'>{new Date(item.createdTime).toLocaleDateString()}</Text>
            </View>

            {/* Status Badge */}
            <View
              className={`px-3 py-1 rounded-full ${item.orderStatus === 'Pending' ? 'bg-yellow-300' : 'bg-green-600'}`}
            >
              <Text className='text-white text-xs'>{item.orderStatus}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
