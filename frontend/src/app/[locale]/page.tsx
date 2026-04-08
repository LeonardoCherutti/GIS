'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/auth/LoginButton'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const tc = useTranslations('common')
  const ta = useTranslations('auth')

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
          <p style={{ color: 'var(--palette-muted-fg)' }}>{tc('loading')}</p>
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
            {ta('redirecting')}
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
        className="w-full max-w-md rounded-xl p-8 shadow-lg"
        style={{
          background: 'var(--palette-surface-raised)',
          border: '1px solid var(--palette-border)',
        }}
      >
        <div className="flex justify-center mb-8">
          <Image
            src="/logo_horizontal.png"
            alt="G.S.I - Gestao Inteligente em Saude"
            width={388}
            height={132}
            priority
            className="dark:brightness-200 dark:contrast-50"
          />
        </div>
        <LoginButton />
      </div>
    </main>
  )
}
