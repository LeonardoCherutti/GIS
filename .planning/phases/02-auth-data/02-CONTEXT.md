# Phase 2: Auth + Data - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Users can securely sign in with Google OAuth popup, are validated against email/domain whitelist, and the app serves real hospital data from the database. This phase delivers: Google OAuth popup flow on frontend, Go API auth verification + whitelist enforcement, httpOnly session cookie management, Go API hospital data endpoints, SPA view transitions (login -> grid -> dashboard), URL-based routing for hospitals, and browser back/forward navigation.

</domain>

<decisions>
## Implementation Decisions

### Authentication Flow
- Google OAuth popup using @react-oauth/google (already in package.json from Phase 1)
- Frontend gets Google ID token from popup, sends to Go API `/api/auth/login`
- Go API verifies token with google.golang.org/api/idtoken
- Go API checks email against whitelist (ALLOWED_EMAILS + ALLOWED_DOMAINS env vars)
- On success, Go API returns a session token; frontend stores via /api/session route as httpOnly cookie
- On failure, return 403 with clear error message in Portuguese

### Session Management
- httpOnly cookie named `auth-session` (established in Phase 1 session route shell)
- Session survives tab close (cookie, not sessionStorage)
- Token refresh handled by Go API (JWT with expiry + refresh endpoint)
- Logout clears cookie via /api/session DELETE and redirects to login

### Hospital Data API
- Go API endpoint `GET /api/hospitals` returns all hospitals from Postgres
- Uses existing pgx pool and repository pattern from Phase 1
- Hospital model: id, name, cnes, logo_url, period_start, period_end, powerbi_url, created_at
- Frontend fetches via proxy route (already wired in Phase 1)

### SPA Navigation
- View handler + view context pattern for login/grid/dashboard views
- URL-based routing: `/` (login or grid based on auth), `/hospital/[cnes]` (dashboard)
- Browser back/forward works without full page reloads
- Auth guard redirects unauthenticated users to login

### Claude's Discretion
- JWT token structure and claims
- Exact Go middleware implementation details
- Error response format standardization
- Hospital repository query patterns

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/contexts/AuthContext.tsx` — auth context shell ready to be filled
- `frontend/src/app/api/session/route.ts` — session route shell ready for implementation
- `frontend/src/app/api/proxy/[...path]/route.ts` — proxy already forwards to Go API
- `frontend/src/lib/api/client.ts` — typed apiFetch with Result<T> pattern
- `api/internal/router/router.go` — chi router ready for new routes
- `api/internal/handler/health.go` — handler pattern to follow
- Reference: D:\ferreiracontabilidade\app uses @react-oauth/google with GoogleOAuthProvider

### Established Patterns
- Go: handler -> service -> repository layers
- Frontend: provider stack (ThemeProvider > AuthProvider > QueryProvider)
- API client: `apiFetch<T>(path)` returns `Result<T>`
- Proxy: catch-all `/api/proxy/[...path]` forwards to Go API

### Integration Points
- AuthContext wraps app — all components can check auth state
- Proxy route reads `auth-session` cookie and forwards as Authorization header
- Go API middleware validates token on protected routes

</code_context>

<specifics>
## Specific Ideas

- Use exact same Google OAuth popup pattern as ferreiracontabilidade reference
- Whitelist format: ALLOWED_EMAILS="email1@x.com,email2@y.com" and ALLOWED_DOMAINS="company.com,partner.org"
- Auth loading state: show spinner during OAuth popup resolution

</specifics>

<deferred>
## Deferred Ideas

- RBAC / per-user hospital access — v2
- Session timeout warning — v2
- Audit logging — v2

</deferred>
