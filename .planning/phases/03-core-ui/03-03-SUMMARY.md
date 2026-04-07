---
phase: 03-core-ui
plan: 03
subsystem: frontend/hospital-grid
tags: [components, grid, search, pagination, skeleton]
dependency_graph:
  requires: [03-02]
  provides: [HospitalCard, HospitalCardSkeleton, HospitalGrid, SearchInput, Pagination]
  affects: [frontend/src/app/hospital/page.tsx]
tech_stack:
  added: []
  patterns: [client-side-filter, client-side-pagination, skeleton-loading, pt-BR-date-formatting]
key_files:
  created:
    - frontend/src/components/hospital/HospitalCard.tsx
    - frontend/src/components/hospital/HospitalCardSkeleton.tsx
    - frontend/src/components/hospital/HospitalGrid.tsx
    - frontend/src/components/hospital/SearchInput.tsx
    - frontend/src/components/hospital/Pagination.tsx
    - frontend/src/types/hospital.ts
  modified:
    - frontend/src/app/hospital/page.tsx
decisions:
  - Shared Hospital interface extracted to types/hospital.ts for reuse across components
  - Used unoptimized Image prop for local logos to avoid Next.js image optimization overhead on small icons
metrics:
  duration: 2min
  completed: "2026-04-07T20:00:20Z"
  tasks: 2
  files: 7
---

# Phase 03 Plan 03: Hospital Card Grid Summary

Hospital card grid with search filter, skeleton loading, pagination, and pt-BR period formatting using 5 reusable components.

## Tasks Completed

### Task 1: Create HospitalCard, HospitalCardSkeleton, SearchInput, and Pagination components
**Commit:** 897e354

- HospitalCard: shadcn Card with left primary border accent, logo circle (Image or Building2 fallback), hospital name, CNES code, and period range formatted as "jan/2021 - abr/2025" in pt-BR
- HospitalCardSkeleton: matching card shape with Skeleton shimmer placeholders for logo, name, CNES, and period
- SearchInput: controlled input with Search icon overlay, max-w-md, placeholder "Buscar por nome ou CNES..."
- Pagination: chevron prev/next, up to 5 page buttons with ellipsis, hides when totalPages <= 1

### Task 2: Create HospitalGrid orchestrator and refactor hospital page
**Commit:** 5264527

- HospitalGrid: 'use client' component orchestrating fetch, search filter (useMemo), pagination (PAGE_SIZE=9), skeleton loading, and empty state
- Hospital page refactored to thin wrapper importing HospitalGrid
- Shared Hospital interface extracted to frontend/src/types/hospital.ts
- Responsive grid: grid-cols-1 / md:grid-cols-2 / lg:grid-cols-3

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all components are fully wired to real data sources via apiFetch('/hospitals').

## Verification

- Build passes: `npx next build` exits 0
- All acceptance criteria verified for both tasks
- Responsive grid classes present in HospitalGrid
- Search filters by name and CNES (client-side useMemo)
- Skeleton loading shown during fetch
- Pagination renders when totalPages > 1

## Decisions Made

1. **Shared Hospital type file** - Extracted interface to `frontend/src/types/hospital.ts` rather than duplicating in HospitalGrid, enabling reuse across dashboard and other components.
2. **unoptimized Image prop** - Used `unoptimized` for logo images since they are small local files in public/logos/ and do not benefit from Next.js image optimization pipeline.

## Self-Check: PASSED

- All 7 created/modified files verified on disk
- Both task commits (897e354, 5264527) verified in git log
