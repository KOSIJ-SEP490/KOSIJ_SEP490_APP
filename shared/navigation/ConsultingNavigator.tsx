import DashboardScreen from '@apps/consulting/screens/navbar/Dashboard'
import AppNavigator from './AppNavigator'
import React from 'react'
import TripScreen from '@apps/consulting/screens/navbar/TripScreen'
import NotiScreen from '@apps/consulting/screens/navbar/NotificationScreens'
import OrdersScreen from '@apps/consulting/screens/navbar/OrdersScreen'
import SettingsScreen from '@apps/consulting/screens/navbar/SettingsScreen'

export default function ConsultingNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: 'Home', component: DashboardScreen, icon: 'home-outline' },
        { name: 'Trip', component: TripScreen, icon: 'document-text-outline' },
        { name: 'Notification', component: NotiScreen, icon: 'notifications-outline' },
        { name: 'Orders', component: OrdersScreen, icon: 'cart-outline' },
        { name: 'Settings', component: SettingsScreen, icon: 'settings-outline' }
      ]}
    />
  )
}
