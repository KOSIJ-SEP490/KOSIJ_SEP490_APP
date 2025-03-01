import { TripType } from '@apps/customer/types/Trip/trip.type'
import { Baby, DollarSign, Hotel, Plane, Users } from 'lucide-react-native'
import React from 'react'
import { View, Text } from 'react-native'

interface TripInfoCardProps {
  trip: TripType
}

const TripInfoCard: React.FC<TripInfoCardProps> = ({ trip }) => {
  const isSlotFull = trip.availableSlot === '30/30' || trip.daysRemaining <= 0
  const displayedDaysRemaining = trip.daysRemaining <= 0 ? 0 : trip.daysRemaining

  return (
    <View className='w-full flex items-center'>
      <View className='max-w-md w-full'>
        <View className='flex-row justify-between mb-3'>
          <Text className='text-base font-semibold'>Trip Information</Text>
          <Text className='text-red-500 pt-1'>Days Remaining: {displayedDaysRemaining} days</Text>
        </View>
        <View className='p-4 border border-gray-300 rounded-lg bg-white'>
          <View className='flex-row justify-between mb-3'>
            <View className='mt-2'>
              <Text className='font-semibold'>
                Trip Type: <Text className='font-normal'>{trip.tripType}</Text>
              </Text>
            </View>

            <View className='mt-1 flex-row justify-between items-center'>
              <Text
                className={`px-2 py-1 rounded ${isSlotFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
              >
                Available Slots: {trip.availableSlot}
              </Text>
            </View>
          </View>

          <View className='flex-row justify-between'>
            <View className='flex-1 items-center p-2 border border-gray-300 rounded-md bg-blue-light'>
              <Text className='font-bold text-base text-blue'>Start Date</Text>
              <Text>{trip.departureDate}</Text>
            </View>
            <View className='flex-1 items-center p-2 border border-gray-300 rounded-md ml-2 bg-blue-light'>
              <Text className='font-bold text-base text-blue'>End Date</Text>
              <Text>{trip.returnDate}</Text>
            </View>
          </View>

          <View className='h-[4px] bg-blue-light mt-6 w-full mb-5' />

          <View className='p-2 rounded-md'>
            <Text className='font-semibold'>Additional Information</Text>

            <View className='flex-row items-center space-x-1 mt-3 mb-2'>
              <Plane size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Airline:</Text> Vietnam Airlines (Tan Son Nhat airport)
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Hotel size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Hotel:</Text> Junnie Hotel (Tokyo Str.Furina 2412, ABC)
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <DollarSign size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Price Rate:</Text> {trip.pricingRate}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Users size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Adult Price:</Text> {trip.tripPrice[0].price.toLocaleString('vi-VN')} VND
                <Text className='text-gray-500'> ({trip.tripPrice[0].description})</Text>
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Users size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Child Price:</Text> {trip.tripPrice[1].price.toLocaleString('vi-VN')} VND
                <Text className='text-gray-500'> ({trip.tripPrice[1].description})</Text>
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Baby size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Infant Price:</Text> {trip.tripPrice[2].price.toLocaleString('vi-VN')} VND
                <Text className='text-gray-500'> ({trip.tripPrice[2].description})</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TripInfoCard
