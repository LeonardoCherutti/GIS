# GIS - Gestao Inteligente em Saude

## What This Is

A hospital dashboard portal that authenticates users via Google OAuth and presents a grid of hospital cards, each linking to embedded Power BI dashboards. Built as a modern Next.js SPA frontend backed by a Go API and Postgres database. Currently serves ~12 hospitals across Brazil with healthcare analytics dashboards.

## Core Value

Authenticated users can quickly access hospital-specific Power BI dashboards from a single, clean portal — with the architecture ready to replace Power BI with custom data views in the future.

## Requirements

### Validated

- Hospital dashboard cards displayed in a grid (existing)
- Power BI iframe embedding per hospital (existing)
- Login/logout flow (existing)
- Back navigation from dashboard to selection (existing)

### Active

- [ ] Next.js latest SPA frontend with app router (`app/api/route.ts` for API proxy)
- [ ] Go API backend serving data and handling auth
- [ ] Google OAuth sign-in via popup (no redirect URI)
- [ ] Email whitelist + domain whitelist via environment variables
- [ ] Postgres database integration (read data)
- [ ] Reusable component architecture (dynamic, DRY)
- [ ] Global header, navbar, and footer
- [ ] palette.css with CSS custom properties (light + dark mode) following ferreiracontabilidade pattern
- [ ] Dark mode toggle
- [ ] i18n-ready (start pt-BR, support future languages)
- [ ] Hospital cards read from database (placeholder for v1, Power BI links for now)
- [ ] Docker Compose deployment (frontend + API + Postgres)
- [ ] Same code standards as D:\ferreiracontabilidade\app (Next.js app router, component patterns, styles)

### Out of Scope

- Custom data visualizations replacing Power BI — deferred to v2+
- Admin panel for hospital management — deferred to v2
- Mobile native app — web-first
- Real-time data / WebSockets — not needed for dashboard portal
- User-specific hospital access control — all users see all hospitals for now

## Context

**Existing system:** Vanilla HTML/JS/CSS single page with hardcoded hospital cards and Power BI URLs. Auth via username/password against a Cloud Run backend API. Session managed via sessionStorage.

**Reference project:** `D:\ferreiracontabilidade\app` — Next.js app router project with `[locale]` routing, `palette.css` CSS custom properties pattern, component-based architecture. This is the gold standard for code patterns, file structure, and styling approach.

**Hospitals served (current):**
1. Hospital Center Clinicas (CNES 0014125)
2. Hospital Geral Cleriston Andrade (CNES 2799758)
3. UPAs Florianopolis (CNES 4564812, 9717552, 3340821, 5989442)
4. Nsa. Sra. da Imac. Conceicao (CNES 2778831)
5. Hospital do Coracao do Cariri (CNES 4010868)
6. Maternidade Santo Antonio HMSA (CNES 2564238)
7. Hospital do Idoso Zilda Arns (CNES 6388671)
8. Hospital Dr. Ricardo de Tadeu Ladeia (CNES 7319770)
9. Hospital Nsa. Sra. Das Gracas (CNES 2232014)
10. Hospital do Rocio (CNES 0013846)
11. Hospital do Cancer de Londrina (CNES 2577623)
12. Hospital Sao Vicente de Paulo (CNES 2246988)

**Power BI:** Each hospital has a unique Power BI embed URL. In v1 these are stored in config/database and rendered as iframes. In v2+ they'll be replaced with custom views reading directly from Postgres.

## Constraints

- **Tech stack**: Next.js latest (SPA, app router) + Go API + Postgres
- **Auth**: Google OAuth popup only, no redirect URI flow. Whitelist via env vars.
- **Standards**: Must match D:\ferreiracontabilidade\app patterns (components, palette.css, app router)
- **Deployment**: Docker Compose (frontend + API + database)
- **Language**: Portuguese (pt-BR) primary, i18n-ready architecture

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js SPA over SSR | Dashboard portal is a single-page app, no SEO needed | -- Pending |
| Google OAuth over username/password | Modern auth, no password management, whitelisting built-in | -- Pending |
| Go API over Node.js backend | Performance, team preference, clean separation of concerns | -- Pending |
| Power BI iframes in v1 | Preserve existing functionality while rebuilding infrastructure | -- Pending |
| Docker Compose deployment | Self-hosted, portable, all services in one compose file | -- Pending |
| palette.css pattern | CSS custom properties for theming, matches reference project | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-07 after initialization*
