import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import Toast from 'react-native-toast-message'

interface AuthProviderProps {
  children: ReactNode
}

interface DecodedToken {
  role: string
  exp: number
}

interface User {
  email: string
  token: string
  role: 'Customer' | 'Consulting' | 'Delivery'
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
        const response = await fetch('https://kosij-api.azurewebsites.net/api/authentication/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMessage = data.message || 'An error occurred during login.'
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: errorMessage
          })
          throw new Error(errorMessage)
        }

        const data = await response.json()
        const token = data.value

        const decoded: DecodedToken = jwtDecode(token)
        const role = decoded.role as 'Customer' | 'Consulting' | 'Delivery'
        const expiresAt = decoded.exp * 1000

        const userData = {
          email,
          token,
          role,
          expiresAt
        }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome, ${role} user!`
        })

        setUser(userData)
        await AsyncStorage.setItem('user', JSON.stringify(userData))
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
        const response = await fetch('https://kosij-api.azurewebsites.net/api/authentication/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, confirmPassword, fullName, phoneNumber })
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMessage = data.message || 'An error occurred during registration.'
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
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error.message || 'An error occurred during registration.'
        })
        throw error // Re-throw the error to prevent navigation
      }
    },
    []
  )

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      try {
        const response = await fetch('https://kosij-api.azurewebsites.net/api/authentication/otp-veriification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMessage = data.message || 'Invalid OTP. Please try again.'
          Toast.show({
            type: 'error',
            text1: 'OTP Verification Failed',
            text2: errorMessage
          })
          throw new Error(errorMessage)
        }

        const data = await response.json()
        const token = data.value

        const decoded: DecodedToken = jwtDecode(token)
        const role = decoded.role as 'Customer' | 'Consulting' | 'Delivery'
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
    setUser(null)
    await AsyncStorage.removeItem('user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
