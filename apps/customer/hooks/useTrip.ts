import { useEffect, useState } from 'react'
import axios from 'axios'
import { TripType } from '../types/Trip/trip.type'
import { API_BASE_URL } from '@env'

export function useTripById(tripId: number) {
  const [trip, setTrip] = useState<TripType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return

    const fetchTrip = async () => {
      try {
        const response = await axios.get<{ message: string; value: TripType }>(`${API_BASE_URL}trip/${tripId}`)
        setTrip(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the trip.')
      }
    }

    fetchTrip()
  }, [tripId])

  return { trip, error }
}
