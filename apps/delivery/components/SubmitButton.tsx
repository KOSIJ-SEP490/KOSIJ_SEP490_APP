import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'

const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface SubmitButtonProps {
  isLoading: boolean
  onPress: () => void
}

export default function SubmitButton({ isLoading, onPress }: SubmitButtonProps) {
  return (
    <StyledTouchableOpacity
      className={`rounded-lg p-4 items-center mt-auto mb-5 ${isLoading ? 'bg-gray-400' : 'bg-blue'}`}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={1}
    >
      <StyledText className='text-white text-base font-medium'>{isLoading ? 'Updating...' : 'Update Order'}</StyledText>
    </StyledTouchableOpacity>
  )
}
