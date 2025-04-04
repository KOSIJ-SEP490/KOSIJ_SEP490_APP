import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-feather'
import { styled } from 'nativewind'
import DateTimePicker from '@react-native-community/datetimepicker'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface DatePickerFieldProps {
  deliveryDate: Date
  setDeliveryDate: (date: Date) => void
}

export default function DatePickerField({ deliveryDate, setDeliveryDate }: DatePickerFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempDate, setTempDate] = useState(deliveryDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)

    if (event.type === 'set' && selectedDate) {
      if (Platform.OS === 'android') {
        setDeliveryDate(selectedDate)
      } else {
        setTempDate(selectedDate)
        setTimeout(() => setDeliveryDate(selectedDate), 100)
      }
    }
  }

  const handlePress = () => {
    setTempDate(deliveryDate)
    setShowDatePicker(true)
  }

  return (
    <StyledView className='mb-6'>
      <StyledText className='text-base font-medium mb-2 text-gray-800'>Expected Delivery Date</StyledText>
      <StyledTouchableOpacity
        className='border border-gray-300 rounded-lg p-4 flex-row items-center bg-white'
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.inputContainer}
      >
        <Calendar stroke='#264ECA' width={20} height={20} />
        <StyledText className='ml-3 text-sm text-gray-700' style={styles.dateText}>
          {formatDate(deliveryDate)}
        </StyledText>
      </StyledTouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          themeVariant='light'
          textColor={Platform.OS === 'android' ? '#000000' : undefined}
          accentColor='#264ECA'
          style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
        />
      )}
    </StyledView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  dateText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'
  },
  iosPicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    height: 200
  },
  androidPicker: {}
})
