import { CancelTripBooking } from '@apps/customer/types/Booking/tripBookingDetail.type'
import React from 'react'
import { View, Text } from 'react-native'

interface CancelledTripBookingCardProps {
  tripBookingDetails?: CancelTripBooking | null
}

const CancelledTripBookingCard: React.FC<CancelledTripBookingCardProps> = ({ tripBookingDetails }) => {
  return (
    <View className='px-5 my-4 mt-5'>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-base font-bold mb-4 text-red-600'>Trip Booking is Cancelled</Text>
      </View>

      <View className='border border-gray-400 p-5 rounded-lg'>
        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Cancellation Time:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>{tripBookingDetails?.cancelTime}</Text>
        </View>

        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Cancellation Reason:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>{tripBookingDetails?.cancellationReason}</Text>
        </View>

        <View className='h-px bg-gray-200 my-3' />

        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Total Amount:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.totalAmount.toLocaleString()} VND
          </Text>
        </View>

        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Total Paid Amount:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.totalPaidAmount.toLocaleString()} VND
          </Text>
        </View>

        <View className='flex-row justify-between mb-4'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Remaining Amount:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.remainingAmount.toLocaleString()} VND
          </Text>
        </View>

        <View className='h-px bg-gray-200 my-3' />

        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Trip Paid Amount:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.totalPaidAmountDetails.tripPaidAmount.toLocaleString()} VND
          </Text>
        </View>

        <View className='flex-row justify-between mb-4'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Visa Fees:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.totalPaidAmountDetails.totalVisaFee.toLocaleString()} VND
          </Text>
        </View>

        <View className='h-px bg-gray-200 my-3' />

        <View className='flex-row justify-between mb-2'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Refund Amount:</Text>
          <Text className='text-sm text-gray-800 flex-1 text-right'>
            {tripBookingDetails?.refundDetails.refundAmount.toLocaleString()} VND
          </Text>
        </View>

        <View className=' justify-between'>
          <Text className='text-sm font-medium text-gray-800 flex-1'>Refund Description:</Text>
          <Text className='text-sm text-gray-800 flex-1 mt-3'>{tripBookingDetails?.refundDetails.description}</Text>
        </View>
      </View>
    </View>
  )
}

export default CancelledTripBookingCard
