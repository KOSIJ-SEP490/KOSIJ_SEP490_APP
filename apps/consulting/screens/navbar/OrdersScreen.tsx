import React from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'

const trips = [
  { id: '1', title: 'Koi Serenity Journey', status: 'Upcoming' },
  { id: '2', title: 'Koi Serenity Journey', status: 'Completed' },
  { id: '3', title: 'Koi Serenity Journey', status: 'Completed' },
  { id: '4', title: 'Koi Serenity Journey', status: 'Completed' },
  { id: '5', title: 'Koi Serenity Journey', status: 'Completed' }
]

export default function OrdersScreen() {
  return (
    <View className='flex-1 bg-white p-4'>
      {/* Header */}
      <Text className='text-center text-lg font-semibold'>Order History</Text>

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='bg-white shadow-md rounded-lg p-3 mt-3 flex-row items-center'>
            {/* Icon */}
            <View className='mr-3'>
              <Text>🛳️</Text>
            </View>

            {/* Trip Details */}
            <View className='flex-1'>
              <Text className='font-semibold'>{item.title}</Text>
              <Text className='text-gray-500'>Order ID: TRP-20241201</Text>
              <Text className='text-gray-500'>Customer: Leslie Alexander</Text>
              <Text className='text-blue-500'>2024-12-01</Text>
            </View>

            {/* Status Badge */}
            <View className={`px-3 py-1 rounded-full ${item.status === 'Upcoming' ? 'bg-yellow-300' : 'bg-green-600'}`}>
              <Text className='text-white text-xs'>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}
