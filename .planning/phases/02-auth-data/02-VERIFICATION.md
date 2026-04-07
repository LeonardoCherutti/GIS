---
phase: 02-auth-data
verified: 2026-04-07T20:00:00Z
status: passed
score: 11/11 must-haves verified
re_verification: false
---

# Phase 2: Auth + Data Verification Report

**Phase Goal:** Users can securely sign in with Google, are validated against the whitelist, and the app serves real hospital data from the database
**Verified:** 2026-04-07
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Go API verifies Google ID tokens and rejects invalid ones with 403 | VERIFIED | `api/internal/service/auth.go`: `idtoken.Validate(ctx, googleToken, s.cfg.GoogleClientID)` — errors map to `writeError(w, http.StatusForbidden, ...)` in handler |
| 2 | Go API checks email against whitelist and rejects non-whitelisted with 403 | VERIFIED | `isAllowed()` checks exact email match and domain match (case-insensitive); on failure `VerifyAndLogin` returns `fmt.Errorf("Email nao autorizado")` → handler returns 403 |
| 3 | Go API issues session JWT on successful login | VERIFIED | `VerifyAndLogin` creates `jwt.NewWithClaims(jwt.SigningMethodHS256, ...)` with 24h expiry, signs with `JWTSecret`, returns `model.LoginResponse{Token: token, User: *user}` |
| 4 | Go API middleware rejects requests without valid Bearer token with 401 | VERIFIED | `api/internal/middleware/auth.go`: missing/malformed header → 401 `{"error":"Nao autorizado"}`; invalid/expired JWT → 401 `{"error":"Token invalido ou expirado"}` |
| 5 | Go API returns all active hospitals with dashboard embed URLs from database | VERIFIED | `api/internal/repository/hospital.go`: real SQL query with `LEFT JOIN dashboard_configs` scans rows into `[]model.Hospital` including `PowerBIURL` from `dc.embed_url`; empty slice returned instead of nil |
| 6 | AuthContext provides user, isAuthenticated, isLoading, login, and logout | VERIFIED | `frontend/src/contexts/AuthContext.tsx` lines 14-21: full interface implemented; all five exported via `AuthContext.Provider` |
| 7 | Login function sends Google ID token to Go API /auth/login and stores returned JWT | VERIFIED | `login` calls `apiFetch<...>('/auth/login', { method: 'POST', body: JSON.stringify({ google_token: credential }) })`, stores returned token in `localStorage` and POSTs to `/api/session` for cookie |
| 8 | Session persists across tab close via httpOnly cookie + localStorage | VERIFIED | `api/session` route (POST) sets `httpOnly: true, maxAge: 7 days`; `useEffect` on mount reads `localStorage` and refreshes cookie |
| 9 | Logout clears cookie via DELETE /api/session, clears localStorage, resets state | VERIFIED | `logout` calls `localStorage.removeItem('gis_auth_token')`, `fetch('/api/session', { method: 'DELETE' })`, then `setUser(null), setToken(null)` |
| 10 | Authenticated user navigating to / is redirected to /hospital | VERIFIED | `frontend/src/app/page.tsx`: `useEffect` → `if (!isLoading && isAuthenticated) router.push('/hospital')` |
| 11 | Unauthenticated user navigating to /hospital or /hospital/[cnes] is redirected to / | VERIFIED | `AuthGuard.tsx`: `useEffect` → `if (!isLoading && !isAuthenticated) router.push('/')`, returns `null` while redirect is in-flight |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact | Status | Evidence |
|----------|--------|----------|
| `api/internal/config/config.go` | VERIFIED | Contains `GoogleClientID`, `JWTSecret`, `AllowedEmails`, `AllowedDomains`; `parseCSV` helper; defaults for `JWTSecret` |
| `api/internal/service/auth.go` | VERIFIED | `VerifyAndLogin`, `isAllowed`, `ValidateSessionToken` all implemented; real `idtoken.Validate` call |
| `api/internal/middleware/auth.go` | VERIFIED | `func Auth(jwtSecret string) func(http.Handler) http.Handler` — extracts Bearer, validates JWT, stores email in context |
| `api/internal/handler/auth.go` | VERIFIED | `func (h *AuthHandler) Login(...)` decodes `LoginRequest`, calls `VerifyAndLogin`, returns `LoginResponse` on success |
| `api/internal/handler/hospital.go` | VERIFIED | `func (h *HospitalHandler) List(...)` calls `ListActive`, returns hospitals array |
| `api/internal/repository/hospital.go` | VERIFIED | `FindAllActive` runs real SQL with `LEFT JOIN dashboard_configs`; scans all rows; returns `[]model.Hospital{}` not nil |
| `api/internal/handler/response.go` | VERIFIED | `writeJSON` and `writeError` helpers present |
| `api/internal/service/hospital.go` | VERIFIED | `ListActive` delegates to `repo.FindAllActive` |
| `api/internal/router/router.go` | VERIFIED | `New(pool, cfg)` wires public group (health, auth/login) and protected group with `middleware.Auth(cfg.JWTSecret)` for hospitals |
| `api/cmd/api/main.go` | VERIFIED | `router.New(pool, &cfg)` passes config pointer |
| `frontend/src/contexts/AuthContext.tsx` | VERIFIED | `GoogleOAuthProvider` wraps `AuthProviderInner`; full login/logout/session restore; `parseJwt`; `useAuth` hook |
| `frontend/src/components/auth/LoginButton.tsx` | VERIFIED | `google.accounts.id.initialize` + `prompt`; fallback `renderButton`; loading spinner; Portuguese label "Entrar com Google"; error display |
| `frontend/src/components/auth/AuthGuard.tsx` | VERIFIED | `isAuthenticated` check; `router.push('/')` redirect; loading spinner; returns children when authenticated |
| `frontend/src/app/page.tsx` | VERIFIED | `useAuth()`, `router.push('/hospital')` on auth, loading spinner, `LoginButton`, GIS branding |
| `frontend/src/app/hospital/page.tsx` | VERIFIED | `apiFetch<Hospital[]>('/hospitals')` in `useEffect`; renders card grid with `Link href="/hospital/{cnes}"`; wrapped in `AuthGuard` |
| `frontend/src/app/hospital/[cnes]/page.tsx` | VERIFIED | `use(params)` for cnes; `apiFetch('/hospitals')` + client-side filter by CNES; Power BI URL placeholder div; wrapped in `AuthGuard` |
| `docker-compose.yml` | VERIFIED | `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `ALLOWED_EMAILS`, `ALLOWED_DOMAINS` passed to api service; `NEXT_PUBLIC_GOOGLE_CLIENT_ID` passed to frontend |
| `.env.example` | VERIFIED | All five env vars documented with example values |

---

### Key Link Verification

| From | To | Via | Status | Detail |
|------|----|-----|--------|--------|
| `router.go` | `middleware/auth.go` | chi group `.Use(middleware.Auth(...))` | WIRED | Line 36: `r.Use(middleware.Auth(cfg.JWTSecret))` inside `r.Group(...)` |
| `handler/auth.go` | `service/auth.go` | `h.service.VerifyAndLogin(...)` | WIRED | Line 31: `h.service.VerifyAndLogin(r.Context(), req.GoogleToken)` |
| `handler/hospital.go` | `repository/hospital.go` | `repo.FindAllActive` via service | WIRED | `handler -> service.ListActive -> repo.FindAllActive` all connected |
| `AuthContext.tsx` | `/api/proxy/auth/login` | `apiFetch('/auth/login', ...)` | WIRED | Line 75: `apiFetch<...>('/auth/login', { method: 'POST', ... })` |
| `AuthContext.tsx` | `/api/session` | `fetch('/api/session', ...)` POST/DELETE | WIRED | Lines 88-92 (POST on login), line 100 (DELETE on logout) |
| `LoginButton.tsx` | `AuthContext.tsx` | `useAuth().login` | WIRED | Line 9: `const { login } = useAuth()` — called inside `google.accounts.id.initialize callback` |
| `page.tsx` | `/hospital` | `useRouter().push('/hospital')` on `isAuthenticated` | WIRED | Lines 12-16 `useEffect` with `router.push('/hospital')` |
| `hospital/page.tsx` | `/api/proxy/hospitals` | `apiFetch('/hospitals')` | WIRED | Line 31: `apiFetch<Hospital[]>('/hospitals')` in `useEffect` |
| `AuthGuard.tsx` | `AuthContext.tsx` | `useAuth()` | WIRED | Line 12: `const { isAuthenticated, isLoading } = useAuth()` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `hospital/page.tsx` | `hospitals` state | `apiFetch('/hospitals')` → proxy → Go API → `FindAllActive` SQL query with `LEFT JOIN dashboard_configs` | Yes — real DB query against `hospitals` and `dashboard_configs` tables | FLOWING |
| `hospital/[cnes]/page.tsx` | `hospital` state | same `apiFetch('/hospitals')` filtered by `cnes` | Yes — same real DB query, filtered client-side | FLOWING |
| `AuthContext.tsx` | `user`, `token` | `apiFetch('/auth/login')` → Go API `VerifyAndLogin` → `idtoken.Validate` → JWT | Yes — live Google token verification + DB-independent JWT | FLOWING |

Note: The Power BI iframe in `hospital/[cnes]/page.tsx` is an intentional placeholder (`"Dashboard Power BI sera exibido aqui"` with the URL displayed). This is documented as a known stub in Plan 03 SUMMARY.md and is Phase 3 scope. It does not block the Phase 2 goal.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Go API compiles cleanly | `cd api && go build ./...` | Exit 0, no output | PASS |
| Go module has idtoken and jwt deps | `grep -q "idtoken\|golang-jwt" api/go.mod` | Both packages present | PASS |
| Frontend packages installed | `grep @react-oauth/google frontend/package.json` | Found | PASS |

Note: Full runtime check (Docker Compose + Google OAuth popup + login flow) requires human verification. API build is confirmed clean.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| AUTH-01 | 02-02 | User can sign in via Google OAuth popup (no redirect URI) | SATISFIED | `LoginButton.tsx` uses `google.accounts.id.initialize()` + `prompt()` — popup flow, no redirect URI |
| AUTH-02 | 02-01 | Only whitelisted emails and domain emails can access (env var driven) | SATISFIED | `isAllowed()` in `service/auth.go` checks `AllowedEmails` and `AllowedDomains` loaded from env vars |
| AUTH-03 | 02-02 | User session persists across tab close via httpOnly cookie | SATISFIED | `api/session` route sets `httpOnly: true, maxAge: 7 days`; `AuthContext` restores from `localStorage` on mount and refreshes cookie |
| AUTH-04 | 02-02 | User can log out with full session cleanup | SATISFIED | `logout()` removes `localStorage`, DELETE `/api/session` (clears httpOnly cookie), resets React state |
| AUTH-05 | 02-02 | Auth loading state shown during OAuth popup flow | SATISFIED | `LoginButton.tsx`: `loading` state shows spinner; `AuthContext` `isLoading=true` prevents flash; `AuthGuard` shows "Carregando..." during check |
| AUTH-06 | 02-01 | Go API middleware validates auth on protected endpoints | SATISFIED | `middleware/auth.go` validates Bearer JWT; `router.go` applies it to `/api/hospitals` group |
| AUTH-07 | 02-01, 02-03 | Next.js proxy route forwards auth headers to Go API | SATISFIED | `api/proxy/[...path]/route.ts` reads `auth-session` cookie and sets `Authorization: Bearer <token>` header on every proxy request |
| SPA-03 | 02-03 | Client-side view transitions without full page reloads | SATISFIED | All pages use Next.js `useRouter().push()` and `<Link>` for navigation — client-side routing confirmed |
| SPA-04 | 02-03 | URL-based routing for dashboards (/hospital/[cnes]) | SATISFIED | `frontend/src/app/hospital/[cnes]/page.tsx` exists; `use(params)` extracts `cnes` from URL |
| SPA-05 | 02-03 | Browser back/forward navigation works correctly | SATISFIED | Next.js App Router provides native browser history; no hash-based routing; Link and router.push add to history stack |

**No orphaned requirements:** All 10 requirement IDs (AUTH-01 through AUTH-07, SPA-03, SPA-04, SPA-05) are covered by plans and verified in code.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `frontend/src/app/hospital/[cnes]/page.tsx` | 130 | `"Dashboard Power BI sera exibido aqui"` placeholder text | INFO | Intentional — Phase 3 scope per Plan 03 SUMMARY |

No blockers. The Power BI iframe placeholder is the only "stub" and it is explicitly scoped to Phase 3 in the plans and summaries. The hospital data (`hospital.powerbi_url`) is real and rendered on the same page — only the iframe rendering itself is deferred.

---

### Human Verification Required

#### 1. End-to-End Login Flow

**Test:** Open `http://localhost:3000` after `docker compose up --build -d` with a real `.env` containing `GOOGLE_CLIENT_ID` and your email in `ALLOWED_EMAILS`.
**Expected:** Google OAuth popup appears; on sign-in with a whitelisted account the app redirects to `/hospital` showing hospital cards loaded from the database; non-whitelisted accounts receive "Email nao autorizado" error.
**Why human:** Requires live Google OAuth credentials, running Docker stack, and real Postgres data. Cannot be verified statically.

#### 2. Session Persistence

**Test:** Log in, close the browser tab, reopen `http://localhost:3000`.
**Expected:** App shows hospital grid immediately (no login screen) because session was restored from the httpOnly cookie + localStorage.
**Why human:** Requires a live browser and running stack.

#### 3. SPA Navigation (No Full Page Reloads)

**Test:** Navigate between `/`, `/hospital`, and `/hospital/{cnes}` using both links and browser back/forward buttons. Watch the Network tab.
**Expected:** After the initial page load, no further document requests appear in the network tab — all transitions are client-side.
**Why human:** Requires browser devtools observation.

---

### Gaps Summary

No gaps found. All 11 observable truths are verified, all 18 artifacts exist and are substantive, all 9 key links are wired, data flows from the real database through to the rendered UI, and all 10 requirement IDs are satisfied.

The only known stub (Power BI iframe placeholder in `hospital/[cnes]/page.tsx`) is intentionally deferred to Phase 3 and does not block the Phase 2 goal.

---

_Verified: 2026-04-07_
_Verifier: Claude (gsd-verifier)_
