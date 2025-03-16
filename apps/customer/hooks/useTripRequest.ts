import AuthContext from '@shared/context/AuthContext'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BookingRequestType } from '../types/Booking/bookingRequest.type'
import { TripRequestResponseType } from '../types/Booking/tripRequestResponse.type'
import { API_BASE_URL } from '@env'
import { TripRequestType } from '../types/Trip/tripRequest.type'
import { TripRequestDetailsType } from '../types/Trip/tripRequestDetails.type'

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
      const res = await axios.post<{ message: string; value: TripRequestResponseType }>(
        `${API_BASE_URL}trip-request`,
        tripData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )

      const tripDataResponse = res.data.value

      setTripRequestResponse(tripDataResponse)
      return tripDataResponse
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response) {
        const axiosError = err as { response: { data?: { errors?: Record<string, string[]> } } }
        const firstErrorMessage = Object.values(axiosError.response.data?.errors || {})[0]?.[0] || 'An error occurred.'
        setError(firstErrorMessage)
      } else {
        setError('Failed to request booking.')
      }

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { bookTrip, isLoading, error, tripRequestResponse }
}

export function useTripRequestByAll() {
  const [tripRequests, setTrip] = useState<TripRequestType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const fetchTrip = async () => {
    try {
      const response = await axios.get<{ message: string; value: TripRequestType[] }>(
        `${API_BASE_URL}trip-requests/current-user`,
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

  return { tripRequests, error, reload: fetchTrip }
}

export function useTripRequestById(tripRequestId: number) {
  const [tripRequestDetails, setTrip] = useState<TripRequestDetailsType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!tripRequestId || !userToken) {
      setError('User is not authenticated or invalid trip ID.')
      return
    }

    const fetchTrip = async () => {
      try {
        const response = await axios.get<{ message: string; value: TripRequestDetailsType }>(
          `${API_BASE_URL}customer/trip-request/${tripRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTrip(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the request details.')
      }
    }

    fetchTrip()
  }, [tripRequestId, userToken])

  return { tripRequestDetails, error }
}
