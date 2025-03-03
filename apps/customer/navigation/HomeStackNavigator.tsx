import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/navbar/HomeScreen'
import { CustomerStackParamList } from '../types/navigationCustomerType'
import BookingScreen from '../screens/booking/BookingScreen'
import KoisScreen from '../screens/kois/KoisScreen'
import ScheduledTourDetailScreen from '../screens/booking/ScheduledTourDetailScreen'
import FarmsScreen from '../screens/farms/FarmsScreen'
import FarmDetailScreen from '../screens/farms/FarmDetailScreen'
import TripDetailScreen from '../screens/booking/TripDetailScreen'
import CustomerInformationScreen from '../screens/booking/CustomerInformationScreen'
import RecheckBookingScreen from '../screens/booking/RecheckBookingScreen'
import PaymentScreen from '../screens/booking/PaymentScreen'

const Stack = createStackNavigator<CustomerStackParamList>()

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Booking' component={BookingScreen} />
      <Stack.Screen name='Farms' component={FarmsScreen} />
      <Stack.Screen name='Kois' component={KoisScreen} />
      <Stack.Screen name='ScheduledTourDetail' component={ScheduledTourDetailScreen} />
      <Stack.Screen name='FarmDetail' component={FarmDetailScreen} />
      <Stack.Screen name='TripDetail' component={TripDetailScreen} />
      <Stack.Screen name='CustomerInformation' component={CustomerInformationScreen} />
      <Stack.Screen name='RecheckBooking' component={RecheckBookingScreen} />
      <Stack.Screen name='Payment' component={PaymentScreen} />
    </Stack.Navigator>
  )
}
