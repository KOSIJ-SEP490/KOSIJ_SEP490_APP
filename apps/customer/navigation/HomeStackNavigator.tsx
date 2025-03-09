import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/navbar/HomeScreen'
import BookingScreen from '../screens/Home/booking/BookingScreen'
import KoisScreen from '../screens/Home/kois/KoisScreen'
import ScheduledTourDetailScreen from '../screens/Home/booking/ScheduledTourDetailScreen'
import FarmsScreen from '../screens/Home/farms/FarmsScreen'
import FarmDetailScreen from '../screens/Home/farms/FarmDetailScreen'
import TripDetailScreen from '../screens/Home/booking/TripDetailScreen'
import CustomerInformationScreen from '../screens/Home/booking/CustomerInformationScreen'
import RecheckBookingScreen from '../screens/Home/booking/RecheckBookingScreen'
import PaymentScreen from '../screens/Home/booking/PaymentScreen'
import { CustomerHomeStackParamList } from '../types/navigationCustomerType'

const Stack = createStackNavigator<CustomerHomeStackParamList>()

export default function CustomerHomeStackNavigator() {
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
