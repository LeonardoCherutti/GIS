'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/auth/LoginButton'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/hospital')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--palette-background)' }}
      >
        <div className="text-center">
          <span
            className="inline-block w-8 h-8 border-3 rounded-full animate-spin mb-4"
            style={{
              borderColor: 'var(--palette-border)',
              borderTopColor: 'var(--palette-primary)',
            }}
          />
          <p style={{ color: 'var(--palette-muted-fg)' }}>Carregando...</p>
        </div>
      </main>
    )
  }

  if (isAuthenticated) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--palette-background)' }}
      >
        <div className="text-center">
          <p style={{ color: 'var(--palette-muted-fg)' }}>
            Redirecionando...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'var(--palette-background)' }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8 shadow-lg"
        style={{
          background: 'var(--palette-surface-raised)',
          border: '1px solid var(--palette-border)',
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--palette-primary)' }}
          >
            GIS
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--palette-foreground)' }}
          >
            Gestao Inteligente em Saude
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: 'var(--palette-muted-fg)' }}
          >
            Portal de Dashboards Hospitalares
          </p>
        </div>
        <LoginButton />
      </div>
    </main>
  )
}
