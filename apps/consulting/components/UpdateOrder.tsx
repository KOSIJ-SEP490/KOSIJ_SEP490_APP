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
import { launchImageLibrary } from 'react-native-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from 'firebaseConfig'
import KoiImageUploader from '@shared/screens/components/KoiUploadImage'
import KoiUploadImage from '@shared/screens/components/KoiUploadImage'

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
  const [quantityUpdate, setQuantityUpdate] = useState<number>(1)
  const [lengthUpdate, setLengthUpdate] = useState<number>(0)
  const [weightUpdate, setWeightUpdate] = useState<number>(0)
  const [koiPriceUpdate, setKoiPriceUpdate] = useState<number>(0)
  const [noteDetailUpdate, setNoteDetailUpdate] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])

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
          setVarietyUpdate(data.orderDetails?.[0]?.variety || '')
          setKoiTypeUpdate(data.orderDetails?.[0]?.koiType || '')
          setQuantityUpdate(data.orderDetails?.[0]?.quantity || 0)
          setLengthUpdate(data.orderDetails?.[0]?.length || 0)
          setWeightUpdate(data.orderDetails?.[0]?.weight || 0)
          setKoiPriceUpdate(data.orderDetails?.[0]?.koiPrice || 0)
          setNoteDetailUpdate(data.orderDetails?.[0]?.note || '')
          setImageUrls(data.orderDetails?.[0]?.orderDetailImages?.map((img: any) => img.imageUrl) || [])
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
      const updatedOrder = {
        fullName: fullNameUpdate,
        phoneNumber: phoneNumberUpdate,
        deliveryAddress: deliveryAddressUpdate,
        paidAmount: koiPriceUpdate,
        note: noteUpdate,
        orderDetails: [
          {
            id: order?.orderDetails?.[0]?.id,
            variety: varietyUpdate,
            koiType: koiTypeUpdate,
            quantity: quantityUpdate,
            length: lengthUpdate,
            weight: weightUpdate,
            koiPrice: koiPriceUpdate,
            note: noteDetailUpdate,
            orderDetailImages: imageUrls.map((url, index) => ({
              id: order?.orderDetails?.orderDetailImages?.[0]?.id,
              imageUrl: url
            }))
          }
        ]
      }

      console.log('Updated Order:', updatedOrder)
      console.log('Image URLs:', imageUrls)

      await updateOrder(orderId, updatedOrder)
      navigation.navigate('OrderDetails', { orderId: orderId })
      Alert.alert('Success', 'Order has been updated.', [{ text: 'OK', onPress: () => navigation.navigate('Orders') }])
    } catch (error: any) {
      console.error('Error updating order:', error)
      if (error.response) {
        console.error('Error Response:', error.response.data)
        Alert.alert('Error', `Failed to update the order. Details: ${error.response.data.message}`)
      } else {
        console.error('Error:', error)
        Alert.alert('Error', 'Failed to update the order due to an unknown issue.')
      }
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                    onPress={() => setQuantityUpdate((prevQuantity) => prevQuantity + 1)}
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
                    value={quantityUpdate.toString()}
                    onChangeText={(text) => setQuantityUpdate(Number(text) || 0)}
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
                    onPress={() => setQuantityUpdate((prevQuantity) => Math.max(1, prevQuantity - 1))}
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
                  value={lengthUpdate.toString()}
                  keyboardType='numeric'
                  onChangeText={(text) => setLengthUpdate(Number(text) || 0)}
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
                  value={weightUpdate.toString()}
                  keyboardType='numeric'
                  onChangeText={(text) => setWeightUpdate(Number(text) || 0)}
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
                value={koiPriceUpdate.toString()}
                onChangeText={(text) => setKoiPriceUpdate(Number(text) || 0)}
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
            <View style={{ marginBottom: 80 }}>
              <Text className='font-bold mb-2'>Koi Image</Text>
              <KoiUploadImage value={imageUrls} onChange={setImageUrls} maxCount={4} />
            </View>
          </View>
        )}

        <View className='absolute bottom-4 left-4 right-4 flex-row justify-between' style={{ flex: 1 }}>
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
