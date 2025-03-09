import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerTripsStackParamList } from '../types/navigationCustomerType'
import TripsScreen from '../screens/navbar/TripsScreen'

const Stack = createStackNavigator<CustomerTripsStackParamList>()

export default function CustomerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Trips' component={TripsScreen} />
    </Stack.Navigator>
  )
}
