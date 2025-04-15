import PassengerDetailsCard from '@apps/customer/components/Card/Passenger/PassengerDetailsCard'
import { usePassengersByTripBookingId } from '@apps/customer/hooks/usePassenger'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import SubLayout from '@shared/layouts/SubLayout'
import React from 'react'
import { ScrollView, Text } from 'react-native'

type PassengerInformationScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'PassengerInformation'>

export default function PassengerInformationScreen() {
  const route = useRoute<PassengerInformationScreenRouteProp>()
  const { tripBookingID } = route.params
  const { passengers, error } = usePassengersByTripBookingId(tripBookingID)

  if (error) {
    return (
      <SubLayout title='Passenger Information' showBackButton={true}>
        <Text className='text-red-500 p-4'>{error}</Text>
      </SubLayout>
    )
  }

  return (
    <SubLayout title='Passenger Information' showBackButton={true}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {passengers.map((passenger, index) => (
          <PassengerDetailsCard key={passenger.id} passenger={passenger} index={index} />
        ))}
      </ScrollView>
    </SubLayout>
  )
}
