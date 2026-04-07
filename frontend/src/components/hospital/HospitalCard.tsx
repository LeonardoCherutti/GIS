import Link from 'next/link'
import Image from 'next/image'
import { Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface HospitalCardProps {
  hospital: {
    name: string
    cnes: string
    logo_url: string | null
    period_start: string | null
    period_end: string | null
  }
}

const PT_MONTHS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function formatPeriod(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const month = PT_MONTHS[d.getMonth()]
  const year = d.getFullYear()
  return `${month}/${year}`
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const periodStart = formatPeriod(hospital.period_start)
  const periodEnd = formatPeriod(hospital.period_end)
  const periodText =
    periodStart && periodEnd
      ? `${periodStart} - ${periodEnd}`
      : periodStart || periodEnd || null

  return (
    <Link href={`/hospital/${hospital.cnes}`} className="block">
      <Card
        className="transition-all hover:-translate-y-0.5 hover:shadow-md border-l-4 cursor-pointer"
        style={{ borderLeftColor: 'var(--palette-primary)' }}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--palette-primary-subtle)' }}
            >
              {hospital.logo_url ? (
                <Image
                  src={hospital.logo_url}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <Building2
                  className="h-6 w-6"
                  style={{ color: 'var(--palette-primary)' }}
                />
              )}
            </div>
            <CardTitle style={{ color: 'var(--palette-foreground)' }}>
              {hospital.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p
            className="text-sm"
            style={{ color: 'var(--palette-muted-fg)' }}
          >
            CNES {hospital.cnes}
          </p>
          {periodText && (
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--palette-muted-fg)' }}
            >
              {periodText}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
