import { useBooking } from '@apps/customer/contexts/BookingContext'
import React from 'react'
import { View, Text, TextInput } from 'react-native'

const NotesInput: React.FC = () => {
  const { bookingData, setBookingData } = useBooking()

  const handleChange = (text: string) => {
    setBookingData((prev) => ({ ...prev, notes: text }))
  }

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
        value={bookingData.notes}
        onChangeText={handleChange}
      />
    </View>
  )
}

export default NotesInput
