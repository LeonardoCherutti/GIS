'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardErrorBoundaryProps {
  onRetry: () => void
}

export function DashboardErrorBoundary({ onRetry }: DashboardErrorBoundaryProps) {
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
          Erro ao carregar dashboard
        </h2>
        <p
          className="text-sm mb-6 max-w-sm"
          style={{ color: 'var(--palette-muted-fg)' }}
        >
          O dashboard nao pode ser carregado. Verifique sua conexao e tente novamente.
        </p>
        <Button onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
