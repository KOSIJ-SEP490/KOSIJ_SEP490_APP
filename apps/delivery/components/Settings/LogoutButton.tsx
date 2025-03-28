import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { LogOut } from 'react-native-feather'

interface LogoutButtonProps {
  onPress: () => void
}

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity className='bg-blue py-3 rounded-lg items-center justify-center flex-row mt-5' onPress={onPress}>
      <LogOut width={20} height={20} stroke='white' />
      <Text className='text-white text-lg font-medium ml-2'>Logout</Text>
    </TouchableOpacity>
  )
}
