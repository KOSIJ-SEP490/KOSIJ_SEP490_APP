import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { Appbar, Card, RadioButton } from 'react-native-paper'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type RootStackParamList = {
  OrderDetails: { orderId: number }
}
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>

const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProps>()
  const [selectedPayment, setSelectedPayment] = React.useState('wallet')
  const [isExpanded, setIsExpanded] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  const toggleSlide = () => {
    setIsExpanded(!isExpanded)
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 0 : 150,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: 'white', elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Recheck Booking' />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        {/* Booking Details */}
        <Card style={{ padding: 16, marginVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Booking Details</Text>
          <Text style={{ color: 'gray', marginBottom: 10 }}>Trip ID: TRP24192</Text>

          {/* Start & End Time */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <Card style={{ flex: 1, padding: 10, marginRight: 5 }}>
              <Text style={{ fontWeight: 'bold', color: '#007bff' }}>Start time</Text>
              <Text style={{ fontSize: 14 }}>2024-12-01 09:00</Text>
            </Card>
            <Card style={{ flex: 1, padding: 10, marginLeft: 5 }}>
              <Text style={{ fontWeight: 'bold', color: '#007bff' }}>End time</Text>
              <Text style={{ fontSize: 14 }}>2024-12-03 12:00</Text>
            </Card>
          </View>

          {/* Additional Information */}
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Additional information</Text>
          <View style={{ gap: 8 }}>
            <Text>
              <MaterialIcons name='flight' size={16} /> Airline: Vietnam Airlines (Tan Son Nhat airport)
            </Text>
            <Text>
              <FontAwesome name='hotel' size={16} /> Hotel: Janria Hotel (Tokyo)
            </Text>
            <Text>
              <MaterialIcons name='group' size={16} /> Number of Customers: 5
            </Text>
            <Text>
              <MaterialIcons name='location-on' size={16} /> Departure: Ho Chi Minh (Tan Son Nhat)
            </Text>
            <Text>
              <MaterialIcons name='place' size={16} /> Destination: Tokyo (Narita)
            </Text>
            <Text>
              <MaterialIcons name='access-time' size={16} /> Time: 5 days, 4 nights
            </Text>
            <Text>
              <MaterialIcons name='eco' size={16} /> Farms to visit: 5 Farms
            </Text>
          </View>
        </Card>

        {/* Payment Method */}
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

        {/* Policy */}
        <Text style={{ fontSize: 14, marginTop: 15 }}>
          By booking, you confirm that you agree to the{' '}
          <Text style={{ color: '#007bff', textDecorationLine: 'underline' }}>terms, policies, and conditions</Text> of
          KOSIJ.
        </Text>
      </ScrollView>

      {/* Total Price (Collapsible) */}
      <TouchableOpacity
        onPress={toggleSlide}
        style={{
          backgroundColor: '#007bff',
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Total Price</Text>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>39.500.000 VND</Text>
        <MaterialIcons name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={24} color='white' />
      </TouchableOpacity>

      {/* Sliding Section */}
      <Animated.View
        style={{
          height: slideAnim,
          backgroundColor: '#007bff',
          overflow: 'hidden',
          paddingHorizontal: 16,
          paddingVertical: isExpanded ? 10 : 0
        }}
      >
        <Text style={{ fontSize: 14, color: '#fff' }}>Breakdown:</Text>
        <Text style={{ fontSize: 14, marginTop: 5, color: '#fff' }}>- Base Price: 35.000.000 VND</Text>
        <Text style={{ fontSize: 14, marginTop: 5, color: '#fff' }}>- Tax & Fees: 4.500.000 VND</Text>
      </Animated.View>

      {/* Continue Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          paddingVertical: 16,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PaymentScreen
