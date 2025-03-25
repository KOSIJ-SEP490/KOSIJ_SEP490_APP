import { useContext, useEffect, useState } from 'react'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { Order, OrderType } from '../types/Order/Order.type'

export function useOrderById(orderId: number) {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!orderId || !userToken) {
      setError('User is not authenticated or invalid order ID.')
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get<{ message: string; value: Order }>(
          `${API_BASE_URL}order/${orderId}/current-delivery`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setOrder(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the order.')
      }
    }

    fetchOrder()
  }, [orderId, userToken])

  return { order, error }
}

export function useOrderByAll() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ message: string; value: OrderType[] }>(
          `${API_BASE_URL}orders/current-delivery`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setOrders(response.data.value || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch orders.')
      }
    }

    fetchOrders()
  }, [userToken])

  return { orders, error }
}
