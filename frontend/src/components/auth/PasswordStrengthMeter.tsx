'use client'

import { useTranslations } from 'next-intl'
import { Check, Circle } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
}

function getScore(password: string): number {
  if (password.length === 0) return 0
  if (password.length < 6) return 1
  if (password.length < 10) return 2
  if (password.length < 15) return 3
  return 4
}

const SEGMENT_COLORS = [
  'var(--palette-destructive)',
  '#f59e0b',
  '#eab308',
  'var(--palette-primary)',
]

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const t = useTranslations('resetPassword')
  const score = getScore(password)
  const meetsMinimum = password.length >= 10

  return (
    <div
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={4}
      aria-label="Forca da senha"
    >
      <div className="flex gap-[2px]">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded"
            style={{
              background: i < score
                ? SEGMENT_COLORS[score - 1]
                : 'var(--palette-border)',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1 mt-1">
        {meetsMinimum ? (
          <Check size={14} style={{ color: 'var(--palette-primary)' }} />
        ) : (
          <Circle size={14} style={{ color: 'var(--palette-muted-fg)' }} />
        )}
        <span
          className="text-xs"
          style={{ color: meetsMinimum ? 'var(--palette-primary)' : 'var(--palette-muted-fg)' }}
        >
          {t('strength.minLength')}
        </span>
      </div>
    </div>
  )
}
