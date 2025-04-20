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
  UpdatedScreen: { orderId: number }
  OrderDetails: { orderId: number }
  Orders: undefined
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'UpdatedScreen'>
type UpdatedScreenRouteProp = RouteProp<RootStackParamList, 'UpdatedScreen'>

export default function UpdatedScreen() {
  const navigation = useNavigation<NavigationProps>()
  const { fetchOrderDetailed, updateOrder } = useOrders()

  const route = useRoute<UpdatedScreenRouteProp>()
  const { orderId } = route.params

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancellationReason, setCancellationReason] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [fullNameUpdate, setFullNameUpdate] = useState('')
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState('')
  const [deliveryAddressUpdate, setDeliveryAddressUpdate] = useState('')
  const [noteUpdate, setNoteUpdate] = useState('')

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetailed(orderId)

        if (data) {
          setOrder(data)
          setFullNameUpdate(data.fullName || '')
          setPhoneNumberUpdate(data.phoneNumber || '')
          setDeliveryAddressUpdate(data.deliveryAddress || '')
          setNoteUpdate(data.note || '')
        }
      } catch (error) {
        console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    getOrderDetails()
  }, [orderId])

  const handleUpdateOrder = async () => {
    try {
      await updateOrder(
        orderId,
        cancellationReason,
        fullNameUpdate,
        phoneNumberUpdate,
        deliveryAddressUpdate,
        noteUpdate
      )
      Alert.alert('Success', 'Order has been updated.', [{ text: 'OK', onPress: () => navigation.navigate('Orders') }])
    } catch (error) {
      Alert.alert('Error', 'Failed to update the order.')
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
          <Text className='text-lg font-semibold text-center flex-1'>Update Order</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className='mt-3'>
          <Text className='font-bold text-base'>FullName</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10
            }}
            value={fullNameUpdate}
            onChangeText={setFullNameUpdate}
          />
        </View>
        <View className='mt-3'>
          <Text className='font-bold text-base'>Phone Number</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10
            }}
            value={phoneNumberUpdate}
            onChangeText={setPhoneNumberUpdate}
          />
        </View>
        <View className='mt-3'>
          <Text className='font-bold text-base'>Delivery Address</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10
            }}
            value={deliveryAddressUpdate}
            onChangeText={setDeliveryAddressUpdate}
          />
        </View>
        <View className='mt-3'>
          <Text className='font-bold text-base'>Note</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10
            }}
            value={noteUpdate}
            onChangeText={setNoteUpdate}
          />
        </View>
        {/* Cancel Order Button */}
        <View className='mt-3'>
          <TouchableOpacity
            className='w-full h-10 justify-center rounded-lg shadow-md'
            style={{ backgroundColor: '#CA2629' }}
            onPress={() => setModalVisible(true)}
          >
            <Text className='text-white text-center font-bold'>Update Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType='fade'>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-5 rounded-lg w-4/5'>
            <Text className='text-lg font-bold text-center'>Are you sure?</Text>
            <Text className='text-center text-gray-600 mt-2'>Do you really want to update this order?</Text>
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
                  handleUpdateOrder()
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
