import React from 'react'
import { View, Text } from 'react-native'
import { styled } from 'nativewind'
import { TripRequestDetailsType } from '@apps/customer/types/Trip/tripRequestDetails.type'

const StyledView = styled(View)
const StyledText = styled(Text)

interface TripRequestInfoCardProps {
  tripRequest: TripRequestDetailsType
}

const TripRequestInfoCard: React.FC<TripRequestInfoCardProps> = ({ tripRequest }) => {
  return (
    <StyledView className='mb-8 mt-5 px-5'>
      <StyledView className='flex-row justify-between items-center mb-4'>
        <StyledText className='text-base font-bold'>Trip Request Information</StyledText>
      </StyledView>

      <StyledView className='bg-white rounded-lg p-6 border border-gray-200'>
        <StyledView className='flex-row justify-between mb-2'>
          <StyledView>
            <StyledText className='text-sm'>
              <StyledText className='font-medium'>Trip Request ID: </StyledText>
              {tripRequest?.id}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Number of Passengers: </StyledText>
            {tripRequest?.numberOfPassengers} person(s)
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Trip Start Date: </StyledText>
            {tripRequest?.departureDate}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Trip Return Date: </StyledText>
            {tripRequest?.returnDate}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Number of Days: </StyledText>
            {tripRequest?.days} days
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Number of Nights: </StyledText>
            {tripRequest?.nights} nights
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Departure Point: </StyledText>
            {tripRequest?.departurePoint}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Affordable Budget: </StyledText>
            {tripRequest?.affordableBudget?.toLocaleString('en-US')} VND
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Name Contact: </StyledText>
            {tripRequest?.nameContact}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Email Contact: </StyledText>
            {tripRequest?.emailContact}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Phone Contact: </StyledText>
            {tripRequest?.phoneContact}
          </StyledText>
        </StyledView>

        <StyledView className='mb-2'>
          <StyledText className='text-sm'>
            <StyledText className='font-medium'>Notes: </StyledText>
            {tripRequest?.note}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  )
}

export default TripRequestInfoCard
