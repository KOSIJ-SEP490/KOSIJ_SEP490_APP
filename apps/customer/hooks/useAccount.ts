import AuthContext from '@shared/context/AuthContext'
import { useContext, useState, useEffect, useCallback } from 'react'
import { AccountType } from '../types/Account/account.type'
import { API_BASE_URL } from '@env'
import axios from 'axios'

export function useAccount() {
  const [account, setAccount] = useState<AccountType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const fetchAccount = useCallback(async () => {
    if (!userToken) return

    try {
      const response = await axios.get<{ message: string; value: AccountType }>(
        `${API_BASE_URL}accounts/current-user`,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      )
      setAccount(response.data.value)
    } catch (err: unknown) {
      console.error('Account fetch error:', err)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.detail || 'Failed to fetch account data.')
    }
  }, [userToken])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return { account, error }
}
