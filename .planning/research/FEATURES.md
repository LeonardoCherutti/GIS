# Feature Landscape

**Domain:** Healthcare dashboard portal (hospital analytics via embedded BI)
**Researched:** 2026-04-07
**Confidence:** MEDIUM-HIGH (based on existing system analysis + market research)

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional.

### Authentication & Session

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Google OAuth sign-in (popup flow) | Modern auth, no password management; PROJECT.md mandates this | Med | Replaces current username/password. Use `@react-oauth/google` or Google Identity Services directly. Popup flow avoids redirect URI complexity. |
| Email/domain whitelist | Controls who can access the portal without building a full admin panel | Low | Env var-driven in v1. Check email against whitelist after Google token verification on Go backend. |
| Persistent session with token refresh | Users should not need to re-login every browser tab close | Low | JWT stored in httpOnly cookie or localStorage with refresh logic. Current system uses sessionStorage (lost on tab close) -- this is a regression risk if not improved. |
| Logout with session cleanup | Basic auth hygiene | Low | Clear token, redirect to login. Revoke Google token on backend if needed. |
| Auth loading state | Users need feedback during OAuth popup flow | Low | Spinner/skeleton during token exchange. Prevents blank screen while popup resolves. |

### Hospital Selection Grid

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Database-driven hospital cards | Cards must come from DB, not hardcoded HTML | Med | Current system has 12 hospitals hardcoded in HTML. API endpoint returns hospital list with name, CNES, logo URL, period, Power BI embed URL. |
| Hospital card with logo, name, CNES, period | Users need to identify hospitals at a glance | Low | Current system already has this pattern. Preserve it. |
| Responsive grid layout (1/2/3 columns) | Works on laptop and large monitor | Low | Current: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Keep this. |
| Click-to-view navigation | Card click opens the hospital's dashboard | Low | Current behavior. Single-click, full view transition. |
| Back navigation from dashboard to grid | Users must be able to return without browser back | Low | Current: back button in dashboard view header. Keep it. |

### Dashboard Display

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Power BI iframe embedding | Core v1 functionality -- this IS the product | Low | Each hospital has a unique `app.powerbi.com/view` URL. Full-width iframe, `calc(100vh - header)` height. |
| Loading indicator for iframe | Power BI iframes take 3-10 seconds to load. Blank screen = broken feel | Low | Listen for iframe `load` event or Power BI Loaded/Rendered events. Show skeleton/spinner until ready. |
| Fullscreen toggle for dashboard | Healthcare users need to present dashboards in meetings | Low | Use Fullscreen API on the iframe container. Simple button in dashboard header. |
| Dashboard title in header | User must know which hospital they're viewing | Low | Already exists. Keep hospital name prominent. |

### Visual Design & Theming

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dark mode toggle | PROJECT.md requirement, matches reference project pattern | Med | `palette.css` with CSS custom properties. Toggle stored in localStorage. Apply to all components. |
| Consistent design language | Professional feel matching a healthcare/analytics brand | Med | Use palette.css pattern from ferreiracontabilidade reference. CSS custom properties for all colors. |
| Global header with navigation | Portal identity, logout button, theme toggle | Low | Header: logo, portal name, user avatar/email, dark mode toggle, logout. |
| Footer with branding | Professionalism, legal/contact info | Low | Company logo, copyright, version. |

### Internationalization

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| pt-BR as primary language | Brazilian healthcare market, all current hospitals are Brazilian | Low | All UI strings in pt-BR. |
| i18n-ready architecture | PROJECT.md requirement for future language support | Med | Use `next-intl` or `react-intl` with `[locale]` routing (matches reference project). Extract all strings to message files from day one. Do NOT hardcode Portuguese strings in components. |

### Accessibility (WCAG 2.1 AA)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Keyboard navigation | WCAG requirement; HHS Section 504 mandates WCAG 2.1 AA for healthcare by May 2026 | Med | All interactive elements focusable and operable via keyboard. Tab order logical. Focus indicators visible. |
| Color contrast compliance | WCAG 2.1 AA requires 4.5:1 for text, 3:1 for large text | Low | Verify palette.css colors in both light and dark mode. Use contrast checker during design. |
| Semantic HTML and ARIA labels | Screen reader support | Low | Use proper heading hierarchy, landmark roles, aria-labels on icon-only buttons (logout, back, fullscreen). |
| Focus management on view transitions | When switching login -> grid -> dashboard, focus must move logically | Med | Programmatic focus on main content area after navigation. Announce route changes to screen readers. |

## Differentiators

Features that set the product apart. Not expected by all users, but add clear value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Search/filter on hospital grid | With 12+ hospitals, finding one quickly saves time; becomes critical at 20+ hospitals | Low | Client-side text filter on hospital name/CNES. Simple input above grid. |
| Hospital card metadata badges | Visual cues: data freshness indicator (e.g., "Updated 3 days ago"), hospital type icon | Low | Small badge/tag on card showing last data update. Helps users trust data currency. |
| "Favorites" or recently viewed | Users who manage 2-3 hospitals out of 12 can jump to their hospitals faster | Med | Store in localStorage (v1) or user preferences table (v2). Pin favorites to top of grid or separate section. |
| Skeleton loading for hospital cards | Perceived performance while API loads hospital list | Low | Skeleton card shapes matching grid layout. Feels fast even on slow connections. |
| Error boundary with retry for dashboards | If Power BI embed fails (network, auth), user sees helpful error instead of blank iframe | Low | Detect iframe load failure. Show "Dashboard could not be loaded" with retry button. |
| User profile display (avatar + email from Google) | Personal touch, confirms who is logged in, audit trail visibility | Low | Google OAuth returns profile info. Show avatar in header, email in dropdown. |
| Breadcrumb navigation | Clear path: Home > Hospital Name > Dashboard | Low | Simple breadcrumb in dashboard view. Helps orientation in deeper navigation flows (v2+). |
| Toast notifications | Feedback for actions: "Logged in", "Session expired", "Dashboard loaded" | Low | Lightweight toast system. Accessible (aria-live region). Not intrusive. |
| URL-based routing for dashboards | Deep links: `/hospital/0014125` shareable, browser back works naturally | Med | Next.js app router makes this straightforward. Enables bookmarking and sharing specific hospital views. |
| Session timeout warning | Healthcare contexts: idle sessions should expire. Warn before auto-logout | Med | 30-min idle timeout. Warning modal at 25 min. Extends session on activity. Prevents unauthorized access on shared workstations. |

## Anti-Features

Features to explicitly NOT build in v1. These add complexity without proportional value at current scale.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Role-based access control (RBAC) | PROJECT.md explicitly defers per-user hospital access. 12 hospitals, all users see all. Over-engineering for current scale. | Email/domain whitelist is sufficient. Revisit when user count or security requirements demand it (v2+). |
| Admin panel for hospital CRUD | Deferred to v2 per PROJECT.md. Adding/editing hospitals is rare (monthly at most). | Manage hospitals via direct DB inserts or seed scripts. API reads only. |
| Custom data visualizations | v2+ scope. Power BI dashboards are the product for now. Building custom charts prematurely splits focus. | Embed Power BI cleanly. Design the iframe container so it can be swapped for custom components later. |
| Real-time data / WebSockets | No use case. Dashboard data is periodic (monthly/quarterly refresh). | Standard HTTP API with normal caching. |
| Mobile native app | Web-first per PROJECT.md. Healthcare dashboard users are on desktop/laptop. Power BI iframes are not mobile-friendly anyway. | Responsive web down to tablet. Do not optimize for phone screens in v1. |
| Multi-tenant white-labeling | Only one organization (GIS) uses this portal. Theming for multiple brands is waste. | Single brand, single palette.css. |
| Audit logging | Important for HIPAA, but this portal shows aggregated analytics (not PHI). Power BI handles its own audit trail. | Log auth events (login/logout) at API level. Full audit trail in v2 if scope expands to PHI. |
| Notification system (email/SMS) | No events to notify about. Users visit portal on-demand to view dashboards. | None needed. |
| Data export / PDF generation | Power BI has its own export. Duplicating this is wasted effort. | Let Power BI handle exports within the embedded iframe. |
| Complex search with filters (date range, region, specialty) | 12 hospitals. Text search is sufficient. Complex filters are over-engineering. | Simple text filter. Add structured filters only if hospital count exceeds ~30. |

## Feature Dependencies

```
Google OAuth  -->  Email/Domain Whitelist  -->  Session Management
    |
    v
User Profile Display (avatar, email from Google token)

Database Schema  -->  Hospital API Endpoint  -->  Hospital Card Grid
    |                                                    |
    v                                                    v
Hospital Metadata (logos, CNES, periods)          Search/Filter (client-side)

palette.css  -->  Dark Mode Toggle  -->  All UI Components
    |
    v
WCAG Color Contrast (verify both themes)

i18n Message Files  -->  [locale] Routing  -->  All UI Strings

Next.js App Router  -->  URL-based Dashboard Routing  -->  Deep Links / Bookmarks
    |
    v
Dashboard View (iframe embed)  -->  Loading States  -->  Error Boundaries

Session Management  -->  Session Timeout Warning
```

## MVP Recommendation

### Must ship (v1.0):

1. **Google OAuth with email/domain whitelist** -- replaces insecure username/password auth
2. **Database-driven hospital grid** -- removes hardcoded HTML, enables future admin panel
3. **Power BI iframe embedding with loading states** -- core product value
4. **Dark mode with palette.css** -- project requirement, reference project pattern
5. **i18n-ready architecture (pt-BR)** -- project requirement, prevents string extraction later
6. **WCAG 2.1 AA basics** -- keyboard nav, contrast, semantic HTML, focus management
7. **Global header/footer** -- professional portal feel, logout/theme controls
8. **Back navigation and dashboard title** -- existing UX preserved
9. **Responsive grid (1/2/3 columns)** -- existing behavior preserved

### Should ship (v1.1):

10. **Search/filter on hospital grid** -- low complexity, high value as hospital count grows
11. **URL-based routing for dashboards** -- enables deep links, browser history
12. **User profile display** -- confirms identity, uses Google-provided data
13. **Skeleton loading states** -- polish, perceived performance
14. **Error boundary with retry for dashboards** -- resilience
15. **Toast notifications** -- user feedback system

### Defer to v2+:

- Favorites / recently viewed (needs user preferences storage)
- Session timeout warning (needs idle detection, more auth sophistication)
- RBAC and per-user hospital access
- Admin panel
- Custom data visualizations replacing Power BI
- Breadcrumb navigation (more useful when navigation depth increases in v2)

## Sources

- [Healthcare Dashboard Design Best Practices - FuseLab Creative](https://fuselabcreative.com/healthcare-dashboard-design-best-practices/)
- [Healthcare UI Design 2026 - Eleken](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [13 Healthcare Dashboards - Power BI, Looker & ReactJS](https://vidi-corp.com/power-bi-healthcare-dashboards/)
- [Power BI Embedded Performance Best Practices - Microsoft Learn](https://learn.microsoft.com/sl-si/power-bi/developer/embedded/embedded-performance-best-practices)
- [Embed a report in a secure portal - Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure)
- [HHS WCAG 2.1 AA Healthcare Compliance 2026 - eDreamz](https://www.edreamz.com/blog/healthcare-website-accessibility-in-2026-what-wcag-21-aa-means-and-how-to-prepare)
- [May 2026 HHS Accessibility Deadline - McDermott Law](https://www.mcdermottlaw.com/insights/may-2026-deadline-hhs-imposes-accessibility-standards-for-healthcare-company-websites-mobile-apps-kiosks/)
- [Healthcare Dashboards and KPIs - NetSuite](https://www.netsuite.com/portal/resource/articles/erp/healthcare-dashboards.shtml)
- [Embedded Healthcare Analytics - Reveal BI](https://www.revealbi.io/healthcare-analytics)
