'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Validación básica (en producción usar Supabase)
      if (!email || !password) {
        throw new Error('Email y contraseña requeridos')
      }

      // Simular login exitoso
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
      }

      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('auth_token', 'token_' + Date.now())
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Validación básica
      if (!email || !password || !name) {
        throw new Error('Todos los campos son requeridos')
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      // Simular signup exitoso
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
      }

      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('auth_token', 'token_' + Date.now())
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('events')
      // Limpiar todos los datos de ventas
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('sales_'))
      keys.forEach((k) => localStorage.removeItem(k))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
