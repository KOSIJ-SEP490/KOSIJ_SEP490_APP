import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { FeedbackType } from '../types/feedback.type'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'

export function useAllFeedbacks() {
  const authContext = useContext(AuthContext)
  const [feedbacks, setFeedbacks] = useState<FeedbackType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
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
        const response = await axios.get<{ message: string; value: FeedbackType[] }>(`${API_BASE_URL}feedbacks`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setFeedbacks(response.data.value)
      } catch (err) {
        setError('Failed to fetch feedback.')
      }
    }

    fetchFeedbacks()
  }, [authContext])

  return { feedbacks, error }
}

export function useFeedbackById(feedbackId: number) {
  const [feedback, setFeedback] = useState<FeedbackType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!feedbackId) return

    const fetchFeedback = async () => {
      try {
        const response = await axios.get<{ message: string; value: FeedbackType }>(
          `${API_BASE_URL}feedback/${feedbackId}`
        )

        setFeedback(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the feedback.')
      }
    }

    fetchFeedback()
  }, [feedbackId])

  return { feedback, error }
}

export function useFeedbackByFarmId(farmId: number) {
  const authContext = useContext(AuthContext)
  const [feedbacks, setFeedbacks] = useState<FeedbackType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!farmId || isNaN(farmId)) return
    if (!authContext) {
      setError('Auth context is not available.')
      return
    }

    const { user } = authContext
    if (!user) {
      setError('User is not authenticated.')
      return
    }

    const fetchFeedback = async () => {
      try {
        const response = await axios.get<{ message: string; value: FeedbackType[] }>(
          `${API_BASE_URL}farm/${farmId}/feedbacks`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        setFeedbacks(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch feedback.')
      }
    }

    fetchFeedback()
  }, [farmId, authContext])

  return { feedbacks, error }
}

export const useCreateFeedback = () => {
  const authContext = useContext(AuthContext)

  const createFeedback = async (feedbackData: {
    tripBookingID: number
    feedbackType: string
    rating: number
    review: string
  }) => {
    if (!authContext || !authContext.user) {
      throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
    }

    const { user } = authContext
    try {
      const response = await axios.post(`${API_BASE_URL}feedback`, feedbackData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error('Error submitting feedback: ' + error.message)
    }
  }

  return { createFeedback }
}
