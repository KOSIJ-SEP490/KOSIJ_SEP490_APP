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
}

export type CustomerTripsStackParamList = {
  Trips: undefined
}

export type CustomerHomeStackNavigationProp = StackNavigationProp<CustomerHomeStackParamList>
export type CustomerTripsStackNavigationProp = StackNavigationProp<CustomerTripsStackParamList>
