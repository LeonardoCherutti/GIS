'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api/client'
import { HospitalCard } from '@/components/hospital/HospitalCard'
import { HospitalCardSkeleton } from '@/components/hospital/HospitalCardSkeleton'
import { SearchInput } from '@/components/hospital/SearchInput'
import { Pagination } from '@/components/hospital/Pagination'
import type { Hospital } from '@/types/hospital'

const PAGE_SIZE = 9

export function HospitalGrid() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

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

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const filtered = useMemo(() => {
    if (!query.trim()) return hospitals
    const q = query.toLowerCase()
    return hospitals.filter(
      (h) => h.name.toLowerCase().includes(q) || h.cnes.includes(q)
    )
  }, [hospitals, query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  )

  return (
    <div>
      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <HospitalCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p
            className="text-sm"
            style={{ color: 'var(--palette-muted-fg)' }}
          >
            Nenhum hospital encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
