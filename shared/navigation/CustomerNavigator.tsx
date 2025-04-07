import React from 'react'
import AppNavigator from './AppNavigator'
import HomeStackNavigator from '@apps/customer/navigation/HomeStackNavigator'
import TripsStackNavigator from '@apps/customer/navigation/TripsStackNavigator'
import SettingsStackNavigator from '@apps/customer/navigation/SettingsStackNavigator'
import CustomerOrderStackNavigator from '@apps/customer/navigation/OrderStackNavigator'
import CustomerNotificationsStackNavigator from '@apps/customer/navigation/NotificationsStackNavigator'

export default function CustomerNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: HomeStackNavigator, icon: 'home' },
        { name: 'Trips', component: TripsStackNavigator, icon: 'map' },
        { name: 'Orders', component: CustomerOrderStackNavigator, icon: 'cart' },
        {
          name: 'Notifications',
          component: CustomerNotificationsStackNavigator,
          icon: 'notifications'
        },
        { name: 'Settings', component: SettingsStackNavigator, icon: 'settings' }
      ]}
    />
  )
}
