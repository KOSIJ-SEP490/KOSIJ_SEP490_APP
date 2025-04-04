import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronDown } from 'react-native-feather'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const orderStatuses = ['Delivering', 'Delivered', 'CancelledByCompany']

interface StatusPickerFieldProps {
  status: string
  setStatus: (status: string) => void
}

export default function StatusPickerField({ status, setStatus }: StatusPickerFieldProps) {
  const [showStatusPicker, setShowStatusPicker] = useState(false)

  return (
    <StyledView className='mb-6'>
      <StyledText className='text-base font-medium mb-2'>Order Status</StyledText>
      <StyledTouchableOpacity
        className='border border-gray-300 rounded-lg p-4 flex-row justify-between items-center'
        onPress={() => setShowStatusPicker(!showStatusPicker)}
      >
        <StyledText className='text-sm'>{status}</StyledText>
        <ChevronDown stroke='black' width={20} height={20} />
      </StyledTouchableOpacity>

      {showStatusPicker && (
        <StyledView className='border border-gray-300 rounded-lg mt-1 bg-white'>
          {orderStatuses.map((option) => (
            <StyledTouchableOpacity
              key={option}
              className='p-3 border-b border-gray-200'
              onPress={() => {
                setStatus(option)
                setShowStatusPicker(false)
              }}
            >
              <StyledText className={`text-sm ${status === option ? 'font-bold' : ''}`}>{option}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      )}
    </StyledView>
  )
}
