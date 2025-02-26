import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/navbar/HomeScreen'
import { CustomerStackParamList } from '../types/navigationCustomerType'
import BookingScreen from '../screens/home/BookingScreen'
import KoisScreen from '../screens/home/KoisScreen'
import ScheduledTourDetailScreen from '../screens/home/ScheduledTourDetailScreen'
import FarmsScreen from '../screens/farms/FarmsScreen'
import FarmDetailScreen from '../screens/farms/FarmDetailScreen'

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
    </Stack.Navigator>
  )
}
