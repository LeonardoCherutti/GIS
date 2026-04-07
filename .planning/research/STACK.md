# Technology Stack

**Project:** GIS - Gestao Inteligente em Saude
**Researched:** 2026-04-07
**Overall confidence:** HIGH

## Recommended Stack

### Core Frontend

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 16.1.1 | App framework (SPA, app router) | Matches reference project; v16 stable with React 19.2, React Compiler, app router mature. Use `output: 'standalone'` for Docker + API route proxying. | HIGH |
| React | 19.2.3 | UI library | Ships with Next.js 16; React Compiler auto-memoization eliminates manual useMemo/useCallback. | HIGH |
| TypeScript | ^5 | Type safety | Non-negotiable for any production frontend. | HIGH |
| next-intl | ^4.8.4 | i18n (pt-BR primary, future languages) | Purpose-built for Next.js app router. Server Component support via `getTranslations()`, client via `useTranslations()`. ~2KB bundle. Reference project already uses this exact version. | HIGH |
| next-themes | ^0.4.6 | Dark/light mode toggle | Zero-flash theme switching, works with CSS custom properties via `data-theme` attribute. Reference project uses this. | HIGH |
| @react-oauth/google | ^0.13.4 | Google OAuth popup login | Renders official Google button, manages popup flow, returns JWT credential. Reference project uses this. No redirect URI needed -- popup only. | HIGH |
| jose | ^6.2.2 | JWT handling (frontend) | Lightweight JWT decode/verify for client-side token inspection. Reference project uses this. | HIGH |

### UI & Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4 | Utility-first CSS | Reference project standard. v4 has new engine, CSS-first config. | HIGH |
| shadcn/ui | ^4.1.2 | Component library (copy-paste) | Not a dependency -- components are copied into project. CLI v4 supports Next.js + Tailwind v4. Uses Radix UI primitives for accessibility. | HIGH |
| @base-ui/react | ^1.3.0 | Headless UI primitives | Used by shadcn v4 as alternative to Radix for some components. Reference project includes it. | HIGH |
| class-variance-authority | ^0.7.1 | Component variant management | Clean API for conditional class composition. shadcn pattern. | HIGH |
| clsx | ^2.1.1 | Class name merging | Lightweight conditional class joining. | HIGH |
| tailwind-merge | ^3.5.0 | Tailwind class deduplication | Resolves conflicting Tailwind classes. Used with clsx in `cn()` utility. | HIGH |
| lucide-react | ^1.7.0 | Icon library | Tree-shakeable, consistent icons. Reference project uses this. | HIGH |
| palette.css | N/A | CSS custom properties theming | Not a library -- a project file. Define `--palette-*` variables in `:root` and `[data-theme="dark"]`. Pattern from reference project. See Architecture for details. | HIGH |

### State & Data

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @tanstack/react-query | ^5.96.0 | Server state / data fetching | Cache, refetch, loading/error states for API calls. De facto standard for React data fetching. Reference project uses this. | HIGH |
| zustand | ^5.0.12 | Client state management | Minimal boilerplate, no providers needed, works with React 19. Only for truly client-side state (theme, UI toggles). Reference project uses this. | HIGH |
| sonner | ^2.0.7 | Toast notifications | Lightweight, accessible toast system. Reference project uses this. | HIGH |

### Go Backend

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Go | 1.26.x | Language runtime | Latest stable (1.26.1 as of March 2026). Green Tea GC enabled by default, ~30% less cgo overhead. | HIGH |
| go-chi/chi | v5 | HTTP router | Lightweight, idiomatic, composable. stdlib `net/http` compatible middleware. No magic -- just `http.Handler`. Actively maintained (Feb 2026 release). Better than Gin for this use case because it stays close to stdlib. | HIGH |
| jackc/pgx | v5.7.x | PostgreSQL driver | The Go community consensus pick. 50% faster than lib/pq with native interface, actively maintained. lib/pq is effectively deprecated. Supports connection pooling via pgxpool. | HIGH |
| google.golang.org/api/idtoken | latest | Google ID token verification | Official Google library for verifying ID tokens in Go. Handles JWKS fetching, key rotation, and claim validation. Use `idtoken.Validate(ctx, token, audience)`. | HIGH |
| golang-jwt/jwt | v5 | JWT creation/signing | For creating session JWTs after Google ID token verification. Session tokens signed with app secret, short-lived. | HIGH |
| rs/cors | latest | CORS middleware | Clean CORS configuration for chi. Needed because frontend and API are separate services in Docker. | MEDIUM |

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| PostgreSQL | 16 | Primary database | Stable, mature, excellent JSON support for flexible hospital config. v16 for logical replication improvements and performance. | HIGH |

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Docker | latest | Containerization | Multi-stage builds for both frontend and backend. | HIGH |
| Docker Compose | v2 | Service orchestration | Three services: frontend, api, postgres. Single `docker compose up`. | HIGH |
| Node.js | 22-alpine | Frontend runtime (Docker) | LTS version for Next.js standalone server in container. Alpine for minimal image size. | HIGH |
| golang | 1.26-alpine | Backend build (Docker) | Multi-stage: build with golang image, run with alpine for ~15MB final image. | HIGH |

### Dev Dependencies

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @tailwindcss/postcss | ^4 | Tailwind build integration | PostCSS plugin for Tailwind v4. | HIGH |
| eslint | ^9 | Linting | Flat config (eslint.config.js). | HIGH |
| eslint-config-next | 16.1.1 | Next.js ESLint rules | Match Next.js version. | HIGH |
| tw-animate-css | ^1.4.0 | Tailwind animation utilities | CSS animations for shadcn components. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Go router | chi v5 | Gin | Gin adds unnecessary abstraction over stdlib. Chi stays close to `net/http`, better for a simple API with ~5 endpoints. |
| Go router | chi v5 | stdlib only (Go 1.22+ routing) | Go 1.22 added pattern routing, but chi provides middleware composition (logging, CORS, recovery) out of the box. Worth the minimal dependency. |
| Postgres driver | pgx v5 | lib/pq | lib/pq is in maintenance mode. Maintainers themselves recommend pgx. |
| State management | zustand | Redux Toolkit | Massive overkill for a dashboard portal with minimal client state. |
| State management | zustand | Jotai | Either works; zustand is already in reference project. Consistency wins. |
| CSS framework | Tailwind v4 | CSS Modules | Reference project uses Tailwind. Consistency and velocity. |
| i18n | next-intl | react-i18next | next-intl is purpose-built for Next.js app router with native Server Component support. react-i18next requires wrapper components. |
| Auth (frontend) | @react-oauth/google | NextAuth.js | NextAuth is server-side auth with sessions. This project needs popup-only Google Sign-In with token passed to Go backend. @react-oauth/google does exactly that with zero server-side complexity on the Next.js side. |
| Component lib | shadcn/ui | Material UI / Chakra | shadcn copies components into your project (ownership, customization). MUI/Chakra are runtime dependencies with opinions about theming that conflict with palette.css pattern. |
| Icons | lucide-react | react-icons / heroicons | lucide-react is shadcn default, tree-shakeable, consistent style. |
| Docker output | standalone | export (static) | `output: 'export'` would prevent API route handlers (`app/api/route.ts`) which are needed to proxy requests to the Go backend (avoiding CORS in production). `standalone` runs a minimal Node server. |

## Key Architecture Decisions in Stack

### Next.js as SPA with `output: 'standalone'`

Use `output: 'standalone'` (NOT `output: 'export'`). This runs a lightweight Node.js server that:
- Serves the SPA with client-side routing
- Provides `app/api/*` route handlers to proxy requests to the Go backend
- Handles `Cross-Origin-Opener-Policy: same-origin-allow-popups` header (required for Google OAuth popup)
- Supports next-intl middleware for locale detection

The app behaves as an SPA (client-side navigation via `<Link>`, no full page reloads) but has the Node server for API proxying and headers.

### Google OAuth Flow

1. Frontend: `@react-oauth/google` `<GoogleLogin>` component opens popup
2. User authenticates with Google, popup returns JWT credential (ID token)
3. Frontend sends ID token to Go API (`POST /api/auth/login`)
4. Go API verifies ID token using `google.golang.org/api/idtoken.Validate()`
5. Go API checks email against whitelist (env var)
6. Go API creates short-lived session JWT (signed with app secret) and returns it
7. Frontend stores session JWT, sends it on subsequent API requests

### palette.css Pattern

CSS custom properties defined in `palette.css`, toggled by `data-theme` attribute:

```css
:root {
  --palette-primary:        #094344;
  --palette-background:     #ffffff;
  --palette-surface:        #f8fafb;
  --palette-foreground:     #0a1628;
  --palette-muted-fg:       #6b7280;
  --palette-border:         #e2e8ea;
  /* ... */
}

[data-theme="dark"] {
  --palette-background:     #163536;
  --palette-surface:        #1c4142;
  --palette-foreground:     #f0f4f4;
  /* ... */
}
```

`next-themes` sets the `data-theme` attribute. Components reference `var(--palette-*)` in Tailwind or direct CSS. This decouples theming from component logic completely.

## Installation

### Frontend

```bash
# Initialize Next.js project
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir

# Core dependencies
npm install next@16.1.1 react@19.2.3 react-dom@19.2.3
npm install @react-oauth/google@^0.13.4 jose@^6.2.2
npm install next-intl@^4.8.4 next-themes@^0.4.6
npm install @tanstack/react-query@^5.96.0 zustand@^5.0.12
npm install sonner@^2.0.7
npm install lucide-react@^1.7.0

# shadcn/ui (copies components, also installs @base-ui/react, cva, clsx, tailwind-merge)
npx shadcn@latest init

# Dev dependencies
npm install -D @tailwindcss/postcss@^4 tailwindcss@^4 typescript@^5
npm install -D eslint@^9 eslint-config-next@16.1.1
npm install -D @types/node@^20 @types/react@^19 @types/react-dom@^19
npm install -D tw-animate-css@^1.4.0
```

### Backend (Go)

```bash
# Initialize module
go mod init github.com/your-org/gis-api

# Dependencies
go get github.com/go-chi/chi/v5
go get github.com/jackc/pgx/v5
go get github.com/golang-jwt/jwt/v5
go get google.golang.org/api/idtoken
go get github.com/rs/cors
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - API_URL=http://api:8080
    depends_on:
      - api

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://gis:${POSTGRES_PASSWORD}@postgres:5432/gis?sslmode=disable
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - ALLOWED_EMAILS=${ALLOWED_EMAILS}
      - ALLOWED_DOMAINS=${ALLOWED_DOMAINS}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=gis
      - POSTGRES_USER=gis
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./api/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gis"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| NextAuth.js / Auth.js | Server-side session management is overkill. This project uses popup Google Sign-In with token verification on the Go backend. NextAuth would create a parallel auth system. |
| Prisma (on frontend) | Database access belongs in the Go API, not the Next.js layer. No ORM needed on the frontend. |
| lib/pq | Deprecated in practice. Maintainers recommend pgx. |
| Redux / Redux Toolkit | Massive complexity for ~3 pieces of client state. |
| Styled Components / Emotion | CSS-in-JS is falling out of favor with React Server Components. Tailwind + CSS custom properties is the modern pattern. |
| express / fastify (Node backend) | Go was chosen for the backend. Don't add a second backend runtime. |
| `output: 'export'` | Prevents API route handlers needed for backend proxying and COOP headers. |

## Sources

- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16) - Verified version 16, React 19.2, React Compiler
- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) - SPA and standalone output modes
- [go-chi/chi GitHub](https://github.com/go-chi/chi) - v5 latest, Feb 2026 release
- [jackc/pgx GitHub](https://github.com/jackc/pgx) - v5.7.x, Mar 2026 release
- [Go 1.26 Release](https://go.dev/blog/go1.26) - Feb 2026, Green Tea GC
- [google.golang.org/api/idtoken](https://pkg.go.dev/google.golang.org/api/idtoken) - Official Google ID token verification
- [golang-jwt/jwt](https://github.com/golang-jwt/jwt) - v5 JWT library
- [@react-oauth/google npm](https://www.npmjs.com/package/@react-oauth/google) - v0.13.4 popup OAuth
- [next-intl docs](https://next-intl.dev/docs/getting-started/app-router) - v4.8.4 app router i18n
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - v0.4.6 dark mode
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) - Mar 2026 release
- [Google ID Token Verification Guide](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) - Official verification docs
- Reference project: `D:\ferreiracontabilidade\app\package.json` - Validated all frontend versions
- Reference project: `D:\ferreiracontabilidade\app\src\app\styles\palette.css` - Validated palette.css pattern
- Reference project: `D:\ferreiracontabilidade\app\next.config.ts` - Validated standalone output + COOP header
