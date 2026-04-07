# Phase 3: Core UI - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

An authenticated user can browse all hospitals in a grid, click into any hospital's Power BI dashboard, and experience a polished design with dark mode. This phase delivers: hospital card components, search/filter, skeleton loading, pagination, Power BI iframe embedding with loading/error states, fullscreen toggle, global header with user profile, global footer, dark mode toggle, toast notification system, and seed data for all 12 hospitals.

</domain>

<decisions>
## Implementation Decisions

### Hospital Grid
- Reusable HospitalCard component showing logo, name, CNES, data period
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop (Tailwind grid)
- Client-side search/filter input above grid (filter by name or CNES)
- Skeleton loading cards while API fetches hospital data
- Pagination component for grid

### Dashboard Display
- Power BI iframe with full-width, calc(100vh - header) height
- Loading indicator (spinner/skeleton) while iframe loads (listen for load event)
- Error boundary with retry button if iframe fails
- Fullscreen toggle using Fullscreen API on iframe container
- Hospital name in dashboard header with back button
- CSP frame-src header for app.powerbi.com

### Global Layout
- Header: GIS logo, portal name, user avatar + email from Google, dark mode toggle, logout button
- Footer: company branding, copyright
- Consistent design using palette.css variables throughout

### Dark Mode
- next-themes ThemeProvider (already in layout from Phase 1)
- Toggle button in header, preference stored in localStorage
- palette.css already has [data-theme="dark"] variables

### UX Polish
- User profile display: Google avatar + email in header dropdown
- Toast notification system (sonner or similar) for login events, errors
- All 12 hospitals seeded with correct Power BI URLs from existing main.js

### Claude's Discretion
- Exact toast library choice (sonner recommended)
- Card hover/click animations
- Skeleton card dimensions
- Pagination page size
- Error boundary implementation details

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/components/ui/card.tsx` — shadcn Card component
- `frontend/src/components/ui/skeleton.tsx` — shadcn Skeleton component
- `frontend/src/components/ui/button.tsx` — shadcn Button component
- `frontend/src/app/styles/palette.css` — CSS custom properties for theming
- `frontend/src/contexts/AuthContext.tsx` — has user profile (name, email, picture)
- `frontend/src/app/hospital/page.tsx` — basic hospital grid (needs enhancement)
- `frontend/src/app/hospital/[cnes]/page.tsx` — basic dashboard page (needs Power BI iframe)
- `frontend/src/lib/api/client.ts` — apiFetch for API calls

### Established Patterns
- Tailwind + palette.css for styling
- shadcn/ui components
- App router with [cnes] dynamic segments
- AuthGuard for protected routes

### Integration Points
- Hospital data from GET /api/hospitals via proxy
- Auth state from AuthContext (user profile, logout)
- Theme from next-themes ThemeProvider

</code_context>

<specifics>
## Specific Ideas

- Match the existing card design from the current index.html (glass-box effect, hospital logos)
- Power BI URLs from existing main.js config object (12 hospitals)
- Use the exact palette.css pattern from ferreiracontabilidade reference

</specifics>

<deferred>
## Deferred Ideas

- Custom data visualizations replacing Power BI — v2
- Hospital favorites/recently viewed — v2
- Session timeout warning — v2
- Breadcrumb navigation — v2

</deferred>
