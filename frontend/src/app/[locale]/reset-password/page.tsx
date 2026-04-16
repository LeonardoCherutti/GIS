'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/api/client'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

function ResetPasswordInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const router = useRouter()
  const t = useTranslations('resetPassword')
  const tc = useTranslations('common')
  const locale = useLocale()

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function validate() {
      if (!token) {
        setError(t('errors.missingToken'))
        setValidating(false)
        return
      }
      const result = await apiFetch<{ valid: boolean }>(`/auth/reset-password/${encodeURIComponent(token)}`)
      if (result.ok && result.data.valid) {
        setTokenValid(true)
      } else {
        setError(t('errors.invalidToken'))
      }
      setValidating(false)
    }
    validate()
  }, [token, t])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password.length < 10) {
      setError(t('errors.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'))
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await apiFetch<{ message: string }>(
      `/auth/reset-password/${encodeURIComponent(token)}`,
      {
        method: 'POST',
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      }
    )
    if (result.ok) {
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}`), 2000)
    } else {
      const msg = result.error.message ?? ''
      if (msg.includes('muito comum')) {
        setError(t('errors.commonPassword'))
      } else if (msg.includes('invalido') || msg.includes('expirado')) {
        setError(t('errors.invalidToken'))
      } else {
        setError(t('errors.generic'))
      }
      setSubmitting(false)
    }
  }

  if (validating) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--palette-background)' }}>
        <p style={{ color: 'var(--palette-muted-fg)' }}>{tc('loading')}</p>
      </main>
    )
  }

  if (!tokenValid && !success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--palette-background)' }}>
        <div
          className="w-full max-w-sm rounded-xl p-8 text-center"
          style={{
            background: 'var(--palette-surface-raised)',
            border: '1px solid var(--palette-border)',
          }}
        >
          <p className="mb-4" style={{ color: 'var(--palette-destructive)' }}>{error}</p>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-sm hover:underline"
            style={{ color: 'var(--palette-primary)' }}
          >
            {t('errors.tokenExpired')}
          </Link>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--palette-background)' }}>
        <div
          className="w-full max-w-sm rounded-xl p-8 text-center"
          style={{
            background: 'var(--palette-surface-raised)',
            border: '1px solid var(--palette-border)',
          }}
        >
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--palette-primary)' }}>{t('success')}</p>
          <p className="text-sm" style={{ color: 'var(--palette-muted-fg)' }}>Redirecionando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--palette-background)' }}>
      <div
        className="w-full max-w-sm sm:max-w-md rounded-xl p-6 sm:p-8 shadow-lg"
        style={{
          background: 'var(--palette-surface-raised)',
          border: '1px solid var(--palette-border)',
        }}
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/logo_horizontal.png"
            alt="G.S.I"
            width={388}
            height={132}
            priority
            className="w-full max-w-[280px] h-auto dark:brightness-200 dark:contrast-50"
          />
        </div>
        <h1 className="text-lg font-semibold mb-1 text-center" style={{ color: 'var(--palette-foreground)' }}>
          {t('title')}
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--palette-muted-fg)' }}>
          {t('subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-3 rounded-md text-sm"
            style={{
              background: 'var(--palette-surface)',
              border: '1px solid var(--palette-border)',
              color: 'var(--palette-foreground)',
            }}
          />
          <PasswordStrengthMeter password={password} />
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 px-3 rounded-md text-sm"
            style={{
              background: 'var(--palette-surface)',
              border: '1px solid var(--palette-border)',
              color: 'var(--palette-foreground)',
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-md text-white cursor-pointer text-sm font-medium disabled:opacity-50 transition-colors"
            style={{ background: 'var(--palette-primary)' }}
          >
            {submitting ? '...' : t('submit')}
          </button>
          {error && (
            <p role="alert" className="text-xs text-center" style={{ color: 'var(--palette-destructive)' }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  )
}
