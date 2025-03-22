import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken')
      setToken(storedToken)
    }
  }, [])

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
    setToken(null)
    window.location.href = '/Login'
  }

  const isTokenValid = () => {
    if (!token) return false

    try {
      const decoded: any = jwtDecode(token)
      const expiryTime = decoded.exp * 1000
      return Date.now() < expiryTime
    } catch (error) {
      console.error('Invalid token:', error)
      return false
    }
  }

  const getValidToken = () => {
    return isTokenValid() ? token : null
  }

  useEffect(() => {
    if (!isTokenValid()) {
      logout()
    }
  }, [token])

  return { token, isTokenValid, getValidToken }
}

export default useAuthToken
