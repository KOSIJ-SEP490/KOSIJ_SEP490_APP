import React from 'react'
import AppNavigator from './AppNavigator'
import HomeStackNavigator from '@apps/delivery/navigation/HomeStackNavigator'
import OrderStackNavigator from '@apps/delivery/navigation/OrderStackNavigator'
import SettingStackNavigator from '@apps/delivery/navigation/SettingStackNavigator'
import NotificationStackNavigator from '@apps/delivery/navigation/NotificationStackNavigator'

export default function DeliveryNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeStackNavigator, icon: 'home' },
        { name: 'Orders', component: OrderStackNavigator, icon: 'cart' },
        {
          name: 'Notifications',
          component: NotificationStackNavigator,
          icon: 'notifications'
        },
        { name: 'Settings', component: SettingStackNavigator, icon: 'settings' }
      ]}
    />
  )
}
