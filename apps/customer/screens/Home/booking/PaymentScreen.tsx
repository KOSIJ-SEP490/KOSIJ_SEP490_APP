import React from 'react'
import { ScrollView } from 'react-native'
import SubLayout from '@shared/layouts/SubLayout'
import PaymentDetailsCard from '@apps/customer/components/Booking/PaymentDetailsCard'
import PaymentDetailsCard2 from '@apps/customer/components/Booking/PaymentDetailsCard2'
import { RouteProp, useRoute } from '@react-navigation/native'
import { CustomerHomeStackParamList } from '@apps/customer/types/navigationCustomerType'

type PaymentScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'Payment'>

export default function PaymentScreen() {
  const route = useRoute<PaymentScreenRouteProp>()
  const { tripBookingID, type } = route.params

  const title = type === 'Payment1' ? 'Payment Deposit' : type === 'Payment2' ? 'Payment Remaining' : 'Payment Deposit'

  return (
    <SubLayout title={title} showBackButton={true}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {type === 'Payment1' ? (
          <PaymentDetailsCard tripBookingID={tripBookingID} />
        ) : type === 'Payment2' ? (
          <PaymentDetailsCard2 tripBookingID={tripBookingID} />
        ) : null}
      </ScrollView>
    </SubLayout>
  )
}
