import { useContext } from 'react'
import AuthContext from '@shared/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_BASE_URL } from '@env'

export type Trip = {
  id: number
  tourName: string
  departurePoint: string
  destinationPoint: string
  tripType: string
  departureDate: string
  returnDate: string
  tripStatus: string
}

const fetchTrips = async (token: string): Promise<Trip[]> => {
  const { data } = await axios.get<{ message: string; value: Trip[] }>(`${API_BASE_URL}staff/trips`, {
    headers: {
      Accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }
  })
  return data.value
}

export const useTrips = () => {
  const authContext = useContext(AuthContext)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: () => fetchTrips(authContext.user!.token)
  })
}
