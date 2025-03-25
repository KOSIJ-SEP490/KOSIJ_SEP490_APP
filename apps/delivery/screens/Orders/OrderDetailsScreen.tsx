import FishOrderTable from '@apps/delivery/components/FishOrderTable'
import OrderDetailCard from '@apps/delivery/components/OrderDetailCard'
import OrderSummary from '@apps/delivery/components/OrderSummaryCard'
import ProgressTracker from '@apps/delivery/components/ProgressTracker'
import { useOrderById } from '@apps/delivery/hooks/useOrder'
import { DeliveryOrdersStackParamList } from '@apps/delivery/types/navigationDelivery.type'
import { RouteProp, useRoute } from '@react-navigation/native'
import Divider from '@shared/components/Divider'
import SubLayout from '@shared/layouts/SubLayout'
import React from 'react'
import { View, Text } from 'react-native'

type OrderDetailScreenRouteProp = RouteProp<DeliveryOrdersStackParamList, 'OrderDetails'>

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>()
  const { orderID } = route.params
  const { order } = useOrderById(orderID)
  return (
    <SubLayout title='Orders' showBackButton={true}>
      <ProgressTracker orderStatus={order?.orderStatus} />
      <Divider />
      <OrderDetailCard order={order} />
      <Divider />
      <View className='px-5 py-2'>
        <Text className='text-base font-bold'>Package</Text>
      </View>
      <FishOrderTable order={order} />
      <Divider />
      <View className='px-5 py-2'>
        <Text className='text-base font-bold'>Amount</Text>
      </View>
      <OrderSummary order={order} />
    </SubLayout>
  )
}
