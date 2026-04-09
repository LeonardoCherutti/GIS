'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import HospitalCheckboxList from './HospitalCheckboxList'

interface UserHospital {
  id: string
  name: string
  cnes: string
}

interface UserWithHospitals {
  id: string
  email: string
  name: string | null
  picture: string | null
  role: 'admin' | 'manager'
  hospitals: UserHospital[]
}

interface UserTableProps {
  users: UserWithHospitals[]
  allHospitals: Array<{ id: string; name: string }>
  onDelete: (userId: string) => void
  onUpdateHospitals: (userId: string, hospitalIds: string[]) => void
}

export default function UserTable({
  users,
  allHospitals,
  onDelete,
  onUpdateHospitals,
}: UserTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const t = useTranslations('admin')

  function handleDelete(userId: string) {
    if (window.confirm(t('confirmDelete'))) {
      onDelete(userId)
    }
  }

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{ borderColor: 'var(--palette-border)' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              background: 'var(--palette-muted)',
              color: 'var(--palette-muted-fg)',
            }}
          >
            <th className="text-left px-4 py-3 font-medium">{t('email')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('role')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('hospitals')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t"
              style={{
                borderColor: 'var(--palette-border)',
                background: 'var(--palette-surface)',
                color: 'var(--palette-fg)',
              }}
            >
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                {user.role === 'admin' ? t('admin') : t('manager')}
              </td>
              <td className="px-4 py-3">
                {user.role === 'admin' ? (
                  <span
                    className="text-xs italic"
                    style={{ color: 'var(--palette-muted-fg)' }}
                  >
                    {t('allHospitals')}
                  </span>
                ) : user.hospitals.length > 0 ? (
                  <span>{user.hospitals.map((h) => h.name).join(', ')}</span>
                ) : (
                  <span
                    className="text-xs italic"
                    style={{ color: 'var(--palette-muted-fg)' }}
                  >
                    {t('noHospitals')}
                  </span>
                )}
                {editingUserId === user.id && (
                  <div className="mt-2">
                    <HospitalCheckboxList
                      allHospitals={allHospitals}
                      assignedIds={user.hospitals.map((h) => h.id)}
                      onSave={(ids) => {
                        onUpdateHospitals(user.id, ids)
                        setEditingUserId(null)
                      }}
                      onCancel={() => setEditingUserId(null)}
                    />
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {user.role !== 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingUserId(
                          editingUserId === user.id ? null : user.id
                        )
                      }
                      className="px-2 py-1 text-xs rounded transition-colors"
                      style={{
                        color: 'var(--palette-primary)',
                        background: 'var(--palette-muted)',
                      }}
                    >
                      {t('editHospitals')}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-2 py-1 text-xs rounded transition-colors"
                      style={{
                        color: 'var(--palette-danger, #ef4444)',
                        background: 'var(--palette-muted)',
                      }}
                    >
                      {t('delete')}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
