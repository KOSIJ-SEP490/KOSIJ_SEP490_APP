import AuthContext from '@shared/context/AuthContext'
import { useContext, useState } from 'react'
import axios from 'axios'
import { BookingRequestType } from '../types/Booking/bookingRequest.type'
import { TripRequestResponseType } from '../types/Booking/tripRequestResponse.type'
import { API_BASE_URL } from '@env'

export function useTripRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripRequestResponse, setTripRequestResponse] = useState<TripRequestResponseType | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const bookTrip = async (tripData: BookingRequestType): Promise<TripRequestResponseType | null> => {
    if (!userToken) {
      setError('User is not authenticated.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.post<TripRequestResponseType>(`${API_BASE_URL}trip-request`, tripData, {
        headers: { Authorization: `Bearer ${userToken}` }
      })

      console.log(res.data)

      setTripRequestResponse(res.data)
      return res.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book the trip.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { bookTrip, isLoading, error, tripRequestResponse }
}
