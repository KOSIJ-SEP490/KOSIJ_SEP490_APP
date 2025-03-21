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
  QuotationDetails: { tripRequestID: number }
  Payment: { tripBookingID: number; type: string }
}

export type CustomerSettingsStackParamList = {
  Settings: undefined
  Account: { account?: AccountType }
}
export type CustomerOrderStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
  PaymentScreen: { orderId: number }
  PaymentDetails: { orderId: number }
}

export type CustomerHomeStackNavigationProp = StackNavigationProp<CustomerHomeStackParamList>
export type CustomerTripsStackNavigationProp = StackNavigationProp<CustomerTripsStackParamList>
export type CustomerSettingsStackNavigationProp = StackNavigationProp<CustomerSettingsStackParamList>
export type CustomerOrderStackNavigationProp = StackNavigationProp<CustomerOrderStackParamList>
