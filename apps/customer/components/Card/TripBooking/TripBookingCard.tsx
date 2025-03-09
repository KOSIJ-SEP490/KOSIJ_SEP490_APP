import { View, Text, Image, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { styled } from 'nativewind'
import type { TripBookingType } from '@apps/customer/types/Booking/tripBooking.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)

const TripBookingCard = ({
  tourImgUrl,
  tourName,
  tripType,
  departureDate,
  expiredTime,
  tripBookingStatus
}: TripBookingType) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green'
      case 'pending':
        return 'bg-yellow'
      case 'cancelled':
        return 'bg-red'
      default:
        return 'bg-blue'
    }
  }

  return (
    <StyledView className='bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden w-full'>
      <StyledView className='relative'>
        <StyledImage source={{ uri: tourImgUrl }} className='w-full h-56 rounded-lgl' />
        <StyledView className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <StyledView className='absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full'>
          <StyledText className='text-xs font-bold text-gray-800'>{tripType}</StyledText>
        </StyledView>
      </StyledView>

      <StyledView className='p-4'>
        <StyledText className='text-xl font-bold text-gray-800 mb-3'>{tourName}</StyledText>

        <StyledView className='mb-4'>
          <StyledView className={`self-start rounded-full px-3 py-1 ${getStatusColor(tripBookingStatus)}`}>
            <StyledText className='text-xs font-semibold'>{tripBookingStatus}</StyledText>
          </StyledView>
        </StyledView>

        <StyledView className='space-y-2 mb-4'>
          <StyledView className='flex flex-row items-center'>
            <StyledView className='w-8 h-8 bg-gray-100 rounded-full items-center justify-center'>
              <FontAwesome5 name='calendar-alt' size={14} color='#4B5563' />
            </StyledView>
            <StyledText className='ml-3 text-gray-700'>
              Departure: <StyledText className='font-semibold'>{departureDate}</StyledText>
            </StyledText>
          </StyledView>

          <StyledView className='flex flex-row items-center'>
            <StyledView className='w-8 h-8 bg-gray-100 rounded-full items-center justify-center'>
              <FontAwesome5 name='clock' size={14} color='#4B5563' />
            </StyledView>
            <StyledText className='ml-3 text-gray-700'>
              Time remaining: <StyledText className='font-semibold text-red-600'>{expiredTime}</StyledText>
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledTouchableOpacity className='mt-2 bg-blue p-4 rounded-lg flex items-center justify-center'>
          <StyledView className='flex-row items-center'>
            <FontAwesome5 name='credit-card' size={16} color='white' />
            <StyledText className='ml-2 text-white font-bold'>Complete Payment</StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  )
}

export default TripBookingCard
