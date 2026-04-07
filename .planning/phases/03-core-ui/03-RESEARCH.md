# Phase 3: Core UI - Research

**Researched:** 2026-04-07
**Domain:** Frontend UI components, Power BI iframe embedding, design system, dark mode
**Confidence:** HIGH

## Summary

Phase 3 delivers the entire user-facing product: hospital card grid with search/filter/pagination, Power BI dashboard embedding with loading/error states, global header/footer layout, dark mode toggle, user profile display, and toast notifications. The codebase already has substantial scaffolding from Phases 1-2 including working hospital page, dashboard page, AuthContext with user profile data, palette.css theming, sonner toasts, shadcn components (Card, Button, Skeleton), and next-themes ThemeProvider.

The primary work is upgrading existing stub pages into full-featured components, extracting a shared layout (header/footer), implementing the Power BI iframe with proper CSP headers, adding search/filter/pagination logic, and fixing the seed data to include real CNES codes, periods, and logo URLs. The 12 hospital Power BI URLs are already seeded in `003_seed_hospitals.sql` but with placeholder CNES codes (`0000001`-`0000012`) that need updating to real values from `index.html`.

**Primary recommendation:** Organize work into 4 plans: (1) seed data fix + API enhancements, (2) design system + shared layout, (3) hospital grid with search/filter/pagination, (4) Power BI dashboard embed with fullscreen/error boundary.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Reusable HospitalCard component showing logo, name, CNES, data period
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop (Tailwind grid)
- Client-side search/filter input above grid (filter by name or CNES)
- Skeleton loading cards while API fetches hospital data
- Pagination component for grid
- Power BI iframe with full-width, calc(100vh - header) height
- Loading indicator (spinner/skeleton) while iframe loads (listen for load event)
- Error boundary with retry button if iframe fails
- Fullscreen toggle using Fullscreen API on iframe container
- Hospital name in dashboard header with back button
- CSP frame-src header for app.powerbi.com
- Header: GIS logo, portal name, user avatar + email from Google, dark mode toggle, logout button
- Footer: company branding, copyright
- Consistent design using palette.css variables throughout
- next-themes ThemeProvider (already in layout from Phase 1)
- Toggle button in header, preference stored in localStorage
- palette.css already has [data-theme="dark"] variables
- User profile display: Google avatar + email in header dropdown
- Toast notification system (sonner or similar) for login events, errors
- All 12 hospitals seeded with correct Power BI URLs from existing main.js

### Claude's Discretion
- Exact toast library choice (sonner recommended)
- Card hover/click animations
- Skeleton card dimensions
- Pagination page size
- Error boundary implementation details

### Deferred Ideas (OUT OF SCOPE)
- Custom data visualizations replacing Power BI -- v2
- Hospital favorites/recently viewed -- v2
- Session timeout warning -- v2
- Breadcrumb navigation -- v2
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GRID-01 | Hospital cards loaded from Go API (database-driven) | API endpoint exists (`GET /api/hospitals`), returns Hospital[] with powerbi_url via JOIN. Seed data needs CNES/period/logo fix. |
| GRID-02 | Each card displays hospital logo, name, CNES code, and data period | Hospital model has all fields. Seed data missing logo_url, period_start, period_end, real CNES. Need migration to add these. |
| GRID-03 | Responsive grid layout (1/2/3 cols) | Existing page already has `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Needs Card component upgrade. |
| GRID-04 | Click on card navigates to hospital dashboard view | Already implemented via `Link href=/hospital/${cnes}`. Works with app router. |
| GRID-05 | Search/filter input filters hospitals by name or CNES | Client-side filter on existing data. Use controlled input + useMemo for filtering. |
| GRID-06 | Skeleton loading placeholders while data loads | shadcn Skeleton component exists. Create HospitalCardSkeleton. |
| GRID-07 | Pagination for hospital grid | Client-side pagination. 12 hospitals is small, but requirement is explicit. |
| DASH-01 | Power BI iframe with proper CSP frame-src headers | Need to add `frame-src https://app.powerbi.com` to next.config.ts headers. iframe loads "Publish to Web" URLs. |
| DASH-02 | Loading indicator while Power BI iframe loads | Listen for iframe `onLoad` event, show spinner/skeleton until loaded. |
| DASH-03 | Dashboard title (hospital name) in header | Already showing hospital.name in header. Needs integration with shared layout. |
| DASH-04 | Back navigation returns to hospital grid | Already implemented via Link to /hospital. |
| DASH-05 | Fullscreen toggle for Power BI iframe | Use browser Fullscreen API (`element.requestFullscreen()`). Button with Maximize/Minimize icon. |
| DASH-06 | Error boundary with retry button when iframe fails | iframe error detection via onError + timeout fallback. React error boundary wrapping. |
| UI-01 | palette.css with CSS custom properties for light and dark themes | Already complete in `frontend/src/app/styles/palette.css`. Both :root and [data-theme="dark"] defined. |
| UI-02 | Dark mode toggle persisted in localStorage | next-themes already configured in layout.tsx with `attribute="data-theme"`. Need toggle button component. |
| UI-03 | Global header with logo, portal name, user profile, dark mode toggle, logout | Extract from per-page headers into shared AppHeader component in layout. |
| UI-04 | Global footer with company branding | New AppFooter component. |
| UI-05 | Reusable component architecture | HospitalCard, AppHeader, AppFooter, DashboardEmbed, SearchInput, Pagination as reusable components. |
| UI-06 | Palette system matching ferreiracontabilidade reference patterns | Already implemented. palette.css follows same pattern. globals.css bridges to shadcn variables. |
| UX-01 | User profile display in header (Google avatar + email) | AuthContext already provides user.picture, user.email, user.name. Reference project has UserMenu pattern. |
| UX-02 | Toast notification system | sonner already installed and configured in layout.tsx with Toaster component. toast() already used in hospital page. |
| UX-03 | All 12 existing hospitals seeded with Power BI URLs | Seed SQL exists but needs updating: real CNES codes, period dates, logo URLs from original index.html + main.js. |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | 16.x | App framework | Installed, standalone mode |
| React | 19.x | UI library | Installed |
| next-themes | 0.4.x | Dark mode toggle | Installed, ThemeProvider in layout |
| sonner | 2.x | Toast notifications | Installed, Toaster in layout |
| @tanstack/react-query | 5.x | Data fetching/caching | Installed, QueryProvider in place |
| lucide-react | 1.x | Icons | Installed |
| shadcn/ui | 4.x | Component library | Initialized, Card/Button/Skeleton present |
| Tailwind CSS | 4.x | Utility CSS | Installed |

### Additional shadcn Components Needed
| Component | Purpose | Install Command |
|-----------|---------|----------------|
| input | Search/filter field | `npx shadcn@latest add input` |
| avatar | User profile display | `npx shadcn@latest add avatar` |
| dropdown-menu | User menu in header | `npx shadcn@latest add dropdown-menu` |
| badge | Optional CNES badge | `npx shadcn@latest add badge` |
| separator | Visual dividers | `npx shadcn@latest add separator` |

No new npm packages need to be installed. All dependencies are already in place.

## Architecture Patterns

### Recommended Component Structure
```
frontend/src/
  components/
    layout/
      AppHeader.tsx      # Global header (logo, user profile, dark mode, logout)
      AppFooter.tsx      # Global footer (branding, copyright)
      ThemeToggle.tsx     # Dark mode toggle button
      UserMenu.tsx        # Avatar + dropdown with email + logout
    hospital/
      HospitalCard.tsx         # Reusable card component
      HospitalCardSkeleton.tsx # Skeleton placeholder
      HospitalGrid.tsx         # Grid + search + pagination orchestrator
      SearchInput.tsx           # Search/filter input
      Pagination.tsx            # Pagination controls
    dashboard/
      DashboardEmbed.tsx    # Power BI iframe with loading/error
      FullscreenToggle.tsx  # Fullscreen button
    ui/
      (existing shadcn components)
  app/
    hospital/
      page.tsx          # Grid page (refactored to use components)
      [cnes]/
        page.tsx        # Dashboard page (refactored)
    layout.tsx          # Add AppHeader/AppFooter wrapper
```

### Pattern 1: Shared Layout with AppHeader/AppFooter
**What:** Extract per-page header/footer into `layout.tsx` level components so all authenticated pages share the same chrome.
**When to use:** All pages under `/hospital` route group.
**Key insight:** The current hospital/page.tsx and hospital/[cnes]/page.tsx each render their own header. This duplicates logic and makes the design inconsistent. Move header/footer to a layout component that wraps AuthGuard children.

```typescript
// app/hospital/layout.tsx — new file
'use client'
import AuthGuard from '@/components/auth/AuthGuard'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--palette-background)' }}>
        <AppHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </AuthGuard>
  )
}
```

### Pattern 2: Client-Side Search/Filter
**What:** Controlled input that filters the hospital list in-memory.
**When to use:** With 12 hospitals, server-side search is overkill. Filter client-side using `useMemo`.
**Example:**
```typescript
const filtered = useMemo(() => {
  if (!query.trim()) return hospitals
  const q = query.toLowerCase()
  return hospitals.filter(h =>
    h.name.toLowerCase().includes(q) || h.cnes.includes(q)
  )
}, [hospitals, query])
```

### Pattern 3: Power BI Iframe Embedding
**What:** Embed "Publish to Web" Power BI URLs via iframe with load detection.
**Key details:**
- These are public "Publish to Web" URLs (`app.powerbi.com/view?r=...`), not private embed tokens
- No Power BI JavaScript SDK needed -- plain iframe with src
- Need CSP `frame-src` header in next.config.ts
- iframe load event fires when Power BI finishes rendering
- Error detection: use `onError` + a timeout (e.g., 15 seconds) as fallback since iframe cross-origin errors are hard to detect

```typescript
// next.config.ts — add to headers()
{
  key: 'Content-Security-Policy',
  value: "frame-src 'self' https://app.powerbi.com"
}
```

### Pattern 4: Fullscreen API
**What:** Toggle fullscreen on the iframe container using the browser Fullscreen API.
```typescript
function toggleFullscreen(containerRef: React.RefObject<HTMLDivElement>) {
  if (!document.fullscreenElement) {
    containerRef.current?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
```

### Anti-Patterns to Avoid
- **Inline style objects for palette vars:** The current code uses `style={{ color: 'var(--palette-muted-fg)' }}` extensively. This works but is verbose. For Phase 3, use Tailwind's theme bridge already set up in `globals.css` (e.g., `text-muted-fg` maps to `var(--palette-muted-fg)` via the `@theme` block). However, custom palette vars not in the theme bridge still need inline styles.
- **Fetching all hospitals on dashboard page:** Current `[cnes]/page.tsx` fetches ALL hospitals to find one. Phase 3 should either add a `GET /api/hospitals/:cnes` endpoint or cache the list via react-query so the second page hits cache.
- **Per-page header rendering:** Current approach duplicates header in each page. Use layout pattern instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode | Custom CSS class toggling | next-themes (already installed) | Handles flash-of-incorrect-theme, localStorage, SSR |
| Toast notifications | Custom toast component | sonner (already installed) | Handles animations, auto-dismiss, stacking, accessibility |
| Icons | SVG inline or sprite sheets | lucide-react (already installed) | Tree-shakeable, consistent sizing, accessible |
| Avatar with fallback | Custom img + initials | shadcn Avatar component | Handles image loading, fallback initials, consistent styling |
| Component variants | Manual className ternaries | cva (class-variance-authority, already installed) | Type-safe variant props, composable with cn() |

## Common Pitfalls

### Pitfall 1: Seed Data Has Placeholder CNES Codes
**What goes wrong:** The migration `003_seed_hospitals.sql` uses `0000001`-`0000012` as CNES codes, but the original `index.html` shows real codes like `0014125`, `2799758`, `4564812`, etc. The frontend already links to `/hospital/[cnes]`, so placeholder codes will show in URLs.
**Why it happens:** Phase 1 created placeholder seed data.
**How to avoid:** Create a new migration (004) that updates CNES codes, period dates, and logo URLs to match the original data. Extract exact values from `index.html` and `main.js`.
**Warning signs:** URLs show `/hospital/0000001` instead of `/hospital/0014125`.

### Pitfall 2: Power BI iframe CSP Blocking
**What goes wrong:** Browser blocks iframe loading with "Refused to frame" error.
**Why it happens:** Missing `Content-Security-Policy frame-src` header for `app.powerbi.com`.
**How to avoid:** Add CSP header in `next.config.ts` headers function. Also note: some browsers block mixed content, so ensure HTTPS in production.
**Warning signs:** Console errors about frame-src violations.

### Pitfall 3: iframe Load Event Unreliability
**What goes wrong:** Loading indicator never disappears or disappears too early.
**Why it happens:** Cross-origin iframes may fire `onLoad` before content is visually rendered, or may not fire `onError` reliably.
**How to avoid:** Use `onLoad` event to hide loading indicator AND add a maximum timeout (e.g., 30 seconds) after which show error state. Do NOT rely on iframe onError for cross-origin content.
**Warning signs:** Loading spinner stuck indefinitely.

### Pitfall 4: Hospital Logo Storage
**What goes wrong:** Logo images referenced from DB but not served by Next.js.
**Why it happens:** Hospital logos exist in `imagens/` directory of the legacy app but not in the Next.js `public/` folder.
**How to avoid:** Copy hospital logo images to `frontend/public/logos/` and reference them as `/logos/HospitalName.png` in the database seed. Or use `logo_url` as a relative path from public directory.
**Warning signs:** Broken image icons on hospital cards.

### Pitfall 5: Dark Mode Flash on Page Load
**What goes wrong:** Brief flash of light theme before dark theme applies.
**Why it happens:** Server renders with default theme, client hydrates and switches.
**How to avoid:** next-themes is already configured with `suppressHydrationWarning` on html tag. The `attribute="data-theme"` approach with `enableSystem={false}` should prevent this. Verify that the ThemeProvider `defaultTheme` matches what users expect.
**Warning signs:** White flash when loading page in dark mode.

### Pitfall 6: Fullscreen API Browser Compatibility
**What goes wrong:** Fullscreen toggle doesn't work on some browsers.
**Why it happens:** Safari requires `webkitRequestFullscreen`. Mobile browsers may not support fullscreen.
**How to avoid:** Check `document.fullscreenEnabled` before showing the toggle button. Use the standard API (no webkit prefix needed in modern browsers since Safari 16.4+). Gracefully hide the button if unsupported.
**Warning signs:** Button visible but clicking does nothing.

## Code Examples

### HospitalCard Component Pattern
```typescript
// Source: Based on original index.html card design + shadcn Card
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface HospitalCardProps {
  hospital: {
    name: string
    cnes: string
    logo_url: string | null
    period_start: string | null
    period_end: string | null
  }
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link href={`/hospital/${hospital.cnes}`}>
      <Card className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-subtle flex items-center justify-center overflow-hidden">
            {hospital.logo_url ? (
              <Image src={hospital.logo_url} alt="" width={32} height={32} />
            ) : (
              <Building2 className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <CardTitle>{hospital.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-muted-fg">
            <span>CNES {hospital.cnes}</span>
            {hospital.period_start && hospital.period_end && (
              <span>Periodo: {hospital.period_start} - {hospital.period_end}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

### ThemeToggle Component Pattern
```typescript
// Source: ferreiracontabilidade reference ThemeToggle.tsx
'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
```

### Power BI Iframe Embed Pattern
```typescript
'use client'
import { useState, useRef, useCallback } from 'react'
import { Maximize, Minimize, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardEmbedProps {
  url: string
  title: string
}

export function DashboardEmbed({ url, title }: DashboardEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleLoad = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setLoading(false)
    setError(false)
  }, [])

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(false)
    // Force iframe reload by toggling key or src
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {loading && <LoadingOverlay />}
      {error && <ErrorOverlay onRetry={handleRetry} />}
      <iframe
        src={url}
        title={title}
        className="w-full border-none"
        style={{ height: 'calc(100vh - 4rem)' }}
        allowFullScreen
        onLoad={handleLoad}
      />
      {document.fullscreenEnabled && (
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}
                className="absolute top-2 right-2">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </Button>
      )}
    </div>
  )
}
```

## Critical Data: Hospital Seed Update

The seed migration needs updating. Here is the mapping from `index.html`/`main.js` to database fields:

| # | Name | Real CNES | Period | Logo File |
|---|------|-----------|--------|-----------|
| 1 | Hospital Center Clinicas | 0014125 | jan/2021 - abr/2025 | CenterClinicas.png |
| 2 | Hospital Geral Cleriston Andrade | 2799758 | jan/2021 - dez/2025 | (none - use icon) |
| 3 | UPAs Florianopolis | 4564812 | jan/2021 - jan/2026 | Florianopolis.png |
| 4 | Nsa. Sra. da Imac. Conceicao | 2778831 | jan/2021 - nov/2024 | NT.png |
| 5 | Hospital do Coracao do Cariri | 4010868 | jan/2021 - ago/2024 | CARIRI.png |
| 6 | Maternidade Santo Antonio HMSA | 2564238 | jan/2021 - ago/2024 | hsa.png |
| 7 | Hospital do Idoso Zilda Arns | 6388671 | jan/2023 - dez/2025 | zilda_arnss.png |
| 8 | Hospital Dr. Ricardo de Tadeu Ladeia | 7319770 | jan/2021 - dez/2025 | (none - use icon) |
| 9 | Hospital Nsa. Sra. Das Gracas | 2232014 | jan/2021 - mai/2025 | CanoasDasGracas.png |
| 10 | Hospital do Rocio | 0013846 | jan/2021 - dez/2025 | (none - use icon) |
| 11 | Hospital do Cancer de Londrina | 2577623 | jan/2021 - jul/2024 | hcl.png |
| 12 | Hospital Sao Vicente de Paulo | 2246988 | jan/2021 - jul/2024 | (none - use icon) |

**Note:** Hospital 10 in seed is "Hospital Nsa. Sra. do Perpetuo Socorro" but in the HTML card it says "Hospital do Rocio" at position 10. The main.js config for estudo-j says "Hospital Nsa. Sra. do Perpetuo Socorro" -- this is a name discrepancy in the original. The HTML was recently updated (commit `9d3f5f8 Hospital do Rocio`). The seed should use the most current names.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Per-page header/footer | Nested layout.tsx in route groups | Next.js 13+ (app router) | Shared chrome without prop drilling |
| Manual dark mode CSS | next-themes + data-theme attribute | Standard since 2023 | Zero-flash, localStorage persistence built-in |
| Inline SVG icons | lucide-react tree-shakeable imports | Standard pattern | Smaller bundle, consistent sizing |
| Custom skeleton loading | shadcn Skeleton + animate-pulse | Standard shadcn pattern | Consistent with design system |

## Open Questions

1. **Hospital Logo Storage Strategy**
   - What we know: Logos exist in `imagens/` directory of legacy app. Database has `logo_url` column (currently null).
   - What's unclear: Should logos be copied to `frontend/public/logos/` as static assets, or served from a different path?
   - Recommendation: Copy to `frontend/public/logos/`, set `logo_url` in DB to `/logos/filename.png`. Simple and works with Next.js Image optimization.

2. **Hospital 10 Name Discrepancy**
   - What we know: main.js says "Hospital Nsa. Sra. do Perpetuo Socorro" for estudo-j (position 10), but recent HTML commit changed card 10 to "Hospital do Rocio"
   - What's unclear: Is Hospital do Rocio a replacement or was the card swapped?
   - Recommendation: Use both -- Hospital do Rocio appears to be a new addition. Check if 12 hospitals is still the right count or if it's 13 now. For seed, use what's in the latest index.html.

3. **API Endpoint for Single Hospital**
   - What we know: Current dashboard page fetches ALL hospitals and filters client-side. Works but wasteful.
   - What's unclear: Should we add `GET /api/hospitals/:cnes` endpoint in this phase?
   - Recommendation: Use react-query caching. The grid page fetches all hospitals; dashboard page reuses that cached data. No new endpoint needed for 12 records. Add `staleTime` to prevent refetch.

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Next.js (SPA, app router) + Go API + Postgres
- **Auth**: Google OAuth popup only, no redirect URI flow
- **Standards**: Must match D:\ferreiracontabilidade\app patterns (components, palette.css, app router)
- **Language**: Portuguese (pt-BR) primary -- but i18n extraction is Phase 4, so Phase 3 can use hardcoded Portuguese strings
- **Next.js version note**: CLAUDE.md warns "This is NOT the Next.js you know -- APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."
- **GSD workflow**: Do not make direct repo edits outside a GSD workflow

## Sources

### Primary (HIGH confidence)
- Codebase analysis: All frontend source files in `frontend/src/`
- Codebase analysis: Go API handlers, models, repository, router
- Codebase analysis: Migration SQL files (001-003)
- Codebase analysis: Original `index.html` and `main.js` for hospital data
- Reference project: `D:\ferreiracontabilidade\app` layout components (ThemeToggle, UserMenu, PageHeader)

### Secondary (MEDIUM confidence)
- Palette.css pattern verified against reference project
- shadcn/ui v4 component API (based on installed components in codebase)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and configured
- Architecture: HIGH - Patterns directly observed in reference project and existing code
- Pitfalls: HIGH - Identified from actual code gaps (placeholder CNES, missing CSP, logo storage)
- Seed data: HIGH - Exact values extracted from index.html and main.js

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable -- no external dependencies to go stale)
