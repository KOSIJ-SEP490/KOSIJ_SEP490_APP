import MainLayout from '@apps/customer/layouts/MainLayout'
import React from 'react'
import { View, Text } from 'react-native'

export default function BookingScreen() {
  return (
    <MainLayout
      title='Booking Koi Tour'
      backgroundImage='https://images.unsplash.com/photo-1524563533368-5dc20937d23e?q=80&w=3100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={true}
    >
      <View>
        <Text>Booking Screen</Text>
      </View>
    </MainLayout>
  )
}
