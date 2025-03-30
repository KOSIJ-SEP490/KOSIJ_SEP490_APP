import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'
import { DeliveryOrderStackNavigationProp } from '../types/navigationDelivery.type'

type StartSuccessPopupProps = {
  isVisible: boolean
  onClose: () => void
}

export default function StartSuccessPopup({ isVisible, onClose }: StartSuccessPopupProps) {
  const navigation = useNavigation<DeliveryOrderStackNavigationProp>()

  const handleClose = () => {
    onClose()
    navigation.navigate('Orders')
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={handleClose} animationIn='zoomIn' animationOut='zoomOut'>
      <View className='bg-white p-6 rounded-lg items-center'>
        <Text className='text-lg font-bold text-blue'>Success!</Text>
        <Text className='text-base text-black mt-2'>Order has started delivery.</Text>
        <TouchableOpacity className='bg-blue px-8 py-3 rounded-md mt-4' onPress={handleClose}>
          <Text className='text-white font-semibold'>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
