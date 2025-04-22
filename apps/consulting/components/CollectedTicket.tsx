import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import { ChevronLeft, ArrowRight, UploadCloud, CheckCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import Steps from './Steps.container'
import axios from 'axios'
import { Checkbox } from 'react-native-paper'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'

type RootStackParamList = {
  CollectTicket: { ticketImage: string; tripId: number }
  TourDetails: { id: number }
}

type Props = StackScreenProps<RootStackParamList, 'CollectTicket'>

interface Passenger {
  id: number
  fullName: string
  isCheckIn: boolean
}

interface Ticket {
  outboundTicketUrl?: string
}

const CollectTicket = ({ route }: Props) => {
  const navigation = useNavigation<StackScreenProps<RootStackParamList, 'CollectTicket'>['navigation']>()
  const { ticketImage, tripId } = route.params
  const [currentStep, setCurrentStep] = useState(1)
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const authContext = useContext(AuthContext)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext
  const [checkedPassengers, setCheckedPassengers] = useState<{ [key: number]: boolean }>({})

  const toggleCheck = (id: number) => {
    setCheckedPassengers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const [ticketUrl, setTicketUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get<{ value: Ticket[] }>(
          `${API_BASE_URL}trip/${tripId}/airplane-tickets?ticketType=Outbound`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: 'application/json'
            }
          }
        )

        const tickets = response.data.value
        const outboundTicket = tickets.find((ticket: any) => ticket.outboundTicketUrl)

        if (outboundTicket) {
          setTicketUrl(outboundTicket.outboundTicketUrl ?? null)
        }
      } catch (error) {
        console.error('Error fetching ticket:', error)
      }
    }

    fetchTicket()
  }, [tripId])

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await axios.get<{ value: Passenger[] }>(`${API_BASE_URL}trip/${tripId}/passengers`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json'
          }
        })

        setPassengers(response.data.value)
      } catch (error) {
        console.error('Error fetching passengers:', error)
      }
    }

    fetchPassengers()
  }, [tripId])
  console.log('Fetching passengers with tripId:', tripId)

  const handleCheckIn = async () => {
    const selectedPassengers = Object.entries(checkedPassengers)
      .filter(([_, checked]) => checked)
      .map(([id]) => ({ id: Number(id), isCheckIn: true }))

    if (selectedPassengers.length === 0) {
      alert('Please select at least one passenger to check in.')
      return
    }

    try {
      const response = await axios.put<{ value: string }>(
        `${API_BASE_URL}trip/${tripId}/passengers/check-in`,
        { checkInPassengersRequest: selectedPassengers },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      alert(response.data.value || 'Check-in successful!')
      navigation.navigate('TourDetails', { id: tripId })
    } catch (error) {
      console.error('Error during check-in:', error)
      alert('Failed to check in passengers.')
    }
  }

  const [attendance, setAttendance] = useState<Record<number, { isCheckIn: boolean | null; isAbsent: boolean | null }>>(
    {}
  )

  // const updateAttendance = (id: any, status: string) => {
  //   setAttendance((prev) => ({
  //     ...prev,
  //     [id]: status === 'yes' ? { isCheckIn: true, isAbsent: null } : { isCheckIn: null, isAbsent: true }
  //   }))
  // }

  const updateAttendance = (id: any, status: string) => {
    setAttendance((prev) => {
      const current = prev[id] || { isCheckIn: null, isAbsent: null }

      if (status === 'yes') {
        return {
          ...prev,
          [id]: current.isCheckIn ? { isCheckIn: null, isAbsent: null } : { isCheckIn: true, isAbsent: null }
        }
      } else {
        return {
          ...prev,
          [id]: current.isAbsent ? { isCheckIn: null, isAbsent: null } : { isCheckIn: null, isAbsent: true }
        }
      }
    })
  }

  const handleSubmit = async () => {
    const requestBody = {
      checkInPassengersRequest: Object.entries(attendance).map(([id, status]) => ({
        id: Number(id),
        ...(status || {})
      }))
    }

    try {
      const response = await axios.put<{ value: Passenger[] }>(
        `${API_BASE_URL}trip/${tripId}/passengers/check-in`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      alert(response.data.value || 'Check-in successful!')
      navigation.navigate('TourDetails', { id: tripId })
    } catch (error) {
      console.error('Error during check-in:', error)
      alert('Failed to check in passengers.')
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white px-4'>
      {/* Header */}
      <View className='mt-3 flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => navigation.navigate('TourDetails', { id: tripId })}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-center flex-1'>Tour Detailed</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Steps Indicator */}
      <Steps currentStep={currentStep} />

      {currentStep === 1 ? (
        // ✅ STEP 1: Collect Tickets
        <ScrollView style={{ paddingBottom: 80 }}>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>🚀 Please collect tickets at the check-in counter</Text>
            <Text className='text-white text-sm'>Please collect tickets at least 3 hours before the flight.</Text>
          </View>

          {/* Ticket Image Upload */}
          <View className='mt-4 border-dashed border-2 border-gray-300 rounded-lg p-4 items-center'>
            {ticketUrl ? (
              <Image source={{ uri: ticketUrl }} className='w-full h-screen rounded-lg' />
            ) : (
              <View className='items-center'>
                <UploadCloud size={32} className='text-gray-400' />
                <Text className='text-gray-500'>No ticket available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        // ✅ STEP 2: Take Attendance
        <ScrollView style={{ flexGrow: 1, paddingBottom: 80 }}>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>
              ℹ️ Please complete the attendance check before proceeding to check-in.
            </Text>
          </View>

          {/* Attendance List */}
          <View className='bg-gray-100 p-4 rounded-lg mt-4'>
            <Text className='text-lg font-semibold mb-2'>Take attendance</Text>
            {passengers
              .filter((passenger) => !passenger.isCheckIn)
              .map((passenger, index) => (
                <View key={passenger.id} className='flex-row justify-between p-2 bg-white rounded-md mb-2'>
                  <Text className='break-words truncate max-w-[75%]'>{passenger.fullName}</Text>
                  <View className='flex-row'>
                    <TouchableOpacity
                      onPress={() => updateAttendance(passenger.id, 'yes')}
                      style={{
                        backgroundColor: attendance[passenger.id]?.isCheckIn ? '#4CAF50' : 'transparent',
                        padding: 8,
                        borderRadius: 16
                      }}
                    >
                      <Text>Present</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateAttendance(passenger.id, 'no')}
                      style={{
                        backgroundColor: attendance[passenger.id]?.isAbsent ? '#F44336' : 'transparent',
                        padding: 8,
                        borderRadius: 16,
                        marginLeft: 10
                      }}
                    >
                      <Text>Absent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      )}

      {/* Navigation Buttons (Fixed at Bottom) */}
      <View className=' bottom-2 left-4 right-4 flex-row justify-between' style={{ paddingTop: 20 }}>
        <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
          <Text className='text-blue-600'>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full flex-row items-center`}
          style={{ backgroundColor: currentStep === 1 ? '#264eca' : 'green' }}
          onPress={() => (currentStep === 1 ? setCurrentStep(2) : handleSubmit())}
        >
          <Text className='text-white mr-2'>{currentStep === 1 ? 'Next' : 'Done'}</Text>
          {currentStep === 1 ? (
            <ArrowRight size={18} className='text-white' />
          ) : (
            <CheckCircle size={18} className='text-white' />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CollectTicket
