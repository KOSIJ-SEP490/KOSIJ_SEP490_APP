import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useOrderById, useUpdateOrder } from '@apps/delivery/hooks/useOrder'
import { DeliveryOrdersStackParamList } from '@apps/delivery/types/navigationDelivery.type'
import EditOrderButton from '@apps/delivery/components/EditOrderBtn'
import FishOrderTable from '@apps/delivery/components/FishOrderTable'
import OrderDetailCard from '@apps/delivery/components/OrderDetailCard'
import OrderSummary from '@apps/delivery/components/OrderSummaryCard'
import ProgressTracker from '@apps/delivery/components/ProgressTracker'
import Divider from '@shared/components/Divider'
import SubLayout from '@shared/layouts/SubLayout'
import EditOrderModal from '@apps/delivery/components/EditOrderModal'
import StartOrderButton from '@apps/delivery/components/StartOrderBtn'
import StartSuccessPopup from '@apps/delivery/components/StartSuccessPopup'
import FailSuccessPopup from '@apps/delivery/components/FailSuccessPopup'
import ReportFishDeathButton from '@apps/delivery/components/ReportFishDeathBtn'
import ReportFishDeathModal from '@apps/delivery/components/ReportFishDeathModal'

type OrderDetailScreenRouteProp = RouteProp<DeliveryOrdersStackParamList, 'OrderDetails'>

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>()
  const { orderID } = route.params
  const { order, refetch } = useOrderById(orderID)
  const { updateOrder, isLoading } = useUpdateOrder()

  const isEditable = order?.orderStatus === 'Delivering'
  const isPackaged = order?.orderStatus === 'Packaged'

  const [isModalVisible, setModalVisible] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showFailPopup, setShowFailPopup] = useState(false)
  const [isModalVisible2, setModalVisible2] = useState(false)

  const handleEditOrder = () => setModalVisible(true)

  const handleReport = () => setModalVisible2(true)

  const closeModal = () => {
    setModalVisible(false)
    refetch()
  }

  const closeModal2 = () => {
    setModalVisible2(false)
    refetch()
  }

  const handleStartOrder = async () => {
    if (!order || order.orderStatus !== 'Packaged') return

    const success = await updateOrder(order.orderId, {
      orderStatus: 'Delivering',
      expectedDeliveryDate: order.expectedDeliveryDate,
      thirdPartyLogisticsInfo: order.thirdPartyLogisticsInfo || '',
      confirmedUrl: '',
      cancellationReason: ''
    })

    if (success) {
      setShowSuccessPopup(true)
      refetch()
    } else {
      setShowFailPopup(true)
    }
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

      {isPackaged ? (
        <StartOrderButton onPress={handleStartOrder} disabled={isLoading} />
      ) : (
        <>
          {order?.orderStatus !== 'Delivered' && <EditOrderButton isEditable={isEditable} onPress={handleEditOrder} />}

          {order?.orderStatus === 'Delivered' && <ReportFishDeathButton isReportable={true} onPress={handleReport} />}
        </>
      )}

      {isModalVisible && <EditOrderModal orderID={order?.orderId} onClose={closeModal} />}

      {isModalVisible2 && <ReportFishDeathModal orderID={order?.orderId} onClose={closeModal2} />}

      <StartSuccessPopup isVisible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
      <FailSuccessPopup isVisible={showFailPopup} onClose={() => setShowFailPopup(false)} />
    </SubLayout>
  )
}
