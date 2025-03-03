import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@env'
import { TripBookingDetailType } from '../types/Booking/tripBookingDetail.type'
import { TripBookingRequestType } from '../types/Booking/tripBooking.type'
import AuthContext from '@shared/context/AuthContext'

export function useTripBookingById(tripBookingId: number) {
  const [tripBookingDetail, setTrip] = useState<TripBookingDetailType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!tripBookingId || !userToken) {
      setError('User is not authenticated or invalid trip ID.')
      return
    }

    const fetchTrip = async () => {
      try {
        const response = await axios.get<{ message: string; value: TripBookingDetailType }>(
          `${API_BASE_URL}trip-booking/${tripBookingId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTrip(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the trip.')
      }
    }

    fetchTrip()
  }, [tripBookingId, userToken])

  return { tripBookingDetail, error }
}

interface TripBookingResponse {
  message: string
  value?: {
    tripBookingId: number
    expiredTime: string
  }
}

export function useTripBooking() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripBookingId, setTripBookingId] = useState<number | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const bookTrip = async (tripData: TripBookingRequestType): Promise<number | null> => {
    if (!userToken) {
      setError('User is not authenticated.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.post<TripBookingResponse>(`${API_BASE_URL}trip-booking/scheduled`, tripData, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })

      console.log('useTripBooking response:')

      const bookingId = res.data.value?.tripBookingId ?? null
      setTripBookingId(bookingId)

      return bookingId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book the trip.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { bookTrip, tripBookingId, isLoading, error }
}
