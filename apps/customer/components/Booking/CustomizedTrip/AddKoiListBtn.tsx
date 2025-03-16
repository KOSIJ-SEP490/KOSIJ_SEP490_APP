import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AddKoiListButtonProps {
  count: number
  onPress: () => void
}

const AddKoiListButton: React.FC<AddKoiListButtonProps> = ({ count, onPress }) => {
  return (
    <TouchableOpacity className='self-end flex-row items-center bg-blue py-2 px-4 rounded-lg mb-4' onPress={onPress}>
      <Text className='text-white text-base mr-2'>Added List</Text>
      <Ionicons name='list' size={20} color='white' />
      {count > 0 && (
        <View className='bg-blue-light rounded-full px-2 ml-2'>
          <Text className=' text-sm font-bold'>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default AddKoiListButton
