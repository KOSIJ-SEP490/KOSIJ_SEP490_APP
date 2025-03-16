import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerTripsStackParamList } from '../types/navigationCustomerType'
import TripsScreen from '../screens/navbar/TripsScreen'
import TripBookingDetailsScreen from '../screens/Trips/TripBookingDetailsScreen'
import TripRequestDetailsScreen from '../screens/Trips/TripRequestDetailsScreen'

const Stack = createStackNavigator<CustomerTripsStackParamList>()

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Trips' component={TripsScreen} />
      <Stack.Screen name='TripBookingDetails' component={TripBookingDetailsScreen} />
      <Stack.Screen name='TripRequestDetails' component={TripRequestDetailsScreen} />
    </Stack.Navigator>
  )
}
