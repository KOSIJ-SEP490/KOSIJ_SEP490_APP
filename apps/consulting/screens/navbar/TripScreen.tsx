import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTrips } from '@apps/consulting/api/useTrip.api'

type RootStackParamList = {
  Orders: undefined
  TourDetails: { id: number }
}

type TripScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TourDetails'>

const TRIP_STATUSES = [
  'All',
  'Available',
  'NotAvailable',
  'Full',
  'RegistrationClosed',
  'NotStarted',
  'Ongoing',
  'Completed',
  'Canceled'
]

export default function TripScreen() {
  const navigation = useNavigation<TripScreenNavigationProp>()
  const { data: trips = [], isLoading, error } = useTrips()
  const [filteredTrips, setFilteredTrips] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSelectTrip = (id: number) => {
    navigation.navigate('TourDetails', { id })
  }

  useEffect(() => {
    let filtered = trips

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (trip) =>
          trip.id.toString().includes(query) ||
          trip.tourName.toLowerCase().includes(query) ||
          trip.tripType.toLowerCase().includes(query)
      )
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((trip) => trip.tripStatus === selectedStatus)
    }

    setFilteredTrips(filtered)
  }, [searchQuery, selectedStatus, trips])
  console.log('data trips: ', trips)

  return (
    <View className='flex-1 bg-white p-4'>
      {/* Show Loading State */}
      {isLoading && <ActivityIndicator size='large' color='#0000ff' />}

      {/* Show Error Message */}
      {error && <Text className='text-red-500'>Failed to load trips.</Text>}
      {!isLoading && !error && (
        <>
          {/* Header */}
          <Text className='text-center text-lg font-semibold'>Trip History</Text>

          {/* Search & Filter */}
          <View className='flex-row items-center mt-3'>
            <TextInput
              placeholder='Search'
              className='flex-1 p-2 border border-gray-300 rounded-lg'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text>{selectedStatus} ▼</Text>
            </TouchableOpacity>
          </View>
          {showDropdown && (
            <View className='absolute right-4 top-20 bg-white shadow-md border border-gray-300 rounded-lg p-2 z-10'>
              {TRIP_STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  className='p-2'
                  onPress={() => {
                    setSelectedStatus(status)
                    setShowDropdown(false)
                  }}
                >
                  <Text className={selectedStatus === status ? 'text-blue-500 font-semibold' : 'text-gray-800'}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Trip List */}
          {filteredTrips.length === 0 ? (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-gray-500 text-lg'>No Trip is found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTrips}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'
                  onPress={() => handleSelectTrip(item.id)}
                >
                  {/* Icon */}
                  <View className='mr-3'>
                    <Text>🛳️</Text>
                  </View>

                  {/* Trip Details */}
                  <View className='flex-1'>
                    <Text className='font-semibold'>{item.tourName}</Text>
                    <Text className='text-gray-500'>Trip ID: {item.id}</Text>
                    <Text className='text-gray-500'>Type: {item.tripType}</Text>
                    <View className='flex-row'>
                      <Text className='text-blue-500'>{item.departureDate} -</Text>
                      <Text className='text-blue-500'> {item.returnDate}</Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View
                    className='px-3 py-1 rounded-full'
                    style={{
                      backgroundColor:
                        item.tripStatus === 'Available'
                          ? '#ADD8E6'
                          : item.tripStatus === 'Not Available'
                            ? '#D3D3D3'
                            : item.tripStatus === 'Full'
                              ? '#A94064'
                              : item.tripStatus === 'Registration Closed'
                                ? '#FFA500'
                                : item.tripStatus === 'NotStarted'
                                  ? '#FFD700'
                                  : item.tripStatus === 'Ongoing'
                                    ? '#0000FF'
                                    : item.tripStatus === 'Completed'
                                      ? '#008000'
                                      : item.tripStatus === 'Canceled'
                                        ? '#FF0000'
                                        : '#D3D3D3'
                    }}
                  >
                    <Text className='text-white text-xs'>{item.tripStatus}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
    </View>
  )
}
