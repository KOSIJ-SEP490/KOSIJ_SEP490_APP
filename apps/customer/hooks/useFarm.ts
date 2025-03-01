import { useEffect, useState } from 'react'
import axios from 'axios'
import { FarmType } from '../types/Farm/farm.type'
import { Farm } from '../types/Tour/tour.type'
import { API_BASE_URL } from '@env'

export function useAllFarms() {
  const [farms, setFarms] = useState<FarmType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get<{ message: string; value: FarmType[] }>(`${API_BASE_URL}farms/active`)
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
        const response = await axios.get<{ message: string; value: FarmType }>(`${API_BASE_URL}farm/${farmId}`)

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

export function useFarmsByTour(farms: Farm[]) {
  const [farmList, setFarmList] = useState<FarmType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!farms || farms.length === 0) return

    const fetchFarms = async () => {
      try {
        const farmPromises = farms.map((farm) =>
          axios.get<{ message: string; value: FarmType }>(`${API_BASE_URL}farm/${farm.id}`)
        )

        const resolvedFarms = await Promise.all(farmPromises)
        setFarmList(resolvedFarms.map((res) => res.data.value))
      } catch (err) {
        setError('Failed to fetch farms.')
      }
    }

    fetchFarms()
  }, [farms])

  return { farmList, error }
}
