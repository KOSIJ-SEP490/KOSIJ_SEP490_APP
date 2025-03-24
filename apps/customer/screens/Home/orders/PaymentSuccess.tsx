import { useOrders } from '@apps/customer/hooks/useOrder'
import { useWallet } from '@apps/customer/hooks/useWallet'
import { PaymentData } from '@apps/customer/types/Wallet/wallet.type'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { CheckCircle, House } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Button, Card } from 'react-native-paper'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type RootStackParamList = {
  OrderDetails: { orderId: number }
  CancelledScreen: { orderId: number }
  UpdatedScreen: { orderId: number }
  PaymentScreen: { orderId: number }
  PaymentDetails: { orderId: number }
  PaymentSuccess: { orderId: number }
  PaymentFailed: undefined
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'PaymentSuccess'>
type PaymentSuccessScreenRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>

const PaymentSuccess = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<PaymentSuccessScreenRouteProp>()
  const { orderId } = route.params
  const { fetchOrderDetails, checkOutPayments } = useOrders()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>({})
  const { wallet, refetch: refetchWallet } = useWallet()
  const [balance, setBalance] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        if (wallet) {
          setBalance(wallet.balance)
        }
        setOrder(data)
        if (order) {
          console.log('Order Status ne: ', order.orderStatus)
        }
        console.log('Wallet:', wallet)
      } catch (error) {
        console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    const fetchPaymentDetails = async () => {
      try {
        const response = await checkOutPayments(orderId)
        setPaymentData(response)
      } catch (error) {
        console.error('Error fetching payment details:', error)
      } finally {
        setLoading(false)
      }
    }
    refetchWallet()
    fetchPaymentDetails()
    getOrderDetails()
  }, [orderId])

  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <>
      {order && order.orderStatus === 'Deposited' ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <CheckCircle color='#3b82f6' size={50} />
              </View>
            </View>
            <Text style={styles.title}>Payment Success!</Text>
            <View style={styles.divider} />

            <Card style={styles.detailsCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Order ID</Text>
                <Text>{orderId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Time</Text>
                <Text>{paymentData?.paymentTime ?? 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Method</Text>
                <Text>KOSIJ Wallet</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sender Name</Text>
                <Text>{paymentData?.senderName ?? 'N/A'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Amount</Text>
                <Text style={styles.totalAmount}>{paymentData?.depositAmount ?? 'N/A'} VND</Text>
              </View>
            </Card>
            <View style={styles.divider} />

            <View style={{ marginHorizontal: 16, marginTop: 30 }}>
              <Button
                mode='contained'
                style={{ backgroundColor: '#1E51A4', paddingVertical: 8 }}
                onPress={() => navigation.navigate('OrderDetails', { orderId: orderId })}
              >
                <House color='#fff' />
                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Go Home</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <CheckCircle color='#3b82f6' size={50} />
              </View>
            </View>
            <Text style={styles.title}>Payment Success!</Text>
            <View style={styles.divider} />

            <Card style={styles.detailsCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Order ID</Text>
                <Text>{orderId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Time</Text>
                <Text>{paymentData?.paymentTime ?? 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Method</Text>
                <Text>KOSIJ Wallet</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sender Name</Text>
                <Text>{paymentData?.senderName ?? 'N/A'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Amount</Text>
                <Text style={styles.totalAmount}>{paymentData?.remainingAmount ?? 'N/A'} VND</Text>
              </View>
            </Card>
            <View style={styles.divider} />

            <View style={{ marginHorizontal: 16, marginTop: 30 }}>
              <Button
                mode='contained'
                style={{ backgroundColor: '#1E51A4', paddingVertical: 8 }}
                onPress={() => navigation.navigate('OrderDetails', { orderId: orderId })}
              >
                <House color='#fff' />
                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Go Home</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
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
    backgroundColor: '#dbeafe',
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
    marginVertical: 10,
    width: '100%'
  },
  detailsCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
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

export default PaymentSuccess
