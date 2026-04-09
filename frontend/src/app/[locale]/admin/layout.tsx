'use client'

import { type ReactNode } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AdminGuard from '@/components/auth/AdminGuard'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1">
          <AdminGuard>{children}</AdminGuard>
        </main>
        <AppFooter />
      </div>
    </AuthGuard>
  )
}
