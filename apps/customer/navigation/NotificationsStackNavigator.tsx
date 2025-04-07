import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerNotificationsStackParamList } from '../types/navigationCustomerType'
import NotificationsScreen from '../screens/navbar/NotificationsScreen'

const Stack = createStackNavigator<CustomerNotificationsStackParamList>()

export default function CustomerNotificationsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Notifications' component={NotificationsScreen} />
    </Stack.Navigator>
  )
}
