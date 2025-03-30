import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Edit2 } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AccountType } from '@apps/customer/types/Account/account.type'
import { DeliverySettingsStackParamList } from '@apps/delivery/types/navigationDelivery.type'

interface ProfileCardProps {
  account?: AccountType
}

export default function ProfileCard({ account }: ProfileCardProps) {
  const navigation = useNavigation<StackNavigationProp<DeliverySettingsStackParamList, 'Account'>>()

  return (
    <TouchableOpacity
      className='bg-blue rounded-lg p-4 px-6 mb-4 flex-row items-center'
      onPress={() => navigation.navigate('Account', { account: account })}
    >
      <Image
        source={{
          uri:
            account?.urlAvatar ||
            'https://static.vecteezy.com/system/resources/previews/005/176/777/non_2x/user-avatar-line-style-free-vector.jpg'
        }}
        className='w-16 h-16 rounded-full bg-blue'
      />
      <View className='ml-4 flex-1'>
        <Text className='text-white text-base font-semibold'>{account?.fullName}</Text>
        <Text className='text-white opacity-90'>{account?.email}</Text>
      </View>
      <Edit2 stroke='white' width={20} height={20} />
    </TouchableOpacity>
  )
}
