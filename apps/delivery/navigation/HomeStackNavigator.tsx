import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DeliveryHomeStackParamList } from '../types/navigationDelivery.type'
import HomeScreen from '../screens/navbar/HomeScreen'
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen'

const Stack = createStackNavigator<DeliveryHomeStackParamList>()

export default function DeliveryHomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
    </Stack.Navigator>
  )
}
