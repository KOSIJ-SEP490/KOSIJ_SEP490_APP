import { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { NotificationType } from '../types/Notifications/Notification.type'

export function useNotificationByAll() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const fetchNotifications = useCallback(async () => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    try {
      const response = await axios.get<{ message: string; value: NotificationType[] | null }>(
        `${API_BASE_URL}notifications`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      setNotifications(Array.isArray(response.data.value) ? response.data.value : [])
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Empty notification list') {
        setNotifications([])
        setError(null)
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch notifications.')
      }
    }
  }, [userToken])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { notifications, error, refetch: fetchNotifications }
}

export function useMarkNotificationAsRead() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const markAsRead = async (notificationId: number): Promise<boolean> => {
    if (!userToken) {
      setError('User is not authenticated.')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      await axios.put(
        `${API_BASE_URL}notification/${notificationId}/mark-as-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark notification as read.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { markAsRead, isLoading, error }
}
