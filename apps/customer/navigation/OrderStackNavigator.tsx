import { createStackNavigator } from '@react-navigation/stack'
import { CustomerOrderStackParamList } from '../types/navigationCustomerType'
import OrderDetailsScreen from '../screens/Home/orders/OrderDetails'
import OrdersScreen from '../screens/navbar/OrdersScreen'
import CancelledScreen from '../screens/Home/orders/CancelledScreen'
import UpdatedScreen from '../screens/Home/orders/UpdatedScreen'
import PaymentDetails from '../screens/Home/orders/PaymentDetails'
import PaymentSuccess from '../screens/Home/orders/PaymentSuccess'
import PaymentFailed from '../screens/Home/orders/PaymentFailed'

const Stack = createStackNavigator<CustomerOrderStackParamList>()

export default function CustomerOrderStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Orders' component={OrdersScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} />
      <Stack.Screen name='CancelledScreen' component={CancelledScreen} />
      <Stack.Screen name='UpdatedScreen' component={UpdatedScreen} />
      <Stack.Screen name='PaymentDetails' component={PaymentDetails} />
      <Stack.Screen name='PaymentSuccess' component={PaymentSuccess} />
      <Stack.Screen name='PaymentFailed' component={PaymentFailed} />
    </Stack.Navigator>
  )
}
