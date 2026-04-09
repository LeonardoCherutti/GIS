---
phase: 05-rbac
plan: 02
subsystem: rbac-auth-middleware
tags: [auth, middleware, jwt, rbac, role-filtering]
dependency_graph:
  requires: [users-table, user-hospitals-table, user-model, user-repo, admin-emails-config]
  provides: [db-driven-auth, role-in-jwt, require-admin-middleware, role-filtered-hospitals, user-service, admin-route-group]
  affects: [login-flow, hospital-list, router]
tech_stack:
  added: []
  patterns: [db-lookup-auth, role-claim-jwt, context-value-middleware, role-branching-handler]
key_files:
  created:
    - api/internal/middleware/admin.go
    - api/internal/service/user.go
  modified:
    - api/internal/service/auth.go
    - api/internal/model/auth.go
    - api/internal/middleware/auth.go
    - api/internal/repository/hospital.go
    - api/internal/service/hospital.go
    - api/internal/handler/hospital.go
    - api/internal/router/router.go
decisions:
  - "isAdminEmail replaces isAllowed -- DB lookup first, admin auto-seed fallback"
  - "UserService created in Plan 02 (not Plan 03) to satisfy router compilation"
  - "Admin route group created empty -- endpoints wired in Plan 03"
metrics:
  duration: 3min
  completed: "2026-04-09"
  tasks: 2
  files: 9
---

# Phase 5 Plan 2: Auth Service Refactor, Role JWT, Middleware, and Hospital Filtering Summary

DB-driven auth replacing env-var allowlist: login checks users table, admin emails auto-seed on first login, unregistered users get 403 with Portuguese message, JWT includes role claim, auth middleware extracts role into context, RequireAdmin middleware blocks non-admins, hospital list endpoint returns role-filtered results.

## Task Summary

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Refactor auth service, models, and middleware for role-based auth | 7aadb8e | auth.go (service), auth.go (model), auth.go (middleware), admin.go |
| 2 | Update hospital handler/service/repo for role-based filtering and wire router | d795e60 | hospital.go (handler/service/repo), router.go, user.go (service) |

## What Was Built

### Auth Service Refactor (api/internal/service/auth.go)
- Constructor now accepts `*repository.UserRepo` in addition to `*config.Config`
- `VerifyAndLogin` does DB lookup via `userRepo.FindByEmail` instead of env-var check
- Unknown emails in `AdminEmails` config auto-seed as admin users via `userRepo.Upsert`
- Unregistered non-admin emails return: "Acesso negado. Contate o administrador."
- Existing users get name/picture updated from Google profile on each login
- `isAllowed()` removed entirely, replaced by `isAdminEmail()` for admin auto-seed only
- JWT now includes `role` claim from the user's DB record

### Auth Model Update (api/internal/model/auth.go)
- `AuthUser` struct now includes `Role string` field
- `LoginResponse` carries role through to frontend

### Auth Middleware Update (api/internal/middleware/auth.go)
- Added `UserRoleKey` context key constant
- Auth middleware extracts `role` from JWT claims and injects into request context

### RequireAdmin Middleware (api/internal/middleware/admin.go)
- New middleware that checks `UserRoleKey` context value
- Returns 403 with "Acesso restrito a administradores" for non-admin users

### Hospital Role-Based Filtering
- `FindByUserAccess(ctx, email)` in hospital repo: INNER JOIN on user_hospitals + users tables
- `ListByUserAccess(ctx, email)` in hospital service delegates to repo
- Hospital handler branches: `role == "admin"` gets all hospitals, managers get filtered list

### Router Wiring (api/internal/router/router.go)
- `NewUserRepo(pool)` instantiated alongside hospitalRepo
- `NewAuthService(cfg, userRepo)` -- two-arg constructor
- `NewUserService(userRepo)` created (used by admin handler in Plan 03)
- Admin route group with `Auth` + `RequireAdmin` middleware chain (endpoints in Plan 03)

### UserService (api/internal/service/user.go)
- Wraps UserRepo methods: ListUsers, CreateManager, UpdateHospitalAccess, DeleteUser
- Ready for Plan 03 admin handler wiring

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| isAdminEmail replaces isAllowed | DB lookup is primary auth check; admin email list only used for auto-seeding new admin users |
| UserService created in Plan 02 | Router needs it for compilation even though admin handler endpoints come in Plan 03 |
| Admin route group created empty | Establishes middleware chain now; Plan 03 adds the actual endpoints |

## Known Stubs

None -- all data flows are wired. The admin route group has no endpoints yet, which is intentional and will be filled in Plan 03.

## Verification Results

- `go build ./...` compiles cleanly
- No references to `isAllowed` or `AllowedEmails` remain in auth service
- `RequireAdmin` middleware returns 403 for non-admin role
- Hospital handler branches on role for list queries
- JWT includes role claim in VerifyAndLogin

## Self-Check: PASSED

- All created/modified files exist on disk
- Commits 7aadb8e and d795e60 found in git log
- `go build ./...` exits 0
