'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface HospitalCheckboxListProps {
  allHospitals: Array<{ id: string; name: string }>
  assignedIds: string[]
  onSave: (hospitalIds: string[]) => void
  onCancel: () => void
}

export default function HospitalCheckboxList({
  allHospitals,
  assignedIds,
  onSave,
  onCancel,
}: HospitalCheckboxListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedIds))
  const [search, setSearch] = useState('')
  const t = useTranslations('admin')

  const filtered = useMemo(() => {
    if (!search.trim()) return allHospitals
    const q = search.toLowerCase()
    return allHospitals.filter((h) => h.name.toLowerCase().includes(q))
  }, [allHospitals, search])

  function toggleHospital(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div
      className="p-4 rounded-md border"
      style={{
        background: 'var(--palette-surface)',
        borderColor: 'var(--palette-border)',
      }}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchHospitals')}
        className="w-full px-3 py-2 mb-3 rounded-md border text-sm focus:ring-2 focus:outline-none"
        style={{
          background: 'var(--palette-background)',
          borderColor: 'var(--palette-border)',
          color: 'var(--palette-fg)',
        }}
      />
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {filtered.length === 0 ? (
          <p
            className="text-sm py-2 text-center"
            style={{ color: 'var(--palette-muted-fg)' }}
          >
            {t('noResults')}
          </p>
        ) : (
          filtered.map((hospital) => (
            <label
              key={hospital.id}
              className="flex items-center gap-2 cursor-pointer text-sm px-1 py-1 rounded transition-colors hover:opacity-80"
              style={{ color: 'var(--palette-fg)' }}
            >
              <input
                type="checkbox"
                checked={selected.has(hospital.id)}
                onChange={() => toggleHospital(hospital.id)}
                className="rounded"
                style={{ accentColor: 'var(--palette-primary)' }}
              />
              {hospital.name}
            </label>
          ))
        )}
      </div>
      <p
        className="text-xs mb-3"
        style={{ color: 'var(--palette-muted-fg)' }}
      >
        {selected.size} {t('selected')}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(Array.from(selected))}
          className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          style={{
            background: 'var(--palette-primary)',
            color: 'var(--palette-primary-fg)',
          }}
        >
          {t('save')}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          style={{
            background: 'var(--palette-muted)',
            color: 'var(--palette-muted-fg)',
          }}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}
