import { useBooking } from '@apps/customer/contexts/BookingContext'
import React from 'react'
import { View, Text, TextInput } from 'react-native'

interface NotesInputProps {
  source: 'bookingData' | 'bookingRequest'
}

const NotesInput: React.FC<NotesInputProps> = ({ source }) => {
  const { bookingData, setBookingData, bookingRequest, setBookingRequest } = useBooking()

  const value = source === 'bookingData' ? bookingData.notes : bookingRequest.note
  const setValue =
    source === 'bookingData'
      ? (text: string) => setBookingData((prev) => ({ ...prev, notes: text }))
      : (text: string) => setBookingRequest((prev) => ({ ...prev, note: text }))

  return (
    <View className='mt-5 px-6 mb-14'>
      <Text className='text-base font-semibold'>
        Notes <Text className='text-gray-500 text-sm font-normal'>(If you have any notes, please let us know)</Text>
      </Text>
      <TextInput
        className='border border-gray-300 rounded-lg p-3 mt-5 min-h-[100px] text-sm'
        multiline
        numberOfLines={5}
        placeholder='Enter your notes here...'
        value={value}
        onChangeText={setValue}
      />
    </View>
  )
}

export default NotesInput
