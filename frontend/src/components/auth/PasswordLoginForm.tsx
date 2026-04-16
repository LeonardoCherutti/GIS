'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

export default function PasswordLoginForm() {
  const { loginPassword } = useAuth()
  const t = useTranslations('auth')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await loginPassword(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('errors.invalidCredentials')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        autoComplete="email"
        placeholder={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-11 px-3 rounded-md text-sm"
        style={{
          background: 'var(--palette-surface)',
          border: '1px solid var(--palette-border)',
          color: 'var(--palette-foreground)',
        }}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
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
      <div className="w-full text-right mt-[-4px]">
        <Link
          href={`/${locale}/forgot-password`}
          className="text-xs hover:underline"
          style={{ color: 'var(--palette-muted-fg)' }}
        >
          {t('forgotPassword')}
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-md cursor-pointer text-sm font-medium disabled:opacity-50 transition-colors"
        style={{
          background: 'var(--palette-surface)',
          border: '1px solid var(--palette-border)',
          color: 'var(--palette-foreground)',
        }}
      >
        {loading ? '…' : t('loginWithPassword')}
      </button>
      {error && (
        <p role="alert" className="text-xs text-center" style={{ color: 'var(--palette-destructive)' }}>
          {error}
        </p>
      )}
    </form>
  )
}
