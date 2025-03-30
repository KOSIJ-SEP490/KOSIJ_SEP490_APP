import { StackNavigationProp } from '@react-navigation/stack'
import { AccountType } from './Account/account.type'

export type DeliveryHomeStackParamList = {
  Home: undefined
}

export type DeliveryOrdersStackParamList = {
  Orders: undefined
  OrderDetails: { orderID: number }
}

export type DeliverySettingsStackParamList = {
  Settings: undefined
  Account: { account?: AccountType }
  ChangePassword: { account?: AccountType }
}

export type DeliveryHomeStackNavigationProp = StackNavigationProp<DeliveryHomeStackParamList>
export type DeliverySettingsStackNavigationProp = StackNavigationProp<DeliverySettingsStackParamList>
export type DeliveryOrderStackNavigationProp = StackNavigationProp<DeliveryOrdersStackParamList>
