// import React, { useContext, useEffect, useState } from 'react'
// import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
// import { useNavigation, useRoute } from '@react-navigation/native'
// import { ChevronLeft } from 'lucide-react-native'
// import axios from 'axios'
// import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
// import AuthContext from '@shared/context/AuthContext'
// import { API_BASE_URL } from '@env'

// type TourDetailsScreenProps = {
//   id: number
// }

// type RootStackParamList = {
//   MainTabs: { screen?: string }
//   TourDetails: { id: number }
//   CollectTicket: { ticketImage: string; tripId: number }
//   CheckOutTrip: { ticketImage: string; tripId: number }
//   CreateOrder: { id: number }
//   Trip: undefined
// }

// type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TourDetails'>

// export default function TourDetailsScreen() {
//   const navigation = useNavigation<NavigationProps>()
//   const route = useRoute()
//   const { id } = route.params as TourDetailsScreenProps
//   const [tourDetails, setTourDetails] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [participantList, setParticipantList] = useState<any>(null)
//   const apiImageUrl = 'https://example.com/ticket.jpg'
//   const authContext = useContext(AuthContext)
//   const [refreshing, setRefreshing] = useState(false)

//   if (!authContext || !authContext.user) {
//     throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
//   }

//   const { user } = authContext
//   const fetchTourDetails = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}staff/trip/${id}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           Accept: 'text/plain'
//         }
//       })
//       return response.data
//     } catch (error) {
//       console.error('Error fetching tour details:', error)
//       throw error
//     }
//   }

//   useEffect(() => {
//     const getTourDetails = async () => {
//       try {
//         const data = await fetchTourDetails()
//         setTourDetails(data)
//       } catch (error) {
//         console.error('Failed to load tour details.')
//       } finally {
//         setLoading(false)
//       }
//     }
//     getTourDetails()
//   }, [id])

//   useEffect(() => {
//     const fetchTourParticipantsList = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}trip/${id}/passengers`, {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             Accept: 'text/plain'
//           }
//         })
//         setParticipantList(response.data)
//       } catch (error) {
//         console.error('Error fetching tour details:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTourParticipantsList()
//   }, [id])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     try {
//       const [tourData, participantsData] = await Promise.all([
//         fetchTourDetails(),
//         axios.get(`${API_BASE_URL}trip/${id}/passengers`, {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             Accept: 'text/plain'
//           }
//         })
//       ])
//       setTourDetails(tourData)
//       setParticipantList(participantsData.data)
//     } catch (error) {
//       console.error('Error refreshing the page:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   if (loading) {
//     return (
//       <View className='flex-1 justify-center items-center'>
//         <ActivityIndicator size='large' color='#264eca' />
//       </View>
//     )
//   }

//   if (!tourDetails) {
//     return (
//       <View className='flex-1 justify-center items-center'>
//         <Text className='text-red-500'>Failed to load tour details.</Text>
//       </View>
//     )
//   }

//   console.log('Data:', participantList)

//   const getButtonText = () => {
//     if (!participantList?.value) return 'Start Trip'

//     const allCheckedIn = participantList.value.every((p: any) => p.isCheckIn === true || p.isCheckIn === false)
//     return allCheckedIn ? 'Trip Completion' : 'Start Trip'
//   }

//   return (
//     <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//       <View className='flex-1 mt-3 bg-white p-4'>
//         {/* Header */}
//         <View className='flex-row items-center px-4 py-2'>
//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate('MainTabs', {
//                 screen: 'Trip'
//               })
//             }
//           >
//             <ChevronLeft color={'#292D32'} size={24} />
//           </TouchableOpacity>
//           <Text className='text-lg font-semibold text-center flex-1'>Tour Details</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Tour Name & Status */}
//         <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//           <View className='flex-row items-center justify-between flex-wrap'>
//             <Text className='text-lg font-bold flex-1 pr-2'>{tourDetails?.value?.tourName}</Text>
//             <View
//               className='px-3 py-1 rounded-full'
//               style={{
//                 backgroundColor:
//                   tourDetails?.value?.tripStatus === 'Available'
//                     ? '#ADD8E6'
//                     : tourDetails?.value?.tripStatus === 'Not Available'
//                       ? '#D3D3D3'
//                       : tourDetails?.value?.tripStatus === 'Full'
//                         ? '#A94064'
//                         : tourDetails?.value?.tripStatus === 'Registration Closed'
//                           ? '#FFA500'
//                           : tourDetails?.value?.tripStatus === 'NotStarted'
//                             ? '#FFD700'
//                             : tourDetails?.value?.tripStatus === 'On Going'
//                               ? '#0000FF'
//                               : tourDetails?.value?.tripStatus === 'Completed'
//                                 ? '#008000'
//                                 : tourDetails?.value?.tripStatus === 'Canceled'
//                                   ? '#FF0000'
//                                   : '#D3D3D3'
//               }}
//             >
//               <Text className='text-white text-xs'>{tourDetails?.value?.tripStatus}</Text>
//             </View>
//           </View>
//           <View>
//             <Text className='text-gray-600 text-sm'>Trip ID: {tourDetails?.value?.id}</Text>
//             <Text className='text-gray-600 text-sm'>Type: {tourDetails?.value?.tripType}</Text>
//           </View>

//           {/* Start & End Dates */}
//           <View className='flex-row justify-between mt-3 border-b border-zinc-300'>
//             <View className='p-3 rounded-lg items-center mb-3 w-36' style={{ backgroundColor: '#f6feff' }}>
//               <Text className='font-semibold' style={{ color: '#264ECA' }}>
//                 Start Time
//               </Text>
//               <Text className='text-black'>{tourDetails?.value?.departureDate}</Text>
//             </View>
//             <View className='p-3 bg-blue-50 rounded-lg items-center mb-3 w-36' style={{ backgroundColor: '#f6feff' }}>
//               <Text className='font-semibold' style={{ color: '#264ECA' }}>
//                 End Time
//               </Text>
//               <Text className='text-black'>{tourDetails?.value?.returnDate}</Text>
//             </View>
//           </View>

//           {/* Additional Information */}
//           <Text className='mt-4 font-bold'>Additional Information</Text>
//           <Text className='text-gray-600 text-sm'>
//             ✈ Airline: {tourDetails?.value?.additionalInformation.airline} {'\n'}
//             🏨 Hotel: {tourDetails?.value?.additionalInformation.hotelService} {'\n'}
//             📍 Departure: {tourDetails?.value?.additionalInformation.departurePoint} {'\n'}
//             📍 Destination: {tourDetails?.value?.additionalInformation.destinationPoint}
//           </Text>
//         </View>

//         {/* Itinerary */}
//         <View className='p-4 bg-white rounded-lg shadow-md mt-5'>
//           {tourDetails?.value?.tourResponse?.tourDetails?.map((day: any, index: number) => (
//             <View key={index} className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
//               <Text className='font-bold'>
//                 Day {day.day}: {day.itineraryName}
//               </Text>
//               {day.itineraryDetails?.map((item: any, idx: number) => (
//                 <View key={idx} className='mt-2'>
//                   <Text className='font-semibold text-blue-600'>{item.time}</Text>
//                   <Text className='text-gray-600'>{item.description}</Text>
//                 </View>
//               ))}
//             </View>
//           ))}
//         </View>

//         {/* Participants List */}
//         <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//           <Text className='font-bold'>Participants List</Text>
//           {participantList?.value?.map((participant: any, index: number) => (
//             <View key={index} className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
//               <Text className='font-semibold' style={{ color: '#264ECA' }}>
//                 {participant.fullName}
//               </Text>
//               <Text className='text-gray-600'>{participant.phoneNumber || 'null'}</Text>
//               <Text className='text-gray-600'>{participant.email || 'null'}</Text>
//             </View>
//           ))}
//         </View>
//         <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
//           <Text className='font-bold'>Important Notes</Text>
//           {tourDetails?.value?.notes?.map((note: any, index: number) => (
//             <View key={index} className='p-3 rounded-lg mb-2 flex-row'>
//               <Text className='font-bold' style={{ color: '#264ECA' }}>
//                 #{index + 1}:
//               </Text>
//               <Text className='font-medium'> {note.note}</Text>
//             </View>
//           ))}
//         </View>
//         <View className='mt-10 ml-5 w-80'>
//           <View>
//             {/* {getButtonText() === 'Trip Completion' ? (
//               <View className='flex-row gap-2'> */}
//             {/* Trip Completion */}
//             {/* <TouchableOpacity
//                   style={{ backgroundColor: '#264eca' }}
//                   className='flex-1 p-3 rounded-lg items-center bottom-4 right-4'
//                   onPress={() => {
//                     if (getButtonText() === 'Start Trip') {
//                       navigation.navigate('CollectTicket', { ticketImage: apiImageUrl, tripId: id })
//                     } else {
//                       navigation.navigate('CheckOutTrip', { ticketImage: apiImageUrl, tripId: id })
//                     }
//                   }}
//                 >
//                   <Text className='text-white font-semibold'>Trip Completion</Text>
//                 </TouchableOpacity> */}

//             {/* Create Order */}
//             {/* <TouchableOpacity
//                   className='flex-2 p-3 rounded-lg items-center bottom-4 right-4'
//                   onPress={() => navigation.navigate('CreateOrder', { id: id })}
//                   style={{ borderColor: '#264eca', borderWidth: 1 }}
//                 >
//                   <Text className='font-semibold' style={{ color: '#264eca' }}>
//                     Record Order
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={{ backgroundColor: '#264eca' }}
//                 className='p-3 rounded-lg items-center mt-2 bottom-4 right-4'
//                 onPress={() => {
//                   if (getButtonText() === 'Start Trip') {
//                     navigation.navigate('CollectTicket', { ticketImage: apiImageUrl, tripId: id })
//                   } else {
//                     navigation.navigate('CheckOutTrip', { ticketImage: apiImageUrl, tripId: id })
//                   }
//                 }}
//               >
//                 <Text className='text-white font-semibold'>{getButtonText()}</Text>
//               </TouchableOpacity>
//             )} */}
//             {tourDetails?.value?.tripStatus === 'Ongoing' ? (
//               <View className='flex-row gap-2'>
//                 {/* Trip Completion */}
//                 <TouchableOpacity
//                   style={{ backgroundColor: '#264eca' }}
//                   className='flex-1 p-3 rounded-lg items-center bottom-4 right-4'
//                   onPress={() => navigation.navigate('CheckOutTrip', { ticketImage: apiImageUrl, tripId: id })}
//                 >
//                   <Text className='text-white font-semibold'>Trip Completion</Text>
//                 </TouchableOpacity>

//                 {/* Create Order */}
//                 <TouchableOpacity
//                   className='flex-2 p-3 rounded-lg items-center bottom-4 right-4'
//                   onPress={() => navigation.navigate('CreateOrder', { id: id })}
//                   style={{ borderColor: '#264eca', borderWidth: 1 }}
//                 >
//                   <Text className='font-semibold' style={{ color: '#264eca' }}>
//                     Record Order
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ) : tourDetails?.value?.tripStatus === 'NotStarted' ? (
//               <TouchableOpacity
//                 style={{ backgroundColor: '#264eca' }}
//                 className='p-3 rounded-lg items-center mt-2 bottom-4 right-4'
//                 onPress={() => navigation.navigate('CollectTicket', { ticketImage: apiImageUrl, tripId: id })}
//               >
//                 <Text className='text-white font-semibold'>Start Trip</Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import axios from 'axios'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'

type TourDetailsScreenProps = {
  id: number
}

type RootStackParamList = {
  MainTabs: { screen?: string }
  TourDetails: { id: number }
  CollectTicket: { ticketImage: string; tripId: number }
  CheckOutTrip: { ticketImage: string; tripId: number }
  CreateOrder: { id: number }
  Trip: undefined
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TourDetails'>

export default function TourDetailsScreen() {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute()
  const { id } = route.params as TourDetailsScreenProps
  const [tourDetails, setTourDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [participantList, setParticipantList] = useState<any>(null)
  const apiImageUrl = 'https://example.com/ticket.jpg'
  const authContext = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  const fetchTourDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}staff/trip/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'text/plain'
        }
      })
      return response.data
    } catch (error) {
      console.log('Error fetching tour details:', error)
      throw error
    }
  }

  useEffect(() => {
    const getTourDetails = async () => {
      try {
        const data = await fetchTourDetails()
        setTourDetails(data)
      } catch (error) {
        console.log('Failed to load tour details.')
      } finally {
        setLoading(false)
      }
    }
    getTourDetails()
  }, [id])

  useEffect(() => {
    const fetchTourParticipantsList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}trip/${id}/passengers`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'text/plain'
          }
        })
        setParticipantList(response.data)
      } catch (error) {
        console.log('Error fetching tour participants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTourParticipantsList()
  }, [id])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const [tourData, participantsData] = await Promise.all([
        fetchTourDetails(),
        axios.get(`${API_BASE_URL}trip/${id}/passengers`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'text/plain'
          }
        })
      ])
      setTourDetails(tourData)
      setParticipantList(participantsData.data)
    } catch (error) {
      console.log('Error refreshing the page:', error)
    } finally {
      setRefreshing(false)
    }
  }

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

  const getButtonText = () => {
    if (!participantList?.value) return 'Start Trip'

    const allCheckedIn = participantList.value.every((p: any) => p.isCheckIn === true || p.isCheckIn === false)
    return allCheckedIn ? 'Trip Completion' : 'Start Trip'
  }

  const sections = [
    {
      type: 'header',
      render: () => (
        <View className='flex-row items-center px-4 py-2'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Trip'
              })
            }
          >
            <ChevronLeft color={'#292D32'} size={24} />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-center flex-1'>Tour Details</Text>
          <View style={{ width: 24 }} />
        </View>
      )
    },
    {
      type: 'tourDetails',
      render: () => (
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <View className='flex-row items-center justify-between flex-wrap'>
            <Text className='text-lg font-bold flex-1 pr-2'>{tourDetails?.value?.tourName}</Text>
            <View
              className='px-3 py-1 rounded-full'
              style={{
                backgroundColor:
                  tourDetails?.value?.tripStatus === 'Available'
                    ? '#ADD8E6'
                    : tourDetails?.value?.tripStatus === 'Not Available'
                      ? '#D3D3D3'
                      : tourDetails?.value?.tripStatus === 'Full'
                        ? '#A94064'
                        : tourDetails?.value?.tripStatus === 'Registration Closed'
                          ? '#FFA500'
                          : tourDetails?.value?.tripStatus === 'NotStarted'
                            ? '#FFD700'
                            : tourDetails?.value?.tripStatus === 'On Going'
                              ? '#0000FF'
                              : tourDetails?.value?.tripStatus === 'Completed'
                                ? '#008000'
                                : tourDetails?.value?.tripStatus === 'Canceled'
                                  ? '#FF0000'
                                  : '#D3D3D3'
              }}
            >
              <Text className='text-white text-xs'>{tourDetails?.value?.tripStatus}</Text>
            </View>
          </View>
          <View>
            <Text className='text-gray-600 text-sm'>Trip ID: {tourDetails?.value?.id}</Text>
            <Text className='text-gray-600 text-sm'>Type: {tourDetails?.value?.tripType}</Text>
          </View>
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
          <Text className='mt-4 font-bold'>Additional Information</Text>
          <Text className='text-gray-600 text-sm'>
            ✈ Airline: {tourDetails?.value?.additionalInformation.airline} {'\n'}
            🏨 Hotel: {tourDetails?.value?.additionalInformation.hotelService} {'\n'}
            📍 Departure: {tourDetails?.value?.additionalInformation.departurePoint} {'\n'}
            📍 Destination: {tourDetails?.value?.additionalInformation.destinationPoint}
          </Text>
        </View>
      )
    },
    {
      type: 'itinerary',
      render: () => (
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
      )
    },
    {
      type: 'participants',
      render: () => (
        <View className='p-4 bg-white rounded-lg shadow-md mt-3'>
          <Text className='font-bold'>Participants List</Text>
          {participantList?.value?.map((participant: any, index: number) => (
            <View key={index} className='p-3 rounded-lg mb-2' style={{ backgroundColor: '#f6feff' }}>
              <Text className='font-semibold' style={{ color: '#264ECA' }}>
                {participant.fullName}
              </Text>
              <Text className='text-gray-600'>{participant.phoneNumber || 'null'}</Text>
              <Text className='text-gray-600'>{participant.email || 'null'}</Text>
            </View>
          ))}
        </View>
      )
    },
    {
      type: 'notes',
      render: () => (
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
      )
    },
    {
      type: 'buttons',
      render: () => (
        <View className='p-4 mt-10 ml-5 w-80'>
          {tourDetails?.value?.tripStatus === 'Ongoing' ? (
            <View className='flex-row gap-2'>
              <TouchableOpacity
                style={{ backgroundColor: '#264eca' }}
                className='flex-1 p-3 rounded-lg items-center bottom-4 right-4'
                onPress={() => navigation.navigate('CheckOutTrip', { ticketImage: apiImageUrl, tripId: id })}
              >
                <Text className='text-white font-semibold'>Trip Completion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-2 p-3 rounded-lg items-center bottom-4 right-4'
                onPress={() => navigation.navigate('CreateOrder', { id: id })}
                style={{ borderColor: '#264eca', borderWidth: 1 }}
              >
                <Text className='font-semibold' style={{ color: '#264eca' }}>
                  Record Order
                </Text>
              </TouchableOpacity>
            </View>
          ) : tourDetails?.value?.tripStatus === 'NotStarted' ? (
            <TouchableOpacity
              style={{ backgroundColor: '#264eca' }}
              className='p-3 rounded-lg items-center mt-2 bottom-4 right-4'
              onPress={() => navigation.navigate('CollectTicket', { ticketImage: apiImageUrl, tripId: id })}
            >
              <Text className='text-white font-semibold'>Start Trip</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )
    }
  ]

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.type}
      renderItem={({ item }) => item.render()}
      contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#fff' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  )
}
