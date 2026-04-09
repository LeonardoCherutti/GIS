---
phase: 05-rbac
plan: 03
subsystem: admin-crud-api
tags: [admin, crud, api, user-management, hospital-access]
dependency_graph:
  requires: [user-service, user-repo, require-admin-middleware, admin-route-group]
  provides: [admin-list-users-endpoint, admin-create-user-endpoint, admin-update-hospitals-endpoint, admin-delete-user-endpoint]
  affects: [router, admin-ui]
tech_stack:
  added: []
  patterns: [handler-service-repo, chi-url-params, pgx-error-detection]
key_files:
  created:
    - api/internal/handler/admin.go
  modified:
    - api/internal/router/router.go
decisions:
  - "Detect duplicate user via pgx PgError code 23505 for 409 conflict response"
  - "Portuguese error messages consistent with existing handler patterns"
metrics:
  duration: 1min
  completed: "2026-04-09"
  tasks: 2
  files: 2
---

# Phase 5 Plan 3: Admin CRUD API Endpoints Summary

AdminHandler with 4 CRUD endpoints (list users, create manager, update hospital access, delete user) wired into router under RequireAdmin middleware, with pgx unique constraint detection for conflict responses.

## Task Summary

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create AdminHandler with CRUD endpoints | 39e7b83 | api/internal/handler/admin.go |
| 2 | Wire admin handler into router admin route group | 036d30e | api/internal/router/router.go |

## What Was Built

### AdminHandler (api/internal/handler/admin.go)
- `ListUsers` -- GET /api/admin/users: returns all users with hospital assignments via UserService.ListUsers
- `CreateUser` -- POST /api/admin/users: decodes CreateUserRequest, validates email not empty, creates manager via UserService.CreateManager, returns 201 on success, 409 on duplicate (pgx error code 23505)
- `UpdateHospitals` -- PUT /api/admin/users/{id}/hospitals: extracts user ID from URL param, decodes UpdateHospitalsRequest, delegates to UserService.UpdateHospitalAccess
- `DeleteUser` -- DELETE /api/admin/users/{id}: extracts user ID from URL param, delegates to UserService.DeleteUser
- All error messages in Portuguese, consistent with existing handler patterns

### Router Wiring (api/internal/router/router.go)
- Replaced `_ = service.NewUserService(userRepo)` placeholder with `userService` assignment
- Created `adminHandler := handler.NewAdminHandler(userService)`
- Registered all 4 admin routes inside the Auth + RequireAdmin middleware group
- Removed Plan 03 placeholder comments

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Detect duplicate via pgx PgError code 23505 | Postgres unique constraint on users.email; avoids separate existence check query |
| Portuguese error messages | Consistent with auth.go and hospital.go handler patterns |

## Known Stubs

None -- all endpoints are fully wired to UserService which delegates to UserRepo with real SQL.

## Verification Results

- `go build ./...` compiles cleanly (exit 0)
- Router has 4 admin endpoints under RequireAdmin middleware
- AdminHandler delegates to UserService for all operations
- All acceptance criteria met for both tasks

## Self-Check: PASSED

- api/internal/handler/admin.go exists on disk
- Commit 39e7b83 found in git log
- Commit 036d30e found in git log
- `go build ./...` exits 0
