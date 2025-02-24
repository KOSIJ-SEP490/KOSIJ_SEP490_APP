import { useEffect, useState } from 'react'
import axios from 'axios'
import { FarmType } from '../types/farm.type'

export function useAllFarms() {
  const [farms, setFarms] = useState<FarmType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get<{ message: string; value: FarmType[] }>(
          'https://kosij-api.azurewebsites.net/api/farms/active'
        )
        setFarms(response.data.value)
      } catch (err) {
        setError('Failed to fetch farms.')
      }
    }

    fetchFarms()
  }, [])

  return { farms, error }
}

export function useFarmById(farmId: number) {
  const [farm, setFarm] = useState<FarmType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!farmId) return

    const fetchFarm = async () => {
      try {
        const response = await axios.get<{ message: string; value: FarmType }>(
          `https://kosij-api.azurewebsites.net/api/farm/${farmId}`
        )

        setFarm(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the farm.')
      }
    }

    fetchFarm()
  }, [farmId])

  return { farm, error }
}
