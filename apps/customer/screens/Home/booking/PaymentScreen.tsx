import React from 'react'
import { ScrollView } from 'react-native'
import SubLayout from '@apps/customer/layouts/SubLayout'
import PaymentDetailsCard from '@apps/customer/components/Booking/PaymentDetailsCard'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  CustomerHomeStackNavigationProp,
  CustomerHomeStackParamList
} from '@apps/customer/types/navigationCustomerType'

type PaymentScreenRouteProp = RouteProp<CustomerHomeStackParamList, 'Payment'>

export default function PaymentScreen() {
  const route = useRoute<PaymentScreenRouteProp>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigation<CustomerHomeStackNavigationProp>()
  const { tripBookingID } = route.params
  return (
    <SubLayout title='Payment Deposit' showBackButton={true}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <PaymentDetailsCard tripBookingID={tripBookingID} />
      </ScrollView>
    </SubLayout>
  )
}
