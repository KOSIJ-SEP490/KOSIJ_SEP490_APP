import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { ChevronLeft, ArrowRight, UploadCloud, CheckCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import Steps from './Steps.container'
import axios from 'axios'
import { Checkbox } from 'react-native-paper'

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

  const [checkedPassengers, setCheckedPassengers] = useState<{ [key: number]: boolean }>({})

  const toggleCheck = (id: number) => {
    setCheckedPassengers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const [ticketUrl, setTicketUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get<{ value: Ticket[] }>(
          `https://kosij.azurewebsites.net/api/trip/${tripId}/airplane-tickets?ticketType=Outbound`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQxMTA1MzIzfQ.twjI4X8nXLIYao2sfsAhzYgNZWIgl_80q4dwhvZHcNM`,
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
        const response = await axios.get<{ value: Passenger[] }>(
          `https://kosij.azurewebsites.net/api/trip/${tripId}/passengers`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQxMDYwMDQzfQ.JZGPPTbui4hAy6zc4Y4IfvVHeyiwfNiHMibFfilxR1U`,
              Accept: 'application/json'
            }
          }
        )

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
        `https://kosij.azurewebsites.net/api/trip/${tripId}/passengers/check-in`,
        { checkInPassengersRequest: selectedPassengers },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQxMDgyNzEzfQ.NPFL8RVmpNPw8Ot0VHKmrh6FC84nsPceYYCifZG18NY`,
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
    <View className='flex-1 bg-white px-4 pt-4'>
      {/* Header */}
      <View className='mt-3 flex-row items-center px-4 py-2'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={'#292D32'} size={24} />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-center flex-1'>Tour Detailed</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Steps Indicator */}
      <Steps currentStep={currentStep} />

      {currentStep === 1 ? (
        // ✅ STEP 1: Collect Tickets
        <>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>🚀 Please collect tickets at the check-in counter</Text>
            <Text className='text-white text-sm'>Please collect tickets at least 3 hours before the flight.</Text>
          </View>

          {/* Ticket Image Upload */}
          <View className='mt-4 border-dashed border-2 border-gray-300 rounded-lg p-4 items-center'>
            {ticketUrl ? (
              <Image source={{ uri: ticketUrl }} className='w-full h-56 rounded-lg' />
            ) : (
              <View className='items-center'>
                <UploadCloud size={32} className='text-gray-400' />
                <Text className='text-gray-500'>No ticket available</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        // ✅ STEP 2: Take Attendance
        <ScrollView>
          <View className='p-4 rounded-lg mt-4' style={{ backgroundColor: '#264eca' }}>
            <Text className='text-white font-bold'>
              ℹ️ Please complete the attendance check before proceeding to check-in.
            </Text>
          </View>

          {/* Attendance List */}
          <ScrollView className='mt-4' style={{ maxHeight: 400 }}>
            <View className='bg-gray-100 p-4 rounded-lg mt-4'>
              <Text className='text-lg font-semibold mb-2'>Take attendance</Text>
              {passengers.map((passenger, index) => (
                <View key={passenger.id} className='flex-row justify-between p-2 bg-white rounded-md mb-2'>
                  <Text>{passenger.fullName}</Text>
                  <Checkbox
                    status={checkedPassengers[passenger.id] ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheck(passenger.id)}
                    disabled={passenger.isCheckIn}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}

      {/* Navigation Buttons (Fixed at Bottom) */}
      <View className='absolute bottom-4 left-4 right-4 flex-row justify-between'>
        <TouchableOpacity className='px-4 py-2 border border-blue-600 rounded-full' onPress={() => setCurrentStep(1)}>
          <Text className='text-blue-600'>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full flex-row items-center ${currentStep === 1 ? '#264eca' : 'bg-green-600'}`}
          onPress={() => (currentStep === 1 ? setCurrentStep(2) : handleCheckIn())}
        >
          <Text className='text-white mr-2'>{currentStep === 1 ? 'Next' : 'Done'}</Text>
          {currentStep === 1 ? (
            <ArrowRight size={18} className='text-white' />
          ) : (
            <CheckCircle size={18} className='text-white' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CollectTicket
