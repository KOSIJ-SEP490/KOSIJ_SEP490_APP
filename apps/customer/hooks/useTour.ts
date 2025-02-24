import { useEffect, useState } from 'react'
import axios from 'axios'
import { TourCardType } from '../types/tourCard.type'
import { TourType } from '../types/tour.type'

export function useAllTours() {
  const [tours, setTours] = useState<TourType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType[] }>(
          'https://kosij-api.azurewebsites.net/api/tours'
        )
        setTours(response.data.value)
      } catch (err) {
        setError('Failed to fetch tours.')
      }
    }

    fetchTours()
  }, [])

  return { tours, error }
}

export function useTourCards() {
  const [tourCards, setTourCards] = useState<TourCardType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTourCards = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType[] }>(
          'https://kosij-api.azurewebsites.net/api/tours'
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
      } catch (err) {
        setError('Failed to fetch tour cards.')
      }
    }

    fetchTourCards()
  }, [])

  return { tourCards, error }
}

export function useTourById(tourId: number) {
  const [tour, setTour] = useState<TourType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tourId) return
    const fetchTour = async () => {
      try {
        const response = await axios.get<{ message: string; value: TourType }>(
          `https://kosij-api.azurewebsites.net/api/tour/${tourId}`
        )

        setTour(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the tour.')
      }
    }

    fetchTour()
  }, [tourId])

  return { tour, error }
}
