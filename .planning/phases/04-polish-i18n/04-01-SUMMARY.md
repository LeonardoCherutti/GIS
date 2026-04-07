---
phase: 04-polish-i18n
plan: 01
subsystem: i18n
tags: [next-intl, i18n, locale-routing, proxy, pt-BR]

# Dependency graph
requires:
  - phase: 03-core-ui
    provides: All page routes and components with hardcoded Portuguese strings
provides:
  - next-intl installed and configured with [locale] routing
  - proxy.ts for locale detection and URL rewriting
  - pt-BR message files for all 4 namespaces (common, auth, hospital, dashboard)
  - NextIntlClientProvider wrapper in [locale]/layout.tsx
  - All page routes restructured under app/[locale]/
affects: [04-02-PLAN string extraction]

# Tech tracking
tech-stack:
  added: [next-intl]
  patterns: [locale-segment routing, proxy-based locale detection, namespace-split message files]

key-files:
  created:
    - frontend/src/i18n/routing.ts
    - frontend/src/i18n/request.ts
    - frontend/src/proxy.ts
    - frontend/src/messages/pt-BR/common.json
    - frontend/src/messages/pt-BR/auth.json
    - frontend/src/messages/pt-BR/hospital.json
    - frontend/src/messages/pt-BR/dashboard.json
    - frontend/src/app/[locale]/layout.tsx
    - frontend/src/app/[locale]/page.tsx
    - frontend/src/app/[locale]/hospital/layout.tsx
    - frontend/src/app/[locale]/hospital/page.tsx
    - frontend/src/app/[locale]/hospital/[cnes]/page.tsx
  modified:
    - frontend/package.json
    - frontend/next.config.ts

key-decisions:
  - "Only pt-BR locale for now; adding locale requires JSON file + routing.ts entry"
  - "No auth check in proxy.ts -- GIS uses client-side AuthGuard pattern"

patterns-established:
  - "Locale routing: all page routes under app/[locale]/ with proxy.ts handling detection"
  - "Message files split by feature domain: common, auth, hospital, dashboard"
  - "Lazy message imports in request.ts for tree-shaking"

requirements-completed: [I18N-01, I18N-03]

# Metrics
duration: 3min
completed: 2026-04-07
---

# Phase 4 Plan 01: i18n Infrastructure Summary

**next-intl with [locale] routing, proxy.ts locale detection, 4 pt-BR message namespaces, and all routes under app/[locale]/**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-07T20:29:13Z
- **Completed:** 2026-04-07T20:32:08Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- Installed next-intl and configured [locale] routing with pt-BR default
- Created proxy.ts with locale detection using Next.js 16 proxy convention (not middleware)
- Created 4 pt-BR message JSON files covering all UI string namespaces
- Restructured all page routes under app/[locale]/ with NextIntlClientProvider wrapper

## Task Commits

Each task was committed atomically:

1. **Task 1: Install next-intl and create i18n infrastructure** - `39b2549` (feat)
2. **Task 2: Move page routes under [locale] segment** - `9dddf40` (feat)

## Files Created/Modified
- `frontend/src/i18n/routing.ts` - Locale routing config with defineRouting
- `frontend/src/i18n/request.ts` - Message loading with lazy imports for 4 namespaces
- `frontend/src/proxy.ts` - Locale detection proxy (export function proxy)
- `frontend/src/messages/pt-BR/common.json` - Shared UI strings (brand, nav, theme, footer)
- `frontend/src/messages/pt-BR/auth.json` - Auth strings (login, errors)
- `frontend/src/messages/pt-BR/hospital.json` - Hospital grid strings (search, pagination)
- `frontend/src/messages/pt-BR/dashboard.json` - Dashboard strings (loading, errors, fullscreen)
- `frontend/src/app/[locale]/layout.tsx` - NextIntlClientProvider wrapper
- `frontend/src/app/[locale]/page.tsx` - Login page (moved from app/page.tsx)
- `frontend/src/app/[locale]/hospital/layout.tsx` - Hospital layout (moved)
- `frontend/src/app/[locale]/hospital/page.tsx` - Hospital grid (moved)
- `frontend/src/app/[locale]/hospital/[cnes]/page.tsx` - Dashboard page (moved)
- `frontend/package.json` - Added next-intl dependency
- `frontend/next.config.ts` - Wrapped with createNextIntlPlugin

## Decisions Made
- Only pt-BR locale configured for now; architecture supports adding locales with just a JSON file and routing.ts entry
- No auth check in proxy.ts -- GIS uses client-side AuthGuard pattern, not middleware-based auth (matching existing architecture)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Stale `.next/types/validator.ts` referenced old route paths after move. Resolved by clearing `.next/types/` directory; TypeScript then compiles cleanly.

## Known Stubs

None - message files contain complete pt-BR strings. Components still use hardcoded strings (Plan 02 will wire useTranslations()).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- i18n infrastructure complete, ready for Plan 02 to extract hardcoded strings to useTranslations() calls
- All message keys already defined in JSON files, matching the strings found in components

## Self-Check: PASSED

- All 14 files verified present on disk
- Both task commits (39b2549, 9dddf40) verified in git log

---
*Phase: 04-polish-i18n*
*Completed: 2026-04-07*
