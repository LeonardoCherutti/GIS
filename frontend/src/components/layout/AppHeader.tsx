'use client'

import { Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function AppHeader() {
  const t = useTranslations('common')

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-surface-raised border-b border-border">
      <div className="flex items-center gap-3">
        <Building2 className="size-6 text-primary" />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight text-primary">
            {t('brand.short')}
          </span>
          <span className="text-xs text-muted-fg leading-tight">
            {t('brand.full')}
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
