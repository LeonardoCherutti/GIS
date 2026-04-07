# Domain Pitfalls

**Domain:** Healthcare dashboard portal (Next.js SPA + Go API + Postgres)
**Researched:** 2026-04-07

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: next-intl Incompatibility with Static Export

**What goes wrong:** The reference project (ferreiracontabilidade) uses `output: 'standalone'` with next-intl middleware and server-side locale routing (`[locale]` directory pattern, `getRequestConfig`, `createNextIntlPlugin`). GIS requires `output: 'export'` (static SPA). These are fundamentally incompatible. next-intl's middleware does not run in static export mode. Copying the reference patterns verbatim will produce build errors or broken locale routing.

**Why it happens:** Developers see the reference project's i18n pattern and replicate it without realizing `output: 'export'` disables Next.js middleware, server components with dynamic rendering, and `getRequestConfig` server-side APIs.

**Consequences:** Build failures, locale routing that silently breaks, or a forced switch away from static export (defeating the SPA requirement).

**Prevention:**
- Use next-intl in **client-only mode** without middleware. Store locale in React state/context and localStorage.
- Skip the `[locale]` URL segment entirely since this is a SPA (no SEO benefit). Use a client-side locale provider instead.
- Alternatively, use a lighter i18n library like `react-intl` or `i18next` with `react-i18next` that has no server dependency.
- If `[locale]` URL segments are desired, use `generateStaticParams` to pre-render all locale variants at build time with next-intl's static rendering support.

**Detection:** Build errors mentioning "i18n configuration cannot be used with output: export" or "middleware is not supported with static exports."

**Phase:** Must be resolved in Phase 1 (project scaffolding). Wrong choice here cascades everywhere.

**Confidence:** HIGH -- verified via next-intl GitHub issues (#334, #743) and Next.js docs.

---

### Pitfall 2: Next.js Static Export Losing Features You Assumed Existed

**What goes wrong:** With `output: 'export'`, the following are NOT available:
- **Middleware** (no `middleware.ts`) -- breaks auth guards, locale redirects, CORS headers
- **Server-side API route handlers** that read request headers/cookies at runtime
- **`useParams()` in client components** with dynamic routes (known bug/limitation)
- **Server Actions**
- **Incremental Static Regeneration (ISR)**
- **Custom `headers()` in next.config** (they have no server to set them)

The reference project's `next.config.ts` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` via `headers()`. This will NOT work in static export mode because there is no Next.js server to inject those headers.

**Why it happens:** Developers treat Next.js as Next.js regardless of output mode. The `export` mode is essentially a different product with a shared API surface.

**Consequences:** Auth middleware that never runs, COOP headers that never get set (breaking Google OAuth popup), API proxy routes that don't exist at runtime.

**Prevention:**
- **Auth guards:** Implement entirely client-side with React context + route protection components.
- **Headers (COOP, CSP, CORS):** Must be set on the static file server (nginx, Caddy, Docker reverse proxy) or via `<meta>` tags where supported.
- **API proxy:** Use the Go API directly from the browser (requires proper CORS on Go side) or use a reverse proxy (nginx) in Docker to route `/api/*` to the Go service.
- Create a checklist of "things that don't work in static export" and review it before using any Next.js server feature.

**Detection:** Features that work in `next dev` but break in `next build && npx serve out/`. Always test the production static build.

**Phase:** Phase 1 (scaffolding). The entire architecture depends on understanding these constraints.

**Confidence:** HIGH -- verified via Next.js official docs on static exports.

---

### Pitfall 3: Google OAuth Popup Blocked or Broken by COOP Headers

**What goes wrong:** The Google OAuth popup flow requires communication between the popup window (accounts.google.com) and the opener window (your app). If the `Cross-Origin-Opener-Policy` header is set to `same-origin` (a common security default), the browser severs the connection between popup and opener. The popup completes auth but `window.opener` is null, so the token never gets back to your app. Users see "popup closed by user" errors.

**Why it happens:** Security-hardened server configs or frameworks default to `Cross-Origin-Opener-Policy: same-origin`. Chrome's security model has gotten stricter around cross-origin popup communication.

**Consequences:** Auth flow completely broken. Users cannot log in. Extremely confusing to debug because the popup opens and closes successfully -- the failure is silent.

**Prevention:**
- Set `Cross-Origin-Opener-Policy: same-origin-allow-popups` on the hosting server (nginx/Caddy config in Docker). The reference project already does this but via Next.js `headers()` which won't work in static export.
- Use Google Identity Services (GIS) library's `google.accounts.oauth2.initCodeClient` or `initTokenClient` with `ux_mode: 'popup'` -- this library handles COOP correctly.
- **Test the popup flow in production build**, not just `next dev`. The dev server has different header behavior.
- The popup must be opened synchronously in a user click handler. Opening it in an async callback (after an API call, after a `setTimeout`) will cause Chrome to block it as a non-user-initiated popup.

**Detection:** "auth/popup-closed-by-user" errors, `window.opener` being null in the popup, popup blockers triggering.

**Phase:** Phase 2 (auth implementation). Test with production build immediately.

**Confidence:** HIGH -- verified via Next.js discussion #51135, Chrome COOP documentation, and Google OAuth docs.

---

### Pitfall 4: CORS Misconfiguration Between Next.js SPA and Go API

**What goes wrong:** The static Next.js SPA is served from one origin (e.g., `http://localhost:3000` or `https://gis.example.com`) and the Go API lives at another origin (e.g., `http://localhost:8080` or `https://api.gis.example.com`). Without correct CORS configuration on the Go API, every fetch request from the browser fails with "CORS policy" errors. Worse, preflight OPTIONS requests get 404 or 405 responses because Go handlers don't handle them.

**Why it happens:** CORS is configured correctly for one environment (dev) but not another (production), or the OPTIONS method isn't registered on routes, or credentials (cookies/Authorization header) are sent but `Access-Control-Allow-Credentials` isn't set, or `Access-Control-Allow-Origin: *` is used with credentials (which browsers reject).

**Consequences:** API completely inaccessible from the browser. Every authenticated request fails.

**Prevention:**
- Use `rs/cors` middleware in Go (the standard library). Configure it with explicit allowed origins (not `*` when using credentials), allowed methods including OPTIONS, and allowed headers including `Authorization` and `Content-Type`.
- **Alternative: avoid CORS entirely** by using a reverse proxy (nginx) in Docker that serves both the static frontend and proxies `/api/*` to the Go service. Same origin = no CORS needed. This is the recommended approach for Docker Compose deployments.
- If using CORS directly, configure it per-environment via environment variables, not hardcoded.
- Always handle `OPTIONS` preflight requests. If using `chi` or `gorilla/mux`, ensure the CORS middleware runs before route matching.

**Detection:** Browser console showing "Access to fetch at X from origin Y has been blocked by CORS policy." Network tab showing OPTIONS requests with non-200 responses.

**Phase:** Phase 1 (project scaffolding / Docker setup). Decide on reverse-proxy vs. CORS-headers approach upfront.

**Confidence:** HIGH -- well-documented, universal issue.

---

### Pitfall 5: Power BI Iframe Embedding CSP/Frame Conflicts

**What goes wrong:** Power BI iframes require specific Content-Security-Policy settings to work. Two directions of framing can fail:
1. **Your app framing Power BI:** Your CSP `frame-src` must allow `https://app.powerbi.com` and `https://*.powerbi.com`.
2. **Power BI's own CSP:** Power BI sets `frame-ancestors` to specific Microsoft domains. If you're using "Publish to web" (public) embeds, this works. If you're using "Embed for your organization" (authenticated), you must register your domain in Power BI admin settings and the token type must be `TokenType.Aad`, not `TokenType.Embed`.

Additionally, if your app sets `X-Frame-Options: DENY` globally (a common security header), Power BI iframes within your own app won't be affected (they're loading Power BI, not being framed by it), but it's a common source of confusion.

**Why it happens:** Developers conflate "my app framing Power BI" with "Power BI framing my app." CSP directives are directional and easy to misconfigure.

**Consequences:** Blank iframes where dashboards should appear, console errors about frame-ancestors violations, authentication popups within the iframe that get blocked.

**Prevention:**
- For v1 with "Publish to web" URLs: Set `frame-src` in your CSP to include `https://app.powerbi.com https://*.powerbi.com https://login.microsoftonline.com`.
- Set CSP headers on the static file server (nginx), not in Next.js config.
- Do NOT set `Cross-Origin-Opener-Policy: same-origin` (use `same-origin-allow-popups`) because Power BI embeds may open auth popups.
- Test iframe loading in an incognito window to catch auth-related framing issues.

**Detection:** Blank Power BI iframe areas, browser console showing "Refused to frame" errors, Power BI loading spinner that never resolves.

**Phase:** Phase 3 (Power BI integration). Can be tested in isolation.

**Confidence:** MEDIUM -- depends on whether "Publish to web" or authenticated embed is used. Public embeds are simpler.

---

## Moderate Pitfalls

### Pitfall 6: Docker Compose Service Discovery -- localhost vs. Service Names

**What goes wrong:** Inside Docker Compose, `localhost` refers to the container itself, not the host machine or other containers. Setting the Go API's database connection to `localhost:5432` means it tries to connect to Postgres inside its own container (which doesn't exist). The frontend container can't reach the API at `localhost:8080`.

**Prevention:**
- Use Docker Compose **service names** as hostnames: `postgres:5432` for the database, `api:8080` for the Go API.
- Use environment variables for all hostnames -- never hardcode `localhost` in connection strings.
- Use `depends_on` with `condition: service_healthy` and define healthchecks on Postgres (`pg_isready`) to prevent the Go API from crashing on startup because the database isn't ready yet.
- For local development outside Docker, use `.env.local` with `localhost` values. For Docker, use `.env.docker` with service names.

**Detection:** "connection refused" errors in container logs, services restarting in loops.

**Phase:** Phase 1 (Docker Compose setup).

**Confidence:** HIGH.

---

### Pitfall 7: Dark Mode Flash of Wrong Theme (FOWT)

**What goes wrong:** On page load, the app renders in light mode (the CSS default), then JavaScript reads the saved theme preference from localStorage and switches to dark mode. Users see a bright flash before the dark theme applies. In a static export SPA, this is worse because there's no server to inject the correct theme class into the initial HTML.

**Prevention:**
- Add a **blocking inline `<script>` in the `<head>`** (before any CSS loads) that reads `localStorage.getItem('theme')` or `window.matchMedia('(prefers-color-scheme: dark)')` and sets `document.documentElement.setAttribute('data-theme', 'dark')` immediately.
- In Next.js with `output: 'export'`, this goes in a custom `app/layout.tsx` using `<Script strategy="beforeInteractive">` or directly in a custom `_document` if using Pages Router.
- The palette.css `[data-theme="dark"]` pattern from the reference project is correct for this -- just ensure the attribute is set before the first paint.
- Use `color-scheme: dark` CSS property alongside custom properties so browser chrome (scrollbars, form controls) matches.

**Detection:** Visible flash of light theme when loading the app with dark mode saved. Test by setting dark mode, then hard-refreshing.

**Phase:** Phase 2 (theming/palette.css setup).

**Confidence:** HIGH -- well-documented issue.

---

### Pitfall 8: Go Middleware Ordering -- CORS Before Auth Before Routes

**What goes wrong:** In Go HTTP servers, middleware execution order matters. If auth middleware runs before CORS middleware, preflight OPTIONS requests (which carry no auth token) get rejected with 401 before CORS headers are set. The browser sees a failed preflight and blocks the actual request. The developer sees "CORS error" but the real problem is middleware ordering.

**Prevention:**
- Use `chi` router (recommended for this stack) with middleware applied in this order:
  1. Recovery (panic handler)
  2. Request ID / Logging
  3. CORS (`rs/cors`)
  4. Auth token validation
  5. Route-specific middleware
- CORS middleware must intercept OPTIONS requests and respond with 200 + headers **before** auth middleware runs.
- Write integration tests that send OPTIONS requests to protected endpoints and verify they get 200 with correct CORS headers.

**Detection:** OPTIONS requests returning 401 or 403 in the Network tab. "CORS error" in browser but the Go API logs show auth failures.

**Phase:** Phase 2 (Go API scaffolding).

**Confidence:** HIGH.

---

### Pitfall 9: Google OAuth Token Handling -- Storing Tokens Client-Side in a SPA

**What goes wrong:** In a static SPA, there is no server-side session. Developers store the Google OAuth token (or the Go API session token) in localStorage, which is vulnerable to XSS attacks. Or they store it only in memory and users lose their session on every page refresh. Or they use `sessionStorage` (like the current vanilla app) which doesn't persist across tabs.

**Prevention:**
- **Recommended flow:** Google OAuth popup returns an authorization code. Send the code to the Go API. The Go API exchanges it for tokens server-side, creates a session, and returns an **httpOnly secure cookie**. The SPA uses cookies for subsequent API requests (no token in JavaScript).
- If cookies are impractical (different origins without reverse proxy), use short-lived JWT access tokens in memory (not localStorage) + a refresh token in an httpOnly cookie via the Go API.
- Never store Google refresh tokens client-side.
- The Go API should validate the Google ID token on every request or maintain its own session.

**Detection:** Tokens visible in localStorage via browser DevTools. Sessions that break across tabs or on refresh.

**Phase:** Phase 2 (auth implementation).

**Confidence:** HIGH.

---

### Pitfall 10: Next.js Static Export + Client-Side Routing Breaks on Direct URL Access

**What goes wrong:** A static export generates HTML files for each known route. If a user navigates to `/dashboard/hospital-123` directly (bookmark, refresh), the static file server looks for `/dashboard/hospital-123/index.html` which doesn't exist (because the route is dynamic/client-rendered). The user gets a 404.

**Prevention:**
- Configure the static file server (nginx) to serve `index.html` for all routes that don't match a static file (SPA fallback): `try_files $uri $uri/ /index.html`.
- In Docker, this goes in the nginx configuration for the frontend container.
- For development, `npx serve out/ --single` handles this.
- If using `generateStaticParams`, all known routes will have HTML files, but new hospitals added to the database won't have corresponding static files until the next build -- so SPA fallback is still needed.

**Detection:** 404 errors when refreshing on any non-root page, or when sharing deep links.

**Phase:** Phase 1 (Docker/nginx setup).

**Confidence:** HIGH.

---

## Minor Pitfalls

### Pitfall 11: Forgetting to Pin Docker Image Versions

**What goes wrong:** Using `node:latest` or `postgres:latest` in Dockerfiles leads to different builds on different machines or at different times. A Postgres major version upgrade could break the database.

**Prevention:** Always pin: `node:22-alpine`, `golang:1.22-alpine`, `postgres:16-alpine`. Update intentionally.

**Phase:** Phase 1.

**Confidence:** HIGH.

---

### Pitfall 12: CSS Custom Properties Not Falling Back Gracefully

**What goes wrong:** Using `var(--palette-primary)` without a fallback means if the variable is undefined (wrong scope, typo, missing import), the property becomes `initial` (usually transparent or inherited). Cards become invisible, text disappears.

**Prevention:**
- Always provide fallbacks for critical visual properties: `color: var(--palette-foreground, #0a1628)`.
- Import `palette.css` in the root layout so it's always available.
- Use CSS linting (stylelint) to catch undefined custom properties.

**Phase:** Phase 2 (component development).

**Confidence:** HIGH.

---

### Pitfall 13: Go API Not Gracefully Handling Postgres Connection Failures

**What goes wrong:** The Go API starts, Postgres isn't ready yet (even with `depends_on`), the first database query panics or returns a cryptic error. No retry logic, no health endpoint, no connection pool configuration.

**Prevention:**
- Use `sqlx` or `pgx` with connection pool settings (max connections, timeout).
- Implement a startup retry loop (try connecting every 2 seconds for 30 seconds before giving up).
- Expose a `/health` endpoint that checks database connectivity.
- Use `depends_on: condition: service_healthy` in Docker Compose with a Postgres healthcheck.

**Phase:** Phase 1 (Go API scaffolding).

**Confidence:** HIGH.

---

### Pitfall 14: Mixing "Publish to Web" and "Embed for Organization" Power BI URLs

**What goes wrong:** "Publish to web" URLs are public (anyone with the link can view). "Embed for organization" URLs require Azure AD authentication. Mixing them in the same app creates inconsistent behavior -- some dashboards load fine, others show login prompts inside the iframe or fail silently.

**Prevention:**
- Decide on ONE embed strategy for v1. "Publish to web" is dramatically simpler (just an iframe src, no token management). Use it unless data sensitivity requires authenticated embedding.
- If using authenticated embeds, the Go API needs to obtain embed tokens via the Power BI REST API and pass them to the frontend.
- Document which embed type each hospital uses.

**Detection:** Some hospital dashboards showing login prompts while others load directly.

**Phase:** Phase 3 (Power BI integration).

**Confidence:** MEDIUM.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Scaffolding | next-intl + static export conflict (#1, #2) | Choose client-only i18n approach from day 1 |
| Phase 1: Scaffolding | Docker networking (#6) | Use service names, healthchecks, nginx reverse proxy |
| Phase 1: Scaffolding | SPA routing 404s (#10) | Configure nginx SPA fallback immediately |
| Phase 2: Auth | OAuth popup blocked (#3) | Set COOP header on nginx, use GIS library, test prod build |
| Phase 2: Auth | Token storage in SPA (#9) | Use httpOnly cookies via Go API, not localStorage |
| Phase 2: Auth | CORS + middleware order (#4, #8) | Reverse proxy eliminates CORS; if not, CORS before auth |
| Phase 2: Theming | Dark mode flash (#7) | Inline script in head before CSS |
| Phase 3: Power BI | CSP/iframe issues (#5) | Set frame-src on nginx, test in incognito |
| Phase 3: Power BI | Mixed embed types (#14) | Standardize on one embed strategy |

## Sources

- [Next.js Static Exports Documentation](https://nextjs.org/docs/app/guides/static-exports)
- [next-intl Static Export Issue #334](https://github.com/amannn/next-intl/issues/334)
- [next-intl Static Export Issue #743](https://github.com/amannn/next-intl/issues/743)
- [Next.js COOP Discussion #51135](https://github.com/vercel/next.js/discussions/51135)
- [Google OAuth2 Code Model](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
- [Chrome COOP restrict-properties](https://developer.chrome.com/blog/coop-restrict-properties)
- [Power BI Embed CSP Issues](https://community.fabric.microsoft.com/t5/Developer/Content-Security-Policy-error-when-embedding-the-dashboard-using/m-p/2032343)
- [Power BI Secure Embed Documentation](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure)
- [Docker Compose Networking](https://docs.docker.com/compose/how-tos/networking/)
- [Fixing Dark Mode Flickering in Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [CORS with Next.js and Go API](https://forum.golangbridge.org/t/cors-erro-with-nextjs-fetch-in-go-api/34339)
- [Go chi middleware package](https://pkg.go.dev/github.com/go-chi/chi/v5/middleware)
- [Common Next.js App Router Mistakes (Vercel)](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)
- Reference project analysis: `D:\ferreiracontabilidade\app` (next.config.ts, i18n/, palette.css)
