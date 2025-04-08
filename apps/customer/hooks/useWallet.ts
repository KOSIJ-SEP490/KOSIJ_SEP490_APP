import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import axios from 'axios'
import { useContext, useEffect, useState, useCallback } from 'react'
import { WalletType } from '../types/Wallet/wallet.type'
import { WithDrawResponseType } from '../types/Wallet/withdraw.type'

export function useWallet() {
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const fetchWallet = useCallback(async () => {
    if (!userToken) return

    try {
      const response = await axios.get<{ message: string; value: WalletType }>(`${API_BASE_URL}wallet/current-user`, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      setWallet(response.data.value)
    } catch (err: unknown) {
      console.error('Wallet fetch error:', err)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.detail || 'Failed to fetch wallet data.')
    }
  }, [userToken])

  useEffect(() => {
    fetchWallet()
  }, [fetchWallet])

  return { wallet, error, refetch: fetchWallet }
}

export function useTopUpWallet() {
  const [topUpUrl, setTopUpUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const topUpWallet = useCallback(
    async (amount: number) => {
      if (!userToken) return

      setLoading(true)
      setError(null)

      try {
        const response = await axios.post<{ message: string; value: string }>(
          `${API_BASE_URL}wallet/topup?amount=${amount}`,
          null,
          {
            headers: { Authorization: `Bearer ${userToken}` }
          }
        )
        setTopUpUrl(response.data.value)
      } catch (err: unknown) {
        console.error('Top up error:', err)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((err as any)?.response?.data?.detail || 'Failed to top up wallet.')
      } finally {
        setLoading(false)
      }
    },
    [userToken]
  )

  return { topUpUrl, loading, error, topUpWallet }
}

export function useWithdraw() {
  const [withdrawalResponse, setWithdrawalResponse] = useState<WithDrawResponseType | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const withdraw = useCallback(
    async (amount: number, bankName: string, bankNumber: string, holderName: string) => {
      if (!userToken) {
        setError('User is not authenticated.')
        return
      }

      setLoading(true)
      setError(null)
      setMessage(null)
      setWithdrawalResponse(null)

      try {
        const response = await axios.post<{ message: string; value: WithDrawResponseType | null }>(
          `${API_BASE_URL}withdrawal`,
          { amount, bankName, bankNumber, holderName },
          {
            headers: { Authorization: `Bearer ${userToken}` },
            validateStatus: (status) => status < 500
          }
        )

        if (response.status === 200 && response.data.value) {
          setWithdrawalResponse(response.data.value)
          setMessage(response.data.message)
        } else {
          setError(response.data.message || 'Withdrawal failed')
        }
      } catch (err: unknown) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    },
    [userToken]
  )

  return { withdrawalResponse, message, loading, error, withdraw }
}

export function useWithdrawRequestByAll() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithDrawResponseType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const fetchWithdrawals = useCallback(async () => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get<{ message: string; value: WithDrawResponseType[] }>(
        `${API_BASE_URL}withdrawals/current-user`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      setWithdrawalRequests(response.data.value)
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.detail || 'Failed to fetch withdrawal requests.')
    } finally {
      setLoading(false)
    }
  }, [userToken])

  useEffect(() => {
    fetchWithdrawals()
  }, [fetchWithdrawals])

  return { withdrawalRequests, loading, error, refetch: fetchWithdrawals }
}

export function useCancelWithdraw() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const cancelWithdrawal = async (id: number): Promise<{ success: boolean; message?: string }> => {
    if (!userToken) {
      setError('User is not authenticated.')
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.put<{ message: string; value: string }>(
        `${API_BASE_URL}cancel/withdrawal/${id}`,
        { id },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )

      return { success: true, message: response.data.value }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.detail || 'Failed to cancel withdrawal request.'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { cancelWithdrawal, loading, error }
}

export function useWithdrawById(id: number) {
  const [withdrawal, setWithdrawal] = useState<WithDrawResponseType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const fetchWithdrawalById = useCallback(async () => {
    if (!userToken) {
      setError('User is not authenticated.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get<{ message: string; value: WithDrawResponseType }>(
        `${API_BASE_URL}withdrawal/${id}/current-user`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      setWithdrawal(response.data.value)
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.detail || 'Failed to fetch withdrawal details.')
    } finally {
      setLoading(false)
    }
  }, [id, userToken])

  useEffect(() => {
    fetchWithdrawalById()
  }, [fetchWithdrawalById])

  return { withdrawal, loading, error, refetch: fetchWithdrawalById }
}
