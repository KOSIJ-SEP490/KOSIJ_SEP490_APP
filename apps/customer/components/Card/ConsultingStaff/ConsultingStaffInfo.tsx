import React from 'react'
import { View, Text } from 'react-native'
import { styled } from 'nativewind'
import { User, Phone, Mail } from 'lucide-react-native'

const StyledView = styled(View)
const StyledText = styled(Text)

interface StaffInfoProps {
  staffType: string
  fullName: string
  phoneNumber: string
  email: string
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string
  labelStyle?: string
  valueStyle?: string
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, labelStyle = 'text-sm', valueStyle = 'text-sm' }) => (
  <StyledView className='flex-row items-center mb-4'>
    {icon}
    <StyledText className={`${labelStyle} font-medium ml-2`}>{label}:</StyledText>
    <StyledText className={`${valueStyle} ml-2 text-gray-700`}>{value}</StyledText>
  </StyledView>
)

export const StaffInfo: React.FC<StaffInfoProps> = ({ staffType, fullName, phoneNumber, email }) => {
  return (
    <StyledView className='p-5 w-full max-w-lg'>
      <StyledText className='text-base font-semibold mb-6 text-blue'>{staffType} Information</StyledText>

      <StyledView className='bg-white rounded-lg border border-gray-300 p-6'>
        <InfoRow icon={<User size={20} color='#000' />} label='Full Name' value={fullName} />
        <InfoRow icon={<Phone size={20} color='#000' />} label='Phone Number' value={phoneNumber} />
        <InfoRow icon={<Mail size={20} color='#000' />} label='Email' value={email} />
      </StyledView>
    </StyledView>
  )
}
