import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DeliveryOrdersStackParamList } from '../types/navigationDelivery.type'
import OrdersScreen from '../screens/navbar/OrdersScreen'
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen'

const Stack = createStackNavigator<DeliveryOrdersStackParamList>()

export default function DeliveryOrdersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Orders' component={OrdersScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
    </Stack.Navigator>
  )
}
