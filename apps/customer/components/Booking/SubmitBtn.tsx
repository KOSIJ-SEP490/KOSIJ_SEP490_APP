import { useBooking } from '@apps/customer/contexts/BookingContext'
import { useTripRequest } from '@apps/customer/hooks/useTripRequest'
import { TouchableOpacity, Text, View, Modal } from 'react-native'
import { useState } from 'react'
import { CheckCircleIcon } from 'lucide-react-native'
import { TripRequestResponseType } from '@apps/customer/types/Booking/tripRequestResponse.type'

interface SubmitBtnProps {
  title: string
  disabled?: boolean
}

export default function SubmitBtn({ title, disabled = false }: SubmitBtnProps) {
  const { bookTrip, isLoading, error } = useTripRequest()
  const { bookingRequest } = useBooking()
  const [visible, setVisible] = useState(false)
  const [tripRequestResponse, setTripRequestResponse] = useState<TripRequestResponseType | null>(null)

  const handlePress = async () => {
    const response = await bookTrip(bookingRequest)
    console.log(bookingRequest)
    if (response) {
      setTripRequestResponse(response)
      setVisible(true)
    } else {
      console.log('Error booking trip:', error)
    }
  }

  return (
    <View>
      <TouchableOpacity
        className={`bg-blue py-3 rounded-lg items-center w-full shadow-md ${disabled || isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        disabled={disabled || isLoading}
      >
        <Text className='text-white text-lg font-semibold'>{title}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType='slide'>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-6 rounded-2xl shadow-lg w-4/5'>
            <View className='items-center'>
              <View className='bg-green-100 p-3 rounded-full'>
                <CheckCircleIcon size={40} color='green' />
              </View>
              <Text className='text-lg font-semibold mt-3'>Submit Success!</Text>
            </View>

            {tripRequestResponse && (
              <View className='mt-4 border-t border-gray-300 pt-4'>
                <Text className='text-gray-700'>Booking ID: {tripRequestResponse.id || 'N/A'}</Text>
                <Text className='text-gray-700'>Created Time: {new Date().toLocaleString()}</Text>
                <Text className='text-gray-700'>Sender Name: {tripRequestResponse.nameContact || 'N/A'}</Text>
              </View>
            )}

            <Text className='text-gray-500 text-sm mt-4'>
              Please wait for us to confirm your customized booking as soon as possible.
            </Text>

            <TouchableOpacity onPress={() => setVisible(false)} className='bg-blue mt-4 py-2 rounded-lg items-center'>
              <Text className='text-white font-bold'>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
