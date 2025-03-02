import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AppNavigator from './AppNavigator'
import DashboardScreen from '@apps/consulting/screens/navbar/Dashboard'
import TripScreen from '@apps/consulting/screens/navbar/TripScreen'
import NotiScreen from '@apps/consulting/screens/navbar/NotificationScreens'
import OrdersScreen from '@apps/consulting/screens/navbar/OrdersScreen'
import SettingsScreen from '@apps/consulting/screens/navbar/SettingsScreen'
import TourDetailsScreen from '@apps/consulting/components/TourDetails'
import CollectTicket from '@apps/consulting/components/CollectTicket'

type RootStackParamList = {
  MainTabs: undefined // If it doesn't need params
  TourDetails: undefined // If it doesn't need params
  CollectTicket: { ticketImage: string }
}

const Stack = createStackNavigator<RootStackParamList>()
export default function ConsultingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MainTabs' component={MainTabNavigator} />
      <Stack.Screen name='TourDetails' component={TourDetailsScreen} />
      <Stack.Screen name='CollectTicket' component={CollectTicket} />
    </Stack.Navigator>
  )
}

const MainTabNavigator = () => {
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
