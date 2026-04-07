# State: GIS - Gestao Inteligente em Saude

**Last updated:** 2026-04-07
**Session:** Roadmap creation

---

## Project Reference

**Core value:** Authenticated users can quickly access hospital-specific Power BI dashboards from a single, clean portal
**Current focus:** Phase 1 - Foundation

---

## Current Position

**Phase:** 1 - Foundation
**Plan:** None started
**Status:** Not started
**Progress:** [----------] 0%

### Phase Progress

| Phase | Status |
|-------|--------|
| 1. Foundation | Not started |
| 2. Auth + Data | Not started |
| 3. Core UI | Not started |
| 4. Polish + i18n | Not started |

---

## Performance Metrics

**Phases complete:** 0/4
**Plans complete:** 0/?
**Requirements satisfied:** 0/41

---

## Accumulated Context

### Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Next.js standalone output | Export mode breaks middleware, OAuth popup COOP headers, and proxy routes |
| Google OAuth popup (no redirect) | Avoids redirect URI complexity; popup handled by @react-oauth/google |
| Catch-all proxy route | Keeps Go API internal-only, eliminates CORS |
| palette.css theming | Matches ferreiracontabilidade reference -- CSS custom properties for light/dark |
| Power BI iframes in v1 | Preserves existing hospital dashboards while rebuilding infrastructure |
| All users see all hospitals | No RBAC in v1 -- insufficient scale to justify complexity |

### Reference Projects

- **ferreiracontabilidade** (`D:\ferreiracontabilidade\app`): Gold standard for Next.js app router patterns, palette.css, component architecture, proxy route, i18n with next-intl

### Research Flags (Unresolved)

- Power BI embed strategy: "Publish to Web" URLs are public -- acceptable?
- Hospital logo storage: static assets vs. DB URLs
- Email whitelist growth: env var approach vs. DB table at scale

### Active Todos

- [ ] Start Phase 1 planning with `/gsd:plan-phase 1`

### Blockers

None.

---

## Session Continuity

**To resume this project:**
1. Read `.planning/ROADMAP.md` for phase structure
2. Read `.planning/REQUIREMENTS.md` for requirement details and traceability
3. Read `.planning/PROJECT.md` for constraints and reference project location
4. Run `/gsd:plan-phase 1` to begin Phase 1 planning

**Reference architecture:** `D:\ferreiracontabilidade\app` -- Next.js app router, palette.css, [locale] routing, proxy pattern

---

*State initialized: 2026-04-07*
