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
import CheckOutTrip from '@apps/consulting/components/CheckOutTrip'
import OrderDetailsScreen from '@apps/consulting/components/OrderDetails'
import CreateOrder from '@apps/consulting/components/CreateOrder'
import UpdateOrder from '@apps/consulting/components/UpdatedOrder'
import EditProfile from '@apps/consulting/components/EditProfile'
import { AccountType } from '@shared/types/Account.dto'
import ChangePassword from '@apps/consulting/components/ChangePassword'
import AccountScreen from '@apps/consulting/components/AccountComponent'

type MainTabParamList = {
  Home: undefined
  Trip: undefined
  Notification: undefined
  Orders: undefined
  Settings: undefined
}

type RootStackParamList = {
  MainTabs: {
    screen?: keyof MainTabParamList
  }
  TourDetails: undefined
  CollectTicket: { ticketImage: string }
  CheckOutTrip: { ticketImage: string }
  OrderDetails: undefined
  CreateOrder: undefined
  UpdateOrder: undefined
  EditProfile: undefined
  ChangePassword: { account?: AccountType }
  AccountDetails: { account?: AccountType }
}

const Stack = createStackNavigator<RootStackParamList>()
export default function ConsultingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MainTabs' component={MainTabNavigator} />
      <Stack.Screen name='TourDetails' component={TourDetailsScreen} />
      <Stack.Screen name='CollectTicket' component={CollectTicket} />
      <Stack.Screen name='CheckOutTrip' component={CheckOutTrip} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
      <Stack.Screen name='CreateOrder' component={CreateOrder} />
      <Stack.Screen name='UpdateOrder' component={UpdateOrder} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
      <Stack.Screen name='AccountDetails' component={AccountScreen} />
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
