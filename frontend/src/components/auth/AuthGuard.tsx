'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const t = useTranslations('common')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
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
          <p style={{ color: 'var(--palette-muted-fg)' }}>{t('loading')}</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
