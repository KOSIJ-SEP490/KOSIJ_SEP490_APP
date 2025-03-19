import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { styled } from 'nativewind'
import { TripRequestType } from '@apps/customer/types/Trip/tripRequest.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const TripRequestCard = ({ requestTime, requestStatus, onPress }: TripRequestType & { onPress: () => void }) => {
  let buttonText = 'Waiting for Manager to approve'
  const buttonColor = 'text-blue'

  if (requestStatus === 'Approved') {
    buttonText = 'Confirm your Trip Request'
  } else if (requestStatus === 'Confirmed' || requestStatus === 'Cancelled') {
    buttonText = 'View Details'
  } else if (requestStatus === 'ManagerRejected' || requestStatus === 'ModificationRequested') {
    buttonText = 'Waiting for Sales Staff to finalize again'
  }

  return (
    <StyledTouchableOpacity
      className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full mb-4 p-5'
      onPress={onPress}
      activeOpacity={0.8}
    >
      <StyledText className='text-base font-bold text-gray-900 mb-3'>[Customized Trip] - [{requestTime}]</StyledText>

      <StyledView className='flex-row items-center mb-2'>
        <FontAwesome5 name='bus' size={16} color='#4A4A4A' />
        <StyledText className='ml-3 text-sm font-medium text-gray-700'>
          Type Trip: <StyledText className='font-normal'>Customized</StyledText>
        </StyledText>
      </StyledView>

      <StyledView className='flex-row items-center mb-4'>
        <FontAwesome5 name='clipboard-check' size={16} color='#4A4A4A' />
        <StyledText className='ml-3 text-sm font-medium text-gray-700'>
          Quotation Status: <StyledText className='font-normal'>{requestStatus}</StyledText>
        </StyledText>
      </StyledView>

      <StyledView className='flex-row items-center justify-end'>
        <StyledText className={`${buttonColor} font-medium text-sm mr-2`}>{buttonText}</StyledText>
        <FontAwesome5 name='arrow-right' size={14} color='#264ECA' />
      </StyledView>
    </StyledTouchableOpacity>
  )
}

export default TripRequestCard
