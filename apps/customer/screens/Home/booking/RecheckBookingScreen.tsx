import BookingDetails from '@apps/customer/components/Booking/ScheduledTrip/BookingDetails'
import PaymentMethod from '@apps/customer/components/Booking/PaymentMethod'
import TotalPrice from '@apps/customer/components/Booking/TotalPrice'
import SubLayout from '@apps/customer/layouts/SubLayout'
import React from 'react'

export default function RecheckBookingScreen() {
  return (
    <SubLayout title='Recheck Booking' showBackButton={true}>
      <BookingDetails />
      <PaymentMethod />
      <TotalPrice navigationLocation='Payment' />
    </SubLayout>
  )
}
