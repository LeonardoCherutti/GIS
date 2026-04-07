# Phase 1: Foundation - Research

**Researched:** 2026-04-07
**Domain:** Docker Compose orchestration, Next.js SPA scaffolding, Go API scaffolding, Postgres schema
**Confidence:** HIGH

## Summary

Phase 1 establishes the three-service architecture: Next.js frontend, Go API, and Postgres database running under Docker Compose. The reference project at `D:\ferreiracontabilidade\app` provides exact patterns for the Next.js scaffold (standalone output, palette.css, proxy route, session route, AuthContext shell, globals.css with Tailwind v4 + shadcn integration). The Go API follows standard `cmd/` + `internal/` layout with chi router and pgx driver. Postgres uses SQL migration files mounted into the container's `docker-entrypoint-initdb.d`.

All technology choices are locked by prior decisions in STACK.md and ARCHITECTURE.md. The reference project has been directly inspected and provides copy-worthy patterns for every Next.js component needed in this phase. The Go backend and Docker Compose patterns follow established conventions with HIGH confidence.

**Primary recommendation:** Clone the reference project's file structure for the frontend scaffold, adapt the proxy/session routes for GIS naming (auth-session cookie instead of firebase-session), build the Go API with minimal handler/service/repository layers (health endpoint only for Phase 1), and wire everything through Docker Compose with healthchecks.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | Docker Compose orchestrates frontend, Go API, and Postgres services | Docker Compose config from ARCHITECTURE.md + reference Dockerfile pattern verified |
| INFRA-02 | Postgres database with migrations for hospitals and dashboard configs | Schema design from ARCHITECTURE.md, migration via docker-entrypoint-initdb.d |
| INFRA-03 | Go API health endpoint responds to readiness checks | Standard chi router health handler, used in Docker healthcheck |
| INFRA-04 | Next.js app with `output: 'standalone'` mode (not export) | Reference project next.config.ts verified with standalone + COOP header |
| SPA-01 | Single page application with view handler and view context pattern | Reference project provides AuthContext, ThemeProvider, QueryProvider, [locale] layout pattern |
| SPA-02 | Next.js app/api/route.ts proxy layer communicates with Go API | Reference project proxy route at `app/api/proxy/[...path]/route.ts` verified |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Tech stack: Next.js latest (SPA, app router) + Go API + Postgres
- Auth: Google OAuth popup only, no redirect URI flow. Whitelist via env vars.
- Standards: Must match D:\ferreiracontabilidade\app patterns (components, palette.css, app router)
- Deployment: Docker Compose (frontend + API + database)
- Language: Portuguese (pt-BR) primary, i18n-ready architecture
- GSD workflow enforcement: use `/gsd:` commands for changes, not direct edits

## Standard Stack

### Core (Phase 1 subset)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.1 | Frontend SPA framework | Reference project uses exactly this version |
| React | 19.2.3 | UI library | Ships with Next.js 16 |
| TypeScript | ^5 | Type safety | Reference project standard |
| next-themes | ^0.4.6 | Dark/light toggle | Reference project uses this, needed for palette.css |
| Tailwind CSS | ^4 | Utility CSS | Reference project standard |
| shadcn/ui | ^4.1.2 (CLI) | Component library (copy-paste) | Reference project uses base-nova style |
| Go | 1.26.x | API runtime | STACK.md locked decision |
| go-chi/chi | v5 | HTTP router | STACK.md locked decision |
| jackc/pgx | v5.7.x | Postgres driver | STACK.md locked decision |
| PostgreSQL | 16-alpine | Database | STACK.md locked decision |

### Supporting (Phase 1 subset)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Class name merging | cn() utility |
| tailwind-merge | ^3.5.0 | Tailwind dedup | cn() utility |
| class-variance-authority | ^0.7.1 | Component variants | shadcn pattern |
| tw-animate-css | ^1.4.0 | Animations | shadcn component animations |
| lucide-react | ^1.7.0 | Icons | shadcn default icon set |
| sonner | ^2.0.7 | Toast notifications | Layout provider (wired in Phase 1, used later) |

### NOT needed in Phase 1 (wire later)

| Library | Phase | Reason |
|---------|-------|--------|
| @react-oauth/google | Phase 2 | Auth implementation |
| jose | Phase 2 | JWT handling |
| next-intl | Phase 4 | i18n (scaffold [locale] routing skeleton only) |
| @tanstack/react-query | Phase 2-3 | Data fetching (scaffold provider only) |
| zustand | Phase 3 | Client state |

**Installation (frontend):**
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir
cd frontend
npm install next@16.1.1 react@19.2.3 react-dom@19.2.3
npm install next-themes@^0.4.6 sonner@^2.0.7 lucide-react@^1.7.0
npm install clsx@^2.1.1 tailwind-merge@^3.5.0 class-variance-authority@^0.7.1 tw-animate-css@^1.4.0
npx shadcn@latest init
```

**Installation (backend):**
```bash
mkdir -p api/cmd/api api/internal/{config,handler,service,repository,model,middleware,router} api/migrations
cd api
go mod init github.com/your-org/gis-api
go get github.com/go-chi/chi/v5
go get github.com/jackc/pgx/v5
```

## Architecture Patterns

### Project Structure (Phase 1 deliverables)

```
GIS/
  docker-compose.yml
  .env.example
  frontend/
    Dockerfile
    package.json
    next.config.ts
    postcss.config.mjs
    tsconfig.json
    components.json              # shadcn config
    src/
      app/
        api/
          proxy/[...path]/route.ts   # Catch-all proxy to Go API
          session/route.ts           # Cookie set/delete (shell for Phase 2)
        [locale]/
          layout.tsx                 # NextIntlClientProvider (minimal)
          page.tsx                   # Redirect to /dashboard or placeholder
        globals.css                  # Tailwind + palette + shadcn imports
        layout.tsx                   # Root layout with providers
        styles/
          palette.css                # CSS custom properties (light + dark)
      components/
        ui/                          # shadcn components (button, card, skeleton)
      contexts/
        AuthContext.tsx               # Shell (Phase 2 fills in)
      lib/
        api/
          client.ts                  # apiFetch<T>() Result type
        utils.ts                     # cn() utility
        theme-colors.ts              # Palette key constants
      providers/
        QueryProvider.tsx             # TanStack Query provider shell
      i18n/
        routing.ts                   # Locale config (pt-BR default)
        request.ts                   # Server-side message loading
      messages/
        pt-BR/
          common.json                # Minimal placeholder
  api/
    Dockerfile
    go.mod
    go.sum
    cmd/
      api/
        main.go                      # Entry point
    internal/
      config/
        config.go                    # Env var parsing
      handler/
        health.go                    # GET /health
      router/
        router.go                    # Route registration
    migrations/
      001_create_hospitals.up.sql
      001_create_hospitals.down.sql
      002_create_dashboard_configs.up.sql
      002_create_dashboard_configs.down.sql
```

### Pattern 1: Next.js Standalone Dockerfile (from reference)

**What:** Multi-stage build: `node:22-alpine` builder, then minimal runner with `.next/standalone`.
**Source:** `D:\ferreiracontabilidade\app\Dockerfile` (directly verified)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### Pattern 2: globals.css with Tailwind v4 + shadcn (from reference)

**What:** CSS imports order matters. The `@custom-variant dark` directive maps dark mode to `data-theme` attribute (not class-based).
**Source:** `D:\ferreiracontabilidade\app\src\app\globals.css` (directly verified)

```css
@import "tailwindcss";
@import "./styles/palette.css";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is([data-theme="dark"] *));

@theme {
  --color-primary:          var(--palette-primary);
  --color-primary-hover:    var(--palette-primary-hover);
  --color-primary-subtle:   var(--palette-primary-subtle);
  --color-accent:           var(--palette-accent);
  --color-accent-hover:     var(--palette-accent-hover);
  --color-background:       var(--palette-background);
  --color-surface:          var(--palette-surface);
  --color-surface-raised:   var(--palette-surface-raised);
  --color-border:           var(--palette-border);
  --color-foreground:       var(--palette-foreground);
  --color-muted-fg:         var(--palette-muted-fg);
  --color-disabled-fg:      var(--palette-disabled-fg);
}
```

Plus the `:root` and `[data-theme="dark"]` blocks mapping `--palette-*` to shadcn's expected `--background`, `--foreground`, `--card`, etc. variables.

### Pattern 3: Root Layout Provider Stack (from reference)

**What:** Providers wrap in order: ThemeProvider > AuthProvider > QueryProvider. Toaster is sibling to QueryProvider.
**Source:** `D:\ferreiracontabilidade\app\src\app\layout.tsx` (directly verified)

```tsx
<html suppressHydrationWarning className={`${fontVar1} ${fontVar2}`}>
  <body className="antialiased">
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-right" richColors closeButton duration={5000} />
      </AuthProvider>
    </ThemeProvider>
  </body>
</html>
```

### Pattern 4: Catch-All Proxy Route (from reference)

**What:** `app/api/proxy/[...path]/route.ts` forwards all HTTP methods to Go API. Reads session cookie and forwards as Bearer token.
**Source:** `D:\ferreiracontabilidade\app\src\app\api\proxy\[...path]\route.ts` (directly verified)

Key differences for GIS:
- Cookie name: `auth-session` (not `firebase-session`)
- No serpro_token forwarding needed
- API_URL defaults to `http://api:8080` in Docker

### Pattern 5: Go API Minimal Health Endpoint

**What:** `GET /api/health` returns 200 with JSON body. Used by Docker healthcheck.

```go
// handler/health.go
package handler

import (
    "encoding/json"
    "net/http"
)

func Health(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
```

### Pattern 6: Go Router Setup with chi

```go
// router/router.go
package router

import (
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    "gis-api/internal/handler"
)

func New() chi.Router {
    r := chi.NewRouter()
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.RequestID)

    r.Get("/api/health", handler.Health)

    return r
}
```

### Pattern 7: Postgres Migrations via docker-entrypoint-initdb.d

**What:** SQL files in `api/migrations/` are mounted into the Postgres container's init directory. Files execute alphabetically on first boot only (when volume is empty).

```yaml
postgres:
  image: postgres:16-alpine
  volumes:
    - pgdata:/var/lib/postgresql/data
    - ./api/migrations:/docker-entrypoint-initdb.d
```

Files must be named to sort correctly: `001_create_hospitals.sql`, `002_create_dashboard_configs.sql`.

**IMPORTANT:** `docker-entrypoint-initdb.d` only runs when the data volume is empty (first boot). To re-run migrations during development, delete the volume: `docker compose down -v`.

### Pattern 8: Session Route (Cookie Management)

**What:** `app/api/session/route.ts` with POST (set cookie) and DELETE (clear cookie).
**Source:** `D:\ferreiracontabilidade\app\src\app\api\session\route.ts` (directly verified)

For Phase 1, this is a shell -- the actual auth flow uses it in Phase 2. But the route must exist because the proxy route reads the cookie.

### Anti-Patterns to Avoid

- **Direct browser-to-Go-API calls:** All API traffic goes through Next.js proxy. Go API port is NOT exposed in Docker Compose (use `expose`, not `ports`).
- **`output: 'export'`:** Prevents API route handlers. Must use `standalone`.
- **Class-based dark mode:** Use `attribute="data-theme"` with next-themes, not `class="dark"`. The `@custom-variant dark` in globals.css depends on this.
- **Skipping COOP header:** Google OAuth popup requires `Cross-Origin-Opener-Policy: same-origin-allow-popups` in next.config.ts headers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle | Manual localStorage + class toggle | next-themes with `attribute="data-theme"` | Handles flash-of-wrong-theme, SSR, system preference |
| CSS class merging | String concatenation | `cn()` from clsx + tailwind-merge | Handles Tailwind class conflicts correctly |
| API proxy | Custom Express middleware | Next.js route handler `app/api/proxy/[...path]` | Built into Next.js, zero extra dependencies |
| Container healthchecks | Custom scripts | Docker Compose `healthcheck` + `depends_on.condition` | Native Docker feature, handles startup ordering |
| Postgres init | Custom migration runner | `docker-entrypoint-initdb.d` | Built into Postgres image, runs .sql/.sh on first boot |
| Component primitives | Custom buttons/cards | shadcn/ui (copied into project) | Accessible, themeable, tested |

## Common Pitfalls

### Pitfall 1: Next.js standalone output missing static files
**What goes wrong:** After `next build`, the `.next/standalone` directory does NOT include `.next/static` or `public/`. The Docker image serves no CSS/JS/images.
**Why it happens:** Standalone mode creates a minimal server.js but expects static files to be served by CDN or copied manually.
**How to avoid:** Dockerfile must explicitly COPY both `.next/static` and `public/` into the standalone directory (reference Dockerfile does this correctly).
**Warning signs:** Browser shows unstyled HTML or 404s for static assets.

### Pitfall 2: docker-entrypoint-initdb.d only runs once
**What goes wrong:** Developer changes a migration SQL file but changes don't appear in the database.
**Why it happens:** Postgres init scripts only run when the data volume is empty. Once initialized, they never re-run.
**How to avoid:** During development, use `docker compose down -v` to delete the volume before `docker compose up`. Document this in README.
**Warning signs:** Schema changes not reflecting, old data persisting after migration edits.

### Pitfall 3: Go API healthcheck with wget in scratch/distroless image
**What goes wrong:** Docker healthcheck fails because `wget` or `curl` is not available in the minimal Go runtime image.
**Why it happens:** Multi-stage Go builds use `alpine` or `scratch` final images that may not have HTTP clients.
**How to avoid:** Either use `golang:1.26-alpine` as final image (has wget) or build a small Go binary that does the health check. Alpine is fine for this project's scale.
**Warning signs:** Container keeps restarting, healthcheck shows "unhealthy".

### Pitfall 4: HOSTNAME env var not set in Next.js container
**What goes wrong:** Next.js standalone server only listens on 127.0.0.1, unreachable from Docker network.
**Why it happens:** Default Node.js listen address is localhost, not 0.0.0.0.
**How to avoid:** Set `ENV HOSTNAME="0.0.0.0"` in Dockerfile (reference project does this).
**Warning signs:** Frontend container starts but `localhost:3000` shows connection refused.

### Pitfall 5: shadcn init failing without correct globals.css path
**What goes wrong:** `npx shadcn@latest init` cannot find the CSS file or generates wrong config.
**Why it happens:** shadcn needs to know where globals.css is to inject its variables.
**How to avoid:** Use `components.json` with `"css": "src/app/globals.css"` and `"style": "base-nova"` matching the reference project. Run shadcn init AFTER creating the base file structure.
**Warning signs:** Missing CSS variables, shadcn components unstyled.

### Pitfall 6: Tailwind v4 @custom-variant syntax
**What goes wrong:** Dark mode styles don't apply when using `dark:` Tailwind prefix.
**Why it happens:** Tailwind v4 uses CSS-first config. The dark variant must be explicitly mapped to the `data-theme` attribute selector.
**How to avoid:** Include `@custom-variant dark (&:is([data-theme="dark"] *));` in globals.css.
**Warning signs:** Dark mode toggle works (data-theme changes) but Tailwind dark: classes have no effect.

## Code Examples

### next.config.ts (verified from reference)
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }
      ]
    }]
  },
}

export default nextConfig
```

Note: next-intl plugin wrapping deferred to Phase 4. Keep config simple for Phase 1.

### postcss.config.mjs (verified from reference)
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### palette.css for GIS (adapted from reference with healthcare colors)
```css
:root {
  --palette-primary:        #094344;
  --palette-primary-hover:  #0c5657;
  --palette-primary-subtle: #e8f2f2;
  --palette-accent:         #f05483;
  --palette-accent-hover:   #e03b6a;
  --palette-background:     #ffffff;
  --palette-surface:        #f8fafb;
  --palette-surface-raised: #ffffff;
  --palette-border:         #e2e8ea;
  --palette-destructive:    #dc2626;
  --palette-destructive-fg: #ffffff;
  --palette-foreground:     #0a1628;
  --palette-muted-fg:       #6b7280;
  --palette-disabled-fg:    #9ca3af;
}

[data-theme="dark"] {
  --palette-background:     #163536;
  --palette-surface:        #1c4142;
  --palette-surface-raised: #224d4e;
  --palette-border:         #2d5e60;
  --palette-primary:        #0eb8bc;
  --palette-primary-hover:  #12d4d8;
  --palette-primary-subtle: #1a3a3b;
  --palette-accent:         #f05483;
  --palette-accent-hover:   #e03b6a;
  --palette-foreground:     #f0f4f4;
  --palette-muted-fg:       #8fa8aa;
  --palette-disabled-fg:    #4a6869;
}
```

### Go main.go entry point
```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "gis-api/internal/config"
    "gis-api/internal/router"

    "github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    cfg := config.Load()

    pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("unable to connect to database: %v", err)
    }
    defer pool.Close()

    if err := pool.Ping(context.Background()); err != nil {
        log.Fatalf("unable to ping database: %v", err)
    }
    log.Println("connected to database")

    r := router.New(pool)
    srv := &http.Server{
        Addr:    fmt.Sprintf(":%s", cfg.Port),
        Handler: r,
    }

    go func() {
        log.Printf("server listening on :%s", cfg.Port)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("server error: %v", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
}
```

### Go config.go
```go
package config

import "os"

type Config struct {
    Port        string
    DatabaseURL string
}

func Load() Config {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    return Config{
        Port:        port,
        DatabaseURL: os.Getenv("DATABASE_URL"),
    }
}
```

### Go Dockerfile (multi-stage)
```dockerfile
FROM golang:1.26-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /api ./cmd/api

FROM alpine:3.19
RUN apk add --no-cache wget
WORKDIR /app
COPY --from=builder /api .
EXPOSE 8080
CMD ["./api"]
```

Note: Using alpine (not scratch) so `wget` is available for Docker healthcheck.

### Postgres Migration: 001_create_hospitals.sql
```sql
CREATE TABLE IF NOT EXISTS hospitals (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    cnes        TEXT NOT NULL UNIQUE,
    logo_url    TEXT,
    period_start DATE,
    period_end   DATE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Postgres Migration: 002_create_dashboard_configs.sql
```sql
CREATE TABLE IF NOT EXISTS dashboard_configs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name        TEXT NOT NULL DEFAULT 'Principal',
    embed_url   TEXT NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_configs_hospital ON dashboard_configs(hospital_id);
```

### docker-compose.yml
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
      - DATABASE_URL=postgres://gis:${DB_PASSWORD:-gisdev}@postgres:5432/gis?sslmode=disable
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./api/migrations:/docker-entrypoint-initdb.d
    environment:
      - POSTGRES_DB=gis
      - POSTGRES_USER=gis
      - POSTGRES_PASSWORD=${DB_PASSWORD:-gisdev}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gis"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

### .env.example
```
DB_PASSWORD=gisdev
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Docker | Containerization | Yes | 27.0.3 | -- |
| Docker Compose | Service orchestration | Yes | v2.28.1 | -- |
| Node.js | Frontend dev | Yes | v22.10.0 | -- |
| npm | Package management | Yes | 10.9.0 | -- |
| Go | API development | Yes | 1.24.1 (local) | Docker uses 1.26-alpine |
| PostgreSQL | Database | Via Docker | 16-alpine | -- |

**Note:** Local Go is 1.24.1 but Docker build uses `golang:1.26-alpine`. This is fine -- all Go compilation happens inside Docker. Local Go is only needed for IDE support and running `go mod tidy`.

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.

## Seed Data Reference

The existing `main.js` contains 12 hospitals that need to be seeded into Postgres. The seed SQL should be a separate migration file (e.g., `003_seed_hospitals.sql`) that inserts into both `hospitals` and `dashboard_configs` tables. The CNES codes are not present in the current system (placeholder IDs like 'estudo-a' are used) -- real CNES codes should be looked up or placeholder values used for now.

Hospital names from current system:
1. Hospital Center Clinicas
2. Hospital Geral Cleriston Andrade
3. UPAs Florianopolis
4. Hospital Nsa. Sra. da Imaculada Conceicao
5. Hospital do Coracao de Cariri
6. Maternidade Santo Antonio HMSA
7. Hospital do Idoso Zilda Arns
8. Hospital Municipal Dr. Ricardo de Tadeu Ladeia
9. Hospital Nsa. Sra. Das Gracas
10. Hospital Nsa. Sra. do Perpetuo Socorro
11. Hospital do Cancer de Londrina
12. Hospital Sao Vicente de Paulo

Each has a Power BI embed URL in the current `main.js` that should be preserved in the seed data.

## Open Questions

1. **CNES codes for hospitals**
   - What we know: Current system uses placeholder IDs (estudo-a through estudo-l), not real CNES codes
   - What's unclear: Whether real CNES registry numbers are available
   - Recommendation: Use placeholder CNES codes (e.g., "0000001" through "0000012") in seed data. Real codes can be updated later via SQL.

2. **Go module path**
   - What we know: Need a Go module name for `go.mod`
   - What's unclear: Preferred organization/repo path
   - Recommendation: Use `gis-api` as a simple module name (no GitHub path needed for a private project).

## Sources

### Primary (HIGH confidence)
- Reference project `D:\ferreiracontabilidade\app` - Directly inspected: package.json, next.config.ts, Dockerfile, globals.css, palette.css, proxy route, session route, AuthContext, layout.tsx, components.json, tsconfig.json, postcss.config.mjs, i18n config, lib/utils.ts, lib/api/client.ts, providers/QueryProvider.tsx, theme-colors.ts
- STACK.md research document - All library versions and rationale
- ARCHITECTURE.md research document - Full system architecture, schema design, data flows

### Secondary (MEDIUM confidence)
- Docker Compose healthcheck patterns - Standard Docker documentation patterns
- Go chi router patterns - Standard community conventions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified against reference project package.json and STACK.md research
- Architecture: HIGH - Reference project provides exact patterns, ARCHITECTURE.md covers full design
- Pitfalls: HIGH - Based on direct experience with Next.js standalone + Docker patterns

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable infrastructure patterns, 30 days)
