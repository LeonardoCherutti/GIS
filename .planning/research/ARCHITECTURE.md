# Architecture Patterns

**Domain:** Healthcare dashboard portal (Next.js SPA + Go API + Postgres)
**Researched:** 2026-04-07
**Confidence:** HIGH (based on reference project patterns + established Go/Next.js conventions)

## System Overview

Three-tier architecture: Next.js SPA frontend, Go REST API backend, Postgres database. The Next.js layer acts as both the UI and a secure proxy to the Go API (keeping API credentials and tokens server-side). Docker Compose orchestrates all three services.

```
Browser
  |
  v
+---------------------------+
| Next.js SPA (port 3000)   |
|  - App Router pages       |
|  - app/api/proxy/[...path]|  <-- server-side proxy to Go API
|  - app/api/session         |  <-- cookie management
|  - AuthContext (Google OAuth popup)
+---------------------------+
  | (internal network)
  v
+---------------------------+
| Go API (port 8080)        |
|  - /api/auth/*            |
|  - /api/hospitals         |
|  - /api/hospitals/:id     |
|  - /api/health            |
+---------------------------+
  |
  v
+---------------------------+
| Postgres (port 5432)      |
|  - hospitals table        |
|  - allowed_users table    |
|  - dashboard_configs table|
+---------------------------+
```

## Component Boundaries

### 1. Next.js Frontend (SPA)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `app/api/proxy/[...path]/route.ts` | Forward all `/api/proxy/*` requests to Go API with auth headers | Go API (server-to-server) |
| `app/api/session/route.ts` | Store/delete Google OAuth token as httpOnly cookie | Browser (cookies) |
| `contexts/AuthContext.tsx` | Google OAuth popup login, token management, user state | Google Identity Services, session API |
| `app/[locale]/page.tsx` | Login page with Google sign-in button | AuthContext |
| `app/[locale]/dashboard/page.tsx` | Hospital card grid, reads from API | Proxy API |
| `app/[locale]/dashboard/[hospitalId]/page.tsx` | Power BI iframe embed for selected hospital | Proxy API |
| `components/hospitals/HospitalCard.tsx` | Reusable card displaying hospital name, CNES, period | Parent page |
| `components/layout/*` | Header, navbar, footer, theme toggle, user menu | Global |
| `lib/api/client.ts` | `apiFetch<T>()` typed wrapper around fetch via proxy | Proxy route |
| `stores/` or `providers/` | Theme state, sidebar state (Zustand or context) | Components |

**Key rule:** The frontend NEVER talks directly to the Go API. All data requests go through `/api/proxy/*` which attaches the session cookie as a Bearer token.

### 2. Go API Backend

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `cmd/api/main.go` | Entry point, config loading, server startup | All packages |
| `internal/handler/` | HTTP handlers (parse request, call service, write response) | Services |
| `internal/service/` | Business logic (validation, orchestration) | Repositories |
| `internal/repository/` | Database queries (one file per entity) | Postgres |
| `internal/model/` | Domain types (Hospital, User, DashboardConfig) | All layers |
| `internal/middleware/` | Auth verification, CORS, logging, request ID | Handlers |
| `internal/config/` | Environment variable parsing into typed config | main.go |
| `migrations/` | SQL migration files (up/down) | Postgres |

**Go project layout** follows the standard `cmd/` + `internal/` convention. No `pkg/` needed -- this is a single-binary application, not a library.

### 3. Postgres Database

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `hospitals` table | Hospital metadata (name, CNES, logo, period) | Go repository |
| `dashboard_configs` table | Power BI embed URLs per hospital | Go repository |
| `allowed_users` table | Email whitelist (optional, supplements env vars) | Go repository |
| `migrations/` | Schema versioning | Go migrate tool |

## Detailed Component Architecture

### Next.js Frontend Structure

```
src/
  app/
    api/
      proxy/[...path]/route.ts    # Catch-all proxy to Go API
      session/route.ts            # Cookie set/delete for auth
    [locale]/
      layout.tsx                  # NextIntlClientProvider wrapper
      page.tsx                    # Login page (public)
      dashboard/
        layout.tsx                # Auth guard + shell (header, nav)
        page.tsx                  # Hospital grid
        [hospitalId]/
          page.tsx                # Power BI iframe view
    globals.css
    layout.tsx                    # Root layout (html, body, providers)
    styles/
      palette.css                 # CSS custom properties (light + dark)
      fonts.css
  components/
    auth/
      GoogleLoginButton.tsx       # @react-oauth/google integration
    hospitals/
      HospitalCard.tsx            # Card with logo, name, CNES, period
      HospitalGrid.tsx            # Responsive grid wrapper
    dashboard/
      PowerBIEmbed.tsx            # iframe wrapper with loading state
    layout/
      Header.tsx                  # Top bar with logo + user menu
      Navbar.tsx                  # Navigation (minimal for v1)
      Footer.tsx                  # Company branding
      ThemeToggle.tsx             # Light/dark switch
      UserMenu.tsx                # Avatar + logout dropdown
      MobileNav.tsx               # Responsive navigation
    ui/
      card.tsx                    # shadcn/ui Card (from reference)
      button.tsx
      skeleton.tsx
      avatar.tsx
      dropdown-menu.tsx
  contexts/
    AuthContext.tsx                # Google OAuth state + login/logout
  hooks/
    useHospitals.ts               # Fetch + cache hospital list
  lib/
    api/
      client.ts                   # apiFetch<T>() Result type pattern
      types.ts                    # API response types
      hooks.ts                    # React Query wrappers (if used)
    utils.ts                      # cn() classname merge
    theme-colors.ts               # Theme initialization
  i18n/
    routing.ts                    # next-intl locale config
    request.ts                    # Server-side message loading
  messages/
    pt-BR.json                    # Portuguese translations
    en.json                       # English translations (future)
  providers/
    QueryProvider.tsx             # TanStack Query provider (optional)
  stores/
    theme.ts                      # Zustand theme store (optional)
  middleware.ts                   # Auth redirect + i18n routing
```

### Go API Structure

```
api/
  cmd/
    api/
      main.go                     # Entry point
  internal/
    config/
      config.go                   # Env var parsing (API_PORT, DB_URL, etc.)
    handler/
      hospital.go                 # GET /api/hospitals, GET /api/hospitals/:id
      auth.go                     # POST /api/auth/verify (validate Google token)
      health.go                   # GET /api/health
    service/
      hospital.go                 # Business logic for hospital operations
      auth.go                     # Token validation, whitelist check
    repository/
      hospital.go                 # SQL queries for hospitals
      user.go                     # SQL queries for allowed_users
    model/
      hospital.go                 # Hospital, DashboardConfig structs
      user.go                     # AllowedUser struct
    middleware/
      auth.go                     # Verify Bearer token from proxy
      logging.go                  # Request logging
      cors.go                     # CORS (restrictive, only Next.js origin)
    router/
      router.go                   # Route registration (chi or stdlib mux)
  migrations/
    001_create_hospitals.up.sql
    001_create_hospitals.down.sql
    002_create_dashboard_configs.up.sql
    002_create_dashboard_configs.down.sql
    003_create_allowed_users.up.sql
    003_create_allowed_users.down.sql
  Dockerfile
  go.mod
  go.sum
```

### Postgres Schema Design

```sql
-- hospitals: Core entity
CREATE TABLE hospitals (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    cnes        TEXT NOT NULL UNIQUE,          -- CNES registry number
    logo_url    TEXT,                           -- Path to hospital logo
    period_start DATE,                         -- Data coverage start
    period_end   DATE,                         -- Data coverage end
    sort_order  INTEGER NOT NULL DEFAULT 0,    -- Display ordering
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- dashboard_configs: Power BI URLs (1:many with hospitals for future multi-dashboard)
CREATE TABLE dashboard_configs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name        TEXT NOT NULL DEFAULT 'Principal',  -- Dashboard label
    embed_url   TEXT NOT NULL,                       -- Power BI embed URL
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dashboard_configs_hospital ON dashboard_configs(hospital_id);

-- allowed_users: Optional DB-backed whitelist (supplements env vars)
CREATE TABLE allowed_users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    name        TEXT,
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Schema rationale:**
- `hospitals` and `dashboard_configs` are separate because v2 will replace Power BI with custom dashboards -- the hospital entity stays, configs change.
- `allowed_users` in DB supplements env var whitelist for easier management without redeployment.
- UUIDs as primary keys for security (no sequential ID enumeration).
- `sort_order` column avoids hardcoding display order.
- `active` boolean for soft-delete without data loss.

## Data Flow

### Authentication Flow

```
1. User clicks "Sign in with Google" button
2. Google Identity Services popup opens
3. User authenticates, popup returns credential JWT
4. AuthContext.login() validates email against whitelist (client-side check)
5. Token stored in localStorage + POST /api/session sets httpOnly cookie
6. Middleware checks cookie on every non-login page load
7. All API requests via /api/proxy/* automatically include cookie
8. Proxy extracts JWT, forwards as Authorization: Bearer to Go API
9. Go auth middleware validates token, extracts user email
```

### Hospital Data Flow

```
1. Dashboard page mounts
2. useHospitals() hook calls apiFetch<Hospital[]>('/hospitals')
3. apiFetch() sends GET to /api/proxy/hospitals (browser)
4. Next.js proxy route forwards to Go API: GET http://api:8080/api/hospitals
5. Go handler -> service -> repository -> SQL: SELECT * FROM hospitals WHERE active = true ORDER BY sort_order
6. Go returns JSON array of hospitals with dashboard_configs joined
7. Proxy relays response to browser
8. HospitalGrid renders HospitalCard for each hospital
9. User clicks card -> navigates to /dashboard/[hospitalId]
10. PowerBIEmbed component fetches config and renders iframe
```

### Docker Compose Network Flow

```
                    External (host)
                         |
                    port 3000
                         |
                  +------v------+
                  |   frontend  | (Next.js)
                  +------+------+
                         |
                  internal:8080
                         |
                  +------v------+
                  |     api     | (Go)
                  +------+------+
                         |
                  internal:5432
                         |
                  +------v------+
                  |   postgres  |
                  +-------------+
```

Only port 3000 is exposed externally. The Go API and Postgres are internal-only on the Docker network. This is a security boundary -- the Go API is never directly accessible from the internet.

## Docker Compose Layout

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:8080
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - NEXT_PUBLIC_ALLOWED_DOMAIN=${ALLOWED_DOMAIN}
      - NEXT_PUBLIC_AUTH_WHITELIST=${AUTH_WHITELIST}
    depends_on:
      api:
        condition: service_healthy

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    expose:
      - "8080"
    environment:
      - PORT=8080
      - DATABASE_URL=postgres://gis:${DB_PASSWORD}@postgres:5432/gis?sslmode=disable
      - ALLOWED_DOMAIN=${ALLOWED_DOMAIN}
      - AUTH_WHITELIST=${AUTH_WHITELIST}
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=gis
      - POSTGRES_USER=gis
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gis"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

## Patterns to Follow

### Pattern 1: Catch-All API Proxy (from reference project)

**What:** Single `app/api/proxy/[...path]/route.ts` that forwards all methods to the Go API with auth headers attached server-side.

**Why:** Keeps the Go API URL and auth tokens out of the browser. The frontend only ever calls `/api/proxy/*`. This is proven in the ferreiracontabilidade reference project.

```typescript
// app/api/proxy/[...path]/route.ts
async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const target = `${API_URL}/api/${path.join('/')}${req.nextUrl.search}`
  const cookieStore = await cookies()
  const session = cookieStore.get('auth-session')?.value

  const headers: Record<string, string> = { 'Content-Type': req.headers.get('content-type') ?? 'application/json' }
  if (session) {
    headers['Authorization'] = `Bearer ${session}`
  }

  const res = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined,
  })

  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
```

### Pattern 2: Result Type for API Calls (from reference project)

**What:** Typed `Result<T, E>` discriminated union for all API calls. No thrown exceptions for expected errors.

```typescript
export type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E }
```

**Why:** Forces explicit error handling at every call site. No uncaught promise rejections. Clean pattern for loading/error/success states in components.

### Pattern 3: Go Handler/Service/Repository Layers

**What:** Strict three-layer separation. Handlers parse HTTP, services contain logic, repositories talk to the database.

```go
// handler/hospital.go
func (h *HospitalHandler) List(w http.ResponseWriter, r *http.Request) {
    hospitals, err := h.service.ListActive(r.Context())
    if err != nil {
        http.Error(w, "internal error", http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(hospitals)
}

// service/hospital.go
func (s *HospitalService) ListActive(ctx context.Context) ([]model.Hospital, error) {
    return s.repo.FindAllActive(ctx)
}

// repository/hospital.go
func (r *HospitalRepo) FindAllActive(ctx context.Context) ([]model.Hospital, error) {
    rows, err := r.db.QueryContext(ctx,
        `SELECT h.id, h.name, h.cnes, h.logo_url, h.period_start, h.period_end,
                dc.embed_url
         FROM hospitals h
         LEFT JOIN dashboard_configs dc ON dc.hospital_id = h.id AND dc.active = true
         WHERE h.active = true
         ORDER BY h.sort_order`)
    // ... scan rows
}
```

**Why:** Testable (mock at service boundary), single responsibility, easy to navigate.

### Pattern 4: CSS Custom Properties Theming (from reference project)

**What:** `palette.css` with `:root` and `[data-theme="dark"]` selectors defining all colors as CSS custom properties.

**Why:** One file controls entire color scheme. Dark mode is a single attribute toggle. Components reference variables, not hardcoded colors. Proven in the reference project.

### Pattern 5: Middleware Auth Guard in Layout

**What:** The `dashboard/layout.tsx` checks for session cookie server-side and redirects to login if missing.

```typescript
export default async function DashboardLayout({ children, params }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('auth-session')?.value
  if (!session) {
    redirect(`/${locale}/login`)
  }
  return <ShellLayout>{children}</ShellLayout>
}
```

**Why:** Auth check happens once at the layout level, not repeated in every page. Server-side redirect is instant (no flash of protected content).

## Anti-Patterns to Avoid

### Anti-Pattern 1: Frontend Calling Go API Directly

**What:** Making fetch calls from the browser directly to `http://api:8080/...`

**Why bad:** Exposes internal API URL, leaks auth tokens to browser DevTools, breaks when deployed behind reverse proxy, CORS headaches.

**Instead:** All API calls go through Next.js `/api/proxy/*` route.

### Anti-Pattern 2: Hardcoding Hospital Data in Frontend

**What:** Putting hospital names, CNES codes, or Power BI URLs in React components or JSON files.

**Why bad:** Every hospital change requires a frontend redeploy. The current system suffers from this exact problem (all data in `main.js`).

**Instead:** Store in Postgres, serve via Go API. Frontend renders whatever the API returns.

### Anti-Pattern 3: Fat Handlers in Go

**What:** Putting business logic, database queries, and HTTP parsing all in handler functions.

**Why bad:** Untestable, hard to reuse logic, grows into unmaintainable functions.

**Instead:** Handler parses request + writes response. Service contains logic. Repository owns SQL.

### Anti-Pattern 4: Shared Database Access from Frontend

**What:** Next.js server components or API routes connecting directly to Postgres.

**Why bad:** Two services owning the same database creates coupling. Go API becomes the single source of truth for data access. Schema changes only need Go updates.

**Instead:** Next.js always goes through Go API via proxy.

### Anti-Pattern 5: Storing Auth Tokens Only in localStorage

**What:** Keeping the Google JWT only in localStorage without httpOnly cookie backup.

**Why bad:** XSS can steal tokens. Server-side rendering/middleware cannot check auth.

**Instead:** Store in both localStorage (for client-side state) AND httpOnly cookie (for server-side proxy auth + middleware redirects). This is exactly what the reference project does.

## Suggested Build Order

Components have dependencies that dictate build sequence:

### Phase 1: Foundation (no external dependencies)

1. **Docker Compose skeleton** -- postgres + api + frontend services, healthchecks, volume
2. **Postgres migrations** -- hospitals, dashboard_configs, allowed_users tables + seed data
3. **Go API scaffold** -- cmd/api/main.go, config, health endpoint, DB connection
4. **Next.js scaffold** -- app router setup, palette.css, layout with providers

**Rationale:** Everything else depends on having running services and a schema.

### Phase 2: Data Layer (depends on Phase 1)

5. **Go hospital repository + service + handler** -- CRUD for hospitals, JSON responses
6. **Go migration runner** -- Apply migrations on startup or via CLI
7. **Next.js proxy route** -- `/api/proxy/[...path]` forwarding to Go
8. **API client library** -- `apiFetch<T>()` with Result type

**Rationale:** Data must flow end-to-end before building UI.

### Phase 3: Authentication (depends on Phase 1-2)

9. **Next.js AuthContext** -- Google OAuth popup, token parsing, whitelist check
10. **Session API route** -- Cookie set/delete
11. **Next.js middleware** -- Auth redirect for protected routes
12. **Go auth middleware** -- Verify Bearer token on protected endpoints

**Rationale:** Auth can be developed in parallel with data layer but must be integrated after both exist.

### Phase 4: UI (depends on Phase 2-3)

13. **Login page** -- Google sign-in button, error handling
14. **Dashboard layout shell** -- Header, nav, footer, theme toggle
15. **Hospital card grid** -- HospitalCard component, responsive grid
16. **Hospital dashboard page** -- Power BI iframe embed
17. **Dark mode** -- ThemeToggle + palette.css dark variant

**Rationale:** UI is last because it consumes all other layers.

### Phase 5: Polish (depends on Phase 4)

18. **i18n setup** -- next-intl with pt-BR messages
19. **Seed data** -- All 12 hospitals with Power BI URLs
20. **Error states** -- Loading skeletons, error boundaries, empty states
21. **Mobile responsive** -- Mobile nav, touch-friendly cards

## Scalability Considerations

| Concern | At 12 hospitals (now) | At 100 hospitals | At 1000+ hospitals |
|---------|----------------------|------------------|-------------------|
| Hospital grid | Single page, no pagination | Add search/filter | Paginated API, virtual scroll |
| API performance | Direct queries fine | Add response caching | Redis cache layer |
| Auth whitelist | Env vars sufficient | DB whitelist table | Role-based access, hospital-level permissions |
| Power BI embeds | Simple iframes | Iframe pool/lazy load | Replace with custom dashboards (v2 goal) |
| Database | Single Postgres | Same, add read replica | Partition by hospital |

For v1 with 12 hospitals, none of these scalability concerns apply. The architecture supports growth without rewrites because the component boundaries are clean.

## Sources

- Reference project: `D:\ferreiracontabilidade\app` (direct inspection of proxy, auth, layout, palette patterns)
- Current GIS system: `D:\gitlab\GIS\index.html` + `main.js` (understanding existing behavior to replicate)
- Go project layout convention: `cmd/` + `internal/` standard (golang.org/doc/modules/layout, HIGH confidence)
- Next.js App Router: Catch-all routes, server components, route handlers (HIGH confidence, verified against reference project)
