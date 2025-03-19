import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react-native'
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
import { useOrders } from '../api/useOrder.api'
import Steps from './Steps.container'
import { Picker } from '@react-native-picker/picker'

type RootStackParamList = {
  UpdateOrder: { orderId: number }
  OrderDetails: { orderId: number }
  Orders: undefined
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'UpdateOrder'>
type UpdatedScreenRouteProp = RouteProp<RootStackParamList, 'UpdateOrder'>

export default function UpdateOrder() {
  const navigation = useNavigation<NavigationProps>()
  const { fetchOrderDetailed, updateOrder } = useOrders()

  const route = useRoute<UpdatedScreenRouteProp>()
  const { orderId } = route.params
  const [currentStep, setCurrentStep] = useState(1)

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancellationReason, setCancellationReason] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [fullNameUpdate, setFullNameUpdate] = useState('')
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState('')
  const [deliveryAddressUpdate, setDeliveryAddressUpdate] = useState('')
  const [noteUpdate, setNoteUpdate] = useState('')
  const [varietyUpdate, setVarietyUpdate] = useState('')
  const [koiTypeUpdate, setKoiTypeUpdate] = useState('')
  const [quantityUpdate, setQuantityUpdate] = useState('')
  const [lengthUpdate, setLengthUpdate] = useState('')
  const [weightUpdate, setWeightUpdate] = useState('')
  const [koiPriceUpdate, setKoiPriceUpdate] = useState('')
  const [depositUpdate, setDepositUpdate] = useState('')
  const [noteDetailUpdate, setNoteDetailUpdate] = useState('')
  const [imageUrlUpdate, setImageUrlUpdate] = useState('')

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
          if (data.orderDetails && data.orderDetails.length > 0) {
            const detail = data.orderDetails[0]
            setVarietyUpdate(detail.variety || '')
            setKoiTypeUpdate(detail.koiType || '')
            setQuantityUpdate(String(detail.quantity) || '')
            setLengthUpdate(String(detail.length) || '')
            setWeightUpdate(String(detail.weight) || '')
            setKoiPriceUpdate(String(detail.koiPrice) || '')
            setDepositUpdate(detail.deposit ? String(detail.deposit) : '')
            setNoteDetailUpdate(detail.note || '')
            setImageUrlUpdate(detail.orderDetailImages?.[0]?.imageUrl || '')
          }
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
      const orderDetails = [
        {
          id: 0,
          variety: 'example',
          koiType: 'example',
          quantity: 10,
          length: 30,
          weight: 1.5,
          koiPrice: 100,
          note: 'Some note',
          orderDetailImages: [
            { id: 1, imageUrl: 'https://example.com/image1.jpg' },
            { id: 2, imageUrl: 'https://example.com/image2.jpg' }
          ]
        }
      ]

      const paidAmount = 100

      await updateOrder(
        orderId,
        cancellationReason,
        fullNameUpdate,
        phoneNumberUpdate,
        deliveryAddressUpdate,
        paidAmount,
        noteUpdate,
        orderDetails
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Update Order</Text>
          <View style={{ width: 24 }} />
        </View>

        <Steps currentStep={currentStep} />
        {currentStep === 1 ? (
          <View>
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
          </View>
        ) : (
          <View>
            <View className='mt-3'>
              <Text className='font-bold text-base'>Variety</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 5,
                  marginBottom: 10
                }}
                value={varietyUpdate}
                onChangeText={setVarietyUpdate}
              />
            </View>
            <View className='flex-row justify-between mt-3'>
              <View className='w-40'>
                <Text className='font-bold text-base'>Koi Type</Text>
                <Picker selectedValue={koiTypeUpdate} onValueChange={setKoiTypeUpdate}>
                  <Picker.Item label='Retail' value='Retail' />
                  <Picker.Item label='Wholesale' value='Wholesale' />
                </Picker>
              </View>
              <View className='w-40'>
                <Text className='font-bold text-base'>Quantity</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    overflow: 'hidden',
                    height: 37
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRightWidth: 1,
                      borderColor: '#ccc',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                      height: 45
                    }}
                    onPress={() => {
                      // const newForms = [...forms]
                      // newForms[index].koiQuantity = Number(newForms[index].koiQuantity) + 1
                      // setForms(newForms)
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>+</Text>
                  </TouchableOpacity>

                  {/* Quantity Input */}
                  <TextInput
                    style={{
                      textAlign: 'center',
                      flex: 1,
                      paddingVertical: 10,
                      height: 42
                    }}
                    keyboardType='numeric'
                    value={quantityUpdate}
                    onChangeText={setQuantityUpdate}
                  />

                  {/* Decrement Button */}
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderLeftWidth: 1,
                      borderColor: '#ccc',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                      height: 45
                    }}
                    onPress={() => {
                      // const newForms = [...forms]
                      // newForms[index].koiQuantity = Math.max(1, Number(newForms[index].koiQuantity) - 1)
                      // setForms(newForms)
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className='flex-row justify-between mt-3'>
              <View className='w-40'>
                <Text className='font-bold text-base'>Length</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 8,
                    borderRadius: 5,
                    marginBottom: 10
                  }}
                  value={lengthUpdate}
                  keyboardType='numeric'
                  onChangeText={setLengthUpdate}
                />
              </View>
              <View className='w-40'>
                <Text className='font-bold text-base'>Weight</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 8,
                    borderRadius: 5,
                    marginBottom: 10
                  }}
                  value={weightUpdate}
                  keyboardType='numeric'
                  onChangeText={setWeightUpdate}
                />
              </View>
            </View>
            <View className='mt-3'>
              <Text className='font-bold text-base'>Koi Deposit</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 5,
                  marginBottom: 10
                }}
                keyboardType='numeric'
                value={koiPriceUpdate}
                onChangeText={setKoiPriceUpdate}
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
                value={noteDetailUpdate}
                onChangeText={setNoteDetailUpdate}
              />
            </View>
            <View className='mt-3'>
              <Text className='font-bold text-base'>Input Image URL</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 8,
                  borderRadius: 5,
                  marginBottom: 10
                }}
                onChangeText={setImageUrlUpdate}
              />
            </View>
          </View>
        )}

        <View className='absolute bottom-4 left-4 right-4 flex-row justify-between'>
          <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
            <Text className='text-blue-600'>← Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full flex-row items-center ${currentStep === 1 ? '#264eca' : 'bg-green-600'}`}
            onPress={() => (currentStep === 1 ? setCurrentStep(2) : setModalVisible(true))}
          >
            <Text className='text-white mr-2'>{currentStep === 1 ? 'Next' : 'Done'}</Text>
            {currentStep === 1 ? (
              <ArrowRight size={18} className='text-white' />
            ) : (
              <CheckCircle size={18} className='text-white' />
            )}
          </TouchableOpacity>
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
      </View>
    </ScrollView>
  )
}
