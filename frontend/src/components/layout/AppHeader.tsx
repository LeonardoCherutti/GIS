'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function AppHeader() {
  const { user } = useAuth()
  const t = useTranslations('common')

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-surface-raised border-b border-border">
      <Link href="/hospital" aria-label={t('home')}>
        <Image
          src="/logo_horizontal.png"
          alt="G.S.I"
          width={156}
          height={53}
          className="dark:brightness-200 dark:contrast-50"
        />
      </Link>
      <div className="flex items-center gap-2">
        {user?.role === 'admin' && (
          <Link
            href="/admin"
            className="px-3 py-1.5 text-sm rounded-md transition-colors"
            style={{
              color: 'var(--palette-primary)',
              background: 'var(--palette-surface)',
            }}
          >
            {t('admin')}
          </Link>
        )}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
