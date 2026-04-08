'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const t = useTranslations('auth')
  const fallbackRef = useRef<HTMLDivElement>(null)

  function handleLogin() {
    setLoading(true)
    setError(null)

    const google = (window as any).google
    if (!google?.accounts?.id) {
      setError(t('errors.googleNotLoaded'))
      setLoading(false)
      return
    }

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: { credential?: string }) => {
        try {
          await login(response)
        } catch (err: any) {
          setError(err?.message ?? t('errors.generic'))
        } finally {
          setLoading(false)
        }
      },
    })

    // Skip One Tap — go straight to popup window
    google.accounts.id.renderButton(fallbackRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: '100%',
    })

    // Click the rendered Google button to open the popup
    setTimeout(() => {
      const btn = fallbackRef.current?.querySelector('div[role="button"]') as HTMLElement
      if (btn) {
        btn.click()
      } else {
        setError(t('errors.popupBlocked'))
        setLoading(false)
      }
    }, 100)
  }

  return (
    <div>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full h-11 rounded-md text-white cursor-pointer flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 transition-colors"
        style={{ background: 'var(--palette-primary)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--palette-primary-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--palette-primary)'}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-[18px] h-[18px] mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('loginButton')}
          </>
        )}
      </button>
      <div ref={fallbackRef} className="hidden overflow-hidden h-0" />
      {error && (
        <p role="alert" className="text-xs mt-2 text-center" style={{ color: 'var(--palette-destructive)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
