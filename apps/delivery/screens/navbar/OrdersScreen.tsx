import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import SubLayout from '@shared/layouts/SubLayout'
import { useOrderByAll } from '@apps/delivery/hooks/useOrder'
import OrderCard from '@apps/delivery/components/OrderCard'
import { useNavigation } from '@react-navigation/native'
import { DeliveryOrderStackNavigationProp } from '@apps/delivery/types/navigationDelivery.type'

export default function OrdersScreen() {
  const { orders, error } = useOrderByAll()

  if (error) {
    return (
      <SubLayout title='Orders' showBackButton={false}>
        <View className='p-4'>
          <Text className='text-red-500'>{error}</Text>
        </View>
      </SubLayout>
    )
  }

  const navigation = useNavigation<DeliveryOrderStackNavigationProp>()

  const handleOrderPress = (orderId: number) => {
    navigation.navigate('OrderDetails', { orderID: orderId })
  }

  return (
    <SubLayout title='Orders' showBackButton={false}>
      <ScrollView
        className='p-4 px-5 mt-10'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} onPress={() => handleOrderPress(order.orderId)} />
        ))}
      </ScrollView>
    </SubLayout>
  )
}
