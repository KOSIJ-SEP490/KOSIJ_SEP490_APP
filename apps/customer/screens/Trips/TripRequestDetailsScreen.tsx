import { useTripRequestById } from '@apps/customer/hooks/useTripRequest'
import SubLayout from '@apps/customer/layouts/SubLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { View, Text } from 'react-native'

type TripRequestDetailScreenRouteProp = RouteProp<CustomerTripsStackParamList, 'TripRequestDetails'>

export default function TripRequestDetailsScreen() {
  const route = useRoute<TripRequestDetailScreenRouteProp>()
  const { tripRequestID } = route.params
  const { tripRequestDetails } = useTripRequestById(tripRequestID)
  return (
    <SubLayout title='Trip Request Details' showBackButton={true}>
      <View>
        <Text></Text>
      </View>
    </SubLayout>
  )
}
