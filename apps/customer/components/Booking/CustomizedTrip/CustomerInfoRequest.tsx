import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { TripRequestDetailsType } from '@apps/customer/types/Trip/tripRequestDetails.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface CustomerInfoRequestProps {
  tripRequest: TripRequestDetailsType | null
  onViewDetails?: () => void
}

const formatPrice = (price: number | undefined) => {
  return price ? `${new Intl.NumberFormat('vi-VN').format(price)} VND` : '0 VND'
}

const CustomerInfoRequest: React.FC<CustomerInfoRequestProps> = ({ tripRequest, onViewDetails }) => {
  const getAgeGroupQuantity = (ageGroup: string) => {
    return (
      tripRequest?.quotationResponse?.quotationDetail
        ?.filter((q) => q.ageGroup === ageGroup)
        .reduce((sum, q) => sum + q.quantity, 0) || 0
    )
  }

  const adultCount = getAgeGroupQuantity('Adult')
  const childCount = getAgeGroupQuantity('Child')
  const infantCount = getAgeGroupQuantity('Infant')

  return (
    <StyledView className='mb-4 px-5 my-5'>
      <StyledView className='flex-row justify-between items-center mb-4'>
        <StyledText className='text-base font-bold text-blue'>Customer Information</StyledText>
        <StyledTouchableOpacity onPress={onViewDetails}>
          <StyledText className='text-blue text-sm'>View Details</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className='bg-white rounded-lg p-6 border border-gray-200 mb-4'>
        {tripRequest?.customizedTripResponse?.tripPriceResponse?.map((item, index) => (
          <StyledView key={index} className='flex-row justify-between items-center mb-6'>
            <StyledView className='flex-1'>
              <StyledText className='text-sm font-bold'>{item.ageGroup}:</StyledText>
              <StyledText className='text-gray-500 text-xs'>{item.description}</StyledText>
            </StyledView>

            <StyledView className='w-40 items-end'>
              <StyledText
                className={`text-sm font-medium mr-10 ${
                  (index === 0 ? adultCount : index === 1 ? childCount : infantCount) === 0
                    ? 'text-gray-500'
                    : 'text-red-600'
                }`}
              >
                {formatPrice(item.price)}
              </StyledText>
            </StyledView>

            <StyledView className='w-14 h-14 border border-gray-300 rounded-lg items-center justify-center'>
              <StyledText className='text-sm'>
                {index === 0 ? adultCount : index === 1 ? childCount : infantCount}
              </StyledText>
            </StyledView>
          </StyledView>
        ))}
      </StyledView>

      <StyledView className='bg-white rounded-lg px-6 py-3 border border-gray-200 mb-4'>
        <StyledView className='flex-row justify-between items-center'>
          <StyledView className='flex-1'>
            <StyledText className='text-sm font-bold'>Visa:</StyledText>
          </StyledView>

          <StyledView className='w-40 items-end'>
            <StyledText
              className={`text-sm font-medium mr-10 ${
                tripRequest?.quotationResponse?.visaDetail.quantity === 0 ? 'text-gray-500' : 'text-red-600'
              }`}
            >
              {formatPrice(tripRequest?.quotationResponse?.visaDetail.unitPrice)}
            </StyledText>
          </StyledView>

          <StyledView className='w-14 h-14 border border-gray-300 rounded-lg items-center justify-center'>
            <StyledText className='text-sm'>{tripRequest?.quotationResponse?.visaDetail.quantity}</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      <StyledView className='flex-row justify-end items-center mt-2'>
        <StyledText className='text-base font-bold mr-2'>Total Amount:</StyledText>
        <StyledText className='text-red-600 text-sm font-bold'>
          {formatPrice(tripRequest?.quotationResponse?.grandTotalAmount)}
        </StyledText>
      </StyledView>
    </StyledView>
  )
}

export default CustomerInfoRequest
