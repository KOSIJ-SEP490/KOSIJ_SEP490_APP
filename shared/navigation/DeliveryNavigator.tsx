import React from 'react'
import AppNavigator from './AppNavigator'
import NotificationsScreen from '../../apps/delivery/screens/navbar/NotificationsScreen'
import HomeStackNavigator from '@apps/delivery/navigation/HomeStackNavigator'
import OrderStackNavigator from '@apps/delivery/navigation/OrderStackNavigator'
import SettingStackNavigator from '@apps/delivery/navigation/SettingStackNavigator'

export default function DeliveryNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeStackNavigator, icon: 'home' },
        { name: 'Orders', component: OrderStackNavigator, icon: 'cart' },
        {
          name: 'Notifications',
          component: NotificationsScreen,
          icon: 'notifications'
        },
        { name: 'Settings', component: SettingStackNavigator, icon: 'settings' }
      ]}
    />
  )
}
