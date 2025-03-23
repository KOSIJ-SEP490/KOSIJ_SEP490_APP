import { API_BASE_URL } from '@env'
import AuthContext from '@shared/context/AuthContext'
import axios from 'axios'
import { useContext, useEffect, useState, useCallback } from 'react'
import { WalletType } from '../types/Wallet/wallet.type'

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
