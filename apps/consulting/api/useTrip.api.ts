import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Define the expected trip type
type Trip = {
  id: number
  tourName: string
  tripType: string
  departureDate: string
  returnDate: string
  tripStatus: string
}

// ✅ Explicitly type `axios.get` to ensure data is `Trip[]`
const fetchTrips = async (): Promise<Trip[]> => {
  const { data } = await axios.get<{ message: string; value: Trip[] }>(
    'https://kosij.azurewebsites.net/api/staff/trips',
    {
      headers: {
        Accept: 'text/plain',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzQwOTQxNDUyfQ.DM9QSghulOLLMa6SMtKVkEqcfFXQ8pRInTbdOpR95qI' // Replace with actual token
      }
    }
  )
  return data.value // ✅ Extract `value` array
}

// ✅ Ensure `useQuery` knows the return type
export const useTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: fetchTrips
  })
}
