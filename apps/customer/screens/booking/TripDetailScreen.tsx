import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { CustomerStackParamList } from '@apps/customer/types/navigationCustomerType'
import SubLayout from '@apps/customer/layouts/SubLayout'
import { useTourById } from '@apps/customer/hooks/useTour'
import ChooseDate from '@apps/customer/components/Booking/ChooseDate'
import { useTripById } from '@apps/customer/hooks/useTrip'
import TripInfoCard from '@apps/customer/components/Card/Trip/TripInfoCard'
import NumberOfCustomer from '@apps/customer/components/Booking/NumberOfCustomer'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import TotalPrice from '@apps/customer/components/Booking/TotalPrice'

type TripDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'TripDetail'>

export default function TripDetailScreen() {
  const route = useRoute<TripDetailScreenRouteProp>()
  const { tourID } = route.params
  const { tour } = useTourById(tourID)
  const { bookingData, setBookingData } = useBooking()

  const [selectedTripId, setSelectedTripId] = useState<number | undefined>(bookingData.tripID)

  const { trip: selectedTrip } = useTripById(selectedTripId ?? 0)

  const setTrip = (tripID: number) => {
    setBookingData((prev) => ({
      ...prev,
      tripID
    }))
    setSelectedTripId(tripID)
  }

  useEffect(() => {
    if (bookingData.tripID !== undefined) {
      setSelectedTripId(bookingData.tripID)
    }
  }, [bookingData.tripID])

  if (!tour) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Loading</Text>
      </View>
    )
  }

  const handleDateSelect = (tripId?: number) => {
    if (tripId !== undefined) {
      setTrip(tripId)
    }
  }

  return (
    <SubLayout title='Select Trip' showBackButton={true}>
      <View className='px-5 py-4'>
        <ChooseDate trips={tour.tripsList} onDateSelect={handleDateSelect} selectedTripId={selectedTripId} />
      </View>

      {selectedTrip ? (
        <View>
          <View className='mt-4 px-5'>
            <TripInfoCard trip={selectedTrip} />

            <NumberOfCustomer tripPrices={selectedTrip.tripPrice ?? []} />
          </View>
          <TotalPrice />
        </View>
      ) : (
        <View className='mt-4 items-center'>
          <Text className='text-gray-500'>Please select a trip date</Text>
        </View>
      )}
    </SubLayout>
  )
}
