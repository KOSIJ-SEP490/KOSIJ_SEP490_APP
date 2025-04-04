import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DeliverySettingsStackParamList } from '../types/navigationDelivery.type'
import SettingsScreen from '../screens/navbar/SettingsScreen'
import AccountScreen from '../screens/Settings/AccountScreen'
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen'

const Stack = createStackNavigator<DeliverySettingsStackParamList>()

export default function DeliverySettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
    </Stack.Navigator>
  )
}
