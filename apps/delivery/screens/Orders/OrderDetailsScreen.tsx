import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useOrderById } from '@apps/delivery/hooks/useOrder'
import { DeliveryOrdersStackParamList } from '@apps/delivery/types/navigationDelivery.type'
import EditOrderButton from '@apps/delivery/components/EditOrderBtn'
import FishOrderTable from '@apps/delivery/components/FishOrderTable'
import OrderDetailCard from '@apps/delivery/components/OrderDetailCard'
import OrderSummary from '@apps/delivery/components/OrderSummaryCard'
import ProgressTracker from '@apps/delivery/components/ProgressTracker'
import Divider from '@shared/components/Divider'
import SubLayout from '@shared/layouts/SubLayout'
import EditOrderModal from '@apps/delivery/components/EditOrderModal'

type OrderDetailScreenRouteProp = RouteProp<DeliveryOrdersStackParamList, 'OrderDetails'>

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>()
  const { orderID } = route.params
  const { order } = useOrderById(orderID)

  const isEditable = order?.orderStatus === 'Delivering'
  const [isModalVisible, setModalVisible] = useState(false)

  const handleEditOrder = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <SubLayout title='Orders' showBackButton={true}>
      <ProgressTracker orderStatus={order?.orderStatus} cancelledReason={order?.cancellationReason} />
      <Divider />
      <OrderDetailCard order={order} />
      <Divider />
      <View className='px-5 py-2'>
        <Text className='text-base font-bold text-black'>Package</Text>
      </View>
      <FishOrderTable order={order} />
      <Divider />
      <View className='px-5 py-2'>
        <Text className='text-base font-bold text-black'>Amount</Text>
      </View>
      <OrderSummary order={order} />
      <EditOrderButton isEditable={isEditable} onPress={handleEditOrder} />
      {isModalVisible && <EditOrderModal orderID={order?.orderId} onClose={closeModal} />}
    </SubLayout>
  )
}
