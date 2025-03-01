import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useBooking } from '@apps/customer/contexts/BookingContext'

const TotalPrice: React.FC = () => {
  const { bookingData } = useBooking()

  const { totalPrice, adultPrice, childPrice, infantPrice } = bookingData.pricing

  const [isDetailVisible, setIsDetailVisible] = useState(false)

  const handleToggleDetails = () => {
    setIsDetailVisible((prev) => !prev)
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
        <View className='mt-4'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-white text-sm'>Adult Price</Text>
            <Text className='text-white text-sm'>{adultPrice.toLocaleString()} VND</Text>
          </View>
          <View className='flex-row justify-between items-center mt-2'>
            <Text className='text-white text-sm'>Child Price</Text>
            <Text className='text-white text-sm'>{childPrice.toLocaleString()} VND</Text>
          </View>
          <View className='flex-row justify-between items-center mt-2'>
            <Text className='text-white text-sm'>Infant Price</Text>
            <Text className='text-white text-sm'>{infantPrice.toLocaleString()} VND</Text>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={() => alert('Book Now')} className='bg-white rounded-lg py-3 mt-4'>
        <Text className='text-center text-blue font-semibold text-base'>Book Now</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TotalPrice
