import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { CheckCircleIcon } from 'lucide-react-native'

const SubmitSuccessModal = () => {
  const [visible, setVisible] = useState(false)

  const handleSubmit = () => {
    setVisible(true)
  }

  return (
    <View className='flex-1 justify-center items-center bg-gray-100 p-4'>
      <TouchableOpacity onPress={handleSubmit} className='bg-green-600 px-4 py-2 rounded-lg'>
        <Text className='text-white font-bold'>Submit</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType='slide'>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-6 rounded-2xl shadow-lg w-4/5'>
            <View className='items-center'>
              <View className='bg-green-100 p-3 rounded-full'>
                <CheckCircleIcon size={40} color='green' />
              </View>
              <Text className='text-lg font-semibold mt-3'>Submit Success!</Text>
            </View>

            <View className='mt-4 border-t border-gray-300 pt-4'>
              <Text className='text-gray-700'>Booking ID: BOOK-24122025</Text>
              <Text className='text-gray-700'>Created Time: 25-02-2023, 13:22:16</Text>
              <Text className='text-gray-700'>Sender Name: Nguyen Le Hoang Dung</Text>
            </View>

            <Text className='text-gray-500 text-sm mt-4'>
              Please wait for us to confirm your customized booking as soon as possible.
            </Text>

            <TouchableOpacity onPress={() => setVisible(false)} className='bg-blue mt-4 py-2 rounded-lg items-center'>
              <Text className='text-white font-bold'>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SubmitSuccessModal
