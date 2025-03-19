import { useTripById } from '@apps/customer/hooks/useTrip'
import { TripRequestDetailsType } from '@apps/customer/types/Trip/tripRequestDetails.type'
import { Building, Calendar, Hotel, MapPin, Plane, Users } from 'lucide-react-native'
import React from 'react'
import { View, Text } from 'react-native'

interface TripBookingInfoCardProps {
  tripRequest: TripRequestDetailsType | null
}

const TripBookingInfoCard: React.FC<TripBookingInfoCardProps> = ({ tripRequest }) => {
  const { trip } = useTripById(tripRequest?.customizedTripResponse?.id ?? 0)

  return (
    <View className='w-full flex items-center mt-10 px-5 mb-7'>
      <View className='max-w-md w-full'>
        <View className='flex-row justify-between mb-3'>
          <Text className='text-base text-blue font-semibold ml-2'>Booking Details</Text>
        </View>
        <View className='p-4 border border-gray-300 rounded-lg bg-white'>
          <View className='flex-row justify-between mb-3'>
            <View className='mt-2'>
              <Text className='font-semibold'>
                Tour Name: <Text className='font-normal'>{trip?.tourResponse.tourName}</Text>
              </Text>
              <Text className='font-semibold'>
                Trip Type: <Text className='font-normal'>{trip?.tripType}</Text>
              </Text>
            </View>
          </View>

          <View className='flex-row justify-between'>
            <View className='flex-1 items-center p-2 border border-gray-300 rounded-md bg-blue-light'>
              <Text className='font-bold text-base text-blue'>Start Date</Text>
              <Text>{trip?.departureDate}</Text>
            </View>
            <View className='flex-1 items-center p-2 border border-gray-300 rounded-md ml-2 bg-blue-light'>
              <Text className='font-bold text-base text-blue'>End Date</Text>
              <Text>{trip?.returnDate}</Text>
            </View>
          </View>

          <View className='h-[4px] bg-blue-light mt-6 w-full mb-5' />

          <View className='p-2 rounded-md'>
            <Text className='font-semibold'>Additional Information</Text>

            <View className='flex-row items-center space-x-1 mt-3 mb-2'>
              <Plane size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Airline:</Text> {trip?.tourResponse.airline}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Hotel size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Hotel:</Text> {trip?.tourResponse.hotelService}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Users size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Number of Customers: </Text>
                {trip?.availableSlot} person(s)
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <MapPin size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Departure Point:</Text> {trip?.tourResponse.departurePoint}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <MapPin size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Destination Point:</Text> {trip?.tourResponse.destinationPoint}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Calendar size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Time:</Text> {trip?.tourResponse.days} days, {trip?.tourResponse.nights}{' '}
                nights
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Building size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Farms to visit:</Text> {trip?.tourResponse.totalFarmVisit} farms
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TripBookingInfoCard
