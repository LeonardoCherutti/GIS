'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  if (!user) return null

  const initials = (user.name ?? user.email ?? '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function handleLogout() {
    setOpen(false)
    await logout()
    router.push('/')
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer rounded-full outline-none focus-visible:ring-2"
        style={{ '--tw-ring-color': 'var(--palette-primary)' } as React.CSSProperties}
      >
        <Avatar>
          <AvatarImage src={user.picture ?? undefined} alt={user.name ?? t('nav.avatar')} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 min-w-48 rounded-lg p-1 shadow-lg"
          style={{
            background: 'var(--palette-surface-raised)',
            border: '1px solid var(--palette-border)',
          }}
        >
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium" style={{ color: 'var(--palette-foreground)' }}>
              {user.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--palette-muted-fg)' }}>
              {user.email}
            </p>
          </div>
          <div className="my-1 h-px" style={{ background: 'var(--palette-border)' }} />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors"
            style={{ color: 'var(--palette-foreground)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--palette-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut className="size-4" />
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
