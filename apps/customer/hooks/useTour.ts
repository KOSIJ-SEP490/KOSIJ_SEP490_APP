import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { TourCardType } from '../types/Tour/tourCard.type'
import { TourType } from '../types/Tour/tour.type'
import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'

export function useAllTours() {
  const [tours, setTours] = useState<TourType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!userToken) return

    const fetchTours = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType[] }>(
          `${API_BASE_URL}tours?status=true&isDeleted=false`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTours(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to fetch tours.')
      }
    }

    fetchTours()
  }, [userToken])

  return { tours, error }
}

export function useTourCards() {
  const [tourCards, setTourCards] = useState<TourCardType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!userToken) return

    const fetchTourCards = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType[] }>(
          `${API_BASE_URL}tours?status=true&isDeleted=false`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )

        const mappedTourCards: TourCardType[] = response.data.value.map((tour) => ({
          id: tour.id,
          tourName: tour.tourName,
          standardPrice: tour.standardPrice,
          imageUrl: tour.imageUrl,
          departurePoint: tour.departurePoint,
          destinationPoint: tour.destinationPoint,
          days: tour.days,
          nights: tour.nights,
          totalFarmVisit: tour.totalFarmVisit
        }))
        setTourCards(mappedTourCards)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to fetch tour cards.')
      }
    }

    fetchTourCards()
  }, [userToken])

  return { tourCards, error }
}

export function useTourById(tourId: number) {
  const [tour, setTour] = useState<TourType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!tourId || !userToken) return

    const fetchTour = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType }>(
          `${API_BASE_URL}tour/${tourId}?tripType=Scheduled&tripIsDeleted=false`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTour(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to fetch the tour.')
      }
    }

    fetchTour()
  }, [tourId, userToken])

  return { tour, error }
}
