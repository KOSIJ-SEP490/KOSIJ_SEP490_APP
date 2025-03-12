import NotesInput from '@apps/customer/components/Booking/NotesInput'
import SubmitBtn from '@apps/customer/components/Booking/SubmitBtn'
import TravelInfoCard from '@apps/customer/components/Booking/TravelInforCard'
import Divider from '@apps/customer/components/Divider'
import SubLayout from '@apps/customer/layouts/SubLayout'
import React from 'react'
import { View } from 'react-native'

export default function TravelInformationScreen() {
  return (
    <SubLayout title='Travel Information' showBackButton={true}>
      <View className='flex-1 py-4'>
        <TravelInfoCard />
        <Divider />
        <NotesInput source='bookingRequest' />
        <View className='mx-5 mt-4'>
          <SubmitBtn title='Submit Request' />
        </View>
      </View>
    </SubLayout>
  )
}
