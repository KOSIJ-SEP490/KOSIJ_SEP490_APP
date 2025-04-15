import { useContext, useEffect, useState } from 'react'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { PassengerDetail } from '../types/Passenger/Passenger.type'
import AuthContext from '@shared/context/AuthContext'

export function usePassengersByTripBookingId(tripBookingId: number) {
  const [passengers, setPassengers] = useState<PassengerDetail[]>([])
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!tripBookingId || !userToken) {
      setError('User is not authenticated or trip ID is missing.')
      return
    }

    const fetchPassengers = async () => {
      try {
        const response = await axios.get<{ message: string; value: PassengerDetail[] }>(
          `${API_BASE_URL}trip-booking/${tripBookingId}/passengers`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setPassengers(response.data.value || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch passenger data.')
      }
    }

    fetchPassengers()
  }, [tripBookingId, userToken])

  return { passengers, error }
}
