import { StackNavigationProp } from "@react-navigation/stack";

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OTP: undefined;
  CustomerNavigator: undefined;
  ConsultingNavigator: undefined;
  DeliveryNavigator: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
