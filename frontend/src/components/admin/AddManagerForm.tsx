'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api/client'

interface AddManagerFormProps {
  onSuccess: () => void
}

export default function AddManagerForm({ onSuccess }: AddManagerFormProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const t = useTranslations('admin')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setSubmitting(true)
    const result = await apiFetch<{ id: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    })
    setSubmitting(false)

    if (result.ok) {
      toast.success(t('userCreated'))
      setEmail('')
      onSuccess()
    } else {
      if (result.error.status === 409) {
        toast.error(t('userExists'))
      } else {
        toast.error(t('errorCreate'))
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 mb-6">
      <div className="flex-1">
        <label
          htmlFor="manager-email"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--palette-fg)' }}
        >
          {t('addManager')}
        </label>
        <input
          id="manager-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full px-3 py-2 rounded-md border text-sm"
          style={{
            background: 'var(--palette-surface)',
            borderColor: 'var(--palette-border)',
            color: 'var(--palette-fg)',
          }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        style={{
          background: 'var(--palette-primary)',
          color: 'var(--palette-primary-fg)',
        }}
      >
        {t('add')}
      </button>
    </form>
  )
}
