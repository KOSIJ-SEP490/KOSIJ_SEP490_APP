import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)

interface CancelReasonFieldProps {
  value: string
  onChangeText: (text: string) => void
}

export default function CancelReasonField({ value, onChangeText }: CancelReasonFieldProps) {
  return (
    <StyledView className='mb-6'>
      <StyledText className='text-base font-medium mb-2'>Cancellation Reason</StyledText>
      <StyledTextInput
        className='border border-gray-300 rounded-lg p-4 text-sm'
        placeholder='Enter cancellation reason'
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={3}
      />
    </StyledView>
  )
}
