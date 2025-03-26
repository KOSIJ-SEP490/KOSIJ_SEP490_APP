import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

interface EditOrderButtonProps {
  isEditable: boolean
  onPress: () => void
}

const EditOrderButton: React.FC<EditOrderButtonProps> = ({ isEditable, onPress }) => {
  return (
    <View className='px-5 py-2 mb-14'>
      <TouchableOpacity
        onPress={onPress}
        disabled={!isEditable}
        className={`rounded-lg py-3 items-center ${isEditable ? 'bg-blue' : 'bg-gray-400'}`}
      >
        <Text className='text-white font-bold text-base'>Edit Order</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditOrderButton
