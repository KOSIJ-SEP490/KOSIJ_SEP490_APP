import QuotationSection from '@apps/customer/components/Booking/CustomizedTrip/QuotationSection'
import TripRequestInfoCard from '@apps/customer/components/Booking/CustomizedTrip/TripRequestInfoCard'
import Divider from '@apps/customer/components/Divider'
import { useTripRequestById } from '@apps/customer/hooks/useTripRequest'
import SubLayout from '@apps/customer/layouts/SubLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'

type TripRequestDetailScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'TripRequestDetails'>

export default function TripRequestDetailsScreen() {
  const route = useRoute<TripRequestDetailScreenRouteProp>()
  const { tripRequestID } = route.params
  const { tripRequestDetails } = useTripRequestById(tripRequestID)

  return (
    <SubLayout title='Trip Request Details' showBackButton={true}>
      <QuotationSection status={tripRequestDetails?.requestStatus ?? ''} tripRequestID={tripRequestID} />

      <Divider />

      {tripRequestDetails ? (
        <TripRequestInfoCard tripRequest={tripRequestDetails} />
      ) : (
        <Text>Loading trip request details...</Text>
      )}

      <Divider />
    </SubLayout>
  )
}
