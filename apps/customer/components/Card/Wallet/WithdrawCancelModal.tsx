import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

type StatusModalProps = {
  visible: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  onClose: () => void
  buttonText?: string
  animationType?: 'fade' | 'slide' | 'none'
  transparent?: boolean
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type = 'info',
  message,
  title,
  onClose,
  buttonText = 'OK',
  animationType = 'fade',
  transparent = true
}) => {
  const getColorConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-blue',
          text: 'text-white',
          button: 'bg-blue',
          icon: '✓'
        }
      case 'error':
        return {
          bg: 'bg-rose-100',
          text: 'text-rose-600',
          button: 'bg-rose-600',
          icon: '!'
        }
      case 'warning':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-600',
          button: 'bg-amber-600',
          icon: '⚠'
        }
      default:
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-600',
          button: 'bg-emerald-600',
          icon: 'i'
        }
    }
  }

  const colors = getColorConfig()
  const modalTitle = title || type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={transparent} animationType={animationType}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white p-6 rounded-lg items-center mx-4'>
          <View className={`w-16 h-16 rounded-full ${colors.bg} justify-center items-center mb-4`}>
            <Text className={`text-3xl ${colors.text} font-bold`}>{colors.icon}</Text>
          </View>

          <Text className='text-lg font-semibold text-gray-800 mb-2'>{modalTitle}</Text>

          <Text className='text-gray-600 text-center mb-6'>{message}</Text>

          <TouchableOpacity
            className={`${colors.button} py-3 px-8 rounded-full w-full items-center`}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text className='text-white font-medium text-base'>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default StatusModal
