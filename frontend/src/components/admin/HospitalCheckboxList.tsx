'use client'

import { useState } from 'react'
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
  const t = useTranslations('admin')

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
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {allHospitals.map((hospital) => (
          <label
            key={hospital.id}
            className="flex items-center gap-2 cursor-pointer text-sm"
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
        ))}
      </div>
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
