import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'

interface Trip {
  tripId: number
  tourName: string
  tripType: string
  tripStatus: string
  departureDate: string
  returnDate: string
  durations: number
}

interface DashboardData {
  message: string
  value: {
    totalCompletedTrips: number
    totalNewTrips: number
    totalOrders: number
    currentTripResponse: Trip
    tripDays: string[]
  }
}

export const useDashboardData = (month: number, year: number) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}dashboard/current-consulting`, {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${user.token}`
          },
          params: {
            month,
            year
          }
        })

        setData(response.data as DashboardData)
        setLoading(false)
      } catch (error: any) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [month, year])

  return { data, loading, error }
}
