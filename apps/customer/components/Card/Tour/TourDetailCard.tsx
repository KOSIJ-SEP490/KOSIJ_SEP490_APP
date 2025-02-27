import { View, Text } from 'react-native'
import { MapPin, Clock, Building, Wallet, CreditCard } from 'lucide-react-native'

interface TourDetailCardProps {
  departurePoint: string
  destinationPoint: string
  days: number
  nights: number
  farmsCount: number
  standardPrice: number
  visaPrice: number
}

export default function TourDetailCard({
  departurePoint,
  destinationPoint,
  days,
  nights,
  farmsCount,
  standardPrice,
  visaPrice
}: TourDetailCardProps) {
  return (
    <View className='bg-white rounded-xl p-6 space-y-6 w-full max-w-md border border-gray-300'>
      <View className='flex-row items-center space-x-4'>
        <MapPin size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Departure Point: </Text>
          {departurePoint}
        </Text>
      </View>

      <View className='flex-row items-center space-x-4'>
        <MapPin size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Destination Point: </Text>
          {destinationPoint}
        </Text>
      </View>

      <View className='flex-row items-center space-x-4'>
        <Clock size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Time: </Text>
          {days} days, {nights} nights
        </Text>
      </View>

      <View className='flex-row items-center space-x-4'>
        <Building size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Farms to visit: </Text>
          {farmsCount} Farms
        </Text>
      </View>

      <View className='flex-row items-center space-x-4'>
        <Wallet size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Standard Price: </Text>
          {standardPrice.toLocaleString('vi-VN')} VND
        </Text>
      </View>

      <View className='flex-row items-center space-x-4'>
        <CreditCard size={22} color='#000000' />
        <Text className='text-sm'>
          <Text className='font-semibold'>Visa Price: </Text>
          {visaPrice.toLocaleString('vi-VN')} VND
        </Text>
      </View>
    </View>
  )
}
