import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { FeedbackType } from '../types/feedback.type'
import AuthContext from '@shared/context/AuthContext'

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
        const response = await axios.get<{ message: string; value: FeedbackType[] }>(
          'https://kosij-api.azurewebsites.net/api/feedbacks',
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
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
          `https://kosij-api.azurewebsites.net/api/feedback/${feedbackId}`
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
