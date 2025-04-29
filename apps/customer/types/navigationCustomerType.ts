import { StackNavigationProp } from '@react-navigation/stack'
import { AccountType } from './Account/account.type'

export type CustomerHomeStackParamList = {
  Home: undefined
  Booking: undefined
  Farms: undefined
  Kois: undefined
  ScheduledTourDetail: { tourID: number }
  FarmDetail: { farmID: number }
  TripDetail: { tourID: number }
  CustomerInformation: undefined
  RecheckBooking: undefined
  Payment: { tripBookingID: number; type: string }
  KoiVarietySelection: undefined
  TravelInformation: undefined
}

export type CustomerTripsStackParamList = {
  Trips: { initialTab?: string }
  TripBookingDetails: { tripBookingID: number }
  TripRequestDetails: { tripRequestID: number }
  FarmDetail: { farmID: number }
  QuotationDetails: { tripRequestID: number }
  Payment: { tripBookingID: number; type: string }
  PassengerInformation: { tripBookingID: number }
  RateTripDetails: { tripBookingID: number }
}

export type CustomerNotificationsStackParamList = {
  Notifications: undefined
  WithdrawDetails: { withdrawID?: number }
  TripBookingDetails: { tripBookingID: number }
  TripRequestDetails: { tripRequestID: number }
  QuotationDetails: { tripRequestID: number }
  Payment: { tripBookingID: number; type: string }
  PassengerInformation: { tripBookingID: number }
  RateTripDetails: { tripBookingID: number }
}

export type CustomerSettingsStackParamList = {
  Settings: undefined
  Account: { account?: AccountType }
  ChangePassword: { account?: AccountType }
  Wallet?: undefined
  Recharge: undefined
  Withdraw: undefined
  WithdrawDetails: { withdrawID?: number }
  TopUpWeb: { url?: string }
}
export type CustomerOrderStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
  PaymentDetails: { orderId: number }
  PaymentSuccess: { orderId: number }
  PaymentFailed: { orderId: number }
}

export type CustomerHomeStackNavigationProp = StackNavigationProp<CustomerHomeStackParamList>
export type CustomerTripsStackNavigationProp = StackNavigationProp<CustomerTripsStackParamList>
export type CustomerSettingsStackNavigationProp = StackNavigationProp<CustomerSettingsStackParamList>
export type CustomerOrderStackNavigationProp = StackNavigationProp<CustomerOrderStackParamList>
export type CustomerNotificationsStackNavigationProp = StackNavigationProp<CustomerNotificationsStackParamList>
