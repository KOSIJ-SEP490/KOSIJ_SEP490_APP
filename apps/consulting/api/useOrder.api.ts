import { useContext } from 'react'
import axios from 'axios'
import AuthContext from '@shared/context/AuthContext'
import { Orders } from '@shared/types/Order.dto'
import { API_BASE_URL } from '@env'

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

  async function createOrder(orderData: any) {
    try {
      const response = await axios.post(`${API_BASE_URL}order`, orderData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async function fetchOrderDetailed(orderId: number): Promise<Orders | null> {
    try {
      console.log(`Fetching order details for ID: ${orderId}`)

      const response = await axios.get<{ value: Orders }>(`${API2_URL}/${orderId}/current-consultant`, {
        headers: {
          Accept: 'text/plain',
          Authorization: `Bearer ${user.token}`
        }
      })

      console.log('API Response:', response.data)

      if (!response.data || !response.data.value) {
        console.error('Invalid API response structure:', response.data)
        return null
      }

      return response.data.value
    } catch (error: any) {
      console.error('Error fetching order details:', error.response?.data || error.message)
      throw error
    }
  }

  const updateOrder = async (
    orderId: number,
    cancellationReason: string,
    fullName: string,
    phoneNumber: string,
    deliveryAddress: string,
    paidAmount: number,
    note: string,
    orderDetails: Array<{
      id: number
      variety: string
      koiType: string
      quantity: number
      length: number
      weight: number
      koiPrice: number
      note: string
      orderDetailImages: Array<{
        id: number
        imageUrl: string
      }>
    }>
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}order/${orderId}/consultant`,
        {
          cancellationReason,
          fullName,
          phoneNumber,
          deliveryAddress,
          paidAmount,
          note,
          orderDetails
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain',
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error canceling order:', error)
      throw error
    }
  }
  return { fetchOrders, fetchOrderDetails, createOrder, updateOrder, fetchOrderDetailed }
}
