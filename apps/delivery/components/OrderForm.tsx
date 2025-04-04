import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Order } from '../types/Order/Order.type'
import DatePickerField from './DatePickerField'
import StatusPickerField from './StatusPickerField'
import LogisticsInfoField from './LogisticsInfoField'
import SubmitButton from './SubmitButton'
import CancelReasonField from './CancelReasonField'
import PackageImageUpload from './PackageImageUpload'
import Toast from 'react-native-toast-message'

interface OrderFormProps {
  order?: Order | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateOrder: (id: number, data: any) => Promise<boolean>
  onClose: () => void
}

export default function OrderForm({ order, updateOrder, onClose }: OrderFormProps) {
  const [deliveryDate, setDeliveryDate] = useState(order ? new Date(order.expectedDeliveryDate) : new Date())
  const [status, setStatus] = useState(order?.orderStatus || 'Delivered')
  const [packageImage, setPackageImage] = useState(order?.confirmedUrl || null)
  const [thirdPartyLogisticsInfo, setThirdPartyLogisticsInfo] = useState(order?.thirdPartyLogisticsInfo || '')
  const [cancelReason, setCancelReason] = useState(order?.cancellationReason || '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (order) {
      setDeliveryDate(new Date(order.expectedDeliveryDate))
      setStatus(order.orderStatus || 'Delivered')
      setPackageImage(order.confirmedUrl || null)
      setThirdPartyLogisticsInfo(order.thirdPartyLogisticsInfo || '')
      setCancelReason(order.cancellationReason || '')
    }
  }, [order])

  const handleUpdate = async () => {
    setIsLoading(true)

    const isSuccess = await updateOrder(order?.orderId ?? 0, {
      expectedDeliveryDate: deliveryDate.toISOString(),
      thirdPartyLogisticsInfo,
      orderStatus: status,
      confirmedUrl: status === 'Delivered' ? (packageImage ?? '') : '',
      cancellationReason: status === 'CancelledByCompany' ? cancelReason : ''
    })

    setIsLoading(false)

    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Order updated successfully!'
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update order. Please try again.'
      })
    }

    setIsLoading(false)
    onClose()
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View className='p-5 flex-1'>
        <DatePickerField deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} />

        <StatusPickerField status={status} setStatus={setStatus} />

        <LogisticsInfoField value={thirdPartyLogisticsInfo} onChangeText={setThirdPartyLogisticsInfo} />

        {(status === 'Delivered' || status === 'CancelledByCompany') && (
          <PackageImageUpload packageImage={packageImage} setPackageImage={setPackageImage} />
        )}

        {status === 'CancelledByCompany' && <CancelReasonField value={cancelReason} onChangeText={setCancelReason} />}

        <SubmitButton isLoading={isLoading} onPress={handleUpdate} />
      </View>
    </ScrollView>
  )
}
