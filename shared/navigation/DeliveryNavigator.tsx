import React from 'react'
import AppNavigator from './AppNavigator'
import HomeScreen from '../../apps/delivery/screens/navbar/HomeScreen'
import OrdersScreen from '../../apps/delivery/screens/navbar/OrdersScreen'
import NotificationsScreen from '../../apps/delivery/screens/navbar/NotificationsScreen'
import SettingsScreen from '../../apps/delivery/screens/navbar/SettingsScreen'

export default function DeliveryNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeScreen, icon: 'home' },
        { name: 'Orders', component: OrdersScreen, icon: 'cart' },
        {
          name: 'Notifications',
          component: NotificationsScreen,
          icon: 'notifications'
        },
        { name: 'Settings', component: SettingsScreen, icon: 'settings' }
      ]}
    />
  )
}
