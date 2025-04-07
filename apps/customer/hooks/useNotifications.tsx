import { useCallback, useContext, useEffect, useState } from 'react'
import { NotificationType } from '../types/Notifications/Notification.type'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import AuthContext from '@shared/context/AuthContext'

export function useNotificationsByAll() {
  const [notifications, setNotifications] = useState<NotificationType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<{ message: string; value: NotificationType[] }>(`${API_BASE_URL}notifications`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      setNotifications(response.data.value)
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch notifications.')
    } finally {
      setLoading(false)
    }
  }, [userToken])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { notifications, error, loading, reload: fetchNotifications }
}

export function useMarkAsRead() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const markAsRead = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await axios.put(
        `${API_BASE_URL}notification/${id}/mark-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )
      return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark notification as read.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { markAsRead, loading, error }
}

export function useMarkAsReadAll() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const markAllAsRead = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await axios.put(
        `${API_BASE_URL}notifications/mark-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )
      setSuccess(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark all notifications as read.')
    } finally {
      setLoading(false)
    }
  }

  return { markAllAsRead, loading, error, success }
}
