import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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

const fetchTrips = async (): Promise<Trip[]> => {
  const { data } = await axios.get<{ message: string; value: Trip[] }>(
    'https://kosij.azurewebsites.net/api/staff/trips',
    {
      headers: {
        Accept: 'text/plain',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQ5Nzg2OTkxfQ.3og4fBtcZS-F3uIsxz5EAZww6WkvM5aZ9dzwjnQ8prA'
      }
    }
  )
  return data.value
}

export const useTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: fetchTrips
  })
}
