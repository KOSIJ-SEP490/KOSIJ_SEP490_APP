import { useTripById } from '@apps/customer/hooks/useTrip'
import { TripBookingDetailType } from '@apps/customer/types/Booking/tripBookingDetail.type'
import { Building, Calendar, Hotel, MapPin, Plane, Users } from 'lucide-react-native'
import React from 'react'
import { View, Text } from 'react-native'

interface TripBookingInfoProps {
  tripBooking: TripBookingDetailType | null
}

const TripBookingInfo: React.FC<TripBookingInfoProps> = ({ tripBooking }) => {
  const { trip } = useTripById(tripBooking?.tripId ?? 0)
  const numberOfCustomers = {
    adult: tripBooking?.bookingDetails.passengerDetails.find((p) => p.ageGroup === 'Adult')?.quantity || 0,
    child: tripBooking?.bookingDetails.passengerDetails.find((p) => p.ageGroup === 'Child')?.quantity || 0,
    infant: tripBooking?.bookingDetails.passengerDetails.find((p) => p.ageGroup === 'Infant')?.quantity || 0
  }

  const totalCustomers = numberOfCustomers.adult + numberOfCustomers.child + numberOfCustomers.infant
  return (
    <View className='w-full flex items-center my-6 mb-7 px-5'>
      <View className='max-w-md w-full'>
        <View className='flex-row justify-between mb-3'>
          <Text className='text-base font-semibold ml-2 text-blue'>Booking Details</Text>
        </View>
        <View className='p-4 border border-gray-300 mt-3 rounded-lg bg-white'>
          <View className='flex-row justify-between mb-3'>
            <View className='mt-2'>
              <Text className='font-semibold'>
                Tour Name: <Text className='font-normal'>{tripBooking?.tourName}</Text>
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
                <Text className='font-medium'>Number of Customers:</Text> {totalCustomers} person(s)
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <MapPin size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Departure Point:</Text>{' '}
                {tripBooking?.additionalInformation.departurePoint}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <MapPin size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Destination Point:</Text>{' '}
                {tripBooking?.additionalInformation.destinationPoint}
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Calendar size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Time:</Text> {tripBooking?.additionalInformation.days} days,{' '}
                {tripBooking?.additionalInformation.nights} nights
              </Text>
            </View>

            <View className='flex-row items-center space-x-1 my-2'>
              <Building size={18} color='#000000' />
              <Text className='text-gray text-sm'>
                <Text className='font-medium'>Farms to visit:</Text>{' '}
                {tripBooking?.additionalInformation.totalFarmToVisit} farms
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TripBookingInfo
