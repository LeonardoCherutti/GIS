---
phase: quick
plan: 260407-pp2
subsystem: deployment
tags: [docker, oauth, build-args, next.js]
dependency_graph:
  requires: []
  provides: [google-oauth-build-arg]
  affects: [frontend-docker-build, google-oauth-login]
tech_stack:
  added: []
  patterns: [docker-build-args-for-nextjs-public-env]
key_files:
  created: []
  modified:
    - frontend/Dockerfile
    - docker-compose.yml
decisions:
  - Use ARG+ENV pattern in Dockerfile to inject NEXT_PUBLIC vars at build time
metrics:
  duration: 1min
  completed: "2026-04-07T21:32:00Z"
  tasks_completed: 1
  tasks_total: 1
---

# Quick Plan 260407-pp2: Fix Google OAuth Client ID Missing at Docker Build Summary

**One-liner:** Pass NEXT_PUBLIC_GOOGLE_CLIENT_ID as Docker build arg so Next.js inlines it during static build

## What Was Done

### Task 1: Pass NEXT_PUBLIC_GOOGLE_CLIENT_ID as build arg through Dockerfile and docker-compose.yml

- Added `ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `frontend/Dockerfile` between `COPY . .` and `RUN npm run build`
- Added `args:` block under the frontend service's `build:` section in `docker-compose.yml` with `NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-}`
- Verified ARG/ENV lines appear before the build step (lines 6-7 vs line 8)

**Commit:** `4545f52` fix(260407-pp2): pass NEXT_PUBLIC_GOOGLE_CLIENT_ID as Docker build arg

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| ARG+ENV pattern before RUN npm run build | Next.js replaces NEXT_PUBLIC_* at build time via string substitution; ARG alone would not set the env var for the build process |

## Known Stubs

None.

## Verification Results

- `grep -n` confirms ARG (line 6), ENV (line 7) before RUN npm run build (line 8) in Dockerfile
- `grep -A2 "args:"` confirms NEXT_PUBLIC_GOOGLE_CLIENT_ID in docker-compose.yml build args

## Self-Check: PASSED
