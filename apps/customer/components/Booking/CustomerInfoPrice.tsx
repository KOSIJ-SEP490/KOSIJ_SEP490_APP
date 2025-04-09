import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
// const StyledTouchableOpacity = styled(TouchableOpacity)

interface PassengerDetail {
  ageGroup: string
  description: string
  unitPrice: number
  quantity: number
}

interface VisaDetail {
  quantity: number
  unitPrice: number
}

interface BookingDetails {
  passengerDetails: PassengerDetail[]
  visa: VisaDetail
}

interface TripBookingProps {
  totalTripBookingAmount: number
  bookingDetails?: BookingDetails
  currency?: string
}

const PricingRow: React.FC<{
  type: string
  description?: string
  price?: number
  quantity?: number
  currency: string
}> = ({ type, description, price, quantity, currency }) => {
  const priceTextColor = quantity === 0 ? 'text-gray-500' : 'text-red-500'

  return (
    <StyledView className='flex-row items-center justify-between mb-3 last:mb-0'>
      <StyledView className='flex-1'>
        <StyledText className='text-sm font-medium'>{type}:</StyledText>
        {description && <StyledText className='text-gray-500'>({description})</StyledText>}
      </StyledView>
      <StyledText className={`text-sm font-medium mx-4 ${priceTextColor}`}>
        {price?.toLocaleString()} {currency}
      </StyledText>
      <StyledView className='w-12 h-12 border border-gray-300 rounded-lg items-center justify-center'>
        <StyledText className='text-sm'>{quantity}</StyledText>
      </StyledView>
    </StyledView>
  )
}

export const CustomerInfoPrice: React.FC<TripBookingProps> = ({
  totalTripBookingAmount,
  bookingDetails,
  currency = 'VND'
}) => {
  return (
    <StyledView className='p-5 w-full'>
      <StyledView className='flex-row justify-between items-center mb-6'>
        <StyledText className='text-base font-semibold text-blue'>Customer Information</StyledText>
        {/* <StyledTouchableOpacity>
          <StyledText className='text-blue text-sm'>View Details</StyledText>
        </StyledTouchableOpacity> */}
      </StyledView>

      <StyledView className='bg-white rounded-lg p-3 pb-0 mb-5 border border-gray-300'>
        {bookingDetails?.passengerDetails.map((passenger, index) => (
          <PricingRow
            key={index}
            type={passenger.ageGroup}
            description={passenger.description}
            price={passenger.unitPrice}
            quantity={passenger.quantity}
            currency={currency}
          />
        ))}
      </StyledView>

      <StyledView className='bg-white rounded-lg p-3 pb-0 border border-gray-300 mb-6'>
        <PricingRow
          type='Visa'
          price={bookingDetails?.visa.unitPrice}
          quantity={bookingDetails?.visa.quantity}
          currency={currency}
        />
      </StyledView>

      <StyledView className='flex-row justify-end items-center'>
        <StyledText className='text-base font-semibold mr-2'>Total Amount: </StyledText>
        <StyledText className='text-base text-red-500 font-semibold'>
          {totalTripBookingAmount.toLocaleString()} {currency}
        </StyledText>
      </StyledView>
    </StyledView>
  )
}
