import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import { useTripById } from '@apps/customer/hooks/useTrip'
import { useNavigation } from '@react-navigation/native'
import {
  CustomerHomeStackNavigationProp,
  CustomerHomeStackParamList
} from '@apps/customer/types/navigationCustomerType'
import { useTripBooking } from '@apps/customer/hooks/useTripBooking'
import { TripBookingRequestType } from '@apps/customer/types/Booking/tripBooking.type'

interface TotalPriceProps {
  navigationLocation: keyof CustomerHomeStackParamList
}

const TotalPrice: React.FC<TotalPriceProps> = ({ navigationLocation }) => {
  const navigation = useNavigation<CustomerHomeStackNavigationProp>()
  const { bookingData } = useBooking()
  const { trip } = useTripById(bookingData.tripID ?? 0)
  const { bookTrip } = useTripBooking()

  const { totalPrice, adultPrice, childPrice, infantPrice } = bookingData.pricing
  const { adult, child, infant } = bookingData.numberOfCustomers

  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const handleToggleDetails = () => setIsDetailVisible((prev) => !prev)

  const isBookingDisabled = useMemo(
    () => trip?.availableSlot.startsWith('0/') || totalPrice === 0 || (trip?.daysRemaining ?? 0) < 0 || isBooking,
    [trip?.availableSlot, trip?.daysRemaining, totalPrice, isBooking]
  )

  const handleBooking = async () => {
    if (adult < 1) {
      Alert.alert('Booking Error', 'At least 1 adult is required to book this trip.')
      return
    }

    if (!bookingData.tripID) {
      Alert.alert('Booking Error', 'Trip ID is missing.')
      return
    }

    if (navigationLocation !== 'CustomerInformation') {
      const { adult: adultCount, child: childCount, infant: infantCount } = bookingData.numberOfCustomers
      const { adult: adultDetails, child: childDetails, infant: infantDetails } = bookingData.customerDetails

      if (
        adultDetails.length !== adultCount ||
        childDetails.length !== childCount ||
        infantDetails.length !== infantCount
      ) {
        Alert.alert('Missing Information', 'You should fill in all customer information before booking.')
        return
      }
    }

    if (navigationLocation === 'Payment') {
      setIsBooking(true)

      const mapPassengers = (group: typeof bookingData.customerDetails.adult, ageGroup: string) =>
        group.map(
          ({ fullName, dateOfBirth, sex, nationality, email, phoneNumber, passport, isRepresentative, hasVisa }) => ({
            ageGroup,
            fullName,
            dateOfBirth: {
              ...dateOfBirth
            },
            sex,
            nationality,
            email,
            phoneNumber,
            passport: passport ?? '',
            isRepresentative,
            hasVisa: hasVisa ?? false
          })
        )

      const bookingRequest: TripBookingRequestType = {
        tripId: bookingData.tripID ?? 0,
        note: 'Booking via app',
        passengerDetailsRequests: [
          ...mapPassengers(bookingData.customerDetails.adult, 'Adult'),
          ...mapPassengers(bookingData.customerDetails.child, 'Child'),
          ...mapPassengers(bookingData.customerDetails.infant, 'Infant')
        ]
      }

      try {
        const tripBookingId = await bookTrip(bookingRequest)
        setTimeout(() => {
          setIsBooking(false)
          navigation.navigate('Payment', { tripBookingID: tripBookingId ?? 0 })
        }, 1000)
      } catch (err) {
        setIsBooking(false)
        Alert.alert('Booking Failed', 'Something went wrong. Please try again.')
      }
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation.navigate(navigationLocation as any)
  }

  return (
    <View className='bg-blue p-5 pb-10 px-6'>
      <View className='flex-row justify-between items-center'>
        <Text className='text-white text-base font-semibold'>Total Price</Text>
        <TouchableOpacity onPress={handleToggleDetails}>
          <MaterialIcons name={isDetailVisible ? 'arrow-drop-down' : 'arrow-drop-up'} size={40} color='white' />
        </TouchableOpacity>
      </View>

      <Text className='text-white text-base font-bold mt-2'>{totalPrice.toLocaleString()} VND</Text>

      {isDetailVisible && (
        <View>
          <View className='h-[2px] bg-blue-light my-5 w-full' />

          {adult > 0 && (
            <View className='flex-row justify-between items-center'>
              <Text className='text-white text-sm'>Adult Price (x{adult})</Text>
              <Text className='text-white text-sm'>{adultPrice.toLocaleString()} VND</Text>
            </View>
          )}

          {child > 0 && (
            <View className='flex-row justify-between items-center mt-2'>
              <Text className='text-white text-sm'>Child Price (x{child})</Text>
              <Text className='text-white text-sm'>{childPrice.toLocaleString()} VND</Text>
            </View>
          )}

          {infant > 0 && (
            <View className='flex-row justify-between items-center mt-2'>
              <Text className='text-white text-sm'>Infant Price (x{infant})</Text>
              <Text className='text-white text-sm'>{infantPrice.toLocaleString()} VND</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={!isBookingDisabled ? handleBooking : undefined}
        disabled={isBookingDisabled}
        className={`rounded-lg py-3 mt-4 ${isBookingDisabled ? 'bg-gray-400' : 'bg-white'}`}
        accessibilityState={{ disabled: isBookingDisabled }}
      >
        {isBooking ? (
          <ActivityIndicator size='small' color='#0000ff' />
        ) : (
          <Text className={`text-center font-semibold text-base ${isBookingDisabled ? 'text-white' : 'text-blue'}`}>
            {navigationLocation === 'Payment' && isBooking ? 'Booking...' : 'Book Now'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default TotalPrice
