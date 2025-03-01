import MainLayout from '@apps/customer/layouts/MainLayout'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TourListCard from '@apps/customer/components/Card/Tour/TourListCard'
import CreateTripCard from '@apps/customer/components/Card/Tour/CreateTripCard'
import { useTourCards } from '@apps/customer/hooks/useTour'
import Divider from '@apps/customer/components/Divider'

export default function BookingScreen() {
  const { tourCards } = useTourCards()
  const [activeTab, setActiveTab] = useState<'scheduled' | 'customize'>('scheduled')

  return (
    <MainLayout
      title='Booking Koi Tour'
      backgroundImage='https://images.unsplash.com/photo-1524563533368-5dc20937d23e?q=80&w=3100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      showBackButton={true}
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
              activeTab === 'scheduled' ? 'bg-blue' : 'bg-white'
            }`}
            onPress={() => setActiveTab('scheduled')}
          >
            <Text className={`text-base font-semibold ${activeTab === 'scheduled' ? 'text-white' : 'text-blue'}`}>
              Scheduled Trip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-4 border border-blue items-center justify-center rounded-lg mx-1 ${
              activeTab === 'customize' ? 'bg-blue' : 'bg-white'
            }`}
            onPress={() => setActiveTab('customize')}
          >
            <Text className={`text-base font-semibold ${activeTab === 'customize' ? 'text-white' : 'text-blue'}`}>
              Customize Trip
            </Text>
          </TouchableOpacity>
        </View>

        <Text className='text-base text-gray-700 mb-4 px-2'>
          {activeTab === 'scheduled'
            ? 'Pre-planned trips with fixed details'
            : 'Fully personalized tour based on customer preferences'}
        </Text>
      </View>

      <Divider />

      {activeTab === 'scheduled' ? <TourListCard tourCards={tourCards ?? []} /> : <CreateTripCard />}
    </MainLayout>
  )
}
