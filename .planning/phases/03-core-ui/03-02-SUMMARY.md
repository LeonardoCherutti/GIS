---
phase: 03-core-ui
plan: 02
subsystem: layout
tags: [header, footer, theme-toggle, user-menu, layout, shadcn]
dependency_graph:
  requires: [AuthContext, palette.css, globals.css, shadcn-button]
  provides: [AppHeader, AppFooter, ThemeToggle, UserMenu, hospital-layout]
  affects: [hospital/page.tsx, hospital/[cnes]/page.tsx]
tech_stack:
  added: [shadcn-avatar, shadcn-dropdown-menu, shadcn-input, lucide-react-icons]
  patterns: [shared-layout, useTheme-toggle, auth-guard-in-layout]
key_files:
  created:
    - frontend/src/components/layout/ThemeToggle.tsx
    - frontend/src/components/layout/UserMenu.tsx
    - frontend/src/components/layout/AppHeader.tsx
    - frontend/src/components/layout/AppFooter.tsx
    - frontend/src/app/hospital/layout.tsx
    - frontend/src/components/ui/avatar.tsx
    - frontend/src/components/ui/dropdown-menu.tsx
    - frontend/src/components/ui/input.tsx
  modified:
    - frontend/src/app/hospital/page.tsx
    - frontend/src/app/hospital/[cnes]/page.tsx
decisions:
  - Shared hospital layout wraps AuthGuard, AppHeader, AppFooter to eliminate per-page duplication
  - UserMenu uses shadcn DropdownMenu with avatar trigger and logout action
  - ThemeToggle uses shadcn Button ghost variant with lucide Sun/Moon icons
  - Text-based logo with Building2 icon (image logo deferred)
metrics:
  duration: 3min
  completed: "2026-04-07T19:55:02Z"
  tasks: 2
  files_created: 8
  files_modified: 2
---

# Phase 03 Plan 02: Shared Layout Components Summary

Shared layout system with global header (logo, user profile, dark mode toggle, logout), global footer (company branding), and hospital route layout wrapping all authenticated pages via AuthGuard.

## What Was Done

### Task 1: Install shadcn components and create layout components
**Commit:** `109b251`

Installed shadcn avatar, dropdown-menu, and input components. Created four layout components:
- **ThemeToggle**: Uses `useTheme` from next-themes with Sun/Moon lucide icons and shadcn Button ghost variant
- **UserMenu**: Shows Google avatar via shadcn Avatar, dropdown with user name/email and logout action using shadcn DropdownMenu
- **AppHeader**: Flex row with Building2 icon + "G.I.S." logo text + subtitle on left, ThemeToggle + UserMenu on right, themed with Tailwind palette colors
- **AppFooter**: Centered company branding text with copyright year, themed background and border

### Task 2: Create hospital route layout and refactor pages
**Commit:** `ff3fea7`

Created `hospital/layout.tsx` that wraps all hospital routes with AuthGuard, AppHeader, and AppFooter in a min-h-screen flex column. Refactored both hospital pages:
- **hospital/page.tsx**: Removed AuthGuard wrapper, inline header, handleLogout function, and outer min-h-screen div. Now renders only the grid content.
- **hospital/[cnes]/page.tsx**: Removed AuthGuard wrapper, inline header, and outer min-h-screen div. Added simple back link with ArrowLeft icon and hospital name at top of content area.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `next build` exits 0 with no errors
- All acceptance criteria verified programmatically
- AppHeader renders ThemeToggle and UserMenu
- hospital/layout.tsx wraps with AuthGuard + AppHeader + AppFooter
- hospital/page.tsx has no inline header or AuthGuard
- hospital/[cnes]/page.tsx has no inline header or AuthGuard

## Known Stubs

None - all components are fully wired to their data sources (AuthContext for user data, next-themes for theme state).

## Self-Check: PASSED

- All 8 created files verified on disk
- Both commit hashes (109b251, ff3fea7) verified in git log
