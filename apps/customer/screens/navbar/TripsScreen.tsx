import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native'
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
  const [selectedRequestStatus, setSelectedRequestStatus] = useState<string | null>(null)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string | null>(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const navigation = useNavigation<StackNavigationProp<CustomerTripsStackParamList, 'TripBookingDetails'>>()

  useFocusEffect(
    useCallback(() => {
      reload()

      const interval = setInterval(() => {
        reload()
      }, 5000)

      return () => {
        clearInterval(interval)
      }
    }, [])
  )

  const filteredTrips: (TripBookingType | TripRequestType)[] =
    activeTab === 'Request'
      ? (tripRequests || []).filter(
          (request) => !selectedRequestStatus || request.requestStatus === selectedRequestStatus
        )
      : tripBookings?.filter((trip) => {
          const today = new Date().toISOString().split('T')[0]
          switch (activeTab) {
            case 'NotStarted':
              // eslint-disable-next-line no-case-declarations
              const statusMatch = !selectedPaymentStatus || trip.tripBookingStatus === selectedPaymentStatus
              return ['Pending', 'Deposited', 'Processing', 'Paid'].includes(trip.tripBookingStatus) && statusMatch
            case 'OnGoing':
              return (
                (trip.tripBookingStatus === 'Paid' && trip.departureDate?.startsWith(today)) ||
                ['CheckIn', 'CheckOut'].includes(trip.tripBookingStatus)
              )
            case 'History':
              return ['Completed', 'Cancelled', 'Refunded'].includes(trip.tripBookingStatus)
            default:
              return false
          }
        }) || []

  const requestStatuses = ['Pending', 'Processing', 'Approved', 'Confirmed', 'ModificationRequest', 'Cancelled']
  const paymentStatuses = ['Pending', 'Deposited', 'Processing', 'Paid']

  const getFilterOptions = () => {
    return activeTab === 'Request' ? requestStatuses : paymentStatuses
  }

  const getSelectedStatus = () => {
    return activeTab === 'Request' ? selectedRequestStatus : selectedPaymentStatus
  }

  const setSelectedStatus = (status: string | null) => {
    if (activeTab === 'Request') {
      setSelectedRequestStatus(status)
    } else {
      setSelectedPaymentStatus(status)
    }
  }

  const resetFilter = () => {
    setSelectedStatus(null)
    setFilterModalVisible(false)
  }

  return (
    <SubLayout title='My Trips' showBackButton={false}>
      <View className='px-5 mt-10'>
        <View className='flex-row items-center justify-between mb-4'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
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

          {(activeTab === 'Request' || activeTab === 'NotStarted') && (
            <TouchableOpacity onPress={() => setFilterModalVisible(true)} className='ml-4 p-2'>
              <Ionicons name='filter-outline' size={24} color='black' />
            </TouchableOpacity>
          )}
        </View>

        <Modal transparent visible={filterModalVisible} animationType='fade'>
          <View className='flex-1 justify-center items-center bg-black/50'>
            <View className='bg-white p-6 rounded-2xl w-11/12 max-w-md'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-xl font-bold text-gray-800'>
                  {activeTab === 'Request' ? 'Filter Requests' : 'Filter Payment Status'}
                </Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name='close' size={24} color='#6b7280' />
                </TouchableOpacity>
              </View>

              <Text className='text-gray-600 mb-3'>
                {activeTab === 'Request' ? 'Select request status' : 'Select payment status'}
              </Text>

              <FlatList
                data={getFilterOptions()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`py-3 px-4 my-1 rounded-lg flex-row items-center ${
                      getSelectedStatus() === item ? 'bg-blue' : 'bg-gray-100'
                    }`}
                    onPress={() => {
                      setSelectedStatus(getSelectedStatus() === item ? null : item)
                      setFilterModalVisible(false)
                    }}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        getSelectedStatus() === item ? 'border-white bg-transparent' : 'border-gray-400'
                      }`}
                    >
                      {getSelectedStatus() === item && (
                        <View className='absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white' />
                      )}
                    </View>
                    <Text className={`font-medium ${getSelectedStatus() === item ? 'text-white' : 'text-gray-800'}`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View className='h-1' />}
              />

              <View className='flex-row justify-between mt-6'>
                <TouchableOpacity className='px-6 py-2 border border-gray-300 rounded-lg' onPress={resetFilter}>
                  <Text className='text-gray-700 font-medium'>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='px-6 py-2 bg-blue-500 rounded-lg'
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text className='text-white font-medium'>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {filteredTrips.length > 0 ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, gap: 16 }}>
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
