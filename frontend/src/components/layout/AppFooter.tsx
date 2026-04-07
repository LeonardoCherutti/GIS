'use client'

import { useTranslations } from 'next-intl'

export default function AppFooter() {
  const t = useTranslations('common')

  return (
    <footer className="py-4 px-6 bg-surface border-t border-border text-center">
      <p className="text-sm text-muted-fg">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </p>
    </footer>
  )
}
