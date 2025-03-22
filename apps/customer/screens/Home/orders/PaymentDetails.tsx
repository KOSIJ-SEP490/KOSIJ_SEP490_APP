import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import { Appbar, Card, Button, RadioButton } from 'react-native-paper'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { useOrders } from '@apps/customer/hooks/useOrder'
import { useWallet } from '@apps/customer/hooks/useWallet'

type RootStackParamList = {
  OrderDetails: { orderId: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>

const PaymentDetails = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current
  const [countdown, setCountdown] = useState(50 * 60 + 24)
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<OrderDetailsScreenRouteProp>()
  const { orderId } = route.params
  const { fetchOrderDetails } = useOrders()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const { wallet } = useWallet()
  const [balance, setBalance] = useState<any>(null)
  const [selectedPayment, setSelectedPayment] = useState('wallet')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderId)
        if (wallet) {
          setBalance(wallet.balance)
        }
        setOrder(data)
        console.log('Order Status ne: ', order.orderStatus)
        console.log('Wallet:', wallet)
      } catch (error) {
        console.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    getOrderDetails()
    return () => clearInterval(timer)
  }, [orderId])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
  }

  const toggleSlide = () => {
    setIsExpanded(!isExpanded)
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 0 : 60,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#1E51A4' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
        <Appbar.Content title='Pay with KOSIJ Wallet' titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      {/* Countdown Timer */}
      <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 16 }}>
        Pay within <Text style={{ color: 'red', fontWeight: 'bold' }}>{formatTime(countdown)}</Text>
      </Text>

      {/* Booking Details */}
      <Card style={{ margin: 16, padding: 16 }}>
        <View className='flex-row justify-between'>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Order ID</Text>
          <Text style={{ fontSize: 16, color: 'gray', marginBottom: 8 }}>{orderId}</Text>
        </View>

        {/* Collapsible Total Amount */}
        <TouchableOpacity
          onPress={toggleSlide}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Deposit Amount</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>{formatNumber(order.paidAmount)} VND</Text>
          <MaterialIcons name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color='black' />
        </TouchableOpacity>

        {/* Expanding Section */}
        <Animated.View style={{ height: slideAnim, overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#E0E7FF', padding: 10, borderRadius: 8 }}>
            <View className='flex-row justify-between'>
              <Text style={{ fontSize: 14 }}>• 60% Fish Amount:</Text>
              <Text style={{ fontWeight: 'bold' }}>{formatNumber(order.totalFishAmount * 0.6)} VND</Text>
            </View>
            <View className='flex-row justify-between'>
              <Text style={{ fontSize: 14 }}>• Delivery Amount:</Text>
              <Text style={{ fontWeight: 'bold' }}>{formatNumber(order.totalDeliveringAmount)} VND</Text>
            </View>
          </View>
        </Animated.View>
      </Card>

      {/* Wallet Amount */}
      <Card style={{ marginHorizontal: 16, padding: 16 }}>
        <View className='flex-row justify-between'>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E51A4' }}>KOSIJ Wallet Amount</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>{formatNumber(balance)} VND</Text>
        </View>
      </Card>
      <Card style={{ marginHorizontal: 16, padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Payment Method:</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#007bff'
          }}
          onPress={() => setSelectedPayment('wallet')}
        >
          <FontAwesome name='credit-card' size={24} color='#007bff' />
          <Text style={{ flex: 1, marginLeft: 10, fontSize: 16 }}>KOSIJ Wallet</Text>
          <RadioButton.Android
            value='wallet'
            status={selectedPayment === 'wallet' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedPayment('wallet')}
          />
        </TouchableOpacity>
      </Card>

      {/* Pay Button */}
      <View style={{ marginHorizontal: 16, marginTop: 30 }}>
        <Button mode='contained' style={{ backgroundColor: '#1E51A4', paddingVertical: 8 }}>
          <Text style={{ fontSize: 18, color: 'white' }}>Pay</Text>
        </Button>
      </View>
    </View>
  )
}

export default PaymentDetails
