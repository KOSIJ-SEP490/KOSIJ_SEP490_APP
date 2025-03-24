import { CustomerSettingsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { XCircle } from 'react-native-feather'

interface WithDrawFailModalProps {
  visible: boolean
  onClose: () => void
  errorMessage: string
}

const WithDrawFailModal = ({ visible, onClose, errorMessage }: WithDrawFailModalProps) => {
  const navigation = useNavigation<CustomerSettingsStackNavigationProp>()
  const failTime = new Date().toLocaleString()

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white w-11/12 max-w-md rounded-2xl p-6'>
          <View className='items-center mb-4'>
            <View className='w-16 h-16 rounded-full bg-red-500 items-center justify-center mb-4'>
              <XCircle width={26} height={26} stroke='#ffffff' strokeWidth={3} />
            </View>
            <Text className='text-lg text-gray-700 font-medium'>WithDraw Failed!</Text>
          </View>

          <View className='h-px bg-gray-200 my-6' />

          <View className='space-y-6'>
            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Fail Time</Text>
              <Text className='text-base text-gray-800'>{failTime}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Reason</Text>
              <Text className='text-base text-gray-800'>{errorMessage}</Text>
            </View>

            <View className='flex-row items-center py-2'>
              {Array(27)
                .fill(0)
                .map((_, index) => (
                  <View key={index} className='w-1 h-1 bg-gray-300 rounded-full mx-1' />
                ))}
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-base text-gray-600'>Please check your details and try again.</Text>
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
            className='bg-red-500 py-3 rounded-lg mt-8'
          >
            <Text className='text-white text-center text-lg font-medium'>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default WithDrawFailModal
