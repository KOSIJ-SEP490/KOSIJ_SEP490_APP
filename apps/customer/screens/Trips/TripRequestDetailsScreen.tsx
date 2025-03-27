import QuotationSection from '@apps/customer/components/Booking/CustomizedTrip/QuotationSection'
import TripRequestInfoCard from '@apps/customer/components/Booking/CustomizedTrip/TripRequestInfoCard'
import KoiCard from '@apps/customer/components/Card/Koi/KoiCard'
import Divider from '@shared/components/Divider'
import { useTripRequestById } from '@apps/customer/hooks/useTripRequest'
import SubLayout from '@shared/layouts/SubLayout'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

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

      <View className='p-5'>
        <Text className='text-base font-semibold'>Koi Variety Selection</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
        {tripRequestDetails?.tripRequestVariety && tripRequestDetails?.tripRequestVariety.length > 0 ? (
          tripRequestDetails.tripRequestVariety.map((koi) => (
            <View key={koi.id} className='mb-4'>
              <KoiCard koi={koi} />
            </View>
          ))
        ) : (
          <Text>No koi varieties found.</Text>
        )}
      </ScrollView>
    </SubLayout>
  )
}
