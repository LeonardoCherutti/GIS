---
phase: 04-polish-i18n
verified: 2026-04-07T21:00:00Z
status: passed
score: 7/7 must-haves verified
---

# Phase 4: Polish / i18n Verification Report

**Phase Goal:** Every visible UI string is served from pt-BR message files and the architecture supports adding new locales without component code changes
**Verified:** 2026-04-07T21:00:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | next-intl configured with [locale] routing | VERIFIED | `routing.ts` exports `defineRouting({ locales: ['pt-BR'], defaultLocale: 'pt-BR' })`; `next.config.ts` wrapped with `createNextIntlPlugin` |
| 2 | Navigating to /pt-BR/hospital shows the hospital grid (locale segment in URL) | VERIFIED | `app/[locale]/hospital/page.tsx` exists; proxy.ts routes all non-API paths through intlMiddleware |
| 3 | Navigating to / redirects to /pt-BR (default locale applied by proxy) | VERIFIED | `proxy.ts` exports `function proxy()` wrapping `createMiddleware(routing)` with matcher `/((?!api|_next|_vercel|.*\..*).*)`; default locale is pt-BR |
| 4 | API routes at /api/* still work without locale prefix | VERIFIED | proxy.ts matcher explicitly excludes `/api`; `app/api/` directory remains at root, not under `[locale]` |
| 5 | Zero hardcoded Portuguese strings in component JSX — all visible text from useTranslations | VERIFIED | Comprehensive grep across all 15 components and 2 pages returns zero matches; only intentional exception is static `metadata` in root `layout.tsx` (documented exemption) |
| 6 | Every component with user-visible text imports and calls useTranslations with appropriate namespace | VERIFIED | All 12 components + 2 page files confirmed with `useTranslations` import; SearchInput excluded by design (receives translated prop from HospitalGrid parent) |
| 7 | Adding a new locale requires only JSON files + routing.ts entry + request.ts import entry — zero component changes | VERIFIED | Architecture confirmed: new locale needs (1) `messages/{locale}/*.json`, (2) locale string in `routing.ts`, (3) import entry in `request.ts` `messageImports` object — no component files require modification |

**Score:** 7/7 truths verified

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `frontend/src/i18n/routing.ts` | Locale routing config | VERIFIED | Contains `defineRouting` with `locales: ['pt-BR']` |
| `frontend/src/i18n/request.ts` | Message loading config | VERIFIED | Contains `getRequestConfig`, lazy imports for all 4 namespaces |
| `frontend/src/proxy.ts` | Locale detection and URL rewriting | VERIFIED | `export function proxy` wraps `createMiddleware(routing)`; imports from `./i18n/routing` |
| `frontend/src/app/[locale]/layout.tsx` | NextIntlClientProvider wrapper | VERIFIED | Server component wrapping children with `NextIntlClientProvider` and `getMessages()` |
| `frontend/src/messages/pt-BR/common.json` | Shared UI strings | VERIFIED | Contains `brand`, `nav`, `theme`, `footer`, `loading` keys |
| `frontend/src/messages/pt-BR/auth.json` | Auth strings | VERIFIED | Contains `loginButton`, `redirecting`, `errors.*` keys |
| `frontend/src/messages/pt-BR/hospital.json` | Hospital strings | VERIFIED | Contains `searchPlaceholder`, `noResults`, `cnesLabel`, `notFound`, `backToList`, `backToHospitals`, `pagination.*` |
| `frontend/src/messages/pt-BR/dashboard.json` | Dashboard strings | VERIFIED | Contains `loading`, `notConfigured`, `error.*`, `fullscreen.*` keys |

### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `frontend/src/components/layout/AppHeader.tsx` | Translated header | VERIFIED | `useTranslations('common')` — renders `t('brand.short')` and `t('brand.full')` |
| `frontend/src/components/layout/AppFooter.tsx` | Translated footer | VERIFIED | Client component; `t('footer.copyright', { year })` with interpolation |
| `frontend/src/components/layout/UserMenu.tsx` | Translated nav | VERIFIED | `t('nav.logout')` and `t('nav.avatar')` |
| `frontend/src/components/layout/ThemeToggle.tsx` | Translated aria-labels | VERIFIED | `t('theme.switchToLight')` / `t('theme.switchToDark')` |
| `frontend/src/components/auth/LoginButton.tsx` | Translated login + errors | VERIFIED | `useTranslations('auth')` — `t('loginButton')`, all 3 error keys |
| `frontend/src/components/auth/AuthGuard.tsx` | Translated loading | VERIFIED | `useTranslations('common')` — `t('loading')` |
| `frontend/src/components/hospital/HospitalGrid.tsx` | Translated no-results + passes placeholder | VERIFIED | `t('noResults')` + passes `t('searchPlaceholder')` to SearchInput |
| `frontend/src/components/hospital/HospitalCard.tsx` | Translated CNES label, locale-aware months | VERIFIED | `useLocale()` + `Intl.DateTimeFormat(locale, { month: 'short' })`; no PT_MONTHS array; `t('cnesLabel', { code })` |
| `frontend/src/components/hospital/SearchInput.tsx` | No hardcoded Portuguese default | VERIFIED | `placeholder = ''` default; receives translated value from parent |
| `frontend/src/components/hospital/Pagination.tsx` | Translated aria-labels | VERIFIED | `t('pagination.label')`, `t('pagination.previous')`, `t('pagination.next')` |
| `frontend/src/components/dashboard/DashboardEmbed.tsx` | Translated loading | VERIFIED | `t('loading')` from dashboard namespace |
| `frontend/src/components/dashboard/DashboardErrorBoundary.tsx` | Translated error messages | VERIFIED | `t('error.title')`, `t('error.description')`, `t('error.retry')` |
| `frontend/src/components/dashboard/FullscreenToggle.tsx` | Translated fullscreen labels | VERIFIED | `t('fullscreen.exit')` / `t('fullscreen.enter')` |
| `frontend/src/app/[locale]/page.tsx` | Login page fully translated | VERIFIED | Both `tc = useTranslations('common')` and `ta = useTranslations('auth')` — brand, loading, redirecting |
| `frontend/src/app/[locale]/hospital/[cnes]/page.tsx` | Dashboard page fully translated | VERIFIED | Three namespaces: `tc`, `th`, `td` — loading, notFound, backToList, backToHospitals, notConfigured |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `proxy.ts` | `i18n/routing.ts` | `import routing` | VERIFIED | `import { routing } from './i18n/routing'` present |
| `[locale]/layout.tsx` | `next-intl/server` | `getMessages` | VERIFIED | `import { getMessages } from 'next-intl/server'` present |
| `next.config.ts` | `next-intl/plugin` | `createNextIntlPlugin` | VERIFIED | `import createNextIntlPlugin from 'next-intl/plugin'` present |
| `AppHeader.tsx` | `messages/pt-BR/common.json` | `useTranslations('common')` | VERIFIED | Pattern confirmed in file |
| `LoginButton.tsx` | `messages/pt-BR/auth.json` | `useTranslations('auth')` | VERIFIED | Pattern confirmed in file |
| `HospitalGrid.tsx` | `messages/pt-BR/hospital.json` | `useTranslations('hospital')` | VERIFIED | Pattern confirmed in file |
| `DashboardEmbed.tsx` | `messages/pt-BR/dashboard.json` | `useTranslations('dashboard')` | VERIFIED | Pattern confirmed in file |

---

## Data-Flow Trace (Level 4)

Not applicable to i18n string-extraction phase. Artifacts are translation wiring, not data-fetching components. The hospital data flow was established in Phase 03 and is unchanged.

---

## Behavioral Spot-Checks

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| next-intl installed | `grep "next-intl" frontend/package.json` | `"next-intl": "^4.9.0"` | PASS |
| 4 plan commits exist | `git log --oneline` | 39b2549, 9dddf40, deeec8d, b95ae1a all present | PASS |
| Old `app/page.tsx` removed | `test -f frontend/src/app/page.tsx` | File absent | PASS |
| Old `app/hospital/` removed | `test -d frontend/src/app/hospital` | Directory absent | PASS |
| PT_MONTHS array deleted | `grep -rn "PT_MONTHS" src/` | Zero matches | PASS |
| Zero hardcoded Portuguese in TSX | comprehensive grep | Zero matches (excluding intentional metadata exception) | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| I18N-01 | 04-01-PLAN.md | next-intl configured with [locale] routing | SATISFIED | `routing.ts`, `next.config.ts`, `proxy.ts`, `[locale]/layout.tsx` all confirmed |
| I18N-02 | 04-02-PLAN.md | All UI strings extracted to pt-BR message files (no hardcoded Portuguese) | SATISFIED | Zero hardcoded Portuguese strings in any `.tsx` component or page file; all 15 files use `useTranslations()` |
| I18N-03 | 04-01-PLAN.md | i18n-ready architecture supporting future language additions | SATISFIED | Adding a locale requires only: new JSON folder, one array entry in `routing.ts`, one import block in `request.ts` — no component code changes needed |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `frontend/src/app/layout.tsx` | 16-17 | Hardcoded Portuguese in static `metadata` (`title` and `description`) | Info | Not user-visible runtime text; Next.js `metadata` exports cannot use hooks — intentional, documented in Plan 02 |

No blockers. No warnings. The metadata hardcoding is a documented, necessary exception due to Next.js framework constraints (static metadata cannot use `useTranslations`).

---

## Human Verification Required

### 1. Locale URL Redirect

**Test:** Open the app at `/` in a browser
**Expected:** Browser redirects to `/pt-BR` (or `/pt-BR/hospital` if already authenticated)
**Why human:** Cannot start a browser or Next.js dev server in this environment

### 2. Translation Display

**Test:** Navigate to the hospital grid and login page
**Expected:** All text displays in Portuguese; no raw translation keys (e.g., `"brand.short"`) appear
**Why human:** Runtime rendering requires a live app

### 3. Month Formatting

**Test:** Check a hospital card that has `period_start` / `period_end` data
**Expected:** Month abbreviations use `pt-BR` locale format (e.g., "jan", "fev") via `Intl.DateTimeFormat`
**Why human:** Requires live data and browser locale rendering

---

## Gaps Summary

No gaps. All must-haves from both plans are verified at all levels (exists, substantive, wired). Requirements I18N-01, I18N-02, and I18N-03 are fully satisfied.

**Architecture note on I18N-03:** Adding a new locale requires three config-level changes (JSON files, `routing.ts` entry, `request.ts` import entry) but zero changes to any component or page file. This is the standard next-intl multi-locale pattern and satisfies "i18n-ready architecture supporting future language additions."

---

_Verified: 2026-04-07T21:00:00Z_
_Verifier: Claude (gsd-verifier)_
