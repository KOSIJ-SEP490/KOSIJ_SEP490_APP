import {
  CustomerHomeStackNavigationProp,
  CustomerTripsStackParamList
} from '@apps/customer/types/navigationCustomerType'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Check } from 'react-native-feather'

interface PaymentSuccessModalProps {
  visible: boolean
  onClose: () => void
  bookingId?: number
  paymentTime?: string
  paymentMethod?: string
  senderName?: string
  totalAmount?: number
  depositAmount?: number
  remainingAmount?: number
  navigationLocation: keyof CustomerTripsStackParamList
}

const PaymentSuccessModal2 = ({
  visible,
  onClose,
  bookingId = 0,
  paymentTime = '',
  paymentMethod = '',
  senderName = '',
  totalAmount = 0,
  depositAmount = 0,
  remainingAmount = 0
}: PaymentSuccessModalProps) => {
  const navigation = useNavigation<CustomerHomeStackNavigationProp>()
  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white w-11/12 max-w-md rounded-2xl p-6'>
          <View className='items-center mb-4'>
            <View className='w-16 h-16 rounded-full bg-blue items-center justify-center mb-4'>
              <Check width={26} height={26} stroke='#ffffff' strokeWidth={3} />
            </View>
            <Text className='text-lg text-gray-700 font-medium'>Payment Remaining Success!</Text>
          </View>

          <View className='h-px bg-gray-200 my-6' />

          <View className='space-y-6'>
            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Booking ID</Text>
              <Text className='text-base text-gray-800'>{bookingId}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Payment Time</Text>
              <Text className='text-base text-gray-800'>{paymentTime}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Payment Method</Text>
              <Text className='text-base text-gray-800'>{paymentMethod}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Sender Name</Text>
              <Text className='text-base text-gray-800'>{senderName}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Total Amount</Text>
              <Text className='text-base text-gray-800'>{totalAmount.toLocaleString()} VND</Text>
            </View>

            <View className='flex-row items-center py-2'>
              {Array(27)
                .fill(0)
                .map((_, index) => (
                  <View key={index} className='w-1 h-1 bg-gray-300 rounded-full mx-1' />
                ))}
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Deposit Amount (Paid)</Text>
              <Text className='text-base text-gray-800'>{depositAmount.toLocaleString()} VND</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Remaining Amount (Paid)</Text>
              <Text className='text-base text-gray-800'>{remainingAmount.toLocaleString()} VND</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onClose()
              navigation.navigate('Home')
            }}
            className='bg-blue py-3 rounded-lg mt-8'
          >
            <Text className='text-white text-center text-lg font-medium'>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default PaymentSuccessModal2
