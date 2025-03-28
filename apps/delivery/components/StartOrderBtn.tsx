import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

type StartOrderButtonProps = {
  onPress: () => void
  disabled?: boolean
}

export default function StartOrderButton({ onPress, disabled = false }: StartOrderButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-blue py-3 mx-5 rounded-lg mb-14 ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className='text-white text-center text-lg font-semibold'>Start Order</Text>
    </TouchableOpacity>
  )
}
