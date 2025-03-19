import { StackNavigationProp } from '@react-navigation/stack'

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
  Payment: { tripBookingID: number }
  KoiVarietySelection: undefined
  TravelInformation: undefined
}

export type CustomerTripsStackParamList = {
  Trips: { initialTab?: string }
  TripBookingDetails: { tripBookingID: number }
  TripRequestDetails: { tripRequestID: number }
}

export type CustomerOrderStackParamList = {
  Orders: undefined
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
}

export type CustomerHomeStackNavigationProp = StackNavigationProp<CustomerHomeStackParamList>
export type CustomerTripsStackNavigationProp = StackNavigationProp<CustomerTripsStackParamList>
export type CustomerOrderStackNavigationProp = StackNavigationProp<CustomerOrderStackParamList>
