import { StackNavigationProp } from '@react-navigation/stack'

export type CustomerStackParamList = {
  Home: undefined
  Booking: undefined
  Farms: undefined
  Kois: undefined
  ScheduledTourDetail: { tourID: number }
}

export type CustomerStackNavigationProp = StackNavigationProp<CustomerStackParamList>
