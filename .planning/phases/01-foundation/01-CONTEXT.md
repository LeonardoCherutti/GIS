# Phase 1: Foundation - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase)

<domain>
## Phase Boundary

All three services run locally under Docker Compose with verified connectivity and database schema in place. This phase delivers: Docker Compose with frontend (Next.js), API (Go), and Postgres services; Postgres schema with migrations for hospitals and dashboard_configs tables; Go API health endpoint; Next.js app with standalone output and SPA view handler/view context pattern; proxy route forwarding to Go API.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from PROJECT.md:
- Next.js latest with `output: 'standalone'` (NOT export)
- Go API with chi router + pgx for Postgres
- SPA with view handler and view context pattern
- palette.css with CSS custom properties (light + dark mode) following ferreiracontabilidade pattern
- Same code standards as D:\ferreiracontabilidade\app
- Docker Compose deployment

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Reference project at D:\ferreiracontabilidade\app provides blueprint for Next.js structure, palette.css, proxy pattern
- Existing main.js has hospital configuration data (12 hospitals with Power BI URLs) for seeding

### Established Patterns
- ferreiracontabilidade uses: app router, [locale] routing, palette.css, next-themes, zustand, shadcn, @react-oauth/google
- Go standard project layout: cmd/ + internal/ with handler/service/repository layers

### Integration Points
- Next.js proxy route (app/api/proxy/[...path]/route.ts) connects frontend to Go API
- Docker Compose networking connects all services
- Postgres migrations run on first boot

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
