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

export interface ResetPasswordAccountRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function useResetPasswordAccount() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)

  const authContext = useContext(AuthContext)
  const userToken = authContext?.user?.token

  const updateAccount = async (updatedData: ResetPasswordAccountRequest) => {
    if (!userToken) {
      setError('User is not authenticated.')
      return { error: 'User is not authenticated.' }
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setResponseMessage(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.post<{ message: string; value: any }>(
        `${API_BASE_URL}accounts/password/reset`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
        setSuccess(true)
        setResponseMessage(response.data.message)
        return response.data
      } else {
        setError('Unexpected response from server.')
        setSuccess(false)
        return { error: 'Unexpected response from server.' }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errors = err.response?.data?.errors
      const message = err.response?.data?.message
      let errorMessage = 'Failed to update account.'

      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0]
      } else if (message) {
        errorMessage = message
      }

      setError(errorMessage)
      setSuccess(false)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { updateAccount, loading, error, success, responseMessage }
}
