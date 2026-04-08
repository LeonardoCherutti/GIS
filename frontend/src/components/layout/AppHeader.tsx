'use client'

import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-surface-raised border-b border-border">
      <Image
        src="/logo_horizontal.png"
        alt="G.S.I"
        width={156}
        height={53}
        className="dark:brightness-200 dark:contrast-50"
      />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
