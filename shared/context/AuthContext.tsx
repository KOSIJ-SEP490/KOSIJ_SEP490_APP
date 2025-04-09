import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { API_BASE_URL } from '@env'
import Toast from 'react-native-toast-message'

interface AuthProviderProps {
  children: ReactNode
}

interface DecodedToken {
  exp: number
  role?: string
  [key: string]: unknown
}

interface User {
  email: string
  token: string
  role: 'Customer' | 'ConsultingStaff' | 'DeliveryStaff'
  expiresAt: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    phoneNumber: string
  ) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser.expiresAt > Date.now()) {
            setUser(parsedUser)
          } else {
            await AsyncStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}authentication/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        let data
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          data = { message: await response.text() }
        }

        if (!response.ok) {
          const errorMessage = data.message || 'An error occurred during login.'
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: errorMessage
          })
          return
        }

        const token = data.value
        const decoded: DecodedToken = jwtDecode(token)
        const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        const role = (decoded[roleClaim] as 'Customer' | 'ConsultingStaff' | 'DeliveryStaff') || 'Customer'
        const expiresAt = decoded.exp * 1000

        const appRole =
          process.env.EXPO_APP === 'delivery'
            ? 'DeliveryStaff'
            : process.env.EXPO_APP === 'consulting'
              ? 'ConsultingStaff'
              : 'Customer'

        if (role !== appRole) {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: `This app is for ${appRole} but you logged in as ${role}.`
          })
          return
        }

        const userData = { email, token, role, expiresAt }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome, ${role} user!`
        })

        setUser(userData)
        await AsyncStorage.setItem('user', JSON.stringify(userData))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.message || 'An error occurred during login.'
        })
      }
    },
    [setUser]
  )

  const register = useCallback(
    async (email: string, password: string, confirmPassword: string, fullName: string, phoneNumber: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}authentication/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, confirmPassword, fullName, phoneNumber })
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMessage = data.errors[0] || 'An error occurred during registration.'
          Toast.show({
            type: 'error',
            text1: 'Register Failed',
            text2: errorMessage
          })
          throw new Error(errorMessage)
        }

        const data = await response.json()

        Toast.show({
          type: 'success',
          text1: 'Register Successful',
          text2: data.message
        })

        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error.errors[0] || 'An error occurred during registration.'
        })
        throw error
      }
    },
    []
  )

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}authentication/otp-veriification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        })

        let data
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          data = { message: await response.text() }
        }

        if (!response.ok) {
          const errorMessage = data.message || 'An error occurred during login.'
          Toast.show({
            type: 'error',
            text1: 'OTP Verification Failed',
            text2: errorMessage
          })
          return
        }

        const token = data.value

        const decoded: DecodedToken = jwtDecode(token)
        const role = decoded.role as 'Customer' | 'ConsultingStaff' | 'DeliveryStaff'
        const expiresAt = decoded.exp * 1000

        const userData = {
          email,
          token,
          role,
          expiresAt
        }

        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: `Welcome to KOSIJ!`
        })

        setUser(userData)
        await AsyncStorage.setItem('user', JSON.stringify(userData))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'OTP Verification Failed',
          text2: error.message || 'An error occurred during OTP verification.'
        })
      }
    },
    [setUser]
  )

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
