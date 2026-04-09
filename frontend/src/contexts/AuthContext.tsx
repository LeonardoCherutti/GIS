'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { apiFetch } from '@/lib/api/client'

interface AuthUser {
  email: string
  name: string
  picture: string
  sub: string
  role: 'admin' | 'manager'
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (credentialResponse: { credential?: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
      role: payload.role ?? 'manager',
    }
  } catch {
    return null
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  useEffect(() => {
    const restore = async () => {
      try {
        const saved = localStorage.getItem('gis_auth_token')
        if (saved) {
          const parsed = parseJwt(saved)
          if (parsed) {
            // Refresh httpOnly cookie BEFORE marking as loaded
            await fetch('/api/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: saved }),
            })
            setUser(parsed)
            setToken(saved)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (credentialResponse: { credential?: string }) => {
    const credential = credentialResponse.credential
    if (!credential) return

    const result = await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ google_token: credential }),
    })

    if (!result.ok) {
      throw new Error(result.error.message ?? 'Erro ao autenticar')
    }

    // Store session JWT in localStorage for display data
    localStorage.setItem('gis_auth_token', result.data.token)

    // Set httpOnly cookie via Next.js API route
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: result.data.token }),
    })

    setUser(result.data.user)
    setToken(result.data.token)
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('gis_auth_token')
    await fetch('/api/session', { method: 'DELETE' })
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
