import React from 'react'
import { View } from 'react-native'
import SubLayout from '@apps/customer/layouts/SubLayout'
import CustomerInfo from '@apps/customer/components/Booking/CustomerInfo'
import Divider from '@apps/customer/components/Divider'
import NotesInput from '@apps/customer/components/Booking/NotesInput'
import TotalPrice from '@apps/customer/components/Booking/TotalPrice'
import { useBooking } from '@apps/customer/contexts/BookingContext'

export default function CustomerInformationScreen() {
  const { bookingData } = useBooking()
  const { adult, child, infant } = bookingData.numberOfCustomers

  const totalCustomers = adult + child + infant

  return (
    <SubLayout title='Customer Information' showBackButton={true}>
      <View className='flex-1 mt-5'>
        <CustomerInfo />
        <Divider />
        <NotesInput />

        <View className={`mt-5 ${totalCustomers <= 2 ? 'flex-1 justify-end' : ''}`}>
          <TotalPrice navigationLocation='RecheckBooking' />
        </View>
      </View>
    </SubLayout>
  )
}
