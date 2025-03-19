import { useContext } from 'react'
import axios from 'axios'
import AuthContext from '@shared/context/AuthContext'
import { Orders } from '@shared/types/Order.dto'

const API_URL = 'https://kosij.azurewebsites.net/api/orders/current-consultant'
const API2_URL = 'https://kosij.azurewebsites.net/api/order'

export function useOrders() {
  const authContext = useContext(AuthContext)

  if (!authContext || !authContext.user) {
    throw new Error('AuthContext is not available. Ensure the component is wrapped in AuthProvider.')
  }

  const { user } = authContext

  async function fetchOrders(): Promise<Orders[]> {
    try {
      const response = await axios.get<{ value: Orders[] }>(API_URL, {
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

  async function fetchOrderDetails(orderId: number): Promise<Orders[]> {
    try {
      const response = await axios.get<{ value: Orders[] }>(`${API2_URL}/${orderId}/current-consultant`, {
        headers: {
          Accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      })
      return response.data.value
    } catch (error) {
      console.error('Error fetching order details:', error)
      throw error
    }
  }

  return { fetchOrders, fetchOrderDetails }
}
