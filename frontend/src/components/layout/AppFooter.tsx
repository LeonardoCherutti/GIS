'use client'

import { useTranslations } from 'next-intl'

export default function AppFooter() {
  const t = useTranslations('common')

  return (
    <footer className="py-4 px-6 bg-surface border-t border-border text-center space-y-1">
      <p className="text-sm text-muted-fg">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </p>
      <p className="text-xs text-muted-fg">
        {t.rich('footer.madeBy', {
          link: (chunks) => (
            <a
              href="https://pixelrogue.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </footer>
  )
}
