'use client'

import { FormEvent, Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api/client'

interface InvitationInfo {
  email: string
  expires_at: string
}

interface AuthUser {
  email: string
  name: string
  picture: string
  sub: string
  role: 'admin' | 'manager'
}

function RegisterInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const router = useRouter()
  const tr = useTranslations('register')
  const tc = useTranslations('common')
  const { applySession } = useAuth()

  const [invite, setInvite] = useState<InvitationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      if (!token) {
        setInvalid(tr('errors.invalidToken'))
        setLoading(false)
        return
      }
      const result = await apiFetch<InvitationInfo>(`/invitations/${encodeURIComponent(token)}`)
      if (result.ok) {
        setInvite(result.data)
      } else {
        setInvalid(result.error.message ?? tr('errors.invalidToken'))
      }
      setLoading(false)
    }
    load()
  }, [token, tr])

  useEffect(() => {
    if (!invite || invalid) return
    const google = (window as unknown as { google?: { accounts: { id: { initialize: (o: unknown) => void; renderButton: (el: HTMLElement | null, o: unknown) => void } } } }).google
    if (!google?.accounts?.id) return

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: { credential?: string }) => {
        if (!response.credential) return
        const result = await apiFetch<{ token: string; user: AuthUser }>(
          `/invitations/${encodeURIComponent(token)}/accept-google`,
          {
            method: 'POST',
            body: JSON.stringify({ google_token: response.credential }),
          }
        )
        if (result.ok) {
          await applySession(result.data.token, result.data.user)
          router.push('/hospital')
        } else {
          setError(result.error.message ?? tr('errors.generic'))
        }
      },
    })
    google.accounts.id.renderButton(googleBtnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 320,
    })
  }, [invite, invalid, token, applySession, router, tr])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password.length < 8) {
      setError(tr('errors.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(tr('errors.passwordMismatch'))
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await apiFetch<{ token: string; user: AuthUser }>(
      `/invitations/${encodeURIComponent(token)}/accept-password`,
      {
        method: 'POST',
        body: JSON.stringify({ password }),
      }
    )
    if (result.ok) {
      await applySession(result.data.token, result.data.user)
      router.push('/hospital')
    } else {
      setError(result.error.message ?? tr('errors.generic'))
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--palette-background)' }}>
        <p style={{ color: 'var(--palette-muted-fg)' }}>{tc('loading')}</p>
      </main>
    )
  }

  if (invalid || !invite) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--palette-background)' }}>
        <div
          className="w-full max-w-sm rounded-xl p-8 text-center"
          style={{
            background: 'var(--palette-surface-raised)',
            border: '1px solid var(--palette-border)',
          }}
        >
          <p style={{ color: 'var(--palette-destructive)' }}>{invalid ?? tr('errors.invalidToken')}</p>
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
          {tr('title')}
        </h1>
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--palette-muted-fg)' }}>
          {tr('subtitle', { email: invite.email })}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={tr('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            minLength={8}
            autoComplete="new-password"
            placeholder={tr('confirmPassword')}
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
            {submitting ? '…' : tr('submit')}
          </button>
          {error && (
            <p role="alert" className="text-xs text-center" style={{ color: 'var(--palette-destructive)' }}>
              {error}
            </p>
          )}
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'var(--palette-border)' }} />
          <span className="text-xs" style={{ color: 'var(--palette-muted-fg)' }}>{tr('googleInstead')}</span>
          <div className="flex-1 h-px" style={{ background: 'var(--palette-border)' }} />
        </div>
        <div className="flex justify-center" ref={googleBtnRef} />
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  )
}
