import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'

type FailSuccessPopupProps = {
  isVisible: boolean
  onClose: () => void
}

export default function FailSuccessPopup({ isVisible, onClose }: FailSuccessPopupProps) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn='shake' animationOut='fadeOut'>
      <View className='bg-white p-6 rounded-lg items-center'>
        <Text className='text-lg font-bold text-red-600'>Error!</Text>
        <Text className='text-base text-black mt-2'>Failed to update order status.</Text>
        <TouchableOpacity className='bg-red-500 px-4 py-2 rounded-md mt-4' onPress={onClose}>
          <Text className='text-white font-semibold'>Try Again</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
