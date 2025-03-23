import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RotateCw, XCircle } from 'lucide-react-native'
import { SafeAreaView, View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type RootStackParamList = {
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
  PaymentScreen: { orderId: number }
  PaymentDetails: { orderId: number }
  PaymentSuccess: undefined
  PaymentFailed: { orderId: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'PaymentFailed'>
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PaymentFailed'>
const PaymentFailed = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<OrderDetailsScreenRouteProp>()
  const { orderId } = route.params
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <XCircle className='text-red-500' size={30} />
          </View>
        </View>
        <Text style={styles.title}>Payment Failed!</Text>
        <View style={styles.divider} />
        <View style={{ marginHorizontal: 16, marginTop: 30 }}>
          <Button
            mode='contained'
            style={{ backgroundColor: '#1E51A4', paddingVertical: 8 }}
            onPress={() => navigation.navigate('PaymentDetails', { orderId: orderId })}
          >
            <View className='flex-row justify-between'>
              <RotateCw color='#fff' style={{ marginRight: 2 }} />
              <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', marginLeft: 2 }}>Try Again</Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '90%',
    alignItems: 'center'
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconBackground: {
    backgroundColor: '#f8e5e5',
    padding: 20,
    borderRadius: 999
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    width: '80%'
  },
  detailsCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    width: '100%',
    marginTop: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6
  },
  label: {
    fontWeight: '500'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  }
})

export default PaymentFailed
