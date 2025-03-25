import React, { useState, useCallback } from 'react'
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTripBookingByAll } from '@apps/customer/hooks/useTripBooking'
import TripBookingCard from '@apps/customer/components/Card/TripBooking/TripBookingCard'
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { CustomerTripsStackParamList } from '@apps/customer/types/navigationCustomerType'
import SubLayout from '@shared/layouts/SubLayout'
import { useTripRequestByAll } from '@apps/customer/hooks/useTripRequest'
import TripRequestCard from '@apps/customer/components/Card/TripRequest/TripRequestCard'
import type { TripBookingType } from '@apps/customer/types/Booking/tripBooking.type'
import { TripRequestType } from '@apps/customer/types/Trip/tripRequest.type'
import { StackNavigationProp } from '@react-navigation/stack'

export default function TripsScreen() {
  const { tripBookings, reload } = useTripBookingByAll()
  const { tripRequests } = useTripRequestByAll()
  const route = useRoute<RouteProp<CustomerTripsStackParamList, 'Trips'>>()
  const initialTab = (route.params?.initialTab as 'Request' | 'NotStarted' | 'OnGoing' | 'History') || 'NotStarted'

  const [activeTab, setActiveTab] = useState<'Request' | 'NotStarted' | 'OnGoing' | 'History'>(initialTab)

  const navigation = useNavigation<StackNavigationProp<CustomerTripsStackParamList, 'TripBookingDetails'>>()

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [])
  )

  const filteredTrips: (TripBookingType | TripRequestType)[] =
    activeTab === 'Request'
      ? tripRequests || []
      : tripBookings?.filter((trip) => {
          const today = new Date().toISOString().split('T')[0]
          switch (activeTab) {
            case 'NotStarted':
              return ['Pending', 'Deposited', 'Processing', 'Paid'].includes(trip.tripBookingStatus)
            case 'OnGoing':
              return (
                (trip.tripBookingStatus === 'Paid' && trip.departureDate?.startsWith(today)) ||
                ['Checkin', 'Checkout'].includes(trip.tripBookingStatus)
              )
            case 'History':
              return ['Completed', 'Cancelled', 'Refunded'].includes(trip.tripBookingStatus)
            default:
              return false
          }
        }) || []

  return (
    <SubLayout title='My Trips' showBackButton={false}>
      <View className='p-4 pb-0 mt-5'>
        <View className='flex-row items-center border border-blue rounded-full px-4 h-12 mb-5'>
          <Ionicons name='search' size={24} color='#6B7FE3' />
          <TextInput
            className='flex-1 text-base ml-2 pb-1 text-blue'
            placeholder='Tour Name'
            placeholderTextColor='#6B7FE3'
          />
          <TouchableOpacity className='ml-2' onPress={() => console.log('Open Filter Modal')}>
            <Ionicons name='filter' size={24} color='#6B7FE3' />
          </TouchableOpacity>
        </View>
      </View>

      <View className='px-5'>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-4'>
          {['Request', 'NotStarted', 'OnGoing', 'History'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-6 py-2 border border-blue items-center justify-center rounded-lg mx-2 ${
                activeTab === tab ? 'bg-blue' : 'bg-white'
              }`}
              onPress={() => setActiveTab(tab as 'Request' | 'NotStarted' | 'OnGoing' | 'History')}
            >
              <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-white' : 'text-blue'}`}>
                {tab === 'Request'
                  ? 'Request'
                  : tab === 'NotStarted'
                    ? 'Not Started'
                    : tab === 'OnGoing'
                      ? 'On Going'
                      : 'History'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredTrips.length > 0 ? (
          <ScrollView className='flex-1 py-4' contentContainerStyle={{ gap: 16 }}>
            {activeTab === 'Request'
              ? filteredTrips.map((request) => (
                  <TripRequestCard
                    key={(request as TripRequestType).id}
                    {...(request as TripRequestType)}
                    onPress={() =>
                      navigation.navigate('TripRequestDetails', { tripRequestID: (request as TripRequestType).id })
                    }
                  />
                ))
              : filteredTrips.map((trip) => (
                  <TripBookingCard
                    key={(trip as TripBookingType).id}
                    {...(trip as TripBookingType)}
                    onPress={() =>
                      navigation.navigate('TripBookingDetails', { tripBookingID: (trip as TripBookingType).id })
                    }
                  />
                ))}
          </ScrollView>
        ) : (
          <Text className='text-center text-gray-500 mt-4'>
            {activeTab === 'History'
              ? 'No past trips available.'
              : activeTab === 'OnGoing'
                ? 'No ongoing trips available.'
                : activeTab === 'NotStarted'
                  ? 'No scheduled trips available.'
                  : 'No trip requests available.'}
          </Text>
        )}
      </View>
    </SubLayout>
  )
}
