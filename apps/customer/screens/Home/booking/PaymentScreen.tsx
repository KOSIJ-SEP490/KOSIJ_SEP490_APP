import React from 'react'
import { ScrollView } from 'react-native'
import SubLayout from '@apps/customer/layouts/SubLayout'
import PaymentDetailsCard from '@apps/customer/components/Booking/PaymentDetailsCard'
import PaymentDetailsCard2 from '@apps/customer/components/Booking/PaymentDetailsCard2'
import { RouteProp, useRoute } from '@react-navigation/native'
import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

type PaymentScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'Payment'>

export default function PaymentScreen() {
  const route = useRoute<PaymentScreenRouteProp>()
  const { tripBookingID, type } = route.params

  return (
    <SubLayout title='Payment Deposit' showBackButton={true}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {type === 'Payment1' ? (
          <PaymentDetailsCard tripBookingID={tripBookingID} />
        ) : type === 'Payment2' ? (
          <PaymentDetailsCard2 tripBookingID={tripBookingID} />
        ) : (
          <></>
        )}
      </ScrollView>
    </SubLayout>
  )
}
