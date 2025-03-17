import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { useNavigation } from '@react-navigation/native'
import { CustomerTripsStackNavigationProp } from '@apps/customer/types/navigationCustomerType'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface PaymentPolicy {
  id: number
  description: string
}

interface PaymentReminderProps {
  status: string
  expiredTime: string
  paymentPolicy: PaymentPolicy[]
  cancellationReason?: string
  tripBookingID: number
}

export const PaymentReminder: React.FC<PaymentReminderProps> = ({
  status,
  expiredTime,
  paymentPolicy,
  cancellationReason,
  tripBookingID
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isExpired, setIsExpired] = useState<boolean>(false)
  const navigation = useNavigation<CustomerTripsStackNavigationProp>()

  useEffect(() => {
    if (status === 'Cancelled') return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const expiryDate = new Date(expiredTime).getTime()
      const diff = expiryDate - now

      if (diff <= 0) {
        setTimeRemaining('Expired')
        setIsExpired(true)
        return
      }

      setIsExpired(false)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [expiredTime, status])

  const getPaymentText = () => {
    switch (status) {
      case 'Pending':
        return 'Time to pay Deposited Amount'
      case 'Processing':
        return 'Time to pay Remaining Amount'
      case 'Deposited':
        return 'Wait for Sales Staff to process the information'
      case 'Cancelled':
        return 'This trip is canceled'
      default:
        return 'Payment Amount'
    }
  }

  const isButtonVisible = status !== 'Cancelled'
  const isButtonDisabled = status === 'Deposited' || isExpired

  return (
    <StyledView className='p-4 w-full max-w-lg'>
      <StyledView className='mb-4'>
        <StyledText className='text-center text-base font-medium'>{getPaymentText()}</StyledText>
        {status !== 'Cancelled' && (
          <StyledText className={`text-center text-base font-medium ${isExpired ? 'text-red-500' : 'text-red-500'}`}>
            {timeRemaining}
          </StyledText>
        )}
      </StyledView>

      <StyledView className='bg-yellow-100 rounded-xl p-4 mb-6'>
        {status === 'Cancelled' ? (
          <StyledText className='text-gray-700 text-sm leading-6'>
            Cancellation Reason: {cancellationReason || 'No reason provided.'}
          </StyledText>
        ) : status === 'Pending' ? (
          <StyledText className='text-gray-700 text-sm leading-6'>
            For pending payments, please complete the payment at least 1 hour before the deadline to secure your
            booking.
          </StyledText>
        ) : (
          paymentPolicy.map((policy) => (
            <StyledText key={policy.id} className='text-gray-700 text-sm leading-6'>
              {policy.description}
            </StyledText>
          ))
        )}
      </StyledView>

      {isButtonVisible && (
        <StyledTouchableOpacity
          className={`rounded-lg py-4 px-6 ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue'}`}
          disabled={isButtonDisabled}
          onPress={() => navigation.navigate('Payment', { tripBookingID: tripBookingID, type: 'Payment2' })}
        >
          <StyledText className='text-white text-center text-sm font-medium'>Go to Payment</StyledText>
        </StyledTouchableOpacity>
      )}
    </StyledView>
  )
}
