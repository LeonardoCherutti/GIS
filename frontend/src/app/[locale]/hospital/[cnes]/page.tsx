'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/api/client'
import { DashboardEmbed } from '@/components/dashboard/DashboardEmbed'

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
  const tc = useTranslations('common')
  const th = useTranslations('hospital')
  const td = useTranslations('dashboard')
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <span
            className="inline-block w-8 h-8 border-3 rounded-full animate-spin mb-4"
            style={{
              borderColor: 'var(--palette-border)',
              borderTopColor: 'var(--palette-primary)',
            }}
          />
          <p style={{ color: 'var(--palette-muted-fg)' }}>{tc('loading')}</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--palette-foreground)' }}
          >
            {th('notFound')}
          </h1>
          <Link
            href="/hospital"
            className="text-sm underline"
            style={{ color: 'var(--palette-primary)' }}
          >
            {th('backToList')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/hospital"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'var(--palette-muted-fg)' }}
        >
          <ArrowLeft className="size-4" />
          {th('backToHospitals')}
        </Link>
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--palette-foreground)' }}
        >
          {hospital?.name}
        </h2>
        <div className="w-32" />
      </div>

      {hospital?.powerbi_url ? (
        <DashboardEmbed url={hospital.powerbi_url} title={hospital.name} />
      ) : (
        <div
          className="rounded-lg p-8 text-center"
          style={{
            background: 'var(--palette-surface-raised)',
            border: '1px solid var(--palette-border)',
          }}
        >
          <p style={{ color: 'var(--palette-muted-fg)' }}>
            {td('notConfigured')}
          </p>
        </div>
      )}
    </div>
  )
}

export default function HospitalDashboardPage({
  params,
}: {
  params: Promise<{ cnes: string }>
}) {
  return <DashboardContent params={params} />
}
