'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/auth/LoginButton'
import PasswordLoginForm from '@/components/auth/PasswordLoginForm'

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
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: 'var(--palette-background)' }}
    >
      <div
        className="w-full max-w-sm sm:max-w-md rounded-xl p-6 sm:p-8 shadow-lg"
        style={{
          background: 'var(--palette-surface-raised)',
          border: '1px solid var(--palette-border)',
        }}
      >
        <div className="flex justify-center mb-6 sm:mb-8">
          <Image
            src="/logo_horizontal.png"
            alt="G.S.I - Gestao Inteligente em Saude"
            width={388}
            height={132}
            priority
            className="w-full max-w-[280px] sm:max-w-[388px] h-auto dark:brightness-200 dark:contrast-50"
          />
        </div>
        <LoginButton />
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'var(--palette-border)' }} />
          <span className="text-xs" style={{ color: 'var(--palette-muted-fg)' }}>{ta('or')}</span>
          <div className="flex-1 h-px" style={{ background: 'var(--palette-border)' }} />
        </div>
        <PasswordLoginForm />
      </div>
    </main>
  )
}
