---
phase: 05-rbac
plan: 01
subsystem: rbac-foundation
tags: [database, models, repository, config]
dependency_graph:
  requires: []
  provides: [users-table, user-hospitals-table, user-model, user-repo, admin-emails-config]
  affects: [auth-service, docker-compose]
tech_stack:
  added: []
  patterns: [upsert-with-coalesce, transactional-junction-update, nullable-fields-for-deferred-population]
key_files:
  created:
    - api/migrations/005_create_users.up.sql
    - api/migrations/005_create_users.down.sql
    - api/internal/model/user.go
    - api/internal/repository/user.go
  modified:
    - api/internal/config/config.go
    - api/internal/service/auth.go
    - docker-compose.yml
decisions:
  - "Name/Picture as *string (nullable) for pre-login manager accounts created by admins"
  - "COALESCE in upsert prevents blanking existing name/picture on re-login"
  - "AdminEmails replaces AllowedEmails+AllowedDomains -- single field, DB-driven users come in 05-02"
metrics:
  duration: 2min
  completed: "2026-04-09"
  tasks: 2
  files: 7
---

# Phase 5 Plan 1: RBAC Database Schema, Models, and User Repository Summary

RBAC foundation: users + user_hospitals tables with CHECK constraint, User/UserWithHospitals Go models with nullable name/picture, UserRepo with 6 CRUD methods including upsert-with-COALESCE, config migrated from AllowedEmails/AllowedDomains to AdminEmails.

## Task Summary

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create RBAC database migration and Go models | e123a4c | 005_create_users.up.sql, 005_create_users.down.sql, user.go (model) |
| 2 | Create UserRepo, update Config, update docker-compose.yml | 1bc5f71 | user.go (repo), config.go, auth.go, docker-compose.yml |

## What Was Built

### Database Migration (005_create_users)
- `users` table: UUID PK, email (UNIQUE), name, picture, role with CHECK constraint ('admin'/'manager'), timestamps
- `user_hospitals` junction table: composite PK (user_id, hospital_id), CASCADE deletes on both FKs
- Indexes on both columns of user_hospitals for efficient lookups

### Go Models (api/internal/model/user.go)
- `User` struct with nullable Name/Picture (*string) for pre-login manager accounts
- `UserWithHospitals` embedding User with Hospital slice for admin listing
- `CreateUserRequest` and `UpdateHospitalsRequest` for API input validation

### User Repository (api/internal/repository/user.go)
- `FindByEmail` -- returns nil, nil when not found (not an error)
- `Upsert` -- INSERT ON CONFLICT with COALESCE to preserve existing name/picture
- `CreateManager` -- email-only insert with role='manager'
- `ListAll` -- LEFT JOIN across users, user_hospitals, hospitals; groups in Go via ordered map
- `UpdateHospitalAccess` -- transactional delete+insert for hospital assignments
- `Delete` -- simple DELETE with CASCADE handling junction table

### Config Migration
- Removed `AllowedEmails []string` and `AllowedDomains []string` from Config struct
- Added `AdminEmails []string` reading from `ADMIN_EMAILS` env var
- Docker Compose updated: `ALLOWED_EMAILS` and `ALLOWED_DOMAINS` replaced with `ADMIN_EMAILS`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated auth.go isAllowed to use AdminEmails**
- **Found during:** Task 2
- **Issue:** Removing AllowedEmails/AllowedDomains from config.Config broke api/internal/service/auth.go which referenced those fields. Build would not compile.
- **Fix:** Updated isAllowed() to iterate cfg.AdminEmails instead. Removed domain-based check (domains not relevant for admin-only allowlist). Added TODO comment for plan 05-02 to wire DB-driven user lookup.
- **Files modified:** api/internal/service/auth.go
- **Commit:** 1bc5f71

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Nullable Name/Picture (*string) | Managers created by admins have email only; name/picture populate on first Google login |
| COALESCE in upsert | Prevents blanking existing profile data when admin re-authenticates |
| AdminEmails replaces both AllowedEmails and AllowedDomains | Simplifies to single field; full DB-driven auth comes in plan 05-02 |

## Known Stubs

None -- all data flows are wired. The auth.go TODO for DB-driven user lookup is intentional and will be resolved in plan 05-02.

## Verification Results

- `grep -c "func.*UserRepo" api/internal/repository/user.go` = 7 (constructor + 6 methods)
- Migration SQL has valid CREATE TABLE, indexes, and constraints
- No references to AllowedEmails or AllowedDomains remain in config.go or docker-compose.yml
- `cd api && go build ./...` passes cleanly
