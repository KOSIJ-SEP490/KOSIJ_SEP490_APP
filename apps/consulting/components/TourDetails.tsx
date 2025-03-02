import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import axios from 'axios'

type TourDetailsScreenProps = {
  id: number
}

export default function TourDetailsScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params as TourDetailsScreenProps
  const [tourDetails, setTourDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`https://kosij.azurewebsites.net/api/staff/trip/${id}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQwOTQxNDUyfQ.DM9QSghulOLLMa6SMtKVkEqcfFXQ8pRInTbdOpR95qI`,
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
        <View className='p-4 bg-white rounded-lg shadow-md'>
          <Text className='text-lg font-bold'>{tourDetails.tourName}</Text>
          <View className='px-3 py-1 rounded-full' style={{ backgroundColor: 'blue' }}>
            <Text className='text-white text-xs'>{tourDetails.tripStatus}</Text>
          </View>
        </View>

        {/* Start & End Dates */}
        <View className='flex-row justify-between mt-3 border-b border-zinc-300'>
          <View className='p-3 bg-blue-50 rounded-lg items-center mb-3'>
            <Text className='font-semibold text-blue-600'>Start Date</Text>
            <Text className='text-black'>{tourDetails.departureDate}</Text>
          </View>
          <View className='p-3 bg-blue-50 rounded-lg items-center mb-3'>
            <Text className='font-semibold text-blue-600'>Return Date</Text>
            <Text className='text-black'>{tourDetails.returnDate}</Text>
          </View>
        </View>

        {/* Additional Information */}
        <Text className='mt-4 font-bold'>Additional Information</Text>
        <Text className='text-gray-600 text-sm'>
          {/* ✈ Airline: {tourDetails.additionalInformation.airline} {'\n'} */}
          {/* 🏨 Hotel: {tourDetails.additionalInformation.hotelService} {'\n'}
          📍 Departure: {tourDetails.additionalInformation.departurePoint} {'\n'}
          📍 Destination: {tourDetails.additionalInformation.destinationPoint} */}
        </Text>

        {/* Itinerary */}
        <Text className='mt-4 font-bold'>Itinerary</Text>
        {tourDetails.tourDetails.map((day: any, index: number) => (
          <View key={index} className='p-3 rounded-lg bg-blue-50 mb-2'>
            <Text className='font-bold'>
              Day {day.day + 1}: {day.itineraryName}
            </Text>
            {day.itineraryDetails.map((item: any, idx: number) => (
              <View key={idx} className='mt-2'>
                <Text className='font-semibold text-blue-600'>{item.time}</Text>
                <Text className='text-gray-600'>{item.description}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Participants List */}
        <Text className='mt-4 font-bold'>Participants List</Text>
        {tourDetails.tripBookingsResponse.map((participant: any, index: number) => (
          <View key={index} className='p-3 rounded-lg bg-blue-50 mb-2'>
            <Text className='font-semibold text-blue-600'>{participant.customerName}</Text>
            <Text className='text-gray-600'>{participant.phoneNumber}</Text>
            <Text className='text-gray-600'>{participant.email}</Text>
          </View>
        ))}
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
