---
phase: 02-auth-data
plan: 01
subsystem: api-auth-data
tags: [go, auth, jwt, google-oauth, middleware, hospital-api]
dependency_graph:
  requires: [01-01, 01-02, 01-03]
  provides: [auth-service, auth-middleware, hospital-endpoint, auth-config]
  affects: [02-02, 02-03]
tech_stack:
  added: [google.golang.org/api/idtoken, github.com/golang-jwt/jwt/v5]
  patterns: [service-layer, repository-pattern, chi-middleware-group, jwt-bearer-auth]
key_files:
  created:
    - api/internal/model/auth.go
    - api/internal/model/hospital.go
    - api/internal/handler/response.go
    - api/internal/handler/auth.go
    - api/internal/handler/hospital.go
    - api/internal/service/auth.go
    - api/internal/service/hospital.go
    - api/internal/repository/hospital.go
    - api/internal/middleware/auth.go
  modified:
    - api/internal/config/config.go
    - api/internal/router/router.go
    - api/cmd/api/main.go
    - api/go.mod
    - api/go.sum
    - docker-compose.yml
    - .env.example
decisions:
  - Google ID token verified server-side via idtoken.Validate before JWT issuance
  - JWT signed with HS256, 24h expiry, dev default secret provided
  - Email whitelist checks both exact email and domain match (case-insensitive)
  - Hospital query uses LEFT JOIN to dashboard_configs for PowerBI embed URL
  - Chi middleware group separates public and protected routes
metrics:
  duration: 3m28s
  completed: "2026-04-07T19:24:49Z"
  tasks: 2
  files_created: 9
  files_modified: 7
requirements: [AUTH-02, AUTH-06, AUTH-07]
---

# Phase 02 Plan 01: Go API Auth + Hospital Endpoints Summary

Go API with Google ID token verification, email/domain whitelist, JWT session issuance, Bearer auth middleware, and hospital data endpoint with dashboard_configs LEFT JOIN -- all wired through chi router with public and protected route groups.

## What Was Built

### Auth Layer (Task 1)
- **Config**: Extended with GoogleClientID, JWTSecret, AllowedEmails, AllowedDomains from env vars
- **Models**: AuthUser, LoginRequest, LoginResponse, Hospital (with PowerBI URL from JOIN)
- **Auth Service**: Google ID token verification via idtoken.Validate, email/domain whitelist check, JWT creation with HS256
- **Auth Handler**: POST /api/auth/login -- decodes LoginRequest, calls VerifyAndLogin, returns token + user
- **Auth Middleware**: Extracts Bearer token, validates JWT, stores email in context, rejects with 401
- **Response Helpers**: writeJSON and writeError for consistent JSON responses

### Hospital Layer + Wiring (Task 2)
- **Hospital Repository**: SQL query with LEFT JOIN dashboard_configs for embed_url as PowerBIURL
- **Hospital Service**: Delegates to repository FindAllActive
- **Hospital Handler**: GET /api/hospitals -- returns all active hospitals with dashboard URLs
- **Router**: Public routes (health, auth/login) and protected group (hospitals) behind JWT middleware
- **Main**: Passes config pointer to router constructor
- **Docker/Env**: Auth env vars added to docker-compose.yml and .env.example

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 7d0e760 | Auth layer: config, models, auth service, handler, middleware, response helpers |
| 2 | d33d716 | Hospital layer, router wiring, env config updates |

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None -- all code paths are fully wired. Auth service calls real Google idtoken.Validate. Hospital repository queries real database.

## Verification

- `cd api && go build ./...` exits 0 (both tasks verified)
- Router wires POST /api/auth/login (public) and GET /api/hospitals (protected)
- Auth middleware validates Bearer JWT on protected routes
- Config loads all auth env vars with proper defaults
- docker-compose.yml passes auth env vars to api and frontend services

## Self-Check: PASSED

All 14 created/modified files verified present. Both commit hashes (7d0e760, d33d716) verified in git log.
