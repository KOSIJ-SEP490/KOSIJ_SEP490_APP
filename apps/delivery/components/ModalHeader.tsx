import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { X } from 'react-native-feather'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ModalHeaderProps {
  title: string
  onClose: () => void
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <StyledView className='bg-blue pt-14 pb-7 px-10 flex-row justify-between items-center relative'>
      <View style={{ width: 24 }} />
      <StyledText className='text-white text-xl font-medium absolute left-0 pt-7 right-0 text-center'>
        {title}
      </StyledText>
      <StyledTouchableOpacity onPress={onClose}>
        <X stroke='white' width={24} height={24} />
      </StyledTouchableOpacity>
    </StyledView>
  )
}
