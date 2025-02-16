import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../auth/SplashScreen";
import RegisterScreen from "../auth/RegisterScreen";
import OtpScreen from "../auth/OtpScreen";
import LoginScreen from "../auth/LoginScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
