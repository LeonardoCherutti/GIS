---
phase: 03-core-ui
plan: 01
subsystem: data-seed, csp
tags: [migration, seed-data, cnes, logos, csp, power-bi]
dependency_graph:
  requires: [api/migrations/003_seed_hospitals.sql, frontend/next.config.ts]
  provides: [real-cnes-codes, hospital-logos, csp-frame-src]
  affects: [hospital-grid, power-bi-iframe]
tech_stack:
  added: []
  patterns: [sql-migration-update, csp-headers]
key_files:
  created:
    - api/migrations/004_update_hospital_seed.up.sql
    - api/migrations/004_update_hospital_seed.down.sql
    - frontend/public/logos/CenterClinicas.png
    - frontend/public/logos/Florianopolis.png
    - frontend/public/logos/NT.png
    - frontend/public/logos/CARIRI.png
    - frontend/public/logos/hsa.png
    - frontend/public/logos/zilda_arnss.png
    - frontend/public/logos/CanoasDasGracas.png
    - frontend/public/logos/hcl.png
  modified:
    - frontend/next.config.ts
decisions:
  - "Hospital logos stored as static assets in frontend/public/logos/ with accent-free filenames"
  - "4 hospitals without logos get NULL logo_url (fallback icon handled by UI)"
metrics:
  duration: 2min
  completed: "2026-04-07"
  tasks: 2
  files: 11
---

# Phase 03 Plan 01: Seed Data Fix + CSP Headers Summary

Real CNES codes, period dates, and logo images for all 12 hospitals via migration 004, plus CSP frame-src header enabling Power BI iframe embedding.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Copy hospital logos and create seed update migration | f67e228 | 004_update_hospital_seed.up.sql, 004_update_hospital_seed.down.sql, 8 logo PNGs |
| 2 | Add CSP frame-src header for Power BI | 0707e82 | frontend/next.config.ts |

## What Was Done

### Task 1: Seed Data and Logos
- Created migration 004 with UPDATE statements for all 12 hospitals
- Updated placeholder CNES codes (0000001-0000012) to real codes from original portal
- Added period_start and period_end dates for each hospital
- Set logo_url for 8 hospitals that have logos; 4 remain NULL for fallback icon
- Corrected Hospital 10 name from "Nsa. Sra. do Perpetuo Socorro" to "Hospital do Rocio"
- Copied 8 logo PNG files from imagens/ to frontend/public/logos/ with accent-free filenames
- Created reversible down migration

### Task 2: CSP Headers
- Added Content-Security-Policy header with frame-src allowing app.powerbi.com
- Preserved existing Cross-Origin-Opener-Policy header for Google OAuth popup

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all data is real, sourced from original portal.

## Self-Check: PASSED

All 11 files verified present. Both commits (f67e228, 0707e82) verified in git log.
