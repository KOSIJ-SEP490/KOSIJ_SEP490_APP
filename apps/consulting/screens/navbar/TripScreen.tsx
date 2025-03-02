import React from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTrips } from '@apps/consulting/api/useTrip.api'

type RootStackParamList = {
  Orders: undefined
  TourDetails: { id: number }
}

type TripScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TourDetails'>

export default function TripScreen() {
  const navigation = useNavigation<TripScreenNavigationProp>()
  const { data: trips = [], isLoading, error } = useTrips()

  console.log('Trips Data:', trips)

  if (isLoading) return <ActivityIndicator size='large' color='#0000ff' />
  if (error) return <Text className='text-red-500'>Failed to load trips.</Text>

  const handleSelectTrip = (id: number) => {
    navigation.navigate('TourDetails', { id })
  }
  return (
    <View className='flex-1 bg-white p-4'>
      {/* Header */}
      <Text className='text-center text-lg font-semibold'>Trip History</Text>

      {/* Search & Filter */}
      <View className='flex-row items-center mt-3'>
        <TextInput placeholder='Search' className='flex-1 p-2 border border-gray-300 rounded-lg' />
        <TouchableOpacity className='ml-2 px-3 py-2 border border-gray-300 rounded-lg'>
          <Text>All ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Trip List */}
      <FlatList
        data={trips}
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
              <Text className='text-blue-500'>
                {new Date(item.departureDate).toLocaleDateString()} - {new Date(item.returnDate).toLocaleDateString()}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              className={`px-3 py-1 rounded-full ${item.tripStatus === 'Available' ? 'bg-yellow-300' : 'bg-green-600'}`}
            >
              <Text className='text-white text-xs'>{item.tripStatus}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
