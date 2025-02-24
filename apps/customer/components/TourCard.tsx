import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Clock, MapPin, Building } from 'lucide-react-native'
import { TourCardType } from '../types/tourCard.type'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CustomerStackParamList } from '@apps/customer/types/navigationCustomerType'
import { useNavigation } from '@react-navigation/native'

type TourCardProps = TourCardType

export default function TourCard({
  id,
  tourName,
  standardPrice,
  imageUrl,
  departurePoint,
  destinationPoint,
  days,
  nights,
  totalFarmVisit
}: TourCardProps) {
  const navigation = useNavigation<StackNavigationProp<CustomerStackParamList, 'ScheduledTourDetail'>>()

  return (
    <TouchableOpacity
      className='w-80 overflow-hidden rounded-lg bg-white border border-gray-200 shadow-lg shadow-gray-700'
      onPress={() => navigation.navigate('ScheduledTourDetail', { tourID: id })}
    >
      <Image source={{ uri: imageUrl }} className='w-full h-40' resizeMode='cover' />

      <View className='p-4 space-y-4'>
        <Text className='text-sm font-semibold h-10'>{tourName}</Text>

        <View className='space-y-2'>
          <View className='flex-row justify-between items-center'>
            <View className='flex-row items-center space-x-1 w-1/4'>
              <Clock size={16} color='#6B7280' />
              <Text className='text-gray-600 text-xs'>
                {days}D{nights}N
              </Text>
            </View>
            <View className='flex-row items-center space-x-1 w-3/4'>
              <MapPin size={16} color='#6B7280' />
              <Text className='text-gray-600 text-xs flex-shrink' numberOfLines={1}>
                {departurePoint}
              </Text>
            </View>
          </View>

          <View className='flex-row justify-between items-center'>
            <View className='flex-row items-center space-x-1 w-1/4'>
              <Building size={16} color='#6B7280' />
              <Text className='text-gray-600 text-xs'>{totalFarmVisit} Farms</Text>
            </View>

            <View className='flex-row items-center space-x-1 w-3/4'>
              <MapPin size={16} color='#6B7280' />
              <Text className='text-gray-600 text-xs flex-shrink' numberOfLines={1}>
                {destinationPoint}
              </Text>
            </View>
          </View>
        </View>

        <View className='pt-2'>
          <Text className='text-sm font-bold text-right'>
            <Text className='text-black'>Price From: </Text>
            <Text className='text-red-600'>{standardPrice.toLocaleString('vi-VN')} VND</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
