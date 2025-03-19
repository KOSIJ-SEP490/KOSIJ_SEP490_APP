import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerSettingsStackParamList } from '../types/navigationCustomerType'
import SettingsScreen from '../screens/navbar/SettingsScreen'
import AccountScreen from '../screens/Settings/AccountScreen'

const Stack = createStackNavigator<CustomerSettingsStackParamList>()

export default function CustomerSettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Account' component={AccountScreen} />
    </Stack.Navigator>
  )
}
