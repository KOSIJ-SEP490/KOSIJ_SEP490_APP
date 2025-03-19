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

  // Return the account data along with a refetch function
  return { account, error, refetch: fetchAccount }
}

export interface UpdateAccountRequest {
  fullName: string
  sex: string
  phoneNumber: string
  address: string
  urlAvatar: string
}

export function useUpdateAccount() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)

  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const updateAccount = async (updatedData: UpdateAccountRequest) => {
    if (!userToken) {
      setError('User is not authenticated.')
      return null
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setResponseMessage(null)

    try {
      const response = await axios.put<{ message: string }>(`${API_BASE_URL}accounts/current-user`, updatedData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      })

      setSuccess(true)
      setResponseMessage(response.data.message)
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update account.'
      setError(errorMessage)
      setSuccess(false)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { updateAccount, loading, error, success, responseMessage }
}
