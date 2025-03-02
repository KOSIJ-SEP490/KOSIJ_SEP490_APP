import React from 'react'
import { View } from 'react-native'
import SubLayout from '@apps/customer/layouts/SubLayout'
import CustomerInfo from '@apps/customer/components/Booking/CustomerInfo'
import Divider from '@apps/customer/components/Divider'
import NotesInput from '@apps/customer/components/Booking/NotesInput'
import TotalPrice from '@apps/customer/components/Booking/TotalPrice'

export default function CustomerInformationScreen() {
  return (
    <SubLayout title='Customer Information' showBackButton={true}>
      <View className='mt-5'>
        <CustomerInfo />
        <Divider />
        <NotesInput />
        <TotalPrice />
      </View>
    </SubLayout>
  )
}
