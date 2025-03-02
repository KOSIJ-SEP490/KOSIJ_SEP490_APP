import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Home, Calendar as CalendarIcon, Bell, Package, Settings } from 'lucide-react-native'
import { Picker } from '@react-native-picker/picker'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
const dates = Array.from({ length: 31 }, (_, i) => i + 1)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const years = Array.from({ length: 10 }, (_, i) => 2025 + i)

const DashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const monthYearOptions = years.flatMap((year) => months.map((month) => `${month} ${year}`))

  const [selectedMonthYear, setSelectedMonthYear] = useState(`${months[0]} ${years[0]}`)

  return (
    <ScrollView className='bg-white flex-1'>
      <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl'>
        <StyledView className='flex-row justify-center items-center'>
          <Picker
            selectedValue={selectedMonthYear}
            onValueChange={(itemValue) => setSelectedMonthYear(itemValue)}
            style={{ color: 'white', width: 200 }}
          >
            {monthYearOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </StyledView>
        <StyledView className='flex-row justify-around mt-2'>
          {daysOfWeek.map((day) => (
            <StyledText key={day} className='text-white text-sm'>
              {day}
            </StyledText>
          ))}
        </StyledView>
        <FlatList
          data={dates}
          numColumns={7}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <StyledTouchableOpacity
              className={`m-1 p-2 w-10 h-10 rounded-full justify-center items-center ${
                selectedDate === item ? 'bg-red-500' : 'bg-transparent'
              }`}
              onPress={() => setSelectedDate(item)}
            >
              <StyledText className='text-white'>{item}</StyledText>
            </StyledTouchableOpacity>
          )}
        />
      </StyledView>
      <StyledView className='rounded-t-3xl'>
        {/* Stats Section */}
        <StyledView className='-mt-6 mx-4 bg-white p-4 rounded-xl shadow-md'>
          <StyledView className='flex-row justify-between'>
            <StyledView className='flex-1 items-center border-r border-gray-300'>
              <StyledText className='text-lg font-bold'>10</StyledText>
              <StyledText className='text-gray-500'>New trip</StyledText>
            </StyledView>
            <StyledView className='flex-1 items-center'>
              <StyledText className='text-lg font-bold'>10</StyledText>
              <StyledText className='text-gray-500'>Trip completed</StyledText>
            </StyledView>
          </StyledView>
          <StyledView className='flex-row items-center border-t mt-3 justify-between  border-gray-300 p-2'>
            <StyledText className='text-gray-500'>Orders</StyledText>
            <StyledText className='text-lg font-bold'>10</StyledText>
          </StyledView>
          <StyledView className='flex-row items-center border-t mt-3 justify-between border-gray-300 p-2'>
            <StyledText className='text-gray-500'>???</StyledText>
            <StyledText className='text-lg font-bold'>10</StyledText>
          </StyledView>
        </StyledView>

        <StyledText className='text-xl font-bold mt-6 px-4'>Current Trip</StyledText>
        <StyledView className='bg-white mx-4 p-4 mt-2 mb-5 rounded-xl shadow-md'>
          {/* Header Section */}
          <StyledView className='flex-row justify-between items-center'>
            <StyledText className='text-lg font-semibold'>Koi Serenity Journey</StyledText>
            <StyledText className='bg-yellow-300 text-xs px-3 py-1 rounded-full text-black'>Upcoming</StyledText>
          </StyledView>

          <StyledText className='text-gray-500 mt-1'>Trip ID: TRP-20241201</StyledText>

          {/* Info Grid Section */}
          <StyledView className='gap-y-2'>
            <StyledView className='flex-row justify-between gap-x-2'>
              {/* Start Time */}
              <StyledView
                style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                className='p-3 rounded-lg items-center w-36'
              >
                <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                  Start time
                </StyledText>
                <StyledText className='text-black'>2024-12-01 09:00</StyledText>
              </StyledView>

              {/* End Time */}
              <StyledView
                style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                className='w-36 bg-blue-50 p-3 rounded-lg items-center'
              >
                <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                  End time
                </StyledText>
                <StyledText className='text-black'>2024-12-03 12:00</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className='flex-row justify-between gap-x-2'>
              {/* Duration */}
              <StyledView
                style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                className='w-36 p-3 rounded-lg items-center'
              >
                <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                  Duration
                </StyledText>
                <StyledText className='text-black'>3 Days</StyledText>
              </StyledView>

              {/* Type */}
              <StyledView
                style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                className='w-36 p-3 rounded-lg items-center'
              >
                <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                  Type
                </StyledText>
                <StyledText className='text-black'>Custom</StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </ScrollView>
  )
}

export default DashboardScreen
