'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface InviteLinkDialogProps {
  token: string | null
  email?: string
  onClose: () => void
}

export default function InviteLinkDialog({ token, email, onClose }: InviteLinkDialogProps) {
  const t = useTranslations('admin')
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!token) return
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    setUrl(`${origin}/register?token=${encodeURIComponent(token)}`)
    setCopied(false)
  }, [token])

  if (!token) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API can fail; fall back to manual selection
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 shadow-xl"
        style={{
          background: 'var(--palette-surface-raised)',
          border: '1px solid var(--palette-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--palette-foreground)' }}>
          {t('inviteTitle')}
        </h2>
        {email && (
          <p className="text-xs mb-3" style={{ color: 'var(--palette-muted-fg)' }}>
            {email}
          </p>
        )}
        <p className="text-xs mb-3" style={{ color: 'var(--palette-muted-fg)' }}>
          {t('inviteHelp')}
        </p>
        <div className="flex gap-2 mb-4">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 px-3 py-2 rounded-md text-xs font-mono"
            style={{
              background: 'var(--palette-surface)',
              border: '1px solid var(--palette-border)',
              color: 'var(--palette-foreground)',
            }}
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-xs font-medium rounded-md transition-colors"
            style={{
              background: 'var(--palette-primary)',
              color: 'var(--palette-primary-fg, white)',
            }}
          >
            {copied ? t('copied') : t('copyLink')}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs rounded-md"
            style={{
              background: 'var(--palette-surface)',
              border: '1px solid var(--palette-border)',
              color: 'var(--palette-foreground)',
            }}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}
