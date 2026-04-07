'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api/client'
import AuthGuard from '@/components/auth/AuthGuard'

interface Hospital {
  id: string
  name: string
  cnes: string
  logo_url: string | null
  period_start: string | null
  period_end: string | null
  powerbi_url: string | null
  sort_order: number
  created_at: string
}

function DashboardContent({
  params,
}: {
  params: Promise<{ cnes: string }>
}) {
  const { cnes } = use(params)
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchHospital() {
      const result = await apiFetch<Hospital[]>('/hospitals')
      if (result.ok) {
        const found = result.data.find((h) => h.cnes === cnes)
        if (found) {
          setHospital(found)
        } else {
          setNotFound(true)
        }
      } else {
        toast.error(result.error.message)
      }
      setLoading(false)
    }
    fetchHospital()
  }, [cnes])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span
            className="inline-block w-8 h-8 border-3 rounded-full animate-spin mb-4"
            style={{
              borderColor: 'var(--palette-border)',
              borderTopColor: 'var(--palette-primary)',
            }}
          />
          <p style={{ color: 'var(--palette-muted-fg)' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--palette-foreground)' }}
          >
            Hospital nao encontrado
          </h1>
          <Link
            href="/hospital"
            className="text-sm underline"
            style={{ color: 'var(--palette-primary)' }}
          >
            Voltar para a lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--palette-background)' }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 shadow-sm"
        style={{
          background: 'var(--palette-surface-raised)',
          borderBottom: '1px solid var(--palette-border)',
        }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--palette-primary)' }}
        >
          {hospital?.name}
        </h1>
        <Link
          href="/hospital"
          className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            color: 'var(--palette-foreground)',
            border: '1px solid var(--palette-border)',
          }}
        >
          Voltar
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {hospital?.powerbi_url ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              background: 'var(--palette-surface-raised)',
              border: '1px solid var(--palette-border)',
              minHeight: '400px',
            }}
          >
            <p
              className="text-lg font-medium mb-2"
              style={{ color: 'var(--palette-foreground)' }}
            >
              Dashboard Power BI sera exibido aqui
            </p>
            <p
              className="text-sm break-all"
              style={{ color: 'var(--palette-muted-fg)' }}
            >
              {hospital.powerbi_url}
            </p>
          </div>
        ) : (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              background: 'var(--palette-surface-raised)',
              border: '1px solid var(--palette-border)',
            }}
          >
            <p style={{ color: 'var(--palette-muted-fg)' }}>
              Dashboard nao configurado
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HospitalDashboardPage({
  params,
}: {
  params: Promise<{ cnes: string }>
}) {
  return (
    <AuthGuard>
      <DashboardContent params={params} />
    </AuthGuard>
  )
}
