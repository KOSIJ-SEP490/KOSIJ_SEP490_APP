import { useContext, useEffect, useState } from 'react'
import { TransactionType } from '../types/Wallet/transaction.type'
import AuthContext from '@shared/context/AuthContext'
import { API_BASE_URL } from '@env'
import axios from 'axios'

export function useTransactionById(transactionId: number) {
  const [transaction, setTransaction] = useState<TransactionType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!transactionId || !userToken) {
      setError('User is not authenticated or invalid trip ID.')
      return
    }

    const fetchTrip = async () => {
      try {
        const response = await axios.get<{ message: string; value: TransactionType }>(
          `${API_BASE_URL}transaction/${transactionId}/current-user`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTransaction(response.data.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch the trip.')
      }
    }

    fetchTrip()
  }, [transactionId, userToken])

  return { transaction, error }
}

export function useTransactionByAll() {
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)

  const userToken = authContext?.user?.token

  useEffect(() => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get<{ message: string; value: TransactionType[] }>(
          `${API_BASE_URL}transactions/current-user`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        setTransactions(response.data.value || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch transactions.')
      }
    }

    fetchTransactions()
  }, [userToken])

  return { transactions, error }
}
