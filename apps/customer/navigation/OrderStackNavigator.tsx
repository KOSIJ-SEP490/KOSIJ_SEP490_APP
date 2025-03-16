import { createStackNavigator } from '@react-navigation/stack'
import { CustomerOrderStackParamList } from '../types/navigationCustomerType'
import OrderDetailsScreen from '../screens/Home/orders/OrderDetails'
import OrdersScreen from '../screens/navbar/OrdersScreen'
import CancelledScreen from '../screens/Home/orders/CancelledScreen'

const Stack = createStackNavigator<CustomerOrderStackParamList>()

export default function CustomerOrderStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Orders' component={OrdersScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
      <Stack.Screen name='CancelledScreen' component={CancelledScreen} />
    </Stack.Navigator>
  )
}
