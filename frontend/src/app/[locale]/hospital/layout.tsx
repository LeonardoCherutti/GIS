'use client'

import { type ReactNode } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function HospitalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </AuthGuard>
  )
}
