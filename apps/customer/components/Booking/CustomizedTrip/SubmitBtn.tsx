import { useState } from 'react'
import { useBooking } from '@apps/customer/contexts/BookingContext'
import { useTripRequest } from '@apps/customer/hooks/useTripRequest'
import { TouchableOpacity, Text, View } from 'react-native'
import SubmitSuccessMssg from './SubmitSuccessMssg'
import SubmitFailedMssg from './SubmitFailedMssg'
import { TripRequestResponseType } from '@apps/customer/types/Booking/tripRequestResponse.type'

interface SubmitBtnProps {
  title: string
  disabled?: boolean
}

export default function SubmitBtn({ title, disabled = false }: SubmitBtnProps) {
  const { bookTrip, isLoading, error } = useTripRequest()
  const { bookingRequest } = useBooking()

  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [tripResponse, setTripResponse] = useState<TripRequestResponseType | null>(null)

  const handlePress = async () => {
    const response = await bookTrip(bookingRequest)

    if (response) {
      setTripResponse(response)
      setSuccessVisible(true)
    } else {
      setErrorVisible(true)
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

      <SubmitSuccessMssg
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        tripRequestResponse={tripResponse}
      />

      <SubmitFailedMssg visible={errorVisible} onClose={() => setErrorVisible(false)} errorMessage={error} />
    </View>
  )
}
