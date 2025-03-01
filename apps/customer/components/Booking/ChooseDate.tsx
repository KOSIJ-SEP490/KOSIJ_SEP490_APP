import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { CalendarDays } from 'lucide-react-native'
import { Calendar, DateData } from 'react-native-calendars'

interface Trip {
  id: number
  departureDate: string
}

interface ChooseDateProps {
  trips: Trip[]
  onDateSelect: (tripId: number) => void
  selectedTripId?: number | null
}

export default function ChooseDate({ trips, onDateSelect, selectedTripId }: ChooseDateProps) {
  const [sortedTrips, setSortedTrips] = useState<Trip[]>([])
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({})

  useEffect(() => {
    if (trips.length > 0) {
      const sorted = [...trips].sort((a, b) => {
        const dateA = new Date(a.departureDate.split('-').reverse().join('-'))
        const dateB = new Date(b.departureDate.split('-').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })

      setSortedTrips(sorted)
      if (selectedTripId == null) {
        onDateSelect(sorted[0].id)
      }

      const marked: { [key: string]: { selected: boolean; selectedColor: string } } = {}
      sorted.forEach((trip) => {
        const tripDate = format(new Date(trip.departureDate.split('-').reverse().join('-')), 'yyyy-MM-dd')
        marked[tripDate] = { selected: true, selectedColor: 'blue' }
      })
      setMarkedDates(marked)
    }
  }, [trips, selectedTripId])

  return (
    <View>
      <Text className='text-base font-semibold mb-2 mt-2'>Choose Date</Text>

      <View className='flex-row items-center space-x-2'>
        <TouchableOpacity className='p-2 bg-gray-100 rounded-lg' onPress={() => setIsCalendarVisible(true)}>
          <CalendarDays size={24} color='black' />
        </TouchableOpacity>

        <FlatList
          data={sortedTrips}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(trip) => trip.id.toString()}
          renderItem={({ item }) => {
            const tripDate = new Date(item.departureDate.split('-').reverse().join('-'))
            const isSelected = item.id === selectedTripId

            return (
              <TouchableOpacity
                className={twMerge(
                  'px-4 py-3 border rounded-lg mr-2 items-center justify-center',
                  isSelected ? 'bg-blue border-blue' : 'border-gray-300'
                )}
                onPress={() => onDateSelect(item.id)}
              >
                <Text className={twMerge('font-medium', isSelected ? 'text-white' : 'text-blue-500')}>
                  {format(tripDate, 'EEE')}
                </Text>
                <Text className={twMerge('font-medium', isSelected ? 'text-white' : 'text-blue-500')}>
                  {format(tripDate, 'd MMM yyyy')}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      <Modal visible={isCalendarVisible} transparent animationType='slide'>
        <View className='flex-1 justify-center items-center bg-black/70'>
          <View className='bg-white p-5 w-80 rounded-lg'>
            <Calendar
              markedDates={markedDates}
              onDayPress={(day: DateData) => {
                const selectedTrip = sortedTrips.find(
                  (trip) =>
                    format(new Date(trip.departureDate.split('-').reverse().join('-')), 'yyyy-MM-dd') === day.dateString
                )

                if (selectedTrip) {
                  onDateSelect(selectedTrip.id)
                  setIsCalendarVisible(false)
                }
              }}
              disableAllTouchEventsForDisabledDays
              theme={{
                todayTextColor: 'red',
                arrowColor: 'black'
              }}
            />

            <TouchableOpacity
              className='mt-4 p-2 bg-gray-300 rounded-lg items-center'
              onPress={() => setIsCalendarVisible(false)}
            >
              <Text className='text-black'>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
