import { createStackNavigator } from '@react-navigation/stack'
import { CustomerOrderStackParamList } from '../types/navigationCustomerType'
import OrderDetailsScreen from '../screens/Home/orders/OrderDetailed'
import OrdersScreen from '../screens/navbar/OrdersScreen'
import CancelledScreen from '../screens/Home/orders/CanceledScreen'
import UpdatedScreen from '../screens/Home/orders/UpdateScreen'
import PaymentDetails from '../screens/Home/orders/PaymentDetailed'
import PaymentSuccess from '../screens/Home/orders/PaymentsSuccess'
import PaymentFailed from '../screens/Home/orders/PaymentsFailed'

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
