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

  // Return the wallet data along with a refetch function
  return { wallet, error, refetch: fetchWallet }
}
