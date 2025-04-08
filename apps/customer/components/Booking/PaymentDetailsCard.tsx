import { useTripBookingCheckInById, useTripBookingCheckoutPayment } from '@apps/customer/hooks/useTripBooking'
import { useWallet } from '@apps/customer/hooks/useWallet'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { ChevronDown } from 'react-native-feather'
import PaymentSuccessModal from './PaymentSuccessModal'
import { useBooking } from '@apps/customer/contexts/BookingContext'

interface PaymentDetailsCardProps {
  tripBookingID: number
}

const PaymentDetailsCard = ({ tripBookingID }: PaymentDetailsCardProps) => {
  const { tripBookingCheckIn, error } = useTripBookingCheckInById(tripBookingID)
  const { resetBookingData } = useBooking()
  const { wallet } = useWallet()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isGrandTotalExpanded, setIsGrandTotalExpanded] = useState(false)
  const [isDepositExpanded, setIsDepositExpanded] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { checkoutTrip, checkoutData, isLoading, error: paymentError } = useTripBookingCheckoutPayment()

  const handlePayment = async () => {
    const response = await checkoutTrip(tripBookingID ?? 0)
    if (response) {
      resetBookingData()
      setIsModalVisible(true)
    }
  }

  useEffect(() => {
    if (paymentError) {
      Alert.alert('Payment Error', paymentError)
    }
  }, [paymentError])

  useEffect(() => {
    if (tripBookingCheckIn?.expiredTime) {
      const expiryTime = Math.max(
        0,
        Math.floor((new Date(tripBookingCheckIn.expiredTime).getTime() - Date.now()) / 1000)
      )
      setTimeLeft(expiryTime)
    }
  }, [tripBookingCheckIn])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00 : 00 : 00'

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return <Text className='text-red-500'>{error}</Text>
  }

  if (!tripBookingCheckIn) {
    return <Text className='text-gray-500'>Loading...</Text>
  }

  return (
    <View>
      <View className='flex-row justify-center mb-2 mt-6'>
        <Text className='text-base font-medium text-black'>Pay within </Text>
        <Text className='text-base font-medium text-red-500'>{formatTime(timeLeft)}</Text>
      </View>

      <View className='my-4 px-4 pt-6 pb-4 bg-white rounded-lg border border-gray-200'>
        <View className='flex-row justify-between mb-4'>
          <Text className='text-sm'>Booking ID</Text>
          <Text className='text-sm'>{tripBookingCheckIn?.tripBookingId ?? 'N/A'}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsGrandTotalExpanded(!isGrandTotalExpanded)}
          className='flex-row justify-between items-center mb-4'
        >
          <View className='flex-row items-center'>
            <Text className='text-sm mr-4'>Grand Total Amount</Text>
            <ChevronDown
              width={20}
              height={20}
              stroke='#000000'
              className={`${isGrandTotalExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </View>
          <Text className='text-sm'>{tripBookingCheckIn?.grandTotalAmount.toLocaleString() ?? 'N/A'} VND</Text>
        </TouchableOpacity>

        {isGrandTotalExpanded && (
          <View className='bg-blue-light p-4 rounded-lg mb-5'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-xs'>Booking Amount After Discount</Text>
              <Text className='text-xs'>
                {tripBookingCheckIn?.tripBookingAmountAfterDiscount.toLocaleString() ?? 'N/A'} VND
              </Text>
            </View>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-xs'>Discount Percentage</Text>
              <Text className='text-xs'>
                {tripBookingCheckIn?.tripBookingDetails.discountPercentage.toLocaleString() ?? 'N/A'}
              </Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xs'>Visa Amount</Text>
              <Text className='text-xs'>
                {tripBookingCheckIn?.depositAmountDetails.visaAmount.toLocaleString() ?? 'N/A'} VND
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsDepositExpanded(!isDepositExpanded)}
          className='flex-row justify-between items-center mb-4'
        >
          <View className='flex-row items-center'>
            <Text className='text-sm mr-2'>Total Deposit Amount</Text>
            <ChevronDown
              width={20}
              height={20}
              stroke='#000000'
              className={`${isDepositExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </View>
          <Text className='text-sm text-red-500'>
            {tripBookingCheckIn?.totalDepositAmount.toLocaleString() ?? 'N/A'} VND
          </Text>
        </TouchableOpacity>

        {isDepositExpanded && (
          <View className='bg-blue-light p-4 rounded-lg'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-xs'>Deposit Amount</Text>
              <Text className='text-xs'>
                {tripBookingCheckIn?.depositAmountDetails.depositAmount.toLocaleString() ?? 'N/A'} VND
              </Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xs'>Visa Amount</Text>
              <Text className='text-xs'>
                {tripBookingCheckIn?.depositAmountDetails.visaAmount.toLocaleString() ?? 'N/A'} VND
              </Text>
            </View>
          </View>
        )}
      </View>

      <View
        style={{ backgroundColor: '#FFF9B7' }}
        className='my-4 px-4 py-6 bg-white rounded-lg border border-gray-200'
      >
        <Text>Deposit Amount = {tripBookingCheckIn?.depositAmountDetails.description}</Text>
      </View>

      <View className='my-4 px-4 py-6 bg-white rounded-lg border border-gray-200 flex-row justify-between items-center mb-4'>
        <Text className='text-blue font-medium'>KOSIJ Wallet</Text>
        <Text className='text-blue font-medium'>
          {wallet?.balance.toLocaleString() ?? 'N/A'} {wallet?.currency}
        </Text>
      </View>

      <View className='flex-row justify-center mt-4'>
        <TouchableOpacity className='bg-blue px-6 py-3 rounded-md w-40' onPress={handlePayment} disabled={isLoading}>
          <Text className='text-white text-sm font-medium text-center'>{isLoading ? 'Processing...' : 'Pay'}</Text>
        </TouchableOpacity>
      </View>

      {checkoutData && (
        <PaymentSuccessModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          bookingId={checkoutData.tripBookingId}
          paymentTime={checkoutData.paymentTime}
          paymentMethod={checkoutData.paymentMethod}
          senderName={checkoutData.senderName}
          totalAmount={checkoutData.totalAmount}
          depositAmount={checkoutData.depositAmount}
          remainingAmount={checkoutData.remainingAmount}
          navigationLocation='Trips'
        />
      )}
    </View>
  )
}

export default PaymentDetailsCard
