'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
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

function HospitalGrid() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHospitals() {
      const result = await apiFetch<Hospital[]>('/hospitals')
      if (result.ok) {
        setHospitals(result.data)
      } else {
        toast.error(result.error.message)
      }
      setLoading(false)
    }
    fetchHospitals()
  }, [])

  async function handleLogout() {
    await logout()
    router.push('/')
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
          Hospitais
        </h1>
        <div className="flex items-center gap-4">
          <span
            className="text-sm"
            style={{ color: 'var(--palette-muted-fg)' }}
          >
            {user?.name ?? user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
            style={{
              color: 'var(--palette-foreground)',
              border: '1px solid var(--palette-border)',
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <span
                className="inline-block w-8 h-8 border-3 rounded-full animate-spin mb-4"
                style={{
                  borderColor: 'var(--palette-border)',
                  borderTopColor: 'var(--palette-primary)',
                }}
              />
              <p style={{ color: 'var(--palette-muted-fg)' }}>
                Carregando hospitais...
              </p>
            </div>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: 'var(--palette-muted-fg)' }}>
              Nenhum hospital encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/hospital/${hospital.cnes}`}
                className="block rounded-lg p-5 transition-shadow hover:shadow-md"
                style={{
                  background: 'var(--palette-surface-raised)',
                  border: '1px solid var(--palette-border)',
                }}
              >
                <h2
                  className="font-semibold text-base"
                  style={{ color: 'var(--palette-foreground)' }}
                >
                  {hospital.name}
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'var(--palette-muted-fg)' }}
                >
                  CNES: {hospital.cnes}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function HospitalPage() {
  return (
    <AuthGuard>
      <HospitalGrid />
    </AuthGuard>
  )
}
