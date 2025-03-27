import { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { Order, OrderType, OrderUpdate } from '../types/Order/Order.type'

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

  const fetchOrders = useCallback(async () => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

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
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch orders.')
    }
  }, [userToken])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, error, refetch: fetchOrders }
}

export function useUpdateOrder() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const updateOrder = async (orderId: number, orderData: OrderUpdate): Promise<boolean> => {
    if (!userToken) {
      setError('User is not authenticated.')
      return false
    }

    console.log(orderData)

    setIsLoading(true)
    setError(null)

    try {
      await axios.put(`${API_BASE_URL}order/${orderId}/delivery`, orderData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('abc')

      return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update the order.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { updateOrder, isLoading, error }
}
