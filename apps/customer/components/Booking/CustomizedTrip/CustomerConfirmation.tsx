import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { useTripRequestById, useUpdateTripRequest } from '@apps/customer/hooks/useTripRequest'
import QuotationConfirmSuccess from './QuotationConfirmSuccess'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface CustomerConfirmationProps {
  tripRequestId: number
  onSubmit?: (confirmed: boolean) => void
  onRefetch?: () => void
}

const CustomerConfirmation: React.FC<CustomerConfirmationProps> = ({ tripRequestId, onSubmit, onRefetch }) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const { tripRequestDetails, refetch } = useTripRequestById(tripRequestId)

  const { updateTripRequest, loading } = useUpdateTripRequest()

  const handleSubmit = async () => {
    if (confirmed !== null) {
      const requestStatus = confirmed ? 'Confirmed' : 'ModificationRequested'

      const result = await updateTripRequest(tripRequestId, requestStatus)

      if (result && 'value' in result) {
        setApiResponse(result.value)
        setSuccessModalVisible(true)

        // Refetch data after successful submission
        await refetch()

        // Optionally call external refetch if provided
        if (onRefetch) {
          onRefetch()
        }
      }

      if (onSubmit) {
        onSubmit(confirmed)
      }
    }
  }

  return (
    <>
      <StyledView className='p-5'>
        <StyledText className='text-base text-blue font-bold mb-4'>Customer Confirmation</StyledText>

        <StyledTouchableOpacity
          className='bg-white rounded-lg p-6 border border-gray-200 mb-4 flex-row justify-between items-center'
          onPress={() => setConfirmed(false)}
        >
          <StyledText className='text-sm'>I do not confirm with this quotation</StyledText>
          <StyledView
            className={`w-5 h-5 rounded-full border-2 ${
              confirmed === false ? 'border-blue bg-blue' : 'border-gray-300'
            } items-center justify-center`}
          >
            {confirmed === false && <StyledView className='w-3 h-3 rounded-full bg-white' />}
          </StyledView>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className='bg-white rounded-lg p-6 border border-gray-200 mb-8 flex-row justify-between items-center'
          onPress={() => setConfirmed(true)}
        >
          <StyledText className='text-sm'>I confirm with this quotation </StyledText>
          <StyledView
            className={`w-5 h-5 rounded-full border-2 ${
              confirmed === true ? 'border-blue bg-blue' : 'border-gray-300'
            } items-center justify-center`}
          >
            {confirmed === true && <StyledView className='w-3 h-3 rounded-full bg-white' />}
          </StyledView>
        </StyledTouchableOpacity>

        <StyledView className='flex-row justify-end'>
          <StyledTouchableOpacity
            className={`rounded-lg py-4 px-10 ${confirmed === null ? 'bg-gray-400' : 'bg-blue'}`}
            onPress={handleSubmit}
            disabled={confirmed === null || loading}
          >
            <StyledText className='text-white text-base font-medium'>{loading ? 'Submitting...' : 'Submit'}</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <QuotationConfirmSuccess
        visible={successModalVisible}
        response={apiResponse || ''}
        tripBookingId={tripRequestDetails?.tripBookingId ?? 0}
        onClose={() => setSuccessModalVisible(false)}
      />
    </>
  )
}

export default CustomerConfirmation
