import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthContextType {
  isAuthenticated: boolean | null
  isLoading: boolean
  login: (pin: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...')

        // Add a timeout to prevent getting stuck
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        })

        const authPromise = AsyncStorage.getItem('pin')
        const pin = (await Promise.race([authPromise, timeoutPromise])) as
          | string
          | null

        const authenticated = !!pin
        console.log('Auth check result:', {
          authenticated,
          pin: pin ? '***' : null,
        })
        setIsAuthenticated(authenticated)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (pin: string) => {
    try {
      console.log(
        'Attempting login with PIN:',
        pin === '1234' ? '***' : 'invalid'
      )
      if (pin === '1234') {
        await AsyncStorage.setItem('pin', pin)
        setIsAuthenticated(true)
        console.log('Login successful')
        return true
      }
      console.log('Login failed: invalid PIN')
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out...')
      await AsyncStorage.removeItem('pin')
      setIsAuthenticated(false)
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
