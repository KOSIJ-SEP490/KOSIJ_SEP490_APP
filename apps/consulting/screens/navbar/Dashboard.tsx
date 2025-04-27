// import React, { useState } from 'react'
// import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
// import { Picker } from '@react-native-picker/picker'
// import { styled } from 'nativewind'
// import { useDashboardData } from '@apps/consulting/api/useDashboard.api'
// import { StackNavigationProp } from '@react-navigation/stack'
// import { useNavigation } from '@react-navigation/native'

// const StyledView = styled(View)
// const StyledText = styled(Text)
// const StyledTouchableOpacity = styled(TouchableOpacity)

// const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
// const months = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December'
// ]
// const years = Array.from({ length: 10 }, (_, i) => 2025 + i)

// type RootStackParamList = {
//   Dashboard: undefined
//   TourDetails: { id: number }
// }

// type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>

// const DashboardScreen = () => {
//   const currentDate = new Date()
//   const currentMonth = months[currentDate.getMonth()]
//   const currentYear = currentDate.getFullYear()
//   const navigation = useNavigation<DashboardScreenNavigationProp>()

//   const [selectedMonthYear, setSelectedMonthYear] = useState(`${currentMonth} ${currentYear}`)

//   const [monthIndex, year] = selectedMonthYear
//     .split(' ')
//     .map((item, index) => (index === 0 ? months.indexOf(item) : parseInt(item, 10)))

//   const { data, loading, error } = useDashboardData(monthIndex + 1, year)

//   const getFirstDayOfMonth = (monthIndex: number, year: number) => {
//     const date = new Date(year, monthIndex, 1)
//     return date.getDay() === 0 ? 7 : date.getDay()
//   }

//   const getDaysInMonth = (monthIndex: number, year: number) => {
//     return new Date(year, monthIndex + 1, 0).getDate()
//   }

//   const firstDayOfMonth = getFirstDayOfMonth(monthIndex, year)
//   const daysInMonth = getDaysInMonth(monthIndex, year)

//   const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1)
//   const paddedDates = [...Array(firstDayOfMonth - 1).fill(null), ...dates]

//   const tripDays = data?.value.tripDays || []

//   const isTripDay = (day: number) => {
//     if (!tripDays) {
//       return false
//     }
//     const tripDaysAsNumbers = tripDays.map((date: string) => new Date(date).getDate())
//     return tripDaysAsNumbers.includes(day)
//   }

//   const handlePickerChange = (value: string) => {
//     setSelectedMonthYear(value)

//     const [selectedMonth, selectedYear] = value.split(' ')
//     const monthNumber = months.indexOf(selectedMonth) + 1
//     const yearNumber = parseInt(selectedYear, 10)

//     console.log('Selected Month:', monthNumber)
//     console.log('Selected Year:', yearNumber)
//   }

//   if (loading) {
//     return (
//       <ScrollView className='bg-white flex-1'>
//         <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl'>
//           <ActivityIndicator size='large' color='#0000ff' />
//         </StyledView>
//       </ScrollView>
//     )
//   }

//   if (error) {
//     return (
//       <ScrollView className='bg-white flex-1'>
//         <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl'>
//           <StyledText className='text-red-500'>{error}</StyledText>
//         </StyledView>
//       </ScrollView>
//     )
//   }

//   const formatDate = (dateString: string | undefined) => {
//     if (!dateString) return ''
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-GB')
//   }

//   return (
//     <ScrollView className='bg-white flex-1'>
//       <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl'>
//         <StyledView className='flex-row justify-center items-center'>
//           <Picker
//             selectedValue={selectedMonthYear}
//             onValueChange={handlePickerChange}
//             style={{ color: 'white', width: 200 }}
//           >
//             {years
//               .flatMap((year) => months.map((month) => `${month} ${year}`))
//               .map((option) => (
//                 <Picker.Item key={option} label={option} value={option} />
//               ))}
//           </Picker>
//         </StyledView>
//         <View className='calendar'>
//           <StyledView className='flex-row justify-around'>
//             {daysOfWeek.map((day) => (
//               <StyledText key={day} className='text-white text-center'>
//                 {day}
//               </StyledText>
//             ))}
//           </StyledView>
//         </View>
//         <FlatList
//           data={paddedDates}
//           numColumns={7}
//           keyExtractor={(item, index) => (item ? item.toString() : index.toString())}
//           renderItem={({ item }) => (
//             <StyledTouchableOpacity
//               className='m-1 p-2 w-10 h-10 rounded-full justify-center items-center'
//               onPress={() => item && console.log(`Selected date: ${item}`)}
//             >
//               {item && (
//                 <View className='relative'>
//                   <StyledText className='text-white'>{item}</StyledText>
//                   {isTripDay(item) && (
//                     <View
//                       style={{
//                         position: 'absolute',
//                         right: -5,
//                         width: 6,
//                         height: 6,
//                         borderRadius: 3,
//                         backgroundColor: 'red'
//                       }}
//                     />
//                   )}
//                 </View>
//               )}
//             </StyledTouchableOpacity>
//           )}
//         />
//       </StyledView>
//       <StyledView className='rounded-t-3xl'>
//         /* Stats Section */
//         <StyledView className='-mt-6 mx-4 bg-white p-4 rounded-xl shadow-lg border border-gray-300'>
//           <StyledView className='flex-row justify-between'>
//             <StyledView className='flex-1 items-center border-r border-gray-300'>
//               <StyledText className='text-lg font-bold'>{data?.value.totalNewTrips}</StyledText>
//               <StyledText className='text-gray-500'>New trip</StyledText>
//             </StyledView>
//             <StyledView className='flex-1 items-center'>
//               <StyledText className='text-lg font-bold'>{data?.value.totalCompletedTrips}</StyledText>
//               <StyledText className='text-gray-500'>Trip completed</StyledText>
//             </StyledView>
//           </StyledView>
//           <StyledView className='flex-row items-center border-t mt-3 justify-between  border-gray-300 p-2'>
//             <StyledText className='text-gray-500'>Orders</StyledText>
//             <StyledText className='text-lg font-bold'>{data?.value.totalOrders}</StyledText>
//           </StyledView>
//         </StyledView>
//         {data?.value.currentTripResponse && (
//           <>
//             <StyledText className='text-xl font-bold mt-6 px-4'>Current Trip</StyledText>
//             <StyledView className='bg-white mx-4 p-4 mt-2 mb-5 rounded-xl shadow-lg border border-gray-300'>
//               /* Header Section */
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate('TourDetails', { id: data?.value.currentTripResponse.tripId })
//                 }}
//               >
//                 <StyledView className='flex-row justify-between items-center flex-wrap'>
//                   <StyledText className='text-base font-semibold break-words truncate max-w-[75%]'>
//                     {data?.value.currentTripResponse.tourName || ''}
//                   </StyledText>
//                   <StyledText
//                     className='text-xs px-3 py-1 rounded-full text-white'
//                     style={{
//                       backgroundColor:
//                         data?.value.currentTripResponse.tripStatus === 'Not Started'
//                           ? '#FFD700'
//                           : data?.value.currentTripResponse.tripStatus === 'Ongoing'
//                             ? '#0000FF'
//                             : data?.value.currentTripResponse.tripStatus === 'Completed'
//                               ? '#008000'
//                               : '#D3D3D3'
//                     }}
//                   >
//                     {data?.value.currentTripResponse.tripStatus || ''}
//                   </StyledText>
//                 </StyledView>
//                 <StyledText className='text-gray-500 mt-1'>
//                   Trip ID: {data?.value.currentTripResponse.tripId || ''}
//                 </StyledText>
//                 {/* Info Grid Section */}
//                 <StyledView className='gap-y-2'>
//                   <StyledView className='flex-row justify-between gap-x-2'>
//                     {/* Start Time */}
//                     <StyledView
//                       style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
//                       className='p-3 rounded-lg items-center w-36'
//                     >
//                       <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
//                         Start time
//                       </StyledText>
//                       <StyledText className='text-black'>
//                         {formatDate(data?.value.currentTripResponse.departureDate) || ''}
//                       </StyledText>
//                     </StyledView>

//                     {/* End Time */}
//                     <StyledView
//                       style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
//                       className='w-36 bg-blue-50 p-3 rounded-lg items-center'
//                     >
//                       <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
//                         End time
//                       </StyledText>
//                       <StyledText className='text-black'>
//                         {formatDate(data?.value.currentTripResponse.returnDate) || ''}
//                       </StyledText>
//                     </StyledView>
//                   </StyledView>
//                   <StyledView className='flex-row justify-between gap-x-2'>
//                     {/* Duration */}
//                     <StyledView
//                       style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
//                       className='w-36 p-3 rounded-lg items-center'
//                     >
//                       <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
//                         Duration
//                       </StyledText>
//                       <StyledText className='text-black'>{data?.value.currentTripResponse.durations || ''}</StyledText>
//                     </StyledView>

//                     {/* Type */}
//                     <StyledView
//                       style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
//                       className='w-36 p-3 rounded-lg items-center'
//                     >
//                       <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
//                         Type
//                       </StyledText>
//                       <StyledText className='text-black'>{data?.value.currentTripResponse.tripType || ''}</StyledText>
//                     </StyledView>
//                   </StyledView>
//                 </StyledView>
//               </TouchableOpacity>
//             </StyledView>
//           </>
//         )}
//       </StyledView>
//     </ScrollView>
//   )
// }

// export default DashboardScreen

import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { styled } from 'nativewind'
import { useDashboardData } from '@apps/consulting/api/useDashboard.api'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
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

type RootStackParamList = {
  Dashboard: undefined
  TourDetails: { id: number }
}

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>

// Calendar Component
const Calendar = ({
  paddedDates,
  isTripDay,
  onDatePress
}: {
  paddedDates: (number | null)[]
  isTripDay: (day: number) => boolean
  onDatePress: (day: number) => void
}) => {
  return (
    <FlatList
      data={paddedDates}
      numColumns={7}
      keyExtractor={(item, index) => (item ? item.toString() : index.toString())}
      renderItem={({ item }) => (
        <StyledTouchableOpacity
          className='m-1 p-2 w-10 h-10 rounded-full justify-center items-center'
          onPress={() => item && onDatePress(item)}
        >
          {item && (
            <View className='relative'>
              <StyledText className='text-white'>{item}</StyledText>
              {isTripDay(item) && (
                <View
                  style={{
                    position: 'absolute',
                    right: -5,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'red'
                  }}
                />
              )}
            </View>
          )}
        </StyledTouchableOpacity>
      )}
    />
  )
}

const DashboardScreen = () => {
  const currentDate = new Date()
  const currentMonth = months[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const navigation = useNavigation<DashboardScreenNavigationProp>()

  const [selectedMonthYear, setSelectedMonthYear] = useState(`${currentMonth} ${currentYear}`)

  const [monthIndex, year] = selectedMonthYear
    .split(' ')
    .map((item, index) => (index === 0 ? months.indexOf(item) : parseInt(item, 10)))

  const { data, loading, error } = useDashboardData(monthIndex + 1, year)

  const getFirstDayOfMonth = (monthIndex: number, year: number) => {
    const date = new Date(year, monthIndex, 1)
    return date.getDay() === 0 ? 7 : date.getDay()
  }

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate()
  }

  const firstDayOfMonth = getFirstDayOfMonth(monthIndex, year)
  const daysInMonth = getDaysInMonth(monthIndex, year)

  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const paddedDates = [...Array(firstDayOfMonth - 1).fill(null), ...dates]

  const tripDays = data?.value.tripDays || []

  const isTripDay = (day: number) => {
    if (!tripDays) return false
    const tripDaysAsNumbers = tripDays.map((date: string) => new Date(date).getDate())
    return tripDaysAsNumbers.includes(day)
  }

  const handlePickerChange = (value: string) => {
    setSelectedMonthYear(value)
    const [selectedMonth, selectedYear] = value.split(' ')
    const monthNumber = months.indexOf(selectedMonth) + 1
    const yearNumber = parseInt(selectedYear, 10)
    console.log('Selected Month:', monthNumber)
    console.log('Selected Year:', yearNumber)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  if (loading) {
    return (
      <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl flex-1'>
        <ActivityIndicator size='large' color='#0000ff' />
      </StyledView>
    )
  }

  if (error) {
    return (
      <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl flex-1'>
        <StyledText className='text-red-500'>{error}</StyledText>
      </StyledView>
    )
  }

  // Data for the main FlatList
  const sections = [
    {
      type: 'header',
      render: () => (
        <StyledView style={{ backgroundColor: '#264ECA' }} className='p-4 rounded-b-3xl'>
          <StyledView className='flex-row justify-center items-center'>
            <Picker
              selectedValue={selectedMonthYear}
              onValueChange={handlePickerChange}
              style={{ color: 'white', width: 200 }}
            >
              {years
                .flatMap((year) => months.map((month) => `${month} ${year}`))
                .map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
            </Picker>
          </StyledView>
          <StyledView className='flex-row justify-around'>
            {daysOfWeek.map((day) => (
              <StyledText key={day} className='text-white text-center'>
                {day}
              </StyledText>
            ))}
          </StyledView>
          <Calendar
            paddedDates={paddedDates}
            isTripDay={isTripDay}
            onDatePress={(day) => console.log(`Selected date: ${day}`)}
          />
        </StyledView>
      )
    },
    {
      type: 'stats',
      render: () => (
        <StyledView className='rounded-t-3xl'>
          <StyledView className='-mt-6 mx-4 bg-white p-4 rounded-xl shadow-lg border border-gray-300'>
            <StyledView className='flex-row justify-between'>
              <StyledView className='flex-1 items-center border-r border-gray-300'>
                <StyledText className='text-lg font-bold'>{data?.value.totalNewTrips}</StyledText>
                <StyledText className='text-gray-500'>New trip</StyledText>
              </StyledView>
              <StyledView className='flex-1 items-center'>
                <StyledText className='text-lg font-bold'>{data?.value.totalCompletedTrips}</StyledText>
                <StyledText className='text-gray-500'>Trip completed</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className='flex-row items-center border-t mt-3 justify-between border-gray-300 p-2'>
              <StyledText className='text-gray-500'>Orders</StyledText>
              <StyledText className='text-lg font-bold'>{data?.value.totalOrders}</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      )
    },
    ...(data?.value.currentTripResponse
      ? [
          {
            type: 'currentTrip',
            render: () => (
              <StyledView>
                <StyledText className='text-xl font-bold mt-6 px-4'>Current Trip</StyledText>
                <StyledView className='bg-white mx-4 p-4 mt-2 mb-5 rounded-xl shadow-lg border border-gray-300'>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('TourDetails', { id: data?.value.currentTripResponse.tripId })
                    }}
                  >
                    <StyledView className='flex-row justify-between items-center flex-wrap'>
                      <StyledText className='text-base font-semibold break-words truncate max-w-[75%]'>
                        {data?.value.currentTripResponse.tourName || ''}
                      </StyledText>
                      <StyledText
                        className='text-xs px-3 py-1 rounded-full text-white'
                        style={{
                          backgroundColor:
                            data?.value.currentTripResponse.tripStatus === 'Not Started'
                              ? '#FFD700'
                              : data?.value.currentTripResponse.tripStatus === 'Ongoing'
                                ? '#0000FF'
                                : data?.value.currentTripResponse.tripStatus === 'Completed'
                                  ? '#008000'
                                  : '#D3D3D3'
                        }}
                      >
                        {data?.value.currentTripResponse.tripStatus || ''}
                      </StyledText>
                    </StyledView>
                    <StyledText className='text-gray-500 mt-1'>
                      Trip ID: {data?.value.currentTripResponse.tripId || ''}
                    </StyledText>
                    <StyledView className='gap-y-2'>
                      <StyledView className='flex-row justify-between gap-x-2'>
                        <StyledView
                          style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                          className='p-3 rounded-lg items-center w-36'
                        >
                          <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                            Start time
                          </StyledText>
                          <StyledText className='text-black'>
                            {formatDate(data?.value.currentTripResponse.departureDate) || ''}
                          </StyledText>
                        </StyledView>
                        <StyledView
                          style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                          className='w-36 bg-blue-50 p-3 rounded-lg items-center'
                        >
                          <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                            End time
                          </StyledText>
                          <StyledText className='text-black'>
                            {formatDate(data?.value.currentTripResponse.returnDate) || ''}
                          </StyledText>
                        </StyledView>
                      </StyledView>
                      <StyledView className='flex-row justify-between gap-x-2'>
                        <StyledView
                          style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                          className='w-36 p-3 rounded-lg items-center'
                        >
                          <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                            Duration
                          </StyledText>
                          <StyledText className='text-black'>
                            {data?.value.currentTripResponse.durations || ''}
                          </StyledText>
                        </StyledView>
                        <StyledView
                          style={{ backgroundColor: '#f6feff', borderColor: '#e9f1f2' }}
                          className='w-36 p-3 rounded-lg items-center'
                        >
                          <StyledText style={{ color: '#3359ce' }} className='font-semibold'>
                            Type
                          </StyledText>
                          <StyledText className='text-black'>
                            {data?.value.currentTripResponse.tripType || ''}
                          </StyledText>
                        </StyledView>
                      </StyledView>
                    </StyledView>
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            )
          }
        ]
      : [])
  ]

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.type}
      renderItem={({ item }) => item.render()}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
    />
  )
}

export default DashboardScreen
