import { StackNavigationProp } from '@react-navigation/stack'

export type CustomerStackParamList = {
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

export type CustomerStackNavigationProp = StackNavigationProp<CustomerStackParamList>
