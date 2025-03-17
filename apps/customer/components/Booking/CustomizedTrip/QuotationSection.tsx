/* eslint-disable no-duplicate-case */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface QuotationSectionProps {
  status: string
  tripRequestID: number
}

const QuotationSection: React.FC<QuotationSectionProps> = ({ status, tripRequestID }) => {
  const navigation = useNavigation<StackNavigationProp<CustomerTripsStackParamList, 'TripRequestDetails'>>()

  let message = ''
  let isButtonDisabled = false

  switch (status) {
    case 'Pending':
    case 'Assigned':
    case 'Processing':
    case 'ManagerRejected':
      message = 'Wait for Manager approval'
      isButtonDisabled = true
      break
    case 'Approved':
      message = 'Manager approved your Trip Request. Please review and confirm your quotation.'
      isButtonDisabled = false
      break
    case 'Confirmed':
      message = 'You confirmed the quotation.'
      isButtonDisabled = false
      break
    case 'ModificationRequested':
      message = 'Waiting for Sales Staff to finalized again'
      isButtonDisabled = false
      break
    default:
      message = 'Status unknown.'
      isButtonDisabled = true
  }

  const handleViewDetails = () => {
    if (!isButtonDisabled) {
      navigation.navigate('QuotationDetails', { tripRequestID })
    }
  }

  return (
    <StyledView className='p-4 px-5 bg-white rounded-lg mt-5'>
      <StyledView className='flex-row justify-between items-center mb-6'>
        <StyledText className='text-base font-bold'>Quotation</StyledText>
        <StyledView className='flex-row items-center'>
          <StyledText className='text-sm font-medium'>Status: </StyledText>
          <StyledText className='text-sm font-semibold text-blue'>{status}</StyledText>
        </StyledView>
      </StyledView>

      <StyledView className='bg-yellow-100 rounded-xl p-4 mb-6'>
        <StyledText className='text-gray-700 text-sm leading-6'>{message}</StyledText>
      </StyledView>

      <StyledTouchableOpacity
        className={`rounded-lg p-3 items-center justify-center self-end min-w-[130px] ${
          isButtonDisabled ? 'bg-gray-400' : 'bg-blue'
        }`}
        onPress={handleViewDetails}
        disabled={isButtonDisabled}
      >
        <StyledText className='text-white text-sm font-medium'>View Details</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  )
}

export default QuotationSection
