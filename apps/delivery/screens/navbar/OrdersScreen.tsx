import React, { useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import SubLayout from '@shared/layouts/SubLayout'
import { useOrderByAll } from '@apps/delivery/hooks/useOrder'
import OrderCard from '@apps/delivery/components/OrderCard'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { DeliveryOrderStackNavigationProp } from '@apps/delivery/types/navigationDelivery.type'

export default function OrdersScreen() {
  const { orders, error, refetch } = useOrderByAll()
  const navigation = useNavigation<DeliveryOrderStackNavigationProp>()
  const [selectedTab, setSelectedTab] = useState<'Ongoing' | 'History'>('Ongoing')

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  if (error) {
    return (
      <SubLayout title='Orders' showBackButton={false}>
        <View className='p-4'>
          <Text className='text-red-500'>{error}</Text>
        </View>
      </SubLayout>
    )
  }

  const handleOrderPress = (orderId: number) => {
    navigation.navigate('OrderDetails', { orderID: orderId })
  }

  const filteredOrders = orders.filter((order) =>
    selectedTab === 'Ongoing' ? order.orderStatus === 'Delivering' : order.orderStatus !== 'Delivering'
  )

  return (
    <SubLayout title='Orders' showBackButton={false}>
      <View className='flex-row justify-center mt-10'>
        <TouchableOpacity
          className={`px-5 py-3 rounded-lg ${selectedTab === 'Ongoing' ? 'bg-blue' : 'border border-black'}`}
          onPress={() => setSelectedTab('Ongoing')}
        >
          <Text className={selectedTab === 'Ongoing' ? 'text-white' : 'text-black'}>Ongoing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`ml-4 px-5 py-3 rounded-lg ${selectedTab === 'History' ? 'bg-blue' : 'border border-black'}`}
          onPress={() => setSelectedTab('History')}
        >
          <Text className={selectedTab === 'History' ? 'text-white' : 'text-black'}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className='p-4 px-5 mt-2'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} onPress={() => handleOrderPress(order.orderId)} />
          ))
        ) : (
          <Text className='text-center text-gray-500 mt-6'>No orders found.</Text>
        )}
      </ScrollView>
    </SubLayout>
  )
}
