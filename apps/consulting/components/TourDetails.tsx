import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import axios from 'axios'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

type TourDetailsScreenProps = {
  id: number
}

type RootStackParamList = {
  TourDetails: { id: number }
  CollectTicket: { ticketImage: string; tripId: number }
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TourDetails'>

export default function TourDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute()
  const { id } = route.params as TourDetailsScreenProps
  const [tourDetails, setTourDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [participantList, setParticipantList] = useState<any>(null)
  const apiImageUrl = 'https://example.com/ticket.jpg' // Example
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`https://kosij.azurewebsites.net/api/staff/trip/${id}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQxMDMxNjE5fQ.4kEuNei2Zp2gd9n4jTrp1mGbMB3nEjhrQZuOfUVta2c`,
            Accept: 'text/plain'
          }
        })
        setTourDetails(response.data)
      } catch (error) {
        console.error('Error fetching tour details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTourDetails()
  }, [id])

  useEffect(() => {
    const fetchTourParticipantsList = async () => {
      try {
        const response = await axios.get(`https://kosij.azurewebsites.net/api/trip/${id}/passengers`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQxMDMxNjE5fQ.4kEuNei2Zp2gd9n4jTrp1mGbMB3nEjhrQZuOfUVta2c`,
            Accept: 'text/plain'
          }
        })
        setParticipantList(response.data)
      } catch (error) {
        console.error('Error fetching tour details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTourParticipantsList()
  }, [id])

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#264eca' />
      </View>
    )
  }

  if (!tourDetails) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-red-500'>Failed to load tour details.</Text>
      </View>
    )
  }

  console.log('Data:', participantList)

  const getButtonText = () => {
    if (!participantList?.value) return 'Start Trip'

    const allCheckedIn = participantList.value.every((p: any) => p.isCheckIn === true)
    return allCheckedIn ? 'Create Order' : 'Start Trip'
  }

  return (
    <ScrollView>
      <View className='flex-1 mt-3 bg-white p-4'>
        {/* Header */}
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Tour Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tour Name & Status */}
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View className='flex-row items-center justify-between flex-wrap'>
            <Text className='text-lg font-bold flex-1 pr-2'>{tourDetails?.value?.tourName}</Text>
            <View className='px-3 py-1 rounded-full' style={{ backgroundColor: '#264ECA' }}>
              <Text className='text-white text-xs'>{tourDetails?.value?.tripStatus}</Text>
            </View>
          </View>

          {/* Start & End Dates */}
          <View className='flex-row justify-between mt-3 border-b border-zinc-300'>
            <View className='p-3 rounded-lg items-center mb-3 w-36' style={{ backgroundColor: '#f6feff' }}>
              <Text className='font-semibold' style={{ color: '#264ECA' }}>
                Start Time
              </Text>
              <Text className='text-black'>{tourDetails?.value?.departureDate}</Text>
            </View>
            <View className='p-3 bg-blue-50 rounded-lg items-center mb-3 w-36' style={{ backgroundColor: '#f6feff' }}>
              <Text className='font-semibold' style={{ color: '#264ECA' }}>
                End Time
              </Text>
              <Text className='text-black'>{tourDetails?.value?.returnDate}</Text>
            </View>
          </View>

          {/* Additional Information */}
          <Text className='mt-4 font-bold'>Additional Information</Text>
          <Text className='text-gray-600 text-sm'>
            ✈ Airline: {tourDetails?.value?.additionalInformation.airline} {'\n'}
            🏨 Hotel: {tourDetails?.value?.additionalInformation.hotelService} {'\n'}
            📍 Departure: {tourDetails?.value?.additionalInformation.departurePoint} {'\n'}
            📍 Destination: {tourDetails?.value?.additionalInformation.destinationPoint}
          </Text>
        </View>

        {/* Itinerary */}
        <View className='p-4 bg-white rounded-lg shadow-md mt-5'>
          {tourDetails?.value?.tourResponse?.tourDetails?.map((day: any, index: number) => (
            <View key={index} className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
              <Text className='font-bold'>
                Day {day.day}: {day.itineraryName}
              </Text>
              {day.itineraryDetails?.map((item: any, idx: number) => (
                <View key={idx} className='mt-2'>
                  <Text className='font-semibold text-blue-600'>{item.time}</Text>
                  <Text className='text-gray-600'>{item.description}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Participants List */}
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <Text className='font-bold'>Participants List</Text>
          {participantList?.value?.map((participant: any, index: number) => (
            <View key={index} className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
              <Text className='font-semibold text-blue-600'>{participant.fullName}</Text>
              <Text className='text-gray-600'>{participant.phoneNumber || 'null'}</Text>
              <Text className='text-gray-600'>{participant.email || 'null'}</Text>
            </View>
          ))}
        </View>
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <Text className='font-bold'>Important Notes</Text>
          {tourDetails?.value?.notes?.map((note: any, index: number) => (
            <View key={index} className='p-3 rounded-lg mb-2 flex-row'>
              <Text className='font-bold' style={{ color: '#264ECA' }}>
                #{index + 1}:
              </Text>
              <Text className='font-medium'> {note.note}</Text>
            </View>
          ))}
        </View>
        <View className='mt-10 ml-5 w-80'>
          {/* Bottom Button */}
          <TouchableOpacity
            style={{ backgroundColor: '#264eca' }}
            className='p-3 rounded-md bottom-4 right-4'
            onPress={() => navigation.navigate('CollectTicket', { ticketImage: apiImageUrl, tripId: id })}
          >
            <Text className='text-white text-center'>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 16,
//     marginTop: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5 // Android shadow
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10
//   },
//   cardContent: {
//     paddingVertical: 10
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5
//   },
//   description: {
//     fontSize: 14,
//     color: 'gray'
//   }
// })
