import React from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface StatusModalProps {
  visible: boolean
  success: boolean
  onClose: () => void
  successMessage?: string
  failureMessage?: string
}

const TopUpModal: React.FC<StatusModalProps> = ({
  visible,
  success,
  onClose,
  successMessage = 'Your wallet has been recharged successfully!',
  failureMessage = 'There was an issue with the payment.'
}) => {
  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-xl w-[85%] p-6'>
          <View className='items-center mb-4'>
            <View
              className={`w-16 h-16 rounded-full items-center justify-center ${success ? 'bg-blue' : 'bg-red-100'}`}
            >
              {success ? (
                <MaterialIcons name='check-circle' size={40} color='#EEEDFA' />
              ) : (
                <MaterialIcons name='error' size={40} color='#ef4444' />
              )}
            </View>
          </View>

          <Text className='text-xl font-bold text-center mb-2'>{success ? 'Top Up Successful' : 'Top Up Failed'}</Text>

          <Text className='text-gray-600 text-center mb-6'>{success ? successMessage : failureMessage}</Text>

          <TouchableOpacity onPress={onClose} className={`py-3 px-6 rounded-lg ${success ? 'bg-blue' : 'bg-red-500'}`}>
            <Text className='text-white text-center font-semibold'>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default TopUpModal
