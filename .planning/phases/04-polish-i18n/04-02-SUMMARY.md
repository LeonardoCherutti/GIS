---
phase: 04-polish-i18n
plan: 02
subsystem: ui
tags: [i18n, next-intl, useTranslations, pt-BR]

requires:
  - phase: 04-01
    provides: "pt-BR message JSON files with all translation keys"
provides:
  - "All 15 components use useTranslations() -- zero hardcoded Portuguese strings in JSX"
  - "Locale-aware month formatting via Intl.DateTimeFormat (replaces PT_MONTHS array)"
affects: [future-locales, ui-components]

tech-stack:
  added: []
  patterns: ["useTranslations('namespace') pattern in all client components", "Intl.DateTimeFormat for locale-aware date formatting"]

key-files:
  created: []
  modified:
    - frontend/src/components/layout/AppHeader.tsx
    - frontend/src/components/layout/AppFooter.tsx
    - frontend/src/components/layout/UserMenu.tsx
    - frontend/src/components/layout/ThemeToggle.tsx
    - frontend/src/components/auth/LoginButton.tsx
    - frontend/src/components/auth/AuthGuard.tsx
    - frontend/src/components/hospital/HospitalGrid.tsx
    - frontend/src/components/hospital/HospitalCard.tsx
    - frontend/src/components/hospital/SearchInput.tsx
    - frontend/src/components/hospital/Pagination.tsx
    - frontend/src/components/dashboard/DashboardEmbed.tsx
    - frontend/src/components/dashboard/DashboardErrorBoundary.tsx
    - frontend/src/components/dashboard/FullscreenToggle.tsx
    - frontend/src/app/[locale]/page.tsx
    - frontend/src/app/[locale]/hospital/[cnes]/page.tsx

key-decisions:
  - "Replaced PT_MONTHS array with Intl.DateTimeFormat for locale-aware month formatting"
  - "AppFooter and Pagination converted to client components to support useTranslations"
  - "SearchInput default placeholder changed to empty string; parent passes translated value"

patterns-established:
  - "useTranslations('namespace') in component body for all user-visible text"
  - "Multiple namespace pattern: tc = useTranslations('common'), ta = useTranslations('auth')"
  - "Intl.DateTimeFormat(locale, { month: 'short' }) for locale-aware month abbreviations"

requirements-completed: [I18N-02]

duration: 3min
completed: 2026-04-07
---

# Phase 04 Plan 02: Component String Extraction Summary

**All 15 components migrated from hardcoded Portuguese strings to useTranslations() calls across 4 message namespaces (common, auth, hospital, dashboard)**

## What Was Done

### Task 1: Layout, Auth, and Common Components (7 files)
- **AppHeader.tsx**: Replaced "G.I.S." and "Gestao Inteligente em Saude" with t('brand.short') and t('brand.full')
- **AppFooter.tsx**: Converted to client component; copyright text uses t('footer.copyright', { year }) with interpolation
- **UserMenu.tsx**: "Sair" replaced with t('nav.logout'), avatar alt with t('nav.avatar')
- **ThemeToggle.tsx**: Aria-labels use t('theme.switchToLight') and t('theme.switchToDark')
- **LoginButton.tsx**: Button text and all 3 error messages use auth namespace translations
- **AuthGuard.tsx**: Loading text uses t('loading')
- **app/[locale]/page.tsx**: Login page uses both common (brand, loading) and auth (redirecting) namespaces

### Task 2: Hospital and Dashboard Components (8 files)
- **HospitalGrid.tsx**: No-results message and search placeholder translated via hospital namespace
- **SearchInput.tsx**: Hardcoded Portuguese default removed; parent passes translated placeholder
- **HospitalCard.tsx**: Converted to client component; PT_MONTHS deleted, uses Intl.DateTimeFormat; CNES label uses t('cnesLabel', { code })
- **Pagination.tsx**: Converted to client component; all 3 aria-labels translated
- **DashboardEmbed.tsx**: Loading text uses t('loading') from dashboard namespace
- **DashboardErrorBoundary.tsx**: Error title, description, and retry button translated
- **FullscreenToggle.tsx**: Fullscreen aria-labels translated
- **app/[locale]/hospital/[cnes]/page.tsx**: Uses 3 namespaces for loading, not-found, back links, and not-configured text

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

1. TypeScript compiles cleanly: `npx tsc --noEmit` passes with zero errors
2. Comprehensive grep for hardcoded Portuguese strings: zero matches across all components
3. All 14 target files confirmed to contain useTranslations import (SearchInput excluded as it receives translated props from parent)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | deeec8d | Extract hardcoded strings from layout and auth components |
| 2 | b95ae1a | Extract hardcoded strings from hospital and dashboard components |

## Self-Check: PASSED

All 15 modified files confirmed present. Both commit hashes (deeec8d, b95ae1a) verified in git log.
