import { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'
import { Order, OrderType, OrderUpdate } from '../types/Order/Order.type'
import { DashBoardType } from '../types/DashBoard/DashBoard.type'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from 'firebaseConfig'

export const uploadImageToFirebase = async (imageUri: string | null): Promise<string | null> => {
  if (!imageUri) return null

  try {
    const response = await fetch(imageUri)
    const blob = await response.blob()

    const storageRef = ref(storage, `orders/${Date.now()}.jpg`)
    const uploadTask = uploadBytesResumable(storageRef, blob)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        }
      )
    })
  } catch (error) {
    console.error('Image upload failed:', error)
    return null
  }
}

export function useOrderById(orderId: number) {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  const fetchOrder = useCallback(async () => {
    if (!orderId || !userToken) {
      setError('User is not authenticated or invalid order ID.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get<{ message: string; value: Order }>(
        `${API_BASE_URL}order/${orderId}/current-delivery`,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )
      setOrder(response.data.value)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch the order.')
    } finally {
      setIsLoading(false)
    }
  }, [orderId, userToken])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  return { order, error, isLoading, refetch: fetchOrder }
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
      const response = await axios.get<{ message: string; value: OrderType[] | null }>(
        `${API_BASE_URL}orders/current-delivery`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      setOrders(Array.isArray(response.data.value) ? response.data.value : [])
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Empty order list') {
        setOrders([])
        setError(null)
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch orders.')
      }
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

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashBoardType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get<{ message: string; value: DashBoardType }>(
          `${API_BASE_URL}dashboard/current-delivery`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setDashboard(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch dashboard data.')
      }
    }

    fetchDashboard()
  }, [userToken])

  return { dashboard, error }
}

export function useCurrentOrderByAll() {
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
      const response = await axios.get<{ message: string; value: OrderType[] | null }>(
        `${API_BASE_URL}current-orders/current-delivery`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )

      setOrders(Array.isArray(response.data.value) ? response.data.value : [])
      setError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Empty order list') {
        setOrders([])
        setError(null)
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch orders.')
      }
    }
  }, [userToken])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, error, refetch: fetchOrders }
}
