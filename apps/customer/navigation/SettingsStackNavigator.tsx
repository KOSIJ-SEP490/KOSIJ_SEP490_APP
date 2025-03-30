import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerSettingsStackParamList } from '../types/navigationCustomerType'
import SettingsScreen from '../screens/navbar/SettingsScreen'
import AccountScreen from '../screens/Settings/AccountScreen'
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen'
import WalletScreen from '../screens/Settings/WalletScreen'
import RechargeScreen from '../screens/Settings/RechargeScreen'
import WithdrawScreen from '../screens/Settings/WithdrawScreen'
import TopUpWebScreen from '../screens/Settings/TopUpWebScreen'
import WithdrawDetailsScreen from '../screens/Settings/WithdrawDetailsScreen'

const Stack = createStackNavigator<CustomerSettingsStackParamList>()

export default function CustomerSettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
      <Stack.Screen name='Wallet' component={WalletScreen} />
      <Stack.Screen name='Recharge' component={RechargeScreen} />
      <Stack.Screen name='Withdraw' component={WithdrawScreen} />
      <Stack.Screen name='WithdrawDetails' component={WithdrawDetailsScreen} />
      <Stack.Screen name='TopUpWeb' component={TopUpWebScreen} />
    </Stack.Navigator>
  )
}
