import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Star, MapPin, Clock } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { FarmType } from '../types/farm.type'
import { CustomerStackParamList } from '@apps/customer/types/navigationCustomerType'
import { StackNavigationProp } from '@react-navigation/stack'

type NavigationProp = StackNavigationProp<CustomerStackParamList, 'FarmDetail'>

const FarmCard: React.FC<{ farm: FarmType }> = ({ farm }) => {
  const navigation = useNavigation<NavigationProp>()

  return (
    <TouchableOpacity onPress={() => navigation.navigate('FarmDetail', { farmID: farm.id })}>
      <View className='flex-row overflow-hidden rounded-lg bg-white border border-gray-300 w-full mx-auto my-2'>
        <Image source={{ uri: farm.imageUrl }} className='w-40 h-36' />

        <View className='flex-1 p-3 justify-between border border-gray-300'>
          <View className='flex-row justify-end'>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                color={index < farm.averageRating ? '#FACC15' : '#E5E7EB'}
                fill={index < farm.averageRating ? '#FACC15' : 'none'}
              />
            ))}
          </View>

          <Text className='text-sm font-bold mt-1'>{farm.farmName}</Text>

          <View className='flex-row items-center space-x-2 mt-1 pr-3'>
            <MapPin size={16} color='#6B7280' />
            <Text className='text-gray-500 text-sm' numberOfLines={1} ellipsizeMode='tail'>
              {farm.location}
            </Text>
          </View>

          <View className='flex-row items-center space-x-2 mt-1'>
            <Clock size={16} color='#6B7280' />
            <Text className='text-gray-500 text-sm'>{farm.openingHours}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FarmCard
