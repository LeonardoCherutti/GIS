'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api/client'
import UserTable from '@/components/admin/UserTable'
import AddManagerForm from '@/components/admin/AddManagerForm'

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

interface Hospital {
  id: string
  name: string
  cnes: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserWithHospitals[]>([])
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations('admin')

  const fetchUsers = useCallback(async () => {
    const result = await apiFetch<UserWithHospitals[]>('/admin/users')
    if (result.ok) {
      setUsers(result.data)
    } else {
      toast.error(t('errorLoad'))
    }
  }, [t])

  useEffect(() => {
    async function init() {
      const [usersResult, hospitalsResult] = await Promise.all([
        apiFetch<UserWithHospitals[]>('/admin/users'),
        apiFetch<Hospital[]>('/hospitals'),
      ])
      if (usersResult.ok) setUsers(usersResult.data)
      else toast.error(t('errorLoad'))
      if (hospitalsResult.ok) setAllHospitals(hospitalsResult.data)
      setLoading(false)
    }
    init()
  }, [t])

  async function handleDelete(userId: string) {
    const result = await apiFetch(`/admin/users/${userId}`, {
      method: 'DELETE',
    })
    if (result.ok) {
      toast.success(t('userDeleted'))
      fetchUsers()
    } else {
      toast.error(t('errorDelete'))
    }
  }

  async function handleUpdateHospitals(
    userId: string,
    hospitalIds: string[]
  ) {
    const result = await apiFetch(`/admin/users/${userId}/hospitals`, {
      method: 'PUT',
      body: JSON.stringify({ hospital_ids: hospitalIds }),
    })
    if (result.ok) {
      toast.success(t('hospitalsUpdated'))
      fetchUsers()
    } else {
      toast.error(t('errorUpdate'))
    }
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ color: 'var(--palette-muted-fg)' }}
      >
        <span
          className="inline-block w-8 h-8 border-3 rounded-full animate-spin"
          style={{
            borderColor: 'var(--palette-border)',
            borderTopColor: 'var(--palette-primary)',
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ color: 'var(--palette-fg)' }}
      >
        {t('title')}
      </h1>
      <AddManagerForm onSuccess={fetchUsers} />
      <UserTable
        users={users}
        allHospitals={allHospitals.map((h) => ({ id: h.id, name: h.name }))}
        onDelete={handleDelete}
        onUpdateHospitals={handleUpdateHospitals}
      />
    </div>
  )
}
