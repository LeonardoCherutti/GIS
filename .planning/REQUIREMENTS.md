# Requirements: GIS - Gestao Inteligente em Saude

**Defined:** 2026-04-07
**Core Value:** Authenticated users can quickly access hospital-specific Power BI dashboards from a single, clean portal

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: Docker Compose orchestrates frontend, Go API, and Postgres services
- [ ] **INFRA-02**: Postgres database with migrations for hospitals and dashboard configs
- [ ] **INFRA-03**: Go API health endpoint responds to readiness checks
- [ ] **INFRA-04**: Next.js app with `output: 'standalone'` mode (not export)

### Authentication

- [ ] **AUTH-01**: User can sign in via Google OAuth popup (no redirect URI)
- [ ] **AUTH-02**: Only whitelisted emails and specified domain emails can access (env var driven)
- [ ] **AUTH-03**: User session persists across tab close via httpOnly cookie with token refresh
- [ ] **AUTH-04**: User can log out with full session cleanup
- [ ] **AUTH-05**: Auth loading state shown during OAuth popup flow
- [ ] **AUTH-06**: Go API middleware validates auth on protected endpoints
- [ ] **AUTH-07**: Next.js proxy route forwards auth headers to Go API

### SPA Architecture

- [ ] **SPA-01**: Single page application with view handler and view context pattern
- [ ] **SPA-02**: Next.js app/api/route.ts proxy layer communicates with Go API
- [ ] **SPA-03**: Client-side view transitions (login -> grid -> dashboard) without full page reloads
- [ ] **SPA-04**: URL-based routing for dashboards (e.g., /hospital/[cnes])
- [ ] **SPA-05**: Browser back/forward navigation works correctly within SPA

### Hospital Grid

- [ ] **GRID-01**: Hospital cards loaded from Go API (database-driven, placeholder config for v1)
- [ ] **GRID-02**: Each card displays hospital logo, name, CNES code, and data period
- [ ] **GRID-03**: Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] **GRID-04**: Click on card navigates to hospital dashboard view
- [ ] **GRID-05**: Search/filter input filters hospitals by name or CNES
- [ ] **GRID-06**: Skeleton loading placeholders while hospital data loads
- [ ] **GRID-07**: Pagination for hospital grid

### Dashboard Display

- [ ] **DASH-01**: Power BI iframe embeds correctly with proper CSP frame-src headers
- [ ] **DASH-02**: Loading indicator shown while Power BI iframe loads (3-10 seconds)
- [ ] **DASH-03**: Dashboard title (hospital name) displayed in header
- [ ] **DASH-04**: Back navigation returns to hospital grid
- [ ] **DASH-05**: Fullscreen toggle for Power BI iframe
- [ ] **DASH-06**: Error boundary with retry button when iframe fails to load

### Visual Design

- [ ] **UI-01**: palette.css with CSS custom properties for light and dark themes
- [ ] **UI-02**: Dark mode toggle persisted in localStorage
- [ ] **UI-03**: Global header with logo, portal name, user profile, dark mode toggle, logout
- [ ] **UI-04**: Global footer with company branding
- [ ] **UI-05**: Reusable component architecture (cards, buttons, inputs, layout)
- [ ] **UI-06**: Palette system matching ferreiracontabilidade reference patterns

### User Experience

- [ ] **UX-01**: User profile display in header (Google avatar + email)
- [ ] **UX-02**: Toast notification system for feedback (login success, errors, etc.)
- [ ] **UX-03**: All 12 existing hospitals seeded in database with Power BI URLs

### Internationalization

- [ ] **I18N-01**: next-intl configured with [locale] routing
- [ ] **I18N-02**: All UI strings extracted to pt-BR message files (no hardcoded Portuguese)
- [ ] **I18N-03**: i18n-ready architecture supporting future language additions

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
| INFRA-01 | Pending | Pending |
| INFRA-02 | Pending | Pending |
| INFRA-03 | Pending | Pending |
| INFRA-04 | Pending | Pending |
| AUTH-01 | Pending | Pending |
| AUTH-02 | Pending | Pending |
| AUTH-03 | Pending | Pending |
| AUTH-04 | Pending | Pending |
| AUTH-05 | Pending | Pending |
| AUTH-06 | Pending | Pending |
| AUTH-07 | Pending | Pending |
| SPA-01 | Pending | Pending |
| SPA-02 | Pending | Pending |
| SPA-03 | Pending | Pending |
| SPA-04 | Pending | Pending |
| SPA-05 | Pending | Pending |
| GRID-01 | Pending | Pending |
| GRID-02 | Pending | Pending |
| GRID-03 | Pending | Pending |
| GRID-04 | Pending | Pending |
| GRID-05 | Pending | Pending |
| GRID-06 | Pending | Pending |
| GRID-07 | Pending | Pending |
| DASH-01 | Pending | Pending |
| DASH-02 | Pending | Pending |
| DASH-03 | Pending | Pending |
| DASH-04 | Pending | Pending |
| DASH-05 | Pending | Pending |
| DASH-06 | Pending | Pending |
| UI-01 | Pending | Pending |
| UI-02 | Pending | Pending |
| UI-03 | Pending | Pending |
| UI-04 | Pending | Pending |
| UI-05 | Pending | Pending |
| UI-06 | Pending | Pending |
| UX-01 | Pending | Pending |
| UX-02 | Pending | Pending |
| UX-03 | Pending | Pending |
| I18N-01 | Pending | Pending |
| I18N-02 | Pending | Pending |
| I18N-03 | Pending | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 0
- Unmapped: 41

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after initial definition*
