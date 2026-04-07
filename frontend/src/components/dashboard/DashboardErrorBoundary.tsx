'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface DashboardErrorBoundaryProps {
  onRetry: () => void
}

export function DashboardErrorBoundary({ onRetry }: DashboardErrorBoundaryProps) {
  const t = useTranslations('dashboard')

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-lg"
      style={{ background: 'var(--palette-surface)' }}
    >
      <div className="text-center">
        <AlertTriangle
          className="mx-auto mb-4 size-12"
          style={{ color: 'var(--palette-destructive)' }}
        />
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: 'var(--palette-foreground)' }}
        >
          {t('error.title')}
        </h2>
        <p
          className="text-sm mb-6 max-w-sm"
          style={{ color: 'var(--palette-muted-fg)' }}
        >
          {t('error.description')}
        </p>
        <Button onClick={onRetry}>
          {t('error.retry')}
        </Button>
      </div>
    </div>
  )
}
