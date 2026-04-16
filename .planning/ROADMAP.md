# Roadmap: GIS - Gestao Inteligente em Saude

**Created:** 2026-04-07
**Milestone:** v1
**Granularity:** Coarse
**Requirements covered:** 41/41

---

## Phases

- [x] **Phase 1: Foundation** - Docker Compose skeleton, Postgres schema, Go scaffold, Next.js scaffold with proxy wiring
- [x] **Phase 2: Auth + Data** - Google OAuth popup, session cookies, auth middleware, hospital API endpoints, SPA navigation
- [ ] **Phase 3: Core UI** - Hospital card grid, Power BI dashboard embed, design system, dark mode, user profile
- [x] **Phase 4: Polish + i18n** - next-intl with pt-BR messages, i18n-ready architecture (completed 2026-04-07)
- [ ] **Phase 5: RBAC** - Two-role permission system (Admin + Manager) with hospital-level access control
- [ ] **Phase 6: Password Security + Recovery** - Strong password enforcement and self-service forgot-password flow

---

## Phase Details

### Phase 1: Foundation
**Goal**: All three services run locally under Docker Compose with verified connectivity and database schema in place
**Depends on**: Nothing
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, SPA-01, SPA-02
**Success Criteria** (what must be TRUE):
  1. `docker compose up` starts frontend, Go API, and Postgres with no manual intervention
  2. Go API health endpoint returns 200 at `GET /health`
  3. Next.js app loads in browser at `localhost:3000` with SPA routing active (no full reloads on navigation)
  4. Next.js proxy route forwards requests to Go API and returns data (verifiable with browser network tab)
  5. Postgres migrations run on first boot and create the hospitals/dashboard_configs tables
**Plans:** 3/3 plans executed

Plans:
- [x] 01-01-PLAN.md — Go API scaffold with chi router, health endpoint, Postgres migrations, and seed data
- [x] 01-02-PLAN.md — Next.js scaffold with palette.css, provider stack, proxy route, and API client
- [x] 01-03-PLAN.md — Docker Compose orchestration, Dockerfiles, and end-to-end verification

**UI hint**: yes

### Phase 2: Auth + Data
**Goal**: Users can securely sign in with Google, are validated against the whitelist, and the app serves real hospital data from the database
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, SPA-03, SPA-04, SPA-05
**Success Criteria** (what must be TRUE):
  1. User can sign in via Google OAuth popup without any page redirect
  2. A non-whitelisted Google account is rejected with a clear error message
  3. User session survives browser tab close and returns the user to the grid on reopen
  4. User can log out and is returned to the login screen with session fully cleared
  5. Browser back/forward navigation moves correctly between login, grid, and dashboard views without full reloads
**Plans:** 3/3 plans executed

Plans:
- [x] 02-01-PLAN.md — Go API auth + hospital endpoints (config, auth service, middleware, hospital repository)
- [x] 02-02-PLAN.md — Frontend auth (AuthContext with Google OAuth, LoginButton, session management)
- [x] 02-03-PLAN.md — SPA navigation (AuthGuard, hospital grid page, dashboard page, routing)

### Phase 3: Core UI
**Goal**: An authenticated user can browse all hospitals in a grid, click into any hospital's Power BI dashboard, and experience a polished design with dark mode
**Depends on**: Phase 2
**Requirements**: GRID-01, GRID-02, GRID-03, GRID-04, GRID-05, GRID-06, GRID-07, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. All 12 seeded hospitals appear in the grid as cards with logo, name, CNES code, and data period
  2. Clicking a hospital card opens the Power BI iframe and shows a loading indicator while it loads
  3. User can filter hospitals by name or CNES code and results update instantly
  4. Dark mode toggle switches the palette and the preference is remembered on next visit
  5. User avatar and email are visible in the header; toast notifications appear on auth events and errors
**Plans:** 4/5 plans executed

Plans:
- [x] 03-01-PLAN.md — Seed data fix (real CNES, periods, logos) + CSP frame-src for Power BI
- [x] 03-02-PLAN.md — Design system: shared layout, AppHeader, AppFooter, ThemeToggle, UserMenu
- [x] 03-03-PLAN.md — Hospital card grid with search/filter, skeleton loading, pagination
- [x] 03-04-PLAN.md — Power BI dashboard embed with loading, error boundary, fullscreen
- [x] 03-05-PLAN.md — Visual and functional verification checkpoint

**UI hint**: yes

### Phase 4: Polish + i18n
**Goal**: Every visible UI string is served from pt-BR message files and the architecture supports adding new locales without code changes
**Depends on**: Phase 3
**Requirements**: I18N-01, I18N-02, I18N-03
**Success Criteria** (what must be TRUE):
  1. Changing the locale segment in the URL (e.g., `/en` vs `/pt-BR`) switches UI language without a full page reload
  2. Zero hardcoded Portuguese strings exist in component JSX -- all text comes from next-intl message files
  3. Adding a new locale requires only a new messages JSON file and a config entry, no component changes
**Plans:** 2/2 plans complete

Plans:
- [x] 04-01-PLAN.md — Install next-intl, configure [locale] routing, proxy.ts, message files, route restructuring
- [x] 04-02-PLAN.md — Extract all hardcoded Portuguese strings to useTranslations() calls

**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-04-07 |
| 2. Auth + Data | 3/3 | Complete | 2026-04-07 |
| 3. Core UI | 4/5 | In Progress|  |
| 4. Polish + i18n | 2/2 | Complete   | 2026-04-07 |
| 5. RBAC | 0/4 | Planned | |
| 6. Password Security + Recovery | 0/3 | Planned | |

### Phase 5: Role-Based Access Control (RBAC)

**Goal:** Admins and managers can log in with role-appropriate access -- admins see all hospitals and manage users, managers see only assigned hospitals
**Requirements**: RBAC-01, RBAC-02, RBAC-03, RBAC-04, RBAC-05, RBAC-06, RBAC-07, RBAC-08, RBAC-09, RBAC-10, RBAC-11, RBAC-12
**Depends on:** Phase 4
**Success Criteria** (what must be TRUE):
  1. Admin-email user auto-receives admin role on first login
  2. Admin can create managers, assign hospitals, and delete managers via /admin page
  3. Managers see only their assigned hospitals in the grid
  4. Unregistered Google accounts are rejected with "Acesso negado. Contate o administrador."
  5. Non-admin users cannot access the /admin page
**Plans:** 4 plans

Plans:
- [ ] 05-01-PLAN.md — DB schema (users + user_hospitals), Go models, UserRepo, config migration
- [ ] 05-02-PLAN.md — Auth refactor (DB lookup), role in JWT/middleware, hospital filtering, RequireAdmin
- [ ] 05-03-PLAN.md — Admin CRUD API endpoints (list/create/update/delete users)
- [ ] 05-04-PLAN.md — Frontend admin page, AdminGuard, role-aware header, user management UI

**UI hint**: yes

### Phase 6: Password Security + Recovery

**Goal:** Users with password-based login have strong password enforcement and can self-service reset forgotten passwords via email
**Depends on:** Phase 5
**Requirements**: PWD-01, PWD-02, PWD-03, PWD-04, PWD-05, PWD-06, PWD-07
**Success Criteria** (what must be TRUE):
  1. Password creation/change rejects passwords that don't meet strength rules (min 10 chars + common password blocklist)
  2. User can request password reset from login page via email
  3. Reset token is time-limited and single-use
  4. User can set new password via reset link with strength validation
  5. Password strength meter provides real-time feedback during input
**Plans:** 3 plans

Plans:
- [ ] 06-01-PLAN.md — Shared password validation package (10-char min + 10k blocklist) and invitation flow update
- [ ] 06-02-PLAN.md — Backend reset flow: migration, repository, Resend email service, handlers, route wiring
- [ ] 06-03-PLAN.md — Frontend: PasswordStrengthMeter, forgot-password page, reset-password page, login/register updates

**UI hint**: yes

---

*Roadmap created: 2026-04-07*
*Last updated: 2026-04-16 after Phase 6 planning*
