import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import { Notifications } from '@shared/types/Notification.dto'
import { useContext } from 'react'
import axios from 'axios'

export function useNotifications() {
  const authContext = useContext(AuthContext)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  async function fetchNotification(): Promise<Notifications[]> {
    try {
      const response = await axios.get<{ value: Notifications[] }>(`${API_BASE_URL}notifications`, {
        headers: {
          Accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      })
      return response.data.value
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  async function updateNotification(id: number): Promise<Notifications[]> {
    const response = await axios.put<Notifications[]>(
      `${API_BASE_URL}notification/${id}/mark-as-read`,
      {},
      {
        headers: {
          Accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      }
    )
    return response.data
  }

  async function updateAllNotification(): Promise<Notifications[]> {
    try {
      const response = await axios.put<Notifications[]>(
        `${API_BASE_URL}notifications/mark-as-read`,
        {},
        {
          headers: {
            Accept: 'text/plain',
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating all notifications:', error)
      throw error
    }
  }

  return { fetchNotification, updateNotification, updateAllNotification }
}
