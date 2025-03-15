import axios from 'axios'

export interface Location {
  id: number
  name: string
  districts?: District[]
  code: string
}

export interface District {
  id: number
  name: string
  wards?: Ward[]
  code: string
}

export interface Ward {
  id: number
  name: string
  code: string
}

const axiosInstance = axios.create({
  baseURL: 'https://provinces.open-api.vn/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const fetchAllLocations = async (): Promise<Location[]> => {
  try {
    const response = await axiosInstance.get<Location[]>('/?depth=3')
    return response.data
  } catch (error) {
    console.error('Error fetching all locations:', error)
    return []
  }
}

export const fetchCities = async () => {
  try {
    const response = await axiosInstance.get<Location[]>('/p/')
    return response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export const fetchDistricts = async (cityId: any) => {
  try {
    const response = await axiosInstance.get<{ districts: District[] }>(`/p/${cityId}?depth=2`)
    return response.data.districts || []
  } catch (error) {
    console.error('Error fetching districts:', error)
    return []
  }
}

export const fetchWards = async (districtId: any) => {
  try {
    const response = await axiosInstance.get<{ wards: Ward[] }>(`/d/${districtId}?depth=2`)
    return response.data.wards || []
  } catch (error) {
    console.error('Error fetching wards:', error)
    return []
  }
}
