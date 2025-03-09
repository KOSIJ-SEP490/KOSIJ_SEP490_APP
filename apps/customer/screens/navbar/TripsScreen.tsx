import MainLayout from '@apps/customer/layouts/MainLayout'
import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTripBookingByAll } from '@apps/customer/hooks/useTripBooking'
import TripBookingCard from '@apps/customer/components/Card/TripBooking/TripBookingCard'
import CreateTripCard from '@apps/customer/components/Card/Tour/CreateTripCard'
import FilterButton from '@apps/customer/components/FilterBtn'

export default function TripsScreen() {
  const { tripBookings } = useTripBookingByAll()
  const [activeTab, setActiveTab] = useState<'NotStarted' | 'OnGoing'>('NotStarted')
  return (
    <MainLayout
      title='Trips'
      backgroundImage='https://images.unsplash.com/photo-1564284369929-026ba231f89b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={false}
    >
      <View className='p-4 pb-0'>
        <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-5'>
          <Ionicons name='search' size={24} color='#6B7FE3' />
          <TextInput
            className='flex-1 text-base ml-2 pb-1 text-blue'
            placeholder='Tour Name'
            placeholderTextColor='#6B7FE3'
          />
        </View>
      </View>

      <View className='px-4'>
        <View className='flex-row mb-4'>
          <TouchableOpacity
            className={`flex-1 py-4 border border-blue items-center justify-center rounded-lg mx-1 ${
              activeTab === 'NotStarted' ? 'bg-blue' : 'bg-white'
            }`}
            onPress={() => setActiveTab('NotStarted')}
          >
            <Text className={`text-base font-semibold ${activeTab === 'NotStarted' ? 'text-white' : 'text-blue'}`}>
              Scheduled Trip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-4 border border-blue items-center justify-center rounded-lg mx-1 ${
              activeTab === 'OnGoing' ? 'bg-blue' : 'bg-white'
            }`}
            onPress={() => setActiveTab('OnGoing')}
          >
            <Text className={`text-base font-semibold ${activeTab === 'OnGoing' ? 'text-white' : 'text-blue'}`}>
              Customize Trip
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'NotStarted' ? (
          <>
            {tripBookings && tripBookings.length > 0 ? (
              <View className='flex-row mb-4'>
                <View className='mt-2'>
                  <FilterButton onPress={() => console.log('Open Filter')} />
                </View>
                <ScrollView className='flex-1 py-4' contentContainerStyle={{ gap: 16 }}>
                  {tripBookings.map((trip) => (
                    <TripBookingCard key={trip.id} {...trip} />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text className='text-center text-gray-500 mt-4'>No scheduled trips available.</Text>
            )}
          </>
        ) : (
          <CreateTripCard />
        )}
      </View>
    </MainLayout>
  )
}
