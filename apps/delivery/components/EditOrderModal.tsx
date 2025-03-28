import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  TextInput,
  ActionSheetIOS,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { X, Calendar, ChevronDown } from 'react-native-feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import { styled } from 'nativewind'
import { uploadImageToFirebase, useOrderById, useUpdateOrder } from '../hooks/useOrder'
import Toast from 'react-native-toast-message'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

interface EditOrderModalProps {
  onClose: () => void
  orderID?: number
}

const orderStatuses = ['Delivered', 'Cancelled']

export default function EditOrderModal({ onClose, orderID }: EditOrderModalProps) {
  const { updateOrder, error } = useUpdateOrder()
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(new Date())
  const [status, setStatus] = useState('Delivered')
  const [packageImage, setPackageImage] = useState<string | null>(null)
  const [thirdPartyLogisticsInfo, setThirdPartyLogisticsInfo] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const { order } = useOrderById(orderID ?? 0)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  useEffect(() => {
    if (order) {
      setDeliveryDate(new Date(order.expectedDeliveryDate))
      setStatus(order.orderStatus || 'Delivered')
      setPackageImage(order.confirmedUrl || null)
      setThirdPartyLogisticsInfo(order.thirdPartyLogisticsInfo || '')
      setCancelReason(order.cancellationReason || '')
    }
  }, [order])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDeliveryDate(selectedDate)
    }
    setShowDatePicker(false)
  }

  const pickImage = async (fromCamera: boolean) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      alert('Permission to access camera is required!')
      return
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        })

    if (!result.canceled && result.assets.length > 0) {
      setPackageImage(result.assets[0].uri)
    }
  }

  const showImageOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage(true)
          else if (buttonIndex === 2) pickImage(false)
        }
      )
    } else {
      pickImage(false)
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true)
    let imageUrl = packageImage

    if (packageImage && !packageImage.startsWith('http')) {
      imageUrl = await uploadImageToFirebase(packageImage)
    }

    const isSuccess = await updateOrder(orderID ?? 0, {
      expectedDeliveryDate: deliveryDate.toISOString(),
      thirdPartyLogisticsInfo,
      orderStatus: status,
      confirmedUrl: status === 'Delivered' ? (imageUrl ?? '') : '',
      cancellationReason: status === 'Cancelled' ? cancelReason : ''
    })

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
    <Modal animationType='slide' transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <StyledView className='flex-1 bg-white'>
            <StyledView className='bg-blue pt-14 pb-7 px-10 flex-row justify-between items-center'>
              <StyledText className='text-white text-xl font-medium'>Edit Order</StyledText>
              <StyledTouchableOpacity onPress={onClose}>
                <X stroke='white' width={24} height={24} />
              </StyledTouchableOpacity>
            </StyledView>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <StyledView className='p-5 flex-1'>
                <StyledView className='mb-6'>
                  <StyledText className='text-base font-medium mb-2'>Expected Delivery Date</StyledText>
                  <StyledTouchableOpacity
                    className='border border-gray-300 rounded-lg p-4 flex-row items-center'
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar stroke='black' width={20} height={20} />
                    <StyledText className='ml-3 text-sm'>{formatDate(deliveryDate)}</StyledText>
                  </StyledTouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker value={deliveryDate} mode='date' display='default' onChange={handleDateChange} />
                  )}
                </StyledView>

                <StyledView className='mb-6'>
                  <StyledText className='text-base font-medium mb-2'>Order Status</StyledText>
                  <StyledTouchableOpacity
                    className='border border-gray-300 rounded-lg p-4 flex-row justify-between items-center'
                    onPress={() => setShowStatusPicker(!showStatusPicker)}
                  >
                    <StyledText className='text-sm'>{status}</StyledText>
                    <ChevronDown stroke='black' width={20} height={20} />
                  </StyledTouchableOpacity>

                  {showStatusPicker && (
                    <StyledView className='border border-gray-300 rounded-lg mt-1 bg-white'>
                      {orderStatuses.map((option) => (
                        <StyledTouchableOpacity
                          key={option}
                          className='p-3 border-b border-gray-200'
                          onPress={() => {
                            setStatus(option)
                            setShowStatusPicker(false)
                          }}
                        >
                          <StyledText className={`text-sm ${status === option ? 'font-bold' : ''}`}>
                            {option}
                          </StyledText>
                        </StyledTouchableOpacity>
                      ))}
                    </StyledView>
                  )}
                </StyledView>

                <StyledView className='mb-6'>
                  <StyledText className='text-base font-medium mb-2'>Third Party Logistics Info</StyledText>
                  <StyledTextInput
                    className='border border-gray-300 rounded-lg p-4 text-sm'
                    placeholder='Enter logistics details'
                    value={thirdPartyLogisticsInfo}
                    onChangeText={setThirdPartyLogisticsInfo}
                    multiline
                    numberOfLines={3}
                  />
                </StyledView>

                {status === 'Delivered' && (
                  <StyledView className='mb-6'>
                    <StyledText className='text-base font-medium mb-2'>Upload Package Image</StyledText>
                    <StyledTouchableOpacity
                      className='bg-gray-500 rounded-lg p-4 items-center'
                      onPress={showImageOptions}
                    >
                      <StyledText className='text-white text-base'>Take Photo / Choose Image</StyledText>
                    </StyledTouchableOpacity>

                    {packageImage && (
                      <StyledView className='mt-4 items-center'>
                        <Image source={{ uri: packageImage }} className='w-full h-60 rounded-lg' resizeMode='cover' />
                      </StyledView>
                    )}
                  </StyledView>
                )}

                {status === 'Cancelled' && (
                  <StyledView className='mb-6'>
                    <StyledText className='text-base font-medium mb-2'>Cancellation Reason</StyledText>
                    <StyledTextInput
                      className='border border-gray-300 rounded-lg p-4 text-sm'
                      placeholder='Enter cancellation reason'
                      value={cancelReason}
                      onChangeText={setCancelReason}
                      multiline
                      numberOfLines={3}
                    />
                  </StyledView>
                )}

                <StyledTouchableOpacity
                  className={`rounded-lg p-4 items-center mt-auto mb-5 ${isLoading ? 'bg-gray-400' : 'bg-blue'}`}
                  onPress={handleUpdate}
                  disabled={isLoading}
                  activeOpacity={1}
                >
                  <StyledText className='text-white text-base font-medium'>
                    {isLoading ? 'Updating...' : 'Update Order'}
                  </StyledText>
                </StyledTouchableOpacity>

                {error && <StyledText className='text-red-500 text-center mt-2'>{error}</StyledText>}
              </StyledView>
            </ScrollView>
          </StyledView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}
