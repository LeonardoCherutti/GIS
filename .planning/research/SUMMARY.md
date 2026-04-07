# Research Summary: GIS - Gestao Inteligente em Saude

**Synthesized:** 2026-04-07
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

## Executive Summary

GIS is a healthcare analytics portal that authenticates internal users via Google OAuth and presents hospital-level Power BI dashboards. The current system is a single HTML/JS file with 12 hospitals hardcoded and insecure password auth. The rebuild uses Next.js latest (`output: 'standalone'`) as the SPA shell and secure API proxy, a Go REST API (chi + pgx) for auth and data, and Postgres as the database -- all orchestrated by Docker Compose. Every technology version is HIGH confidence, validated against a live reference project (ferreiracontabilidade).

## Stack Consensus

| Layer | Technology | Confidence |
|-------|-----------|------------|
| Frontend | Next.js (standalone), React, shadcn, zustand | HIGH |
| Auth | @react-oauth/google + Go idtoken verification | HIGH |
| i18n | next-intl with [locale] routing | HIGH |
| Theming | palette.css + next-themes | HIGH |
| Backend | Go + chi router + pgx | HIGH |
| Database | Postgres | HIGH |
| Deploy | Docker Compose (3 services) | HIGH |

## Key Findings

### Architecture
- Reference project (ferreiracontabilidade) provides battle-tested blueprint for proxy pattern, auth flow, theming, and component structure
- Catch-all proxy route (`app/api/proxy/[...path]/route.ts`) keeps Go API internal-only
- Go API follows standard `cmd/` + `internal/` layout with handler/service/repository layers
- Postgres schema separates `hospitals` from `dashboard_configs` for v2 flexibility

### Features (Table Stakes for v1)
- Google OAuth replacing insecure username/password
- Database-driven hospital cards (placeholder for v1)
- Power BI iframe embedding with loading states
- Dark mode toggle
- i18n-ready architecture
- Accessibility basics (WCAG 2.1 AA)

### Top Pitfalls
1. **Output mode**: Must use `output: 'standalone'`, NOT `output: 'export'` -- export breaks middleware, API proxy, COOP headers, and OAuth popups
2. **Power BI CSP**: iframe embedding requires correct `frame-src` directives
3. **CORS avoidance**: Use proxy route pattern to eliminate CORS between frontend and Go API
4. **OAuth COOP headers**: `Cross-Origin-Opener-Policy: same-origin-allow-popups` required for Google popup

## Suggested Phase Structure

1. **Foundation** -- Docker Compose skeleton, Postgres schema + migrations, Go health endpoint, Next.js scaffold with palette.css and providers
2. **Data Layer + Auth** -- Go hospital endpoints, Next.js proxy, Google OAuth popup + session cookies, auth middleware on both sides
3. **Core UI** -- Login page, hospital card grid (database-driven), Power BI iframe embed, dark mode, dashboard navigation
4. **Polish + Compliance** -- i18n with pt-BR messages, WCAG audit, skeleton loading, URL routing, search/filter, seed data

## Research Flags

- **Power BI embed strategy** (Publish to Web vs. authenticated) must be decided before Phase 3
- **Hospital logo storage** (static assets vs. DB URLs) -- undecided
- **Email whitelist growth** -- env var approach may need DB table supplement at scale

## Open Questions

- Power BI "Publish to Web" URLs are public -- acceptable security posture?
- Expected hospital growth rate? 24+ hospitals makes search/filter table stakes
- Multiple dashboards per hospital (clinical + financial)?
- chi router vs Go 1.22+ stdlib ServeMux?
- Migration tooling: golang-migrate vs goose?

---
*Synthesized from 4 parallel research agents*
