import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { KoiVarietyType } from '../types/koiVariety.type'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'

export function useAllKoiVarieties() {
  const authContext = useContext(AuthContext)
  const [koiVarieties, setKoiVarieties] = useState<KoiVarietyType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKoiVarieties = async () => {
      if (!authContext) {
        setError('Auth context is not available.')
        return
      }

      const { user } = authContext

      if (!user) {
        setError('User is not authenticated.')
        return
      }

      try {
        const response = await axios.get<{ message: string; value: KoiVarietyType[] }>('${API_BASE_URL}koi-varieties', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setKoiVarieties(response.data.value)
      } catch (err) {
        setError('Failed to fetch koi varieties.')
      }
    }

    fetchKoiVarieties()
  }, [authContext])

  return { koiVarieties, error }
}

export function useKoiVarietyById(koiId: number) {
  const authContext = useContext(AuthContext)
  const [koiVariety, setKoiVariety] = useState<KoiVarietyType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!koiId) return

    const fetchKoiVariety = async () => {
      if (!authContext) {
        setError('Auth context is not available.')
        return
      }

      const { user } = authContext

      if (!user) {
        setError('User is not authenticated.')
        return
      }

      try {
        const response = await axios.get<{ message: string; value: KoiVarietyType }>(
          `${API_BASE_URL}koi-varieties/${koiId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )

        setKoiVariety(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the koi variety.')
      }
    }

    fetchKoiVariety()
  }, [koiId, authContext])

  return { koiVariety, error }
}

export function useKoiVarietyListByFarmId(farmId: number) {
  const authContext = useContext(AuthContext)
  const [koiVariety, setKoiVariety] = useState<KoiVarietyType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!farmId) return

    const fetchKoiVariety = async () => {
      if (!authContext) {
        setError('Auth context is not available.')
        return
      }

      const { user } = authContext

      if (!user) {
        setError('User is not authenticated.')
        return
      }

      try {
        const response = await axios.get<{ message: string; value: KoiVarietyType[] }>(
          `${API_BASE_URL}farm-variety/varieties/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )

        setKoiVariety(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the koi variety.')
      }
    }

    fetchKoiVariety()
  }, [farmId, authContext])

  return { koiVariety, error }
}
