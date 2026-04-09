# Phase 5: Role-Based Access Control (RBAC) - Research

**Researched:** 2026-04-09
**Domain:** Authorization, database schema design, admin UI, role-based filtering
**Confidence:** HIGH

## Summary

This phase replaces the current env-var-driven email allowlist (`ALLOWED_EMAILS`, `ALLOWED_DOMAINS`) with a database-driven user/role system. Two roles exist: Admin and Manager. The implementation touches all three layers: Postgres schema (new `users` and `user_hospitals` tables), Go API (new admin endpoints, modified auth flow, authorization middleware), and Next.js frontend (new `/admin` page, role-aware AuthContext, AdminGuard component).

The existing codebase follows a clean handler-service-repository pattern in Go and a Context-provider pattern in Next.js. Both patterns extend naturally to support RBAC without architectural changes. The primary complexity lies in the auth service migration (env-var check to DB lookup) and ensuring the admin seeding via `ADMIN_EMAILS` works on first login.

**Primary recommendation:** Implement in three waves: (1) DB schema + migration + Go models, (2) API endpoints + auth refactor + middleware, (3) Frontend admin page + role-aware filtering.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Dedicated `/admin` route with a user list table. Only visible to admin-role users.
- **D-02:** Admins can add managers by entering their Google email. Managers are created explicitly by admins -- no self-registration.
- **D-03:** Hospital assignment uses a checkbox list of all hospitals when editing a manager.
- **D-04:** Admin page shows user table with columns: email, role, assigned hospitals (with dropdown to edit).
- **D-05:** New `ADMIN_EMAILS` env var in docker-compose. Emails listed here automatically receive the admin role on first login.
- **D-06:** Admin role is strictly env-var-driven -- admins cannot promote other users to admin via the UI.
- **D-07:** Managers are registered by admins through the admin UI configuration panel.
- **D-08:** Managers see the same hospital grid UI as admins, but only their assigned hospitals appear.
- **D-09:** No admin menu, admin route, or user management is visible to managers.
- **D-10:** Search/filter functionality still works within the manager's visible hospitals.
- **D-11:** Remove `ALLOWED_EMAILS` and `ALLOWED_DOMAINS` env vars. Replace entirely with DB-driven roles.
- **D-12:** Only users registered in the database (as admin or manager) can log in. Unregistered Google accounts are rejected.
- **D-13:** Login rejection shows clear Portuguese error: "Acesso negado. Contate o administrador."

### Claude's Discretion
- Database schema design (users table, roles, user_hospitals junction table)
- API endpoint structure for admin operations
- Frontend state management for role-based UI rendering
- Migration strategy for existing env-var users to DB records

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

## Standard Stack

### Core (Already in project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| chi/v5 | 5.2.5 | Go HTTP router with middleware groups | Already used; supports route groups for admin-only endpoints |
| pgx/v5 | 5.9.1 | Postgres driver with connection pooling | Already used; handles all DB operations |
| golang-jwt/jwt/v5 | 5.3.1 | JWT creation and validation | Already used; add `role` claim to tokens |
| next-intl | 4.9.0 | i18n for frontend | Already used; admin page needs pt-BR strings |
| @tanstack/react-query | 5.96.2 | Data fetching/caching | Already used; admin API calls follow same pattern |
| @base-ui/react | 1.3.0 | Headless UI components | Already used; checkboxes for hospital assignment |

### No New Dependencies Required

This phase requires zero new libraries. The existing stack covers all needs:
- chi middleware groups for admin route protection
- pgx for new table queries
- JWT for adding role claims
- React context for role state
- Existing `apiFetch` for admin API calls
- Existing `base-ui` components for admin UI forms

## Architecture Patterns

### Database Schema Design

```sql
-- Migration 005_create_users.up.sql
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    name        TEXT,
    picture     TEXT,
    role        TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_hospitals (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, hospital_id)
);

CREATE INDEX IF NOT EXISTS idx_user_hospitals_user ON user_hospitals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hospitals_hospital ON user_hospitals(hospital_id);
```

**Design rationale:**
- `role` as TEXT with CHECK constraint: Only two roles, no need for a separate roles table. CHECK constraint enforces valid values at DB level.
- `user_hospitals` junction table: Standard many-to-many pattern. Composite primary key prevents duplicates. ON DELETE CASCADE cleans up when users or hospitals are removed.
- `email UNIQUE`: Ensures one user record per Google account. Email is the natural key from Google OAuth.
- No `password` field: Auth is exclusively via Google OAuth; users table stores identity + role only.

### Modified Auth Flow

Current flow:
```
Google OAuth -> Go API validates token -> checks ALLOWED_EMAILS/ALLOWED_DOMAINS -> issues JWT -> returns user
```

New flow:
```
Google OAuth -> Go API validates token -> looks up email in users table:
  - Found: issue JWT with role claim -> return user + role
  - Not found but in ADMIN_EMAILS: create user with admin role -> issue JWT -> return user + role
  - Not found: return 403 "Acesso negado. Contate o administrador."
```

### Go API Layer Changes

**New files:**
```
api/internal/
  model/user.go           # User, UserHospital models
  repository/user.go      # UserRepo: FindByEmail, Create, List, UpdateHospitals, Delete
  service/user.go         # UserService: business logic for admin operations
  handler/admin.go        # AdminHandler: CRUD endpoints for user management
  middleware/admin.go      # RequireAdmin middleware (checks role from context)
```

**Modified files:**
```
api/internal/
  config/config.go        # Add AdminEmails field, remove AllowedEmails/AllowedDomains
  service/auth.go         # Replace isAllowed() with DB lookup + auto-seed admin logic
  middleware/auth.go       # Add UserRoleKey to context after JWT validation
  model/auth.go           # Add Role field to AuthUser and LoginResponse
  router/router.go        # Add admin route group with RequireAdmin middleware
  handler/hospital.go     # Pass user email to service for role-based filtering
  service/hospital.go     # Add ListByUserAccess method
  repository/hospital.go  # Add FindByUserAccess query
```

### API Endpoint Structure

```
POST   /api/auth/login           # Modified: returns role in response
GET    /api/hospitals             # Modified: filters by user access (admins see all)

# Admin-only endpoints (behind RequireAdmin middleware)
GET    /api/admin/users           # List all users with their hospital assignments
POST   /api/admin/users           # Create manager (email required, role defaults to manager)
PUT    /api/admin/users/{id}/hospitals  # Update hospital assignments (checkbox list)
DELETE /api/admin/users/{id}      # Remove manager
```

### Frontend Structure

**New files:**
```
frontend/src/
  app/[locale]/admin/
    layout.tsx              # AdminGuard wrapper
    page.tsx                # Admin page with user table
  components/admin/
    UserTable.tsx           # User list table
    HospitalCheckboxList.tsx # Hospital assignment checkboxes
    AddManagerForm.tsx      # Email input to create manager
  components/auth/
    AdminGuard.tsx          # Role-based route guard (redirects non-admins)
  messages/pt-BR/
    admin.json              # Admin UI strings
```

**Modified files:**
```
frontend/src/
  contexts/AuthContext.tsx   # Add role to AuthUser interface and state
  components/layout/AppHeader.tsx  # Show admin link for admin users
```

### Recommended Project Structure (additions only)
```
api/
  migrations/
    005_create_users.up.sql
    005_create_users.down.sql
  internal/
    model/user.go
    repository/user.go
    service/user.go
    handler/admin.go
    middleware/admin.go

frontend/src/
  app/[locale]/admin/
    layout.tsx
    page.tsx
  components/admin/
    UserTable.tsx
    HospitalCheckboxList.tsx
    AddManagerForm.tsx
  components/auth/
    AdminGuard.tsx
```

### Pattern: RequireAdmin Middleware

```go
// api/internal/middleware/admin.go
package middleware

import (
    "encoding/json"
    "net/http"
)

const UserRoleKey contextKey = "user_role"

func RequireAdmin(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        role, _ := r.Context().Value(UserRoleKey).(string)
        if role != "admin" {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusForbidden)
            json.NewEncoder(w).Encode(map[string]string{"error": "Acesso restrito a administradores"})
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

### Pattern: Role in JWT Claims

The existing Auth middleware extracts email from JWT. It must also extract and inject role:

```go
// In middleware/auth.go, after extracting email:
role, _ := claims["role"].(string)
ctx = context.WithValue(ctx, UserRoleKey, role)
```

The auth service must include role in JWT claims:

```go
// In service/auth.go VerifyAndLogin:
token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
    "email":   email,
    "name":    name,
    "picture": picture,
    "sub":     sub,
    "role":    user.Role,  // NEW
    "iat":     now.Unix(),
    "exp":     now.Add(24 * time.Hour).Unix(),
})
```

### Pattern: AdminGuard Component

```tsx
// frontend/src/components/auth/AdminGuard.tsx
'use client'
import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/') // redirect non-admins to home
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || user?.role !== 'admin') return null
  return <>{children}</>
}
```

### Pattern: Hospital Filtering by Role

The hospital handler needs the user's email and role to decide what to return:

```go
// handler/hospital.go
func (h *HospitalHandler) List(w http.ResponseWriter, r *http.Request) {
    email, _ := r.Context().Value(middleware.UserEmailKey).(string)
    role, _ := r.Context().Value(middleware.UserRoleKey).(string)

    var hospitals []model.Hospital
    var err error
    if role == "admin" {
        hospitals, err = h.service.ListActive(r.Context())
    } else {
        hospitals, err = h.service.ListByUserAccess(r.Context(), email)
    }
    // ...
}
```

```sql
-- repository/hospital.go FindByUserAccess query
SELECT h.id, h.name, h.cnes, h.logo_url, h.period_start, h.period_end,
       h.sort_order, h.created_at, dc.embed_url
FROM hospitals h
LEFT JOIN dashboard_configs dc ON dc.hospital_id = h.id AND dc.active = true
INNER JOIN user_hospitals uh ON uh.hospital_id = h.id
INNER JOIN users u ON u.id = uh.user_id AND u.email = $1
WHERE h.active = true
ORDER BY h.sort_order, h.name
```

### Anti-Patterns to Avoid
- **Frontend-only filtering:** Never filter hospitals client-side. The API must return only allowed hospitals for managers. Frontend trusts API response.
- **Role in localStorage only:** Role must come from JWT claims (server-signed), not from a separate client-side store. Parse JWT to extract role for UI decisions.
- **Separate auth endpoints for roles:** Keep a single `/api/auth/login`. The role is returned in the response -- no need for separate admin login.
- **Hardcoding admin check in every handler:** Use `RequireAdmin` middleware on the route group, not per-handler checks.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route protection | Custom auth check in each admin handler | chi middleware group with RequireAdmin | One declaration protects all admin routes |
| Hospital assignment UI | Custom multi-select dropdown | Checkbox list with `base-ui` Checkbox | Simpler, matches D-03 decision |
| JWT role extraction | Second API call to check role | Parse JWT claims on frontend (already done for user info) | Zero extra network calls |
| User deduplication | Manual check-then-insert | `ON CONFLICT (email) DO UPDATE` in upsert | Race-condition-free |

## Common Pitfalls

### Pitfall 1: Admin Seed Race Condition
**What goes wrong:** Two admin-email users log in simultaneously, both see "user not found", both try to INSERT, one fails with unique constraint violation.
**Why it happens:** The check-then-insert pattern without proper handling.
**How to avoid:** Use `INSERT ... ON CONFLICT (email) DO UPDATE SET role = 'admin', name = $2, picture = $3, updated_at = NOW()` for the admin seed flow. This is idempotent.
**Warning signs:** 500 errors on first login for admin users.

### Pitfall 2: Stale JWT After Role Change
**What goes wrong:** Admin removes a manager, but the manager's JWT still has valid claims for hours.
**Why it happens:** JWTs are stateless -- they remain valid until expiry.
**How to avoid:** Accept this tradeoff for v1 (24h token expiry is acceptable). The API hospital endpoint checks DB access on every request, so even with a valid JWT, the manager sees no hospitals after removal. For the admin UI, the middleware could optionally verify the user still exists in DB, but this adds latency.
**Warning signs:** Deleted managers can still see the hospital grid (but with no cards if API filters correctly).

### Pitfall 3: Forgetting to Remove Env Var References
**What goes wrong:** `ALLOWED_EMAILS` and `ALLOWED_DOMAINS` are still read from config, causing confusion about which system is authoritative.
**Why it happens:** Incomplete migration of config.go and docker-compose.yml.
**How to avoid:** Remove `AllowedEmails` and `AllowedDomains` from `config.Config` struct entirely. Remove from docker-compose.yml environment. Add `AdminEmails` in their place.
**Warning signs:** Auth works even without DB users because old allowlist code is still active.

### Pitfall 4: Manager Created But Cannot Login
**What goes wrong:** Admin creates a manager by email, but the manager's Google OAuth fails.
**Why it happens:** The created user record has no `name`, `picture`, or `sub` fields yet -- those come from Google OAuth on first login. The auth flow must handle users that exist in DB but haven't logged in yet.
**How to avoid:** When creating a manager via admin UI, only store email + role. On first login, UPDATE the user's name, picture, and sub from Google OAuth payload.
**Warning signs:** Manager's name shows as null in the admin table until they log in.

### Pitfall 5: Admin Page Accessible via Direct URL
**What goes wrong:** A manager navigates directly to `/pt-BR/admin` and sees the admin page briefly before the guard redirects.
**Why it happens:** Client-side guards show content momentarily during the auth check.
**How to avoid:** AdminGuard returns `null` while loading or if role is not admin (same pattern as existing AuthGuard). The admin layout wraps children in AdminGuard.
**Warning signs:** Flash of admin content before redirect.

## Code Examples

### AuthContext Extension (role field)

```tsx
// In AuthContext.tsx
interface AuthUser {
  email: string
  name: string
  picture: string
  sub: string
  role: 'admin' | 'manager'  // NEW
}

// In parseJwt:
return {
  email: payload.email,
  name: payload.name,
  picture: payload.picture,
  sub: payload.sub,
  role: payload.role ?? 'manager',  // NEW - fallback for old tokens
}
```

### Admin User Creation (API)

```go
// POST /api/admin/users body
type CreateUserRequest struct {
    Email string `json:"email"`
}

// Handler creates user with role='manager', no hospitals assigned yet
func (h *AdminHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "Requisicao invalida")
        return
    }
    user, err := h.service.CreateManager(r.Context(), req.Email)
    if err != nil {
        writeError(w, http.StatusConflict, "Usuario ja existe")
        return
    }
    writeJSON(w, http.StatusCreated, user)
}
```

### Hospital Assignment Update (API)

```go
// PUT /api/admin/users/{id}/hospitals body
type UpdateHospitalsRequest struct {
    HospitalIDs []string `json:"hospital_ids"`
}

// Repository: delete all existing, insert new set (in transaction)
func (r *UserRepo) UpdateHospitalAccess(ctx context.Context, userID string, hospitalIDs []string) error {
    tx, err := r.pool.Begin(ctx)
    if err != nil { return err }
    defer tx.Rollback(ctx)

    _, err = tx.Exec(ctx, "DELETE FROM user_hospitals WHERE user_id = $1", userID)
    if err != nil { return err }

    for _, hID := range hospitalIDs {
        _, err = tx.Exec(ctx, "INSERT INTO user_hospitals (user_id, hospital_id) VALUES ($1, $2)", userID, hID)
        if err != nil { return err }
    }

    return tx.Commit(ctx)
}
```

### Config Change

```go
// config/config.go - replace AllowedEmails/AllowedDomains with AdminEmails
type Config struct {
    Port           string
    DatabaseURL    string
    GoogleClientID string
    JWTSecret      string
    AdminEmails    []string  // NEW - replaces AllowedEmails + AllowedDomains
}
```

### Docker Compose Change

```yaml
# Replace ALLOWED_EMAILS and ALLOWED_DOMAINS with:
- ADMIN_EMAILS=${ADMIN_EMAILS:-}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Env var email allowlist | DB-driven user table with roles | This phase | All auth decisions move to DB |
| All users see all hospitals | Role-based hospital visibility | This phase | Managers see subset |
| No users table | users + user_hospitals tables | This phase | Foundation for future RBAC extensions |

## Open Questions

1. **Existing sessions after migration**
   - What we know: Users currently have JWTs without a `role` claim. After deploying, old JWTs will still be valid for 24h.
   - What's unclear: Should we force re-login or handle gracefully?
   - Recommendation: Handle gracefully. If JWT has no `role` claim, check DB for role. If user not in DB, reject (force re-login). Old tokens expire naturally within 24h.

2. **Admin table: show admins or only managers?**
   - What we know: D-04 says "user table with columns: email, role, assigned hospitals". D-06 says admins are env-var-driven only.
   - What's unclear: Should admins appear in the table as read-only rows?
   - Recommendation: Show admins in the table as read-only rows (no delete button, no hospital assignment -- admins see all). This gives visibility into who has admin access.

3. **Migration of Postgres init scripts**
   - What we know: Current migrations run via `docker-entrypoint-initdb.d` which only executes on first DB creation. The new migration file needs to run on existing databases too.
   - What's unclear: Is there a migration runner, or are migrations applied manually?
   - Recommendation: The Go API should apply migrations on startup (check if `golang-migrate` or manual approach is used). If using init.d only, the new migration must be applied manually on existing deployments. Consider adding a simple migration check to the Go startup.

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Next.js (app router) + Go API + Postgres -- no new frameworks
- **Auth**: Google OAuth popup only -- RBAC is additive, not changing auth method
- **Standards**: Must match `D:\ferreiracontabilidade\app` patterns for components and routing
- **Language**: Portuguese (pt-BR) primary -- all new UI strings in message files
- **Deployment**: Docker Compose -- new `ADMIN_EMAILS` env var added
- **i18n**: All admin UI strings must go in `frontend/src/messages/pt-BR/admin.json`
- **Handler-service-repository pattern**: All new Go code follows this layered architecture
- **UUID primary keys, timestamptz audit columns**: Schema must follow existing conventions

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `api/internal/service/auth.go` -- current allowlist logic
- Codebase inspection: `api/internal/middleware/auth.go` -- current JWT extraction pattern
- Codebase inspection: `api/internal/config/config.go` -- current env var parsing
- Codebase inspection: `api/internal/router/router.go` -- chi router middleware groups
- Codebase inspection: `api/migrations/001_create_hospitals.up.sql` -- schema conventions
- Codebase inspection: `frontend/src/contexts/AuthContext.tsx` -- current auth state management
- Codebase inspection: `frontend/src/components/auth/AuthGuard.tsx` -- route guard pattern
- Codebase inspection: `docker-compose.yml` -- current env var configuration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies needed, extending existing patterns
- Architecture: HIGH - follows established handler-service-repository and Context-provider patterns
- Pitfalls: HIGH - identified from direct codebase analysis of current auth flow
- Schema design: HIGH - standard Postgres RBAC pattern with junction table

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable domain, no external dependency changes)
