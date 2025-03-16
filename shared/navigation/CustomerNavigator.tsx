import React from 'react'
import AppNavigator from './AppNavigator'
import HomeStackNavigator from '@apps/customer/navigation/HomeStackNavigator'
import NotificationsScreen from '@apps/customer/screens/navbar/NotificationsScreen'
import SettingsScreen from '@apps/customer/screens/navbar/SettingsScreen'
import TripsStackNavigator from '@apps/customer/navigation/TripsStackNavigator'
import CustomerOrderStackNavigator from '@apps/customer/navigation/OrderStackNavigator'

export default function CustomerNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeStackNavigator, icon: 'home' },
        { name: 'Trips', component: TripsStackNavigator, icon: 'map' },
        { name: 'Orders', component: CustomerOrderStackNavigator, icon: 'cart' },
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
