import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DeliverySettingsStackParamList } from '../types/navigationDelivery.type'
import SettingsScreen from '../screens/navbar/SettingsScreen'

const Stack = createStackNavigator<DeliverySettingsStackParamList>()

export default function DeliveryHomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Settings' component={SettingsScreen} />
    </Stack.Navigator>
  )
}
