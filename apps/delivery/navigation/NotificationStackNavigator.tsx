import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DeliveryNotificationsStackParamList } from '../types/navigationDelivery.type'
import NotificationsScreen from '../screens/navbar/NotificationsScreen'
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen'

const Stack = createStackNavigator<DeliveryNotificationsStackParamList>()

export default function DeliveryNotificationStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Notifications' component={NotificationsScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
    </Stack.Navigator>
  )
}
