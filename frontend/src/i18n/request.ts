import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

const messageImports = {
  'pt-BR': async () => ({
    common: (await import('../messages/pt-BR/common.json')).default,
    auth: (await import('../messages/pt-BR/auth.json')).default,
    hospital: (await import('../messages/pt-BR/hospital.json')).default,
    dashboard: (await import('../messages/pt-BR/dashboard.json')).default,
    admin: (await import('../messages/pt-BR/admin.json')).default,
    register: (await import('../messages/pt-BR/register.json')).default,
  }),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const messages = await messageImports[locale]()

  return { locale, messages }
})
