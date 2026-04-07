# Phase 2: Auth + Data - Research

**Researched:** 2026-04-07
**Domain:** Google OAuth popup authentication, Go API auth middleware, hospital data endpoints, SPA navigation
**Confidence:** HIGH

## Summary

Phase 2 delivers end-to-end authentication via Google OAuth popup and real hospital data from the database. The frontend shell exists (AuthContext, session route, proxy route, API client) but all are stubs or minimal implementations. The Go API has health endpoint only -- no auth verification, no hospital endpoints, no middleware beyond logging/recovery.

The authentication flow is: Google OAuth popup on frontend (via `@react-oauth/google` + Google Identity Services) returns a Google ID token. Frontend sends it to Go API `/api/auth/login`. Go API verifies with `google.golang.org/api/idtoken`, checks email whitelist, creates a session JWT, returns it. Frontend stores JWT via `/api/session` as httpOnly cookie. Proxy route already forwards this cookie as `Authorization: Bearer` header on subsequent requests.

**Primary recommendation:** Follow the reference project's AuthContext pattern exactly (it is proven), but add the Go API verification step that the reference project lacks. The reference project stores the raw Google token; GIS should store a Go-API-issued session JWT instead for proper server-side validation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Google OAuth popup using @react-oauth/google (already in package.json from Phase 1)
- Frontend gets Google ID token from popup, sends to Go API `/api/auth/login`
- Go API verifies token with google.golang.org/api/idtoken
- Go API checks email against whitelist (ALLOWED_EMAILS + ALLOWED_DOMAINS env vars)
- On success, Go API returns a session token; frontend stores via /api/session route as httpOnly cookie
- On failure, return 403 with clear error message in Portuguese
- httpOnly cookie named `auth-session` (established in Phase 1 session route shell)
- Session survives tab close (cookie, not sessionStorage)
- Token refresh handled by Go API (JWT with expiry + refresh endpoint)
- Logout clears cookie via /api/session DELETE and redirects to login
- Go API endpoint `GET /api/hospitals` returns all hospitals from Postgres
- Uses existing pgx pool and repository pattern from Phase 1
- Hospital model: id, name, cnes, logo_url, period_start, period_end, powerbi_url, created_at
- Frontend fetches via proxy route (already wired in Phase 1)
- View handler + view context pattern for login/grid/dashboard views
- URL-based routing: `/` (login or grid based on auth), `/hospital/[cnes]` (dashboard)
- Browser back/forward works without full page reloads
- Auth guard redirects unauthenticated users to login
- Use exact same Google OAuth popup pattern as ferreiracontabilidade reference
- Whitelist format: ALLOWED_EMAILS="email1@x.com,email2@y.com" and ALLOWED_DOMAINS="company.com,partner.org"
- Auth loading state: show spinner during OAuth popup resolution

### Claude's Discretion
- JWT token structure and claims
- Exact Go middleware implementation details
- Error response format standardization
- Hospital repository query patterns

### Deferred Ideas (OUT OF SCOPE)
- RBAC / per-user hospital access -- v2
- Session timeout warning -- v2
- Audit logging -- v2
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can sign in via Google OAuth popup (no redirect URI) | Reference project LoginButton.tsx pattern with @react-oauth/google GoogleOAuthProvider + google.accounts.id API. Proven pattern. |
| AUTH-02 | Only whitelisted emails and specified domain emails can access (env var driven) | Go API whitelist check after idtoken.Validate(); Config struct extended with ALLOWED_EMAILS + ALLOWED_DOMAINS |
| AUTH-03 | User session persists across tab close via httpOnly cookie with token refresh | Session route already sets httpOnly cookie; Go API issues JWT with expiry; refresh endpoint needed |
| AUTH-04 | User can log out with full session cleanup | Reference pattern: localStorage.removeItem + DELETE /api/session + state reset |
| AUTH-05 | Auth loading state shown during OAuth popup flow | Loading spinner in login button during popup resolution (reference pattern) |
| AUTH-06 | Go API middleware validates auth on protected endpoints | Chi middleware that reads Authorization Bearer header, validates JWT signature + expiry |
| AUTH-07 | Next.js proxy route forwards auth headers to Go API | Already implemented in proxy/[...path]/route.ts -- reads auth-session cookie, forwards as Bearer |
| SPA-03 | Client-side view transitions (login -> grid -> dashboard) without full page reloads | Next.js app router with client-side navigation via Link/useRouter; no full page reloads |
| SPA-04 | URL-based routing for dashboards (e.g., /hospital/[cnes]) | Next.js dynamic route: app/hospital/[cnes]/page.tsx |
| SPA-05 | Browser back/forward navigation works correctly within SPA | Next.js app router handles this natively; popstate events managed by framework |
</phase_requirements>

## Standard Stack

### Core (to install/add for Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @react-oauth/google | ^0.13.4 | Google OAuth popup + GIS script loading | Reference project uses this. GoogleOAuthProvider loads google.accounts.id script. NOT in package.json yet -- must install. |
| jose | ^6.2.2 | JWT decode on frontend (inspect token claims) | Lightweight, reference project pattern. NOT in package.json yet -- must install. |
| google.golang.org/api/idtoken | latest | Go: Verify Google ID token server-side | Official Google library. Handles JWKS fetching, key rotation, claim validation. |
| github.com/golang-jwt/jwt/v5 | v5 | Go: Create/validate session JWTs | Standard Go JWT library for creating app-issued session tokens. |

### Already Present (from Phase 1)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| next | 16.2.2 | App framework | Installed, standalone output configured |
| react | 19.2.4 | UI | Installed |
| @tanstack/react-query | ^5.96.2 | Data fetching/caching | Installed, QueryProvider wired |
| next-themes | ^0.4.6 | Theme toggle | Installed, ThemeProvider wired |
| sonner | ^2.0.7 | Toast notifications | Installed, Toaster wired |
| go-chi/chi/v5 | v5.2.5 | Go HTTP router | In go.mod |
| jackc/pgx/v5 | v5.9.1 | Postgres driver | In go.mod, pool created in main.go |

**Installation:**
```bash
# Frontend
cd frontend && npm install @react-oauth/google@^0.13.4 jose@^6.2.2

# Backend
cd api && go get google.golang.org/api/idtoken github.com/golang-jwt/jwt/v5
```

## Architecture Patterns

### Existing Shells to Fill

The Phase 1 foundation created these shells that Phase 2 must implement:

```
frontend/src/
  contexts/AuthContext.tsx          # SHELL: hardcoded nulls, needs full OAuth implementation
  app/api/session/route.ts         # DONE: POST sets cookie, DELETE clears cookie
  app/api/proxy/[...path]/route.ts # DONE: forwards auth-session as Bearer header
  lib/api/client.ts                # DONE: apiFetch<T> with Result<T> pattern
  app/page.tsx                     # SHELL: placeholder, needs login or redirect logic

api/
  cmd/api/main.go                  # DONE: config, pgx pool, graceful shutdown
  internal/config/config.go        # PARTIAL: Port + DatabaseURL only, needs auth config
  internal/router/router.go        # PARTIAL: health route only, needs auth + hospital routes
  internal/handler/health.go       # DONE: pattern to follow for new handlers
```

### New Files to Create

```
frontend/src/
  app/hospital/[cnes]/page.tsx     # Dashboard view with Power BI iframe
  components/auth/LoginButton.tsx  # Google OAuth popup button (copy reference pattern)

api/internal/
  config/config.go                 # EXTEND: add GoogleClientID, JWTSecret, AllowedEmails, AllowedDomains
  handler/auth.go                  # POST /api/auth/login - verify Google token, issue session JWT
  handler/hospital.go              # GET /api/hospitals - list all active hospitals with configs
  service/auth.go                  # Token verification, whitelist check, JWT creation
  service/hospital.go              # Business logic for hospital queries
  repository/hospital.go           # SQL queries for hospitals + dashboard_configs
  middleware/auth.go               # Validate session JWT on protected routes
  model/hospital.go                # Hospital + DashboardConfig structs
```

### Pattern 1: Authentication Flow (Reference + Go API verification)

**What:** Google OAuth popup returns ID token -> frontend sends to Go API -> Go API verifies + issues session JWT -> frontend stores as httpOnly cookie.

**Key difference from reference:** The reference project stores the raw Google ID token as the session. GIS adds a Go API verification step that issues its own JWT. This is more secure because: (a) server validates the token, (b) whitelist is enforced server-side not client-side, (c) session JWT has app-controlled expiry.

```typescript
// AuthContext.tsx login function (adapted from reference)
const login = useCallback(async (credentialResponse: { credential?: string }) => {
  const credential = credentialResponse.credential
  if (!credential) return

  // Send Google ID token to Go API for verification
  const result = await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ google_token: credential }),
  })

  if (!result.ok) {
    throw new Error(result.error.code ?? 'auth_failed')
  }

  // Store session JWT (Go API issued) in httpOnly cookie
  await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: result.data.token }),
  })

  setUser(result.data.user)
  setToken(result.data.token)
}, [])
```

### Pattern 2: Go Auth Handler

**What:** Receives Google ID token, verifies with Google, checks whitelist, issues session JWT.

```go
// handler/auth.go
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
    var req struct {
        GoogleToken string `json:"google_token"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "Requisicao invalida")
        return
    }

    user, sessionToken, err := h.service.VerifyAndLogin(r.Context(), req.GoogleToken)
    if err != nil {
        // Return 403 with Portuguese message
        writeError(w, http.StatusForbidden, err.Error())
        return
    }

    json.NewEncoder(w).Encode(map[string]any{
        "token": sessionToken,
        "user":  user,
    })
}
```

### Pattern 3: Go Auth Service

```go
// service/auth.go
func (s *AuthService) VerifyAndLogin(ctx context.Context, googleToken string) (*model.AuthUser, string, error) {
    // 1. Verify Google ID token
    payload, err := idtoken.Validate(ctx, googleToken, s.cfg.GoogleClientID)
    if err != nil {
        return nil, "", fmt.Errorf("Token invalido")
    }

    email := payload.Claims["email"].(string)

    // 2. Check whitelist
    if !s.isAllowed(email) {
        return nil, "", fmt.Errorf("Email nao autorizado")
    }

    // 3. Create session JWT
    claims := jwt.MapClaims{
        "email": email,
        "name":  payload.Claims["name"],
        "picture": payload.Claims["picture"],
        "sub":   payload.Claims["sub"],
        "exp":   time.Now().Add(24 * time.Hour).Unix(),
        "iat":   time.Now().Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
    if err != nil {
        return nil, "", fmt.Errorf("Erro interno")
    }

    user := &model.AuthUser{
        Email:   email,
        Name:    payload.Claims["name"].(string),
        Picture: payload.Claims["picture"].(string),
    }
    return user, signed, nil
}

func (s *AuthService) isAllowed(email string) bool {
    // Check ALLOWED_EMAILS
    for _, e := range s.cfg.AllowedEmails {
        if strings.EqualFold(e, email) {
            return true
        }
    }
    // Check ALLOWED_DOMAINS
    parts := strings.SplitN(email, "@", 2)
    if len(parts) == 2 {
        for _, d := range s.cfg.AllowedDomains {
            if strings.EqualFold(d, parts[1]) {
                return true
            }
        }
    }
    return false
}
```

### Pattern 4: Go Auth Middleware

```go
// middleware/auth.go
func Auth(jwtSecret string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            authHeader := r.Header.Get("Authorization")
            if !strings.HasPrefix(authHeader, "Bearer ") {
                http.Error(w, `{"error":"Nao autorizado"}`, http.StatusUnauthorized)
                return
            }
            tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

            token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
                if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
                    return nil, fmt.Errorf("unexpected signing method")
                }
                return []byte(jwtSecret), nil
            })
            if err != nil || !token.Valid {
                http.Error(w, `{"error":"Token invalido"}`, http.StatusUnauthorized)
                return
            }

            claims := token.Claims.(jwt.MapClaims)
            ctx := context.WithValue(r.Context(), "user_email", claims["email"])
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}
```

### Pattern 5: Hospital Repository with JOIN

```go
// repository/hospital.go
func (r *HospitalRepo) FindAllActive(ctx context.Context) ([]model.Hospital, error) {
    rows, err := r.pool.Query(ctx, `
        SELECT h.id, h.name, h.cnes, h.logo_url, h.period_start, h.period_end,
               h.sort_order, h.created_at,
               dc.embed_url
        FROM hospitals h
        LEFT JOIN dashboard_configs dc ON dc.hospital_id = h.id AND dc.active = true
        WHERE h.active = true
        ORDER BY h.sort_order
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    // ... scan into model.Hospital slice
}
```

### Pattern 6: Router with Auth Middleware Groups

```go
// router/router.go
func New(pool *pgxpool.Pool, cfg *config.Config) chi.Router {
    r := chi.NewRouter()
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.RequestID)

    // Public routes
    r.Get("/api/health", handler.Health)
    r.Post("/api/auth/login", authHandler.Login)

    // Protected routes
    r.Group(func(r chi.Router) {
        r.Use(authMiddleware.Auth(cfg.JWTSecret))
        r.Get("/api/hospitals", hospitalHandler.List)
    })

    return r
}
```

### Pattern 7: SPA Navigation with Next.js App Router

```
app/
  page.tsx                  # Root: check auth -> redirect to /hospital or show login
  hospital/
    page.tsx                # Hospital grid (protected)
    [cnes]/
      page.tsx              # Dashboard view with Power BI iframe (protected)
```

**Key:** Use `useRouter().push()` for programmatic navigation (after login), `<Link>` for declarative navigation (grid cards). Next.js app router handles browser back/forward natively.

### Anti-Patterns to Avoid

- **Client-side-only whitelist check:** The reference project checks whitelist on the frontend (`NEXT_PUBLIC_*` env vars). GIS MUST verify server-side in Go API. The client-side check in the reference is a UX convenience, not security.
- **Storing raw Google token as session:** Reference project stores Google ID token directly. GIS should issue its own JWT from Go API to control expiry and claims.
- **Putting auth logic in page components:** Use AuthContext for all auth state. Pages check `useAuth().isAuthenticated` and redirect.
- **Hardcoding redirect paths:** Use a constant or config for post-login redirect path.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Google token verification | Manual JWKS fetch + JWT decode | `idtoken.Validate()` from google.golang.org/api/idtoken | Handles key rotation, clock skew, issuer validation |
| JWT creation/parsing | Manual base64 encode + HMAC | `golang-jwt/jwt/v5` | Edge cases in JWT spec (padding, algorithm confusion attacks) |
| Google OAuth popup UI | Custom popup window management | `@react-oauth/google` GoogleOAuthProvider + google.accounts.id | Handles script loading, popup lifecycle, COOP compliance |
| Cookie security flags | Manual Set-Cookie header | Next.js `response.cookies.set()` | Correctly encodes, sets Secure/HttpOnly/SameSite |
| Query string building for proxy | Manual string concatenation | `req.nextUrl.search` passthrough | Handles encoding edge cases |

## Common Pitfalls

### Pitfall 1: @react-oauth/google Not in package.json
**What goes wrong:** CONTEXT.md says "already in package.json from Phase 1" but inspection shows it is NOT installed. `jose` is also missing.
**Why it happens:** Assumption from planning that Phase 1 included it, but Phase 1 only scaffolded the shell.
**How to avoid:** First task must install `@react-oauth/google` and `jose` in the frontend.
**Warning signs:** Import errors when building AuthContext.

### Pitfall 2: Google Identity Services Script Not Loaded
**What goes wrong:** The LoginButton references `window.google.accounts.id` but the GIS script hasn't loaded yet.
**Why it happens:** The `GoogleOAuthProvider` from `@react-oauth/google` loads the script asynchronously. If login is attempted before script loads, `google.accounts.id` is undefined.
**How to avoid:** The reference project's LoginButton checks `if (!google?.accounts?.id)` before proceeding and shows an error. Copy this guard.
**Warning signs:** "Cannot read property 'initialize' of undefined" errors.

### Pitfall 3: COOP Header Already Configured but Verify It Works
**What goes wrong:** `next.config.ts` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` via `headers()`. This works in standalone mode but must be verified.
**Why it happens:** The header is critical for Google OAuth popup communication. If it doesn't apply, popup returns null credential.
**How to avoid:** Test OAuth popup flow in production build (`next build && next start`), not just dev server.
**Warning signs:** `credential` is undefined in the callback, popup closes without returning data.

### Pitfall 4: Go API google.golang.org/api/idtoken Requires Network Access
**What goes wrong:** `idtoken.Validate()` fetches Google's JWKS from the internet. In a Docker container with restricted network, this fails.
**Why it happens:** Google rotates signing keys. The library fetches current keys on first validation.
**How to avoid:** Ensure the Go API container has outbound internet access (at least to googleapis.com). No special Docker networking needed with default bridge.
**Warning signs:** "failed to verify token: could not get JWKS" errors.

### Pitfall 5: JWT Expiry Mismatch Between Cookie and Token
**What goes wrong:** Session route sets cookie maxAge to 7 days. If the Go-API-issued JWT has a shorter expiry (e.g., 24 hours), the cookie exists but the token inside is expired. API requests fail with 401 but the frontend thinks the user is logged in.
**How to avoid:** Align cookie maxAge with JWT expiry, OR implement a token refresh flow. The CONTEXT.md says "Token refresh handled by Go API (JWT with expiry + refresh endpoint)."
**Warning signs:** Users suddenly get 401 errors after some hours despite appearing logged in.

### Pitfall 6: Go Config Struct Missing Auth Fields
**What goes wrong:** Current `config.go` only has `Port` and `DatabaseURL`. All auth-related env vars (GOOGLE_CLIENT_ID, JWT_SECRET, ALLOWED_EMAILS, ALLOWED_DOMAINS) are missing.
**How to avoid:** Extend config.go as the first Go-side task. Parse comma-separated lists for ALLOWED_EMAILS and ALLOWED_DOMAINS.
**Warning signs:** Empty whitelist = nobody can log in. Missing JWT_SECRET = panic on startup.

### Pitfall 7: Hospital Model Mismatch with CONTEXT.md
**What goes wrong:** CONTEXT.md says model includes `powerbi_url`. But the actual schema has `embed_url` in `dashboard_configs` table (separate from hospitals). The API must JOIN and return a flattened or nested response.
**How to avoid:** The hospital API response should include the dashboard config embed_url. Use the LEFT JOIN pattern from the architecture research.
**Warning signs:** Frontend expects `powerbi_url` field but API returns `embed_url` in a nested object.

## Code Examples

### Reference: LoginButton.tsx (from ferreiracontabilidade)

The reference project's LoginButton uses `google.accounts.id.initialize()` + `google.accounts.id.prompt()` for the popup flow. Key elements:
- Checks `google?.accounts?.id` exists before proceeding
- Uses `hd` parameter to hint the allowed domain
- Falls back to rendering a Google button if prompt is not displayed
- Wraps in try/catch for domain validation errors

GIS adaptation: Replace the `login(response)` call with an API call to Go backend `/api/auth/login`, then store the returned session JWT instead of the raw Google credential.

### Reference: AuthContext.tsx (from ferreiracontabilidade)

Key patterns to replicate:
- `GoogleOAuthProvider` wraps `AuthProviderInner` (two-layer pattern)
- `parseJwt()` helper decodes token client-side for user display (name, email, picture)
- `useEffect` on mount checks localStorage for existing token and restores session
- `login` callback validates domain then stores token
- `logout` callback clears localStorage + cookie + state

GIS adaptation: On mount, instead of just reading localStorage, also verify the token is still valid by calling the Go API (or check JWT expiry client-side with `jose`).

### Go Error Response Pattern

```go
// Standardized error response for Go API
type ErrorResponse struct {
    Error   string `json:"error"`
    Code    string `json:"code,omitempty"`
}

func writeError(w http.ResponseWriter, status int, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @react-oauth/google `<GoogleLogin>` component | `google.accounts.id.initialize()` + `prompt()` API | 2024+ | More control over UX; `<GoogleLogin>` renders Google's button, the API approach allows custom button styling |
| Google Sign-In (gapi.auth2) | Google Identity Services (accounts.google.com/gsi/client) | 2023 | Old library deprecated. GIS is loaded by @react-oauth/google automatically |
| Go `crypto/rsa` manual token verification | `idtoken.Validate()` | 2022+ | Handles JWKS caching, key rotation, all claim checks |

## Open Questions

1. **Token refresh strategy**
   - What we know: CONTEXT.md says "JWT with expiry + refresh endpoint"
   - What's unclear: Whether refresh uses a separate refresh token (stored where?) or just re-validates the Google token
   - Recommendation: Issue short-lived access JWT (24h) + long-lived refresh token (7 days) in httpOnly cookie. Refresh endpoint issues new access token. This matches the 7-day cookie maxAge already set.

2. **Hospital response shape**
   - What we know: Schema has hospitals + dashboard_configs as separate tables
   - What's unclear: Should API return flat `{ ...hospital, powerbi_url }` or nested `{ ...hospital, dashboards: [...] }`?
   - Recommendation: Return flat with single `powerbi_url` for v1 (only one dashboard per hospital). The LEFT JOIN already handles this. Future v2 can return array.

3. **Auth state restoration on page refresh**
   - What we know: Cookie persists, localStorage can store user display info
   - What's unclear: How to restore user display state (name, picture) without an API call on every refresh
   - Recommendation: Store user info in localStorage (like reference). On mount, decode the JWT from localStorage to get display info. The cookie handles API auth automatically via proxy.

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Next.js (app router, standalone output) + Go API + Postgres
- **Auth**: Google OAuth popup only, no redirect URI flow. Whitelist via env vars.
- **Standards**: Must match D:\ferreiracontabilidade\app patterns (components, palette.css, app router)
- **Language**: Portuguese (pt-BR) for user-facing messages
- **CRITICAL**: `frontend/AGENTS.md` warns: "This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."
- **GSD Workflow**: Do not make direct repo edits outside a GSD workflow

## Sources

### Primary (HIGH confidence)
- Reference project `D:\ferreiracontabilidade\app\src\contexts\AuthContext.tsx` - Full Google OAuth implementation
- Reference project `D:\ferreiracontabilidade\app\src\components\auth\LoginButton.tsx` - Popup flow with google.accounts.id API
- Reference project `D:\ferreiracontabilidade\app\src\app\api\session\route.ts` - Session cookie pattern
- GIS codebase direct inspection - all existing shells verified
- STACK.md / ARCHITECTURE.md / PITFALLS.md from Phase 1 research

### Secondary (MEDIUM confidence)
- google.golang.org/api/idtoken - `idtoken.Validate()` API (verified via Go pkg docs)
- golang-jwt/jwt/v5 - JWT creation/parsing (widely used, well-documented)

### Tertiary (LOW confidence)
- Token refresh strategy details - recommendation based on common patterns, not verified against specific library behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries verified in reference project or Go ecosystem
- Architecture: HIGH - reference project patterns directly inspectable, Go patterns standard
- Pitfalls: HIGH - several verified by direct code inspection (missing npm packages, config gaps)
- Auth flow: HIGH - reference implementation exists and is proven
- SPA navigation: HIGH - standard Next.js app router patterns

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable libraries, low churn)
