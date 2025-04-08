import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { CustomerNotificationsStackParamList } from '../types/navigationCustomerType'
import NotificationsScreen from '../screens/navbar/NotificationsScreen'
import WithdrawDetailsScreen from '../screens/Settings/WithdrawDetailsScreen'
import TripRequestDetailsScreen from '../screens/Trips/TripRequestDetailsScreen'
import TripBookingDetailsScreen from '../screens/Trips/TripBookingDetailsScreen'
import QuotationDetailsScreen from '../screens/Trips/QuotationDetailsScreen'
import PaymentScreen from '../screens/Home/booking/PaymentScreen'
import RateTripDetails from '../screens/Trips/RateTripDetails'

const Stack = createStackNavigator<CustomerNotificationsStackParamList>()

export default function CustomerNotificationsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Notifications' component={NotificationsScreen} />
      <Stack.Screen name='WithdrawDetails' component={WithdrawDetailsScreen} />
      <Stack.Screen name='TripBookingDetails' component={TripBookingDetailsScreen} />
      <Stack.Screen name='TripRequestDetails' component={TripRequestDetailsScreen} />
      <Stack.Screen name='QuotationDetails' component={QuotationDetailsScreen} />
      <Stack.Screen name='Payment' component={PaymentScreen} />
      <Stack.Screen name='RateTripDetails' component={RateTripDetails} />
    </Stack.Navigator>
  )
}
