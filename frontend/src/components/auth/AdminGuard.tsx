'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== 'admin') return null
  return <>{children}</>
}
