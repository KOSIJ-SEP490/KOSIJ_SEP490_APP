import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AppNavigator from './AppNavigator'
import DashboardScreen from '@apps/consulting/screens/navbar/Dashboard'
import TripScreen from '@apps/consulting/screens/navbar/TripScreen'
import NotiScreen from '@apps/consulting/screens/navbar/NotificationScreens'
import OrdersScreen from '@apps/consulting/screens/navbar/OrdersScreen'
import SettingsScreen from '@apps/consulting/screens/navbar/SettingsScreen'
import TourDetailsScreen from '@apps/consulting/components/TourDetailed'
import CollectTicket from '@apps/consulting/components/CollectedTicket'
import CheckOutTrip from '@apps/consulting/components/CheckedOutTrip'
import OrderDetailsScreen from '@apps/consulting/components/OrderDetailed'
import CreateOrder from '@apps/consulting/components/CreatedOrder'
import UpdateOrder from '@apps/consulting/components/UpdatedOrder'
import EditProfile from '@apps/consulting/components/EditedProfile'
import { AccountType } from '@shared/types/Account.dto'
import ChangePassword from '@apps/consulting/components/ChangePassword'
import AccountScreen from '@apps/consulting/components/AccountComponent'
import MessageScreen from '@apps/consulting/components/MessageScreen'
import ContactScreen from '@apps/consulting/components/ContactScreen'

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
  Messages: { selectedUserId: string } | undefined
  Contact: undefined
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
      <Stack.Screen name='Messages' component={MessageScreen} />
      <Stack.Screen name='Contact' component={ContactScreen} />
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
