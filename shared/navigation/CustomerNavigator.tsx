import React from 'react'
import AppNavigator from './AppNavigator'
import TripsScreen from '../../apps/customer/screens/navbar/TripsScreen'
import NotificationsScreen from '../../apps/customer/screens/navbar/NotificationsScreen'
import OrdersScreen from '../../apps/customer/screens/navbar/OrdersScreen'
import SettingsScreen from '../../apps/customer/screens/navbar/SettingsScreen'
import HomeStackNavigator from '@apps/customer/navigation/HomeStackNavigation'

export default function CustomerNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeStackNavigator, icon: 'home' },
        { name: 'Trips', component: TripsScreen, icon: 'map' },
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
