'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (result.ok) {
      setSent(true)
    } else {
      setSent(true)
    }
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

        {sent ? (
          <div className="text-center">
            <Mail size={48} className="mx-auto mb-4" style={{ color: 'var(--palette-primary)' }} />
            <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--palette-foreground)' }}>
              {t('successTitle')}
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--palette-muted-fg)' }}>
              {t('successBody')}
            </p>
            <Link
              href={`/${locale}`}
              className="text-sm hover:underline"
              style={{ color: 'var(--palette-primary)' }}
            >
              {t('backToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-semibold mb-1 text-center" style={{ color: 'var(--palette-foreground)' }}>
              {t('title')}
            </h1>
            <p className="text-sm mb-6 text-center" style={{ color: 'var(--palette-muted-fg)' }}>
              {t('subtitle')}
            </p>

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
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-md text-white cursor-pointer text-sm font-medium disabled:opacity-50 transition-colors"
                style={{ background: 'var(--palette-primary)' }}
              >
                {loading ? '...' : t('submit')}
              </button>
              {error && (
                <p role="alert" className="text-xs text-center" style={{ color: 'var(--palette-destructive)' }}>
                  {error}
                </p>
              )}
            </form>

            <div className="text-center mt-4">
              <Link
                href={`/${locale}`}
                className="text-xs hover:underline"
                style={{ color: 'var(--palette-muted-fg)' }}
              >
                {t('backToLogin')}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
