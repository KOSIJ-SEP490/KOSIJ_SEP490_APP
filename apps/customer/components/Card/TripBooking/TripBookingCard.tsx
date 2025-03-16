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
  tripBookingStatus,
  onPress
}: TripBookingType & { onPress: () => void }) => {
  const getPaymentText = () => {
    switch (tripBookingStatus) {
      case 'Pending':
        return 'Pay Deposited Amount'
      case 'Deposited':
        return 'Waiting for Staff to Review'
      case 'Processing':
        return `Pay Remaining Amount (${expiredTime})`
      case 'Paid':
        return 'Wait for Started Date'
      default:
        return 'View Details'
    }
  }

  return (
    <StyledTouchableOpacity
      className='bg-white rounded-lg border border-gray-300 overflow-hidden w-full mb-4'
      onPress={onPress}
      activeOpacity={0.8}
    >
      <StyledView className='relative'>
        <StyledImage source={{ uri: tourImgUrl }} className='w-full h-40' resizeMode='cover' />
      </StyledView>

      <StyledView className='p-5'>
        <StyledText className='text-sm font-bold text-gray-900 mb-4'>{tourName}</StyledText>

        <StyledView className='space-y-4'>
          <StyledView className='flex-row items-center'>
            <StyledView className='w-4 h-4 items-center justify-center'>
              <FontAwesome5 name='bus' size={16} color='#000000' />
            </StyledView>
            <StyledText className='ml-3 text-xs font-medium'>
              Type Trip: <StyledText className='font-normal'>{tripType}</StyledText>
            </StyledText>
          </StyledView>

          <StyledView className='flex-row items-center'>
            <StyledView className='w-4 h-4 items-center justify-center'>
              <FontAwesome5 name='wallet' size={16} color='#000000' />
            </StyledView>
            <StyledText className='ml-3 text-xs font-medium'>
              Payment Status: <StyledText className='font-normal'>{tripBookingStatus}</StyledText>
            </StyledText>
          </StyledView>

          <StyledView className='flex-row items-center'>
            <StyledView className='w-4 h-4 items-center justify-center'>
              <FontAwesome5 name='clock' size={16} color='#000000' />
            </StyledView>
            <StyledText className='ml-3 text-xs font-medium'>
              Day Started: <StyledText className='font-normal'>{departureDate}</StyledText>
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledView className='mt-6 flex-row items-center justify-end'>
          <StyledText className='text-blue font-medium text-sm mr-5'>{getPaymentText()}</StyledText>
          <FontAwesome5 name='arrow-right' size={16} color='#264ECA' />
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  )
}

export default TripBookingCard
