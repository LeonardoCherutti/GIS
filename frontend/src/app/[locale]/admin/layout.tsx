'use client'

import AdminGuard from '@/components/auth/AdminGuard'
import { type ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
