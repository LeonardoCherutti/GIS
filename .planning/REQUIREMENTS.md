# Requirements: GIS - Gestao Inteligente em Saude

**Defined:** 2026-04-07
**Core Value:** Authenticated users can quickly access hospital-specific Power BI dashboards from a single, clean portal

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Docker Compose orchestrates frontend, Go API, and Postgres services
- [x] **INFRA-02**: Postgres database with migrations for hospitals and dashboard configs
- [x] **INFRA-03**: Go API health endpoint responds to readiness checks
- [x] **INFRA-04**: Next.js app with `output: 'standalone'` mode (not export)

### Authentication

- [x] **AUTH-01**: User can sign in via Google OAuth popup (no redirect URI)
- [x] **AUTH-02**: Only whitelisted emails and specified domain emails can access (env var driven)
- [x] **AUTH-03**: User session persists across tab close via httpOnly cookie with token refresh
- [x] **AUTH-04**: User can log out with full session cleanup
- [x] **AUTH-05**: Auth loading state shown during OAuth popup flow
- [x] **AUTH-06**: Go API middleware validates auth on protected endpoints
- [x] **AUTH-07**: Next.js proxy route forwards auth headers to Go API

### SPA Architecture

- [x] **SPA-01**: Single page application with view handler and view context pattern
- [x] **SPA-02**: Next.js app/api/route.ts proxy layer communicates with Go API
- [x] **SPA-03**: Client-side view transitions (login -> grid -> dashboard) without full page reloads
- [x] **SPA-04**: URL-based routing for dashboards (e.g., /hospital/[cnes])
- [x] **SPA-05**: Browser back/forward navigation works correctly within SPA

### Hospital Grid

- [x] **GRID-01**: Hospital cards loaded from Go API (database-driven, placeholder config for v1)
- [x] **GRID-02**: Each card displays hospital logo, name, CNES code, and data period
- [x] **GRID-03**: Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- [x] **GRID-04**: Click on card navigates to hospital dashboard view
- [x] **GRID-05**: Search/filter input filters hospitals by name or CNES
- [x] **GRID-06**: Skeleton loading placeholders while hospital data loads
- [x] **GRID-07**: Pagination for hospital grid

### Dashboard Display

- [x] **DASH-01**: Power BI iframe embeds correctly with proper CSP frame-src headers
- [x] **DASH-02**: Loading indicator shown while Power BI iframe loads (3-10 seconds)
- [x] **DASH-03**: Dashboard title (hospital name) displayed in header
- [x] **DASH-04**: Back navigation returns to hospital grid
- [x] **DASH-05**: Fullscreen toggle for Power BI iframe
- [x] **DASH-06**: Error boundary with retry button when iframe fails to load

### Visual Design

- [x] **UI-01**: palette.css with CSS custom properties for light and dark themes
- [x] **UI-02**: Dark mode toggle persisted in localStorage
- [x] **UI-03**: Global header with logo, portal name, user profile, dark mode toggle, logout
- [x] **UI-04**: Global footer with company branding
- [x] **UI-05**: Reusable component architecture (cards, buttons, inputs, layout)
- [x] **UI-06**: Palette system matching ferreiracontabilidade reference patterns

### User Experience

- [x] **UX-01**: User profile display in header (Google avatar + email)
- [x] **UX-02**: Toast notification system for feedback (login success, errors, etc.)
- [x] **UX-03**: All 12 existing hospitals seeded in database with Power BI URLs

### Internationalization

- [x] **I18N-01**: next-intl configured with [locale] routing
- [x] **I18N-02**: All UI strings extracted to pt-BR message files (no hardcoded Portuguese)
- [x] **I18N-03**: i18n-ready architecture supporting future language additions

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Custom Dashboards

- **CDASH-01**: Replace Power BI iframes with custom data visualizations reading from Postgres
- **CDASH-02**: Interactive charts and filters for hospital analytics

### Hospital Management

- **HMGMT-01**: Admin panel for adding/editing/removing hospitals
- **HMGMT-02**: Per-user hospital access control (RBAC)
- **HMGMT-03**: Hospital logo upload and management

### Advanced Features

- **ADV-01**: Favorites / recently viewed hospitals
- **ADV-02**: Session timeout warning (idle auto-logout)
- **ADV-03**: Audit logging for auth events
- **ADV-04**: Complex search filters (date range, region, specialty)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Custom data visualizations | v2+ scope, Power BI serves current needs |
| Admin panel | Hospitals managed via DB/seed scripts in v1 |
| RBAC / per-user access | All users see all hospitals, insufficient scale to justify |
| Mobile native app | Web-first, Power BI not mobile-friendly |
| Real-time data / WebSockets | Dashboard data is periodic, no live feeds |
| Multi-tenant white-labeling | Single organization portal |
| Email/SMS notifications | No notification events in dashboard portal |
| Data export / PDF | Power BI handles its own exports |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| SPA-01 | Phase 1 | Complete |
| SPA-02 | Phase 1 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| AUTH-04 | Phase 2 | Complete |
| AUTH-05 | Phase 2 | Complete |
| AUTH-06 | Phase 2 | Complete |
| AUTH-07 | Phase 2 | Complete |
| SPA-03 | Phase 2 | Complete |
| SPA-04 | Phase 2 | Complete |
| SPA-05 | Phase 2 | Complete |
| GRID-01 | Phase 3 | Complete |
| GRID-02 | Phase 3 | Complete |
| GRID-03 | Phase 3 | Complete |
| GRID-04 | Phase 3 | Complete |
| GRID-05 | Phase 3 | Complete |
| GRID-06 | Phase 3 | Complete |
| GRID-07 | Phase 3 | Complete |
| DASH-01 | Phase 3 | Complete |
| DASH-02 | Phase 3 | Complete |
| DASH-03 | Phase 3 | Complete |
| DASH-04 | Phase 3 | Complete |
| DASH-05 | Phase 3 | Complete |
| DASH-06 | Phase 3 | Complete |
| UI-01 | Phase 3 | Complete |
| UI-02 | Phase 3 | Complete |
| UI-03 | Phase 3 | Complete |
| UI-04 | Phase 3 | Complete |
| UI-05 | Phase 3 | Complete |
| UI-06 | Phase 3 | Complete |
| UX-01 | Phase 3 | Complete |
| UX-02 | Phase 3 | Complete |
| UX-03 | Phase 3 | Complete |
| I18N-01 | Phase 4 | Complete |
| I18N-02 | Phase 4 | Complete |
| I18N-03 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after roadmap creation*
