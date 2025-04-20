import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal
} from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { useOrders } from '@apps/customer/hooks/useOrder'

type RootStackParamList = {
  CancelledScreen: { orderId: number }
  OrderDetails: { orderId: number }
  Orders: undefined
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CancelledScreen'>
type CancelledScreenRouteProp = RouteProp<RootStackParamList, 'CancelledScreen'>

export default function CancelledScreen() {
  const navigation = useNavigation<NavigationProps>()
  const { fetchOrderDetails, updateOrder } = useOrders()

  const route = useRoute<CancelledScreenRouteProp>()
  const { orderId } = route.params

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancellationReason, setCancellationReason] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [fullNameUpdate, setFullNameUpdate] = useState('')
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState('')
  const [deliveryAddressUpdate, setDeliveryAddress] = useState('')
  const [noteUpdate, setNoteUpdate] = useState('')

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        setOrder(data)
      } catch (error) {
        console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    getOrderDetails()
  }, [orderId])

  const handleCancelOrder = async () => {
    try {
      await updateOrder(
        orderId,
        cancellationReason,
        fullNameUpdate,
        phoneNumberUpdate,
        deliveryAddressUpdate,
        noteUpdate
      )
      Alert.alert('Success', 'Order has been canceled.', [{ text: 'OK', onPress: () => navigation.navigate('Orders') }])
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel the order.')
    }
  }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  return (
    <ScrollView>
      <View className='flex-1 mt-3 bg-white p-4'>
        {/* Header */}
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: orderId })}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Cancel Order</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          {/* Fish List */}
          <View className='mt-3 border-b border-zinc-300'>
            {order.orderDetails.map((fish: any) => (
              <View className='flex-row items-center mb-3' key={fish.id}>
                <Image source={{ uri: fish.orderDetailImages?.[0]?.imageUrl }} className='w-16 h-12 rounded-lg' />
                <View className='ml-3 flex-1'>
                  <Text className='font-bold'>{fish.variety}</Text>
                </View>
                <Text className='font-bold'>x{fish.quantity}</Text>
                <Text className='ml-2'>{fish.koiPrice} VND</Text>
              </View>
            ))}
          </View>

          {/* Total Price */}
          <Text className='font-bold mt-3 text-right'>Total price: {order.totalAmount}</Text>
        </View>

        {/* Cancellation Warning */}
        <View
          className='mt-3 border rounded-lg justify-center'
          style={{ borderColor: '#ccc', backgroundColor: '#FFF9B7' }}
        >
          <Text className='p-2'>Your Deposit Amount will be lost after canceling this Order</Text>
        </View>

        {/* Cancellation Reason Input */}
        <View className='mt-3'>
          <Text className='font-bold text-base'>
            Canceled Reason <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            multiline
            maxLength={30}
            numberOfLines={3}
            value={cancellationReason}
            onChangeText={setCancellationReason}
          />
        </View>

        {/* Cancel Order Button */}
        <View className='mt-3'>
          <TouchableOpacity
            className='w-full h-10 justify-center rounded-lg shadow-md'
            style={{ backgroundColor: '#CA2629' }}
            onPress={() => setModalVisible(true)}
          >
            <Text className='text-white text-center font-bold'>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType='fade'>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-5 rounded-lg w-4/5'>
            <Text className='text-lg font-bold text-center'>Are you sure?</Text>
            <Text className='text-center text-gray-600 mt-2'>Do you really want to cancel this order?</Text>
            <View className='flex-row justify-between mt-4'>
              <TouchableOpacity
                className='flex-1 mr-2 p-3 bg-gray-300 rounded-lg'
                onPress={() => setModalVisible(false)}
              >
                <Text className='text-center'>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-1 ml-2 p-3 bg-red-600 rounded-lg'
                onPress={() => {
                  setModalVisible(false)
                  handleCancelOrder()
                }}
              >
                <Text className='text-white text-center'>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
