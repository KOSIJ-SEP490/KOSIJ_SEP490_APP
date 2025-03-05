import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import SubLayout from '@apps/customer/layouts/SubLayout'

export default function PaymentScreen() {
  const [timeLeft, setTimeLeft] = useState(50 * 60 + 24) // 50 min 24 sec countdown

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
  }

  return (
    <SubLayout title='Payment' showBackButton={true}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Countdown Timer */}
        <Text className='text-center text-base font-semibold mt-5'>
          Pay within <Text className='text-red-500'>{formatTime(timeLeft)}</Text>
        </Text>

        {/* Booking Details */}
        <View className='bg-gray-100 p-4 rounded-lg mt-4'>
          <Text className='text-gray-500'>Booking ID</Text>
          <Text className='text-black font-bold'>BOOK-24122025</Text>

          <View className='flex-row justify-between items-center mt-3'>
            <Text className='text-gray-500'>Deposit Amount</Text>
            <Text className='text-red-500 text-base font-bold'>19.400.000 VND</Text>
          </View>

          {/* Deposit Breakdown */}
          <View className='bg-blue-100 p-3 rounded-lg mt-2'>
            <Text className='text-black'>
              • 40% Booking Amount: <Text className='font-bold'>13.400.000 VND</Text>
            </Text>
            <Text className='text-black'>
              • Visa Amount: <Text className='font-bold'>6.000.000 VND</Text>
            </Text>
          </View>
        </View>

        {/* Notice */}
        <View className='bg-yellow-200 p-3 rounded-lg mt-4'>
          <Text className='text-black text-sm'>
            Customers must register at least 3 weeks before the departure date.
          </Text>
          <Text className='text-black text-sm mt-1'>
            Deposit deadline: at least 21 days before departure (if spots are available).
          </Text>
        </View>

        {/* Wallet Amount */}
        <View className='border border-gray-300 p-3 rounded-lg mt-4 flex-row justify-between'>
          <Text className='text-blue-600 font-semibold'>KOSIJ Wallet Amount</Text>
          <Text className='text-black font-semibold'>50.000.000 VND</Text>
        </View>

        {/* Action Buttons */}
        <View className='flex-row justify-between mt-6'>
          <TouchableOpacity className='bg-red-500 flex-1 p-4 rounded-lg mr-2'>
            <Text className='text-white text-center font-bold'>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-blue flex-1 p-4 rounded-lg ml-2'>
            <Text className='text-white text-center font-bold'>Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SubLayout>
  )
}
