import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@env'
import { TripBookingDetailType } from '../types/Booking/tripBookingDetail.type'
import { TripBookingRequestType, TripBookingType } from '../types/Booking/tripBooking.type'
import AuthContext from '@shared/context/AuthContext'
import { TripBookingCheckInType } from '../types/Booking/tripBookingCheckIn.type'
import { TripCheckOutType } from '../types/Booking/tripCheckout.type'

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

export function useTripBookingCheckInById(tripBookingId: number) {
  const [tripBookingCheckIn, setTrip] = useState<TripBookingCheckInType | null>(null)
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
        const response = await axios.get<{ message: string; value: TripBookingCheckInType }>(
          `${API_BASE_URL}trip-booking/${tripBookingId}/check-in-payment`,
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

  return { tripBookingCheckIn, error }
}

interface TripBookingResponse {
  message: string
  value?: {
    tripBookingId: number
    expiredTime: string
  }
}

export function useTripBookingCheckoutPayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkoutData, setCheckoutData] = useState<TripCheckOutType | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const checkoutTrip = async (id: number) => {
    if (!userToken) {
      setError('User is not authenticated.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post<{ message: string; value: TripCheckOutType }>(
        `${API_BASE_URL}trip-booking/check-out-payment`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      setCheckoutData(response.data.value)
      return response.data.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process payment.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { checkoutTrip, checkoutData, isLoading, error }
}

export function useTripBookingByAll() {
  const [tripBookings, setTrip] = useState<TripBookingType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const fetchTrip = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}trip-booking/check-expired`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )

      const response = await axios.get<{ message: string; value: TripBookingType[] }>(
        `${API_BASE_URL}customer/trip-bookings`,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )

      setTrip(response.data.value)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch the trip.')
    }
  }

  useEffect(() => {
    fetchTrip()
  }, [userToken])

  return { tripBookings, error, reload: fetchTrip }
}
