import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/navbar/HomeScreen'
import { CustomerStackParamList } from '../types/navigationCustomerType'
import BookingScreen from '../screens/home/BookingScreen'
import FarmsScreen from '../screens/home/FarmsScreen'
import KoisScreen from '../screens/home/KoisScreen'

const Stack = createStackNavigator<CustomerStackParamList>()

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Booking' component={BookingScreen} />
      <Stack.Screen name='Farms' component={FarmsScreen} />
      <Stack.Screen name='Kois' component={KoisScreen} />
    </Stack.Navigator>
  )
}
