import { User, AuthState } from '@/types'
import { encryptData, decryptData, hashPassword } from '@/lib/crypto'

const STORAGE_KEY = 'real_estate_auth'

export const authStorage = {
  saveUser: (user: User) => {
    const users = authStorage.getUsers()
    users[user.username] = user
    localStorage.setItem(STORAGE_KEY, encryptData(users))
  },

  getUsers: (): Record<string, User> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return {} as Record<string, User>
      const decrypted = decryptData(stored)
      return decrypted || {} as Record<string, User>
    } catch {
      return {} as Record<string, User>
    }
  },

  getUser: (username: string): User | null => {
    const users = authStorage.getUsers()
    return users[username] || null
  },

  saveAuthState: (state: AuthState) => {
    localStorage.setItem('auth_state', encryptData(state))
  },

  getAuthState: (): AuthState => {
    try {
      const stored = localStorage.getItem('auth_state')
      if (!stored) return { user: null, isAuthenticated: false, requiresTwoFactor: false }
      const decrypted = decryptData(stored)
      return decrypted || { user: null, isAuthenticated: false, requiresTwoFactor: false }
    } catch {
      return { user: null, isAuthenticated: false, requiresTwoFactor: false }
    }
  },

  clearAuth: () => {
    localStorage.removeItem('auth_state')
  },

  validateCredentials: (username: string, password: string): User | null => {
    const user = authStorage.getUser(username)
    if (!user) return null
    
    const hashedPassword = hashPassword(password)
    return user.password === hashedPassword ? user : null
  }
}