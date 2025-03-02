import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import { useTripById } from '@apps/customer/hooks/useTrip'
import { useNavigation } from '@react-navigation/native'
import { CustomerStackNavigationProp } from '@apps/customer/types/navigationCustomerType'

const TotalPrice: React.FC = () => {
  const navigation = useNavigation<CustomerStackNavigationProp>()
  const { bookingData } = useBooking()
  const { trip } = useTripById(bookingData.tripID ?? 0)

  const { totalPrice, adultPrice, childPrice, infantPrice } = bookingData.pricing
  const { adult, child, infant } = bookingData.numberOfCustomers

  const [isDetailVisible, setIsDetailVisible] = useState(false)

  const handleToggleDetails = () => setIsDetailVisible((prev) => !prev)

  const isBookingDisabled = useMemo(
    () =>
      trip?.availableSlot === '00/30' ||
      trip?.availableSlot === '0/30' ||
      totalPrice === 0 ||
      (trip?.daysRemaining ?? 0) < 0,
    [trip?.availableSlot, trip?.daysRemaining, totalPrice]
  )

  const handleBooking = () => {
    if (adult < 1) {
      Alert.alert('Booking Error', 'At least 1 adult is required to book this trip.')
      return
    }
    navigation.navigate('CustomerInformation')
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
        <Text className={`text-center font-semibold text-base ${isBookingDisabled ? 'text-white' : 'text-blue'}`}>
          Book Now
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default TotalPrice
