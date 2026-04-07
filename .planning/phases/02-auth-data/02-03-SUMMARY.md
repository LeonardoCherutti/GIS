---
phase: 02-auth-data
plan: 03
subsystem: frontend-navigation
tags: [spa-navigation, auth-guard, hospital-grid, dashboard-page, routing]
dependency_graph:
  requires: [02-01, 02-02]
  provides: [AuthGuard, hospital-grid-page, dashboard-page, auth-redirect]
  affects: [frontend/src/app/page.tsx, frontend/src/app/hospital/page.tsx, frontend/src/app/hospital/[cnes]/page.tsx, frontend/src/components/auth/AuthGuard.tsx]
tech_stack:
  added: []
  patterns: [auth-guard-wrapper, client-side-routing, use-hook-for-params]
key_files:
  created:
    - frontend/src/components/auth/AuthGuard.tsx
    - frontend/src/app/hospital/page.tsx
    - frontend/src/app/hospital/[cnes]/page.tsx
  modified:
    - frontend/src/app/page.tsx
decisions:
  - Used React `use()` hook for dynamic route params (Next.js async params API)
  - Fetch all hospitals and filter client-side for dashboard page (dedicated endpoint deferred to Phase 3)
  - Power BI iframe is a placeholder div (Phase 3 adds actual iframe with CSP)
metrics:
  duration: 2min
  completed: "2026-04-07T19:32:07Z"
  tasks_completed: 2
  files_changed: 4
---

# Phase 02 Plan 03: SPA Navigation Summary

SPA navigation with AuthGuard protecting routes, hospital grid fetched from Go API via proxy, and dashboard page displaying hospital info by CNES from URL.

## What Was Built

### AuthGuard Component
Reusable client component wrapping protected routes. Checks `isAuthenticated` from `useAuth()`, redirects unauthenticated users to `/`, shows loading spinner during auth check.

### Hospital Grid Page (`/hospital`)
Protected page that fetches hospital list from Go API via `apiFetch('/hospitals')`. Renders a responsive card grid (1/2/3 columns). Each card links to `/hospital/{cnes}`. Header shows user name and logout button.

### Dashboard Page (`/hospital/[cnes]`)
Protected page that reads CNES from URL params using React `use()` hook (Next.js async params). Fetches all hospitals and filters by CNES client-side. Shows Power BI URL placeholder div or "Dashboard nao configurado" message. Back link to grid.

### Root Page Update (`/`)
Added `useEffect` redirect: authenticated users are pushed to `/hospital`. Unauthenticated users see the login card with GIS branding and Google OAuth button.

## Task Completion

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | AuthGuard, hospital grid, dashboard, root redirect | 30e80ab | AuthGuard.tsx, hospital/page.tsx, [cnes]/page.tsx, page.tsx |
| 2 | Verify full auth flow (checkpoint) | auto-approved (autonomous mode) | none |

## Deviations from Plan

None - plan executed exactly as written.

## Checkpoint: Human Verification

Task 2 was a `checkpoint:human-verify` gate. Auto-approved in autonomous mode. The build verification (`npx next build`) succeeded with all routes registered correctly.

## Known Stubs

1. **Power BI iframe placeholder** - `frontend/src/app/hospital/[cnes]/page.tsx` line ~128: Shows "Dashboard Power BI sera exibido aqui" text instead of actual iframe. **Intentional** - Phase 3 adds the actual iframe with CSP headers, loading indicator, and fullscreen support.

2. **Hospital fetch in dashboard** - `frontend/src/app/hospital/[cnes]/page.tsx`: Fetches all hospitals and filters client-side. **Intentional** - dedicated `/hospitals/{cnes}` endpoint is Phase 3 scope.

## Verification Results

- All 11 acceptance criteria passed (grep checks)
- `npx next build` exits 0
- Routes registered: `/`, `/hospital` (static), `/hospital/[cnes]` (dynamic)

## Self-Check: PASSED

All 4 created/modified files verified on disk. Commit 30e80ab found in git log.
