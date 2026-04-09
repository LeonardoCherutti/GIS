# Phase 5: Role-Based Access Control (RBAC) - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement a two-role permission system (Admin + Manager) with hospital-level access control. Admins see all hospitals and can manage managers. Managers only see hospitals they are assigned to. Replaces the current env-var-based email allowlist with a database-driven user/role system.

</domain>

<decisions>
## Implementation Decisions

### Admin UI
- **D-01:** Dedicated `/admin` route with a user list table. Only visible to admin-role users.
- **D-02:** Admins can add managers by entering their Google email. Managers are created explicitly by admins — no self-registration.
- **D-03:** Hospital assignment uses a checkbox list of all hospitals when editing a manager.
- **D-04:** Admin page shows user table with columns: email, role, assigned hospitals (with dropdown to edit).

### First User Bootstrap
- **D-05:** New `ADMIN_EMAILS` env var in docker-compose. Emails listed here automatically receive the admin role on first login.
- **D-06:** Admin role is strictly env-var-driven — admins cannot promote other users to admin via the UI.
- **D-07:** Managers are registered by admins through the admin UI configuration panel.

### Manager Experience
- **D-08:** Managers see the same hospital grid UI as admins, but only their assigned hospitals appear.
- **D-09:** No admin menu, admin route, or user management is visible to managers.
- **D-10:** Search/filter functionality still works within the manager's visible hospitals.

### Allowlist Migration
- **D-11:** Remove `ALLOWED_EMAILS` and `ALLOWED_DOMAINS` env vars. Replace entirely with DB-driven roles.
- **D-12:** Only users registered in the database (as admin or manager) can log in. Unregistered Google accounts are rejected.
- **D-13:** Login rejection shows clear Portuguese error: "Acesso negado. Contate o administrador."

### Claude's Discretion
- Database schema design (users table, roles, user_hospitals junction table)
- API endpoint structure for admin operations
- Frontend state management for role-based UI rendering
- Migration strategy for existing env-var users to DB records

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Authentication System
- `api/internal/service/auth.go` — Current auth service with allowlist logic (must be modified)
- `api/internal/middleware/auth.go` — JWT middleware (must add role extraction)
- `api/internal/handler/auth.go` — Login handler (must check DB instead of env vars)
- `api/internal/model/auth.go` — Auth models (must add role field)

### Database Schema
- `api/migrations/001_create_hospitals.up.sql` — Existing hospitals table
- `api/migrations/002_create_dashboard_configs.up.sql` — Existing dashboard configs

### Frontend Auth
- `frontend/src/contexts/AuthContext.tsx` — Auth context (must expose user role)
- `frontend/src/components/auth/AuthGuard.tsx` — Route guard (must add role-based guards)
- `frontend/app/api/proxy/[...path]/route.ts` — Proxy route (passes auth headers)

### Hospital Data Flow
- `api/internal/repository/hospital.go` — Hospital repo (must filter by user access)
- `api/internal/handler/hospital.go` — Hospital handler (must respect role)
- `frontend/src/components/hospital/HospitalGrid.tsx` — Grid component (no changes needed — API filters)

### Reference Patterns
- `D:\ferreiracontabilidade\app` — Component and routing patterns to follow

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AuthContext` (`frontend/src/contexts/AuthContext.tsx`): Already manages user state + JWT. Can be extended with `role` field.
- `AuthGuard` (`frontend/src/components/auth/AuthGuard.tsx`): Redirect component. Can be extended with role-based access (AdminGuard).
- `apiFetch` (`frontend/src/lib/api/client.ts`): Generic API client. Works as-is for new admin endpoints.
- `chi` router (`api/internal/router/router.go`): Already has middleware groups. Can add admin-only route group.
- `Auth middleware` (`api/internal/middleware/auth.go`): Extracts JWT claims. Can be extended to inject role into context.

### Established Patterns
- Go API: handler → service → repository layered architecture
- Frontend: Context providers → components → API client pattern
- Auth: Google OAuth popup → JWT → httpOnly cookie → proxy → Go API
- DB: UUID primary keys, timestamptz audit columns, migrations in `api/migrations/`

### Integration Points
- Router (`api/internal/router/router.go`): Add `/api/admin/*` protected route group
- Auth service (`api/internal/service/auth.go`): Replace allowlist check with DB lookup
- Hospital repository (`api/internal/repository/hospital.go`): Add `FindByUserAccess(email)` method
- Frontend routing: Add `/admin` page under `[locale]` routing
- AppHeader: Conditionally show admin link for admin users

</code_context>

<specifics>
## Specific Ideas

- Admin page mockup confirmed: user table with email, role, hospital assignment dropdown
- Hospital assignment via checkbox list (not drag-and-drop)
- Managers created via email entry in admin UI — Google validates identity on their first login
- Error message for denied users: "Acesso negado. Contate o administrador."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-rbac*
*Context gathered: 2026-04-09*
