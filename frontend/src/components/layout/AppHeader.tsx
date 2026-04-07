'use client'

import { Building2 } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-surface-raised border-b border-border">
      <div className="flex items-center gap-3">
        <Building2 className="size-6 text-primary" />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight text-primary">
            G.I.S.
          </span>
          <span className="text-xs text-muted-fg leading-tight">
            Gestao Inteligente em Saude
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
