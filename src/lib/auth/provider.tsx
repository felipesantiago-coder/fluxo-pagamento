'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthState, User } from '@/types'
import { authStorage } from '@/lib/auth/storage'

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; requiresTwoFactor?: boolean; error?: string }>
  verifyTwoFactor: (token: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  enableTwoFactor: () => Promise<{ secret: string; qrCode: string }>
  confirmTwoFactor: (secret: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    requiresTwoFactor: false,
    tempUserId: undefined
  })

  useEffect(() => {
    const savedState = authStorage.getAuthState()
    if (savedState.isAuthenticated && savedState.user) {
      setAuthState(savedState)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const user = authStorage.validateCredentials(username, password)
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' }
    }

    if (user.twoFactorEnabled) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        requiresTwoFactor: true,
        tempUserId: user.id
      })
      return { success: true, requiresTwoFactor: true }
    }

    const newState = {
      user,
      isAuthenticated: true,
      requiresTwoFactor: false
    }
    
    setAuthState(newState)
    authStorage.saveAuthState(newState)
    return { success: true }
  }

  const verifyTwoFactor = async (token: string) => {
    if (!authState.tempUserId) {
      return { success: false, error: 'No user session found' }
    }

    const users = authStorage.getUsers()
    const user = Object.values(users).find((u: User) => u.id === authState.tempUserId)
    
    if (!user || !user.twoFactorSecret) {
      return { success: false, error: 'User not found or 2FA not configured' }
    }

    const { verifyTwoFactorToken } = await import('@/lib/auth/twoFactor')
    const isValid = verifyTwoFactorToken(user.twoFactorSecret, token)

    if (!isValid) {
      return { success: false, error: 'Invalid verification code' }
    }

    const newState = {
      user,
      isAuthenticated: true,
      requiresTwoFactor: false
    }
    
    setAuthState(newState)
    authStorage.saveAuthState(newState)
    return { success: true }
  }

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      requiresTwoFactor: false,
      tempUserId: undefined
    })
    authStorage.clearAuth()
  }

  const register = async (username: string, email: string, password: string) => {
    const existingUser = authStorage.getUser(username)
    if (existingUser) {
      return { success: false, error: 'Username already exists' }
    }

    const { hashPassword } = await import('@/lib/crypto')
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashPassword(password),
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    }

    authStorage.saveUser(newUser)
    return { success: true }
  }

  const enableTwoFactor = async () => {
    const { generateTwoFactorSecret, generateTwoFactorQR } = await import('@/lib/auth/twoFactor')
    const secret = generateTwoFactorSecret()
    const qrCode = generateTwoFactorQR(secret, authState.user?.username || '')
    
    return { secret, qrCode }
  }

  const confirmTwoFactor = async (secret: string) => {
    if (!authState.user) {
      return { success: false, error: 'No user logged in' }
    }

    const updatedUser = {
      ...authState.user,
      twoFactorSecret: secret,
      twoFactorEnabled: true
    }

    authStorage.saveUser(updatedUser)
    
    const newState = {
      ...authState,
      user: updatedUser
    }
    
    setAuthState(newState)
    authStorage.saveAuthState(newState)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      verifyTwoFactor,
      logout,
      register,
      enableTwoFactor,
      confirmTwoFactor
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}