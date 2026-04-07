# Phase 4: Polish + i18n - Research

**Researched:** 2026-04-07
**Domain:** Internationalization with next-intl on Next.js 16
**Confidence:** HIGH

## Summary

This phase adds internationalization to the GIS portal using next-intl with `[locale]` routing. The reference project (ferreiracontabilidade) provides a proven, working pattern on the same Next.js 16 + next-intl 4.x stack. The key structural change is moving all page routes under `app/[locale]/` and creating a `proxy.ts` file (Next.js 16 renamed middleware to proxy) that handles locale detection and URL rewriting.

All visible UI strings are currently hardcoded in Portuguese across ~12 components. These need extraction into a `messages/pt-BR/` JSON structure. The architecture is straightforward: install next-intl, configure routing/request/proxy, wrap the locale layout with `NextIntlClientProvider`, then replace every hardcoded string with `useTranslations()` calls.

**Primary recommendation:** Follow the ferreiracontabilidade reference pattern exactly -- next-intl 4.x with `[locale]` routing, `proxy.ts` for locale detection, JSON message files split by feature domain, `useTranslations` hook in all client components.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- next-intl with [locale] routing matching ferreiracontabilidade reference pattern
- Default locale: pt-BR
- Message files in JSON format (messages/pt-BR.json)
- Middleware for locale detection and routing
- All hardcoded Portuguese strings extracted to message files
- next-intl middleware handles locale prefix
- Navigation wrapper for locale-aware links
- useTranslations hook in all components with visible text
- Adding a new locale requires only: new JSON file + config entry

### Claude's Discretion
- Message key naming conventions
- Grouping of message keys by feature/component
- Locale detection strategy (browser vs. explicit)

### Deferred Ideas (OUT OF SCOPE)
- Additional locales (en, es) -- future
- Locale selector UI component -- future (URL-based switching is sufficient for now)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-01 | next-intl configured with [locale] routing | Reference project pattern verified, proxy.ts + routing.ts + request.ts structure documented |
| I18N-02 | All UI strings extracted to pt-BR message files (no hardcoded Portuguese) | Complete string inventory across 12+ components compiled below |
| I18N-03 | i18n-ready architecture supporting future language additions | Architecture requires only new JSON file + locale entry in routing.ts |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **AGENTS.md warning:** "This is NOT the Next.js you know. This version has breaking changes -- APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."
- **Critical Next.js 16 change:** `middleware.ts` is **deprecated and renamed to `proxy.ts`**. The export function must be named `proxy`, not `middleware`. The reference project already uses this convention.
- **Standards:** Must match `D:\ferreiracontabilidade\app` patterns
- **Language:** Portuguese (pt-BR) primary, i18n-ready architecture

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | 4.9.0 | i18n framework for Next.js App Router | Reference project uses 4.8.4; 4.9.0 is latest. Provides routing, message loading, useTranslations hook |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-intl/middleware | (included) | Locale detection + URL rewriting | In proxy.ts for locale prefix handling |
| next-intl/server | (included) | Server-side message loading | In request.ts and locale layout |
| next-intl/routing | (included) | Routing config (locales, defaultLocale) | In i18n/routing.ts |
| next-intl/plugin | (included) | Next.js config plugin | In next.config.ts |

**Installation:**
```bash
cd frontend && npm install next-intl
```

**Version verification:** `npm view next-intl version` returned `4.9.0` (2026-04-07).

## Architecture Patterns

### Recommended Project Structure
```
frontend/src/
  i18n/
    routing.ts          # defineRouting({ locales, defaultLocale })
    request.ts          # getRequestConfig with message imports
  messages/
    pt-BR/
      common.json       # Shared: nav, footer, loading, errors
      auth.json         # Login, session messages
      hospital.json     # Grid, card, search, pagination
      dashboard.json    # Embed, error boundary, fullscreen
  proxy.ts              # Locale detection + redirect (NOT middleware.ts)
  app/
    layout.tsx           # Root layout (html tag, providers) -- NO locale here
    [locale]/
      layout.tsx         # NextIntlClientProvider wrapper
      page.tsx           # Login page (moved from app/page.tsx)
      hospital/
        layout.tsx       # AuthGuard + AppHeader + AppFooter
        page.tsx         # Hospital grid
        [cnes]/
          page.tsx       # Dashboard view
```

### Pattern 1: Routing Configuration
**What:** Define supported locales and default
**When to use:** Single source of truth for locale list
**Example:**
```typescript
// src/i18n/routing.ts -- Source: ferreiracontabilidade reference
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR'],
  defaultLocale: 'pt-BR',
})
```

### Pattern 2: Request Configuration with Lazy Message Imports
**What:** Load messages per-locale using dynamic imports
**When to use:** In `src/i18n/request.ts`, consumed by next-intl plugin
**Example:**
```typescript
// src/i18n/request.ts -- Source: ferreiracontabilidade reference
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

const messageImports = {
  'pt-BR': async () => ({
    common: (await import('../messages/pt-BR/common.json')).default,
    auth: (await import('../messages/pt-BR/auth.json')).default,
    hospital: (await import('../messages/pt-BR/hospital.json')).default,
    dashboard: (await import('../messages/pt-BR/dashboard.json')).default,
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
```

### Pattern 3: Proxy (NOT Middleware) for Locale Handling
**What:** Next.js 16 proxy.ts handles locale prefix detection and redirect
**When to use:** Root-level `src/proxy.ts` -- required for [locale] routing
**Example:**
```typescript
// src/proxy.ts -- Adapted from ferreiracontabilidade + Next.js 16 docs
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(request) {
  return intlMiddleware(request)
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
```
**CRITICAL:** Export function MUST be named `proxy`, not `middleware`. File MUST be `proxy.ts`. The next-intl `createMiddleware` still returns a function, but we wrap it in the `proxy` export.

### Pattern 4: Locale Layout with NextIntlClientProvider
**What:** Wrap locale segment with provider for client components
**When to use:** `app/[locale]/layout.tsx`
**Example:**
```typescript
// src/app/[locale]/layout.tsx -- Source: ferreiracontabilidade reference
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

### Pattern 5: next.config.ts with next-intl Plugin
**What:** Wrap Next.js config with next-intl plugin
**When to use:** `next.config.ts`
**Example:**
```typescript
// next.config.ts -- Source: ferreiracontabilidade reference
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        { key: 'Content-Security-Policy', value: "frame-src 'self' https://app.powerbi.com" },
      ]
    }]
  },
}

export default withNextIntl(nextConfig)
```

### Pattern 6: useTranslations in Client Components
**What:** Hook to access translated strings by namespace
**When to use:** Every component with visible text
**Example:**
```typescript
// Source: ferreiracontabilidade reference
'use client'
import { useTranslations } from 'next-intl'

export default function AppHeader() {
  const t = useTranslations('common')
  return <span>{t('nav.portalName')}</span>
}
```

### Anti-Patterns to Avoid
- **Using middleware.ts instead of proxy.ts:** Next.js 16 deprecated middleware.ts. Will cause deprecation warnings or break.
- **Putting NextIntlClientProvider in root layout:** Must be in `[locale]/layout.tsx` so it has access to the locale param.
- **Hardcoding strings in aria-label attributes:** These are user-visible to screen readers and must be translated too.
- **Using next-intl navigation wrappers:** The reference project uses standard `next/link` -- the `[locale]` segment in the URL path handles routing automatically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale detection | Custom Accept-Language parser | `next-intl/middleware` (createMiddleware) | Handles browser preference negotiation, cookie persistence, redirect logic |
| Message loading | Manual JSON import system | `next-intl/server` getRequestConfig | Handles server/client boundary, code splitting, type safety |
| String interpolation | Template literals with variables | next-intl ICU message format `{variable}` | Handles plurals, dates, numbers correctly |
| Locale-aware routing | Custom URL rewriting | `[locale]` dynamic segment + proxy.ts | Next.js native dynamic routing + next-intl middleware |

## Common Pitfalls

### Pitfall 1: Forgetting to Move Routes Under [locale]
**What goes wrong:** Pages render without locale context, useTranslations throws "no messages" error
**Why it happens:** Routes must be under `app/[locale]/` for the locale param to exist
**How to avoid:** Move ALL page routes (page.tsx, hospital/, hospital/[cnes]/) under `app/[locale]/`
**Warning signs:** "Unable to find `next-intl` locale" errors at runtime

### Pitfall 2: API Routes Under [locale]
**What goes wrong:** API routes like `/api/proxy/[...path]` and `/api/session` get locale prefix, breaking fetch calls
**Why it happens:** If API routes accidentally get moved under `[locale]/`
**How to avoid:** Keep `app/api/` at the top level, NOT under `[locale]/`. The proxy.ts matcher already excludes `/api` paths.
**Warning signs:** 404 on API calls

### Pitfall 3: Link Paths Need Locale Prefix
**What goes wrong:** Links like `/hospital` produce 404 or redirect loops
**Why it happens:** All page routes now live under `/[locale]/hospital`
**How to avoid:** Use `next/link` normally -- the proxy.ts handles adding locale prefix to bare paths. But internal `router.push('/')` calls need updating to include locale or rely on the redirect.
**Warning signs:** Redirect loops, 404 on navigation

### Pitfall 4: Root Layout Must NOT Be Under [locale]
**What goes wrong:** HTML tag, ThemeProvider, AuthProvider get re-mounted on locale change
**Why it happens:** Root layout.tsx must stay at `app/layout.tsx` (without locale), providing html/body tags. The `[locale]/layout.tsx` provides NextIntlClientProvider only.
**Warning signs:** Flash of unstyled content, lost auth state on navigation

### Pitfall 5: metadata.title with Translated Strings
**What goes wrong:** Page title shows in English or shows message key
**Why it happens:** `export const metadata` is static and cannot use hooks
**How to avoid:** For now, keep metadata static in Portuguese (single locale). When adding locales later, use `generateMetadata()` async function with `getTranslations()`.

### Pitfall 6: Proxy Export Name
**What goes wrong:** Proxy file is ignored, locale routing doesn't work
**Why it happens:** Next.js 16 requires the export to be named `proxy`, not `middleware`
**How to avoid:** Always export `function proxy(request)` in `proxy.ts`
**Warning signs:** No locale prefix in URLs, next-intl provider has no locale

## Hardcoded String Inventory

Complete inventory of all Portuguese strings to extract, organized by component:

### page.tsx (Login page)
| String | Suggested Key |
|--------|---------------|
| `"Carregando..."` | `common.loading` |
| `"Redirecionando..."` | `auth.redirecting` |
| `"GIS"` | `common.brand.short` |
| `"Gestao Inteligente em Saude"` | `common.brand.full` |
| `"Portal de Dashboards Hospitalares"` | `common.brand.tagline` |

### LoginButton.tsx
| String | Suggested Key |
|--------|---------------|
| `"Servico do Google nao carregado. Recarregue a pagina."` | `auth.errors.googleNotLoaded` |
| `"Erro ao autenticar"` | `auth.errors.generic` |
| `"Popup bloqueado. Habilite popups para este site."` | `auth.errors.popupBlocked` |
| `"Entrar com Google"` | `auth.loginButton` |

### AppHeader.tsx
| String | Suggested Key |
|--------|---------------|
| `"G.I.S."` | `common.brand.short` (reuse) |
| `"Gestao Inteligente em Saude"` | `common.brand.full` (reuse) |

### AppFooter.tsx
| String | Suggested Key |
|--------|---------------|
| `"G.I.S. Gestao Inteligente em Saude"` | `common.footer.copyright` (with year interpolation) |

### UserMenu.tsx
| String | Suggested Key |
|--------|---------------|
| `"Avatar"` | `common.nav.avatar` |
| `"Sair"` | `common.nav.logout` |

### ThemeToggle.tsx
| String | Suggested Key |
|--------|---------------|
| `"Mudar para tema claro"` | `common.theme.switchToLight` |
| `"Mudar para tema escuro"` | `common.theme.switchToDark` |

### HospitalGrid.tsx
| String | Suggested Key |
|--------|---------------|
| `"Nenhum hospital encontrado."` | `hospital.noResults` |

### SearchInput.tsx
| String | Suggested Key |
|--------|---------------|
| `"Buscar por nome ou CNES..."` | `hospital.searchPlaceholder` |

### HospitalCard.tsx
| String | Suggested Key |
|--------|---------------|
| `PT_MONTHS` array (jan, fev, mar...) | `hospital.months.jan` through `hospital.months.dec` (or use Intl.DateTimeFormat) |
| `"CNES {code}"` | `hospital.cnesLabel` (with interpolation) |

### Pagination.tsx
| String | Suggested Key |
|--------|---------------|
| `"Paginacao"` (aria-label) | `hospital.pagination.label` |
| `"Pagina anterior"` (aria-label) | `hospital.pagination.previous` |
| `"Proxima pagina"` (aria-label) | `hospital.pagination.next` |

### DashboardEmbed.tsx
| String | Suggested Key |
|--------|---------------|
| `"Carregando dashboard..."` | `dashboard.loading` |

### DashboardErrorBoundary.tsx
| String | Suggested Key |
|--------|---------------|
| `"Erro ao carregar dashboard"` | `dashboard.error.title` |
| `"O dashboard nao pode ser carregado. Verifique sua conexao e tente novamente."` | `dashboard.error.description` |
| `"Tentar novamente"` | `dashboard.error.retry` |

### hospital/[cnes]/page.tsx (Dashboard page)
| String | Suggested Key |
|--------|---------------|
| `"Carregando..."` | `common.loading` (reuse) |
| `"Hospital nao encontrado"` | `hospital.notFound` |
| `"Voltar para a lista"` | `hospital.backToList` |
| `"Voltar para hospitais"` | `hospital.backToHospitals` |
| `"Dashboard nao configurado para este hospital."` | `dashboard.notConfigured` |

### AuthGuard.tsx
| String | Suggested Key |
|--------|---------------|
| `"Carregando..."` | `common.loading` (reuse) |

### FullscreenToggle.tsx
| String | Suggested Key |
|--------|---------------|
| `"Sair da tela cheia"` (aria-label) | `dashboard.fullscreen.exit` |
| `"Tela cheia"` (aria-label) | `dashboard.fullscreen.enter` |

### layout.tsx (Root)
| String | Suggested Key |
|--------|---------------|
| `"GIS - Gestao Inteligente em Saude"` (metadata.title) | Keep static for now (metadata limitation) |
| `"Portal de dashboards hospitalares"` (metadata.description) | Keep static for now |

## Recommended Message File Structure

### messages/pt-BR/common.json
```json
{
  "brand": {
    "short": "G.I.S.",
    "full": "Gestao Inteligente em Saude",
    "tagline": "Portal de Dashboards Hospitalares"
  },
  "nav": {
    "avatar": "Avatar",
    "logout": "Sair"
  },
  "theme": {
    "switchToLight": "Mudar para tema claro",
    "switchToDark": "Mudar para tema escuro"
  },
  "footer": {
    "copyright": "G.I.S. Gestao Inteligente em Saude \u00a9 {year}"
  },
  "loading": "Carregando..."
}
```

### messages/pt-BR/auth.json
```json
{
  "loginButton": "Entrar com Google",
  "redirecting": "Redirecionando...",
  "errors": {
    "googleNotLoaded": "Servico do Google nao carregado. Recarregue a pagina.",
    "generic": "Erro ao autenticar",
    "popupBlocked": "Popup bloqueado. Habilite popups para este site."
  }
}
```

### messages/pt-BR/hospital.json
```json
{
  "searchPlaceholder": "Buscar por nome ou CNES...",
  "noResults": "Nenhum hospital encontrado.",
  "cnesLabel": "CNES {code}",
  "notFound": "Hospital nao encontrado",
  "backToList": "Voltar para a lista",
  "backToHospitals": "Voltar para hospitais",
  "pagination": {
    "label": "Paginacao",
    "previous": "Pagina anterior",
    "next": "Proxima pagina"
  }
}
```

### messages/pt-BR/dashboard.json
```json
{
  "loading": "Carregando dashboard...",
  "notConfigured": "Dashboard nao configurado para este hospital.",
  "error": {
    "title": "Erro ao carregar dashboard",
    "description": "O dashboard nao pode ser carregado. Verifique sua conexao e tente novamente.",
    "retry": "Tentar novamente"
  },
  "fullscreen": {
    "enter": "Tela cheia",
    "exit": "Sair da tela cheia"
  }
}
```

## Route Migration Plan

Current route structure -> New structure:

```
CURRENT:                          NEW:
app/layout.tsx                    app/layout.tsx (keep -- root html/body)
app/page.tsx                  ->  app/[locale]/page.tsx
app/hospital/layout.tsx       ->  app/[locale]/hospital/layout.tsx
app/hospital/page.tsx         ->  app/[locale]/hospital/page.tsx
app/hospital/[cnes]/page.tsx  ->  app/[locale]/hospital/[cnes]/page.tsx
app/api/ (stays)                  app/api/ (stays -- NOT under [locale])
                              NEW: app/[locale]/layout.tsx (NextIntlClientProvider)
                              NEW: src/proxy.ts
                              NEW: src/i18n/routing.ts
                              NEW: src/i18n/request.ts
```

**Internal links to update:**
- `router.push('/hospital')` -> `router.push('/hospital')` (proxy handles locale prefix)
- `router.push('/')` -> `router.push('/')` (proxy handles locale prefix)
- `Link href="/hospital"` -> remains same (proxy handles redirect)
- `Link href={/hospital/${cnes}}` -> remains same

**Note:** The next-intl proxy/middleware will detect bare paths (without locale prefix) and redirect to the locale-prefixed version. Existing `next/link` usage should work without changes to href values because the proxy adds the locale prefix automatically.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| middleware.ts | proxy.ts | Next.js 16.0.0 | File + export renamed; next-intl createMiddleware output is wrapped in proxy export |
| next-intl createSharedPathnamesNavigation | Standard next/link | next-intl 4.x | Navigation wrappers removed in favor of built-in Next.js link with [locale] segment |

## Open Questions

1. **Month formatting in HospitalCard**
   - What we know: Currently uses a hardcoded `PT_MONTHS` array for month abbreviations
   - What's unclear: Whether to use message keys per month or `Intl.DateTimeFormat` with locale
   - Recommendation: Use `Intl.DateTimeFormat(locale, { month: 'short' })` for automatic locale-aware formatting. The locale comes from `useLocale()`. This avoids 12 translation keys and handles all future locales automatically.

2. **Toast messages from API errors**
   - What we know: `toast.error(result.error.message)` in HospitalGrid shows server error messages
   - What's unclear: Whether API error messages should be translated client-side or come pre-translated from the API
   - Recommendation: Keep as-is for v1 (API returns Portuguese errors). Future locales can add client-side error mapping.

## Sources

### Primary (HIGH confidence)
- ferreiracontabilidade reference project (`D:\ferreiracontabilidade\app`) -- complete working next-intl 4.x + Next.js 16 implementation
- Next.js 16 official docs (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`) -- confirms [locale] routing and proxy.ts pattern
- Next.js 16 proxy.ts docs (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`) -- confirms middleware->proxy rename
- npm registry (`npm view next-intl version`) -- confirmed 4.9.0 as latest

### Secondary (MEDIUM confidence)
- None needed -- reference project provides complete pattern

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- reference project uses exact same stack, npm version verified
- Architecture: HIGH -- copied directly from working ferreiracontabilidade reference
- Pitfalls: HIGH -- derived from Next.js 16 docs (proxy rename) and direct code analysis
- String inventory: HIGH -- every component file read and strings catalogued

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable -- next-intl 4.x is mature)
