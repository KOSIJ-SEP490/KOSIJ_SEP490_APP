import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import { WithDrawResponseType } from '@apps/customer/types/Wallet/withdraw.type'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Check } from 'react-native-feather'

interface PaymentSuccessModalProps {
  visible: boolean
  onClose: () => void
  response: WithDrawResponseType
}

const WithDrawSuccessModal = ({ visible, onClose, response }: PaymentSuccessModalProps) => {
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()
  const withdrawTime = new Date().toLocaleString()

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white w-11/12 max-w-md rounded-2xl p-6'>
          <View className='items-center mb-4'>
            <View className='w-16 h-16 rounded-full bg-blue items-center justify-center mb-4'>
              <Check width={26} height={26} stroke='#ffffff' strokeWidth={3} />
            </View>
            <Text className='text-lg text-gray-700 font-medium'>WithDraw Success!</Text>
          </View>

          <View className='h-px bg-gray-200 my-6' />

          <View className='space-y-6'>
            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Request ID</Text>
              <Text className='text-base text-gray-800'>{response.id}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>WithDraw Time</Text>
              <Text className='text-base text-gray-800'>{withdrawTime}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Sender Name</Text>
              <Text className='text-base text-gray-800'>{response.holderName}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Bank</Text>
              <Text className='text-base text-gray-800'>{response.bankName}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Total Amount</Text>
              <Text className='text-base text-gray-800'>{response.amount.toLocaleString()} VND</Text>
            </View>

            <View className='flex-row items-center py-2'>
              {Array(27)
                .fill(0)
                .map((_, index) => (
                  <View key={index} className='w-1 h-1 bg-gray-300 rounded-full mx-1' />
                ))}
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>
                Please wait for our Manager to approve your Withdraw Request
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onClose()
              navigation.reset({
                index: 0,
                routes: [{ name: 'Settings' }]
              })
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

export default WithDrawSuccessModal
