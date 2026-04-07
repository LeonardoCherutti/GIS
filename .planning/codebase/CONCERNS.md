# Codebase Concerns

**Analysis Date:** 2026-04-07

## Security Issues

**Hardcoded Sensitive URLs in Configuration:**
- Issue: Power BI embedding URLs contain sensitive API tokens embedded directly in the source code
- Files: `main.js` (lines 9-54)
- Impact: These tokens could be extracted from the frontend code and reused to generate unauthorized Power BI reports or gain access to dashboards. The URLs contain encoded credentials that should never be client-side accessible.
- Fix approach: Move all dashboard URLs to a secure backend API endpoint. Server should return only authorized URLs based on authenticated user roles. Implement server-side URL generation with temporary token expiration.

**Session Storage for Authentication:**
- Issue: Authentication token stored in `sessionStorage` without secure flags
- Files: `main.js` (lines 92-93)
- Impact: Tokens stored in sessionStorage are vulnerable to XSS attacks. No httpOnly flag means JavaScript can read and exfiltrate the token.
- Fix approach: Use httpOnly, Secure, SameSite cookies for token storage instead of sessionStorage. Implement CSRF protection. Add request signing with backend validation.

**Missing CORS Headers Validation:**
- Issue: Fetch request to backend at line 83 lacks proper error handling and CORS validation
- Files: `main.js` (line 83)
- Impact: Cross-origin requests could be intercepted or manipulated. No verification of response origin.
- Fix approach: Implement strict CORS policies on backend. Add response origin validation. Implement certificate pinning for sensitive requests.

**No Rate Limiting on Login:**
- Issue: Login endpoint has no visible rate limiting, brute force protection, or account lockout
- Files: `main.js` (lines 76-103)
- Impact: Credentials can be brute-forced with no throttling. No logging of failed attempts.
- Fix approach: Implement backend-side rate limiting (e.g., 5 attempts per 15 minutes per IP). Add progressive delays on failures. Implement account lockout. Log all authentication attempts.

**Frontend Authentication Bypass Potential:**
- Issue: Login logic relies on simple sessionStorage check at line 71
- Files: `main.js` (lines 71-73)
- Impact: Savvy users could bypass login by manually setting sessionStorage flag. No backend session validation on dashboard requests.
- Fix approach: Require backend session validation for every dashboard access. Return 401 for invalid sessions. Never trust frontend-only authentication state.

**Missing Content Security Policy:**
- Issue: No CSP headers to prevent XSS injection or data exfiltration
- Files: All files
- Impact: Inline styles and scripts could be replaced with malicious code. Tokens and user data could be exfiltrated to attacker servers.
- Fix approach: Implement strict CSP header on backend. Restrict script-src to 'self', style-src, and only necessary external domains. No unsafe-inline.

## Data Flow & Integration Issues

**Backend URL Exposed in Frontend:**
- Issue: Hardcoded backend URL `https://backend-app-113139671688.southamerica-east1.run.app` visible in source
- Files: `main.js` (line 83)
- Impact: Backend infrastructure is revealed. Opens attack surface. Difficult to rotate without code changes.
- Fix approach: Use relative URLs or API Gateway. Move backend URL to environment configuration. Implement API proxy at same origin.

**No Request Validation:**
- Issue: No input validation before sending username/password to backend
- Files: `main.js` (lines 79-86)
- Impact: Malformed requests could crash backend or reveal debug information. No client-side validation allows bad UX.
- Fix approach: Add client-side validation for required fields, format, and length. Add backend-side validation with detailed error logging (without exposing details to frontend).

**Unvalidated iframe Content:**
- Issue: Power BI iframe source set directly from config without origin validation
- Files: `main.js` (line 145)
- Impact: If config is compromised, arbitrary content could be embedded. XSS risk through iframe injection.
- Fix approach: Validate iframe URLs against whitelist. Use iframe sandbox attribute to restrict capabilities. Implement Subresource Integrity for Power BI script loads.

## Architectural Issues

**Single File JavaScript with Global State:**
- Issue: All logic in one file (main.js) with no module structure or dependency injection
- Files: `main.js`
- Impact: Hard to test, reuse, or refactor. Global scope pollution. No separation of concerns.
- Fix approach: Split into modules: auth.js, dashboards.js, ui.js, config.js. Use ES modules with imports/exports. Implement a minimal state management pattern.

**Missing Error Boundaries:**
- Issue: Error handling is minimal - only catches fetch errors with generic alert
- Files: `main.js` (lines 99-102)
- Impact: Unhandled errors silently fail or crash the app. No error logging for debugging production issues.
- Fix approach: Implement comprehensive error handling with try-catch blocks. Add error logging service (Sentry, LogRocket, etc.). Provide user-friendly error messages distinct from technical errors.

**No API Response Validation:**
- Issue: Response from login endpoint not validated before assuming success
- Files: `main.js` (lines 89-98)
- Impact: If backend returns unexpected format, app could crash or behave unpredictably.
- Fix approach: Validate response shape with schema validation (Zod, Joi). Check for required fields (token). Handle edge cases (empty token, missing fields).

**Tight Coupling to Tailwind CSS:**
- Issue: Heavy reliance on Tailwind CSS classes via CDN with no local fallback
- Files: `index.html` (line 8)
- Impact: If CDN is down, styling breaks completely. Network latency affects user experience.
- Fix approach: Build Tailwind locally. Include PurgeCSS to reduce bundle size. Add critical CSS inline for above-the-fold content.

## UI/UX Concerns

**Login View Visibility Issue:**
- Issue: Login view starts with `hidden` class at line 16, but showLoginView may never be called on initial load
- Files: `index.html` (line 16), `main.js` (line 125)
- Impact: Users may see blank page on first load if sessionStorage check fails unexpectedly.
- Fix approach: Start with login view visible by default. Remove `hidden` class from initial markup. Only hide after successful login.

**No Loading States:**
- Issue: No loading indicators while authentication request is in flight
- Files: `main.js` (lines 83-87)
- Impact: Users don't know if app is processing. May click submit multiple times creating duplicate requests.
- Fix approach: Disable submit button during request. Show loading spinner. Implement request cancellation for stale requests.

**Accessibility Issues:**
- Issue: Missing ARIA labels, alt text for images, keyboard navigation
- Files: `index.html` (multiple), `main.js`
- Impact: Screen reader users cannot navigate. Keyboard-only users cannot interact with dashboard cards.
- Fix approach: Add aria-label, aria-described-by attributes. Add alt text to all images. Ensure keyboard navigation with tabindex. Test with accessibility tools.

## Performance Issues

**Monolithic Dashboard Card Structure:**
- Issue: 12 hardcoded dashboard cards with no lazy loading or virtualization
- Files: `index.html` (lines 63-219)
- Impact: Large DOM tree increases initial render time. Adding more dashboards degrades performance linearly.
- Fix approach: Generate cards dynamically from config. Implement lazy loading for images. Use CSS Grid efficiently. Consider virtual scrolling if dashboard count grows beyond 20.

**Tailwind CDN Loading:**
- Issue: Tailwind CSS loaded from CDN on every page load
- Files: `index.html` (line 8)
- Impact: Extra network request blocking rendering. Cached for 24h but still adds latency on cold loads.
- Fix approach: Build Tailwind locally during build process. Inline critical CSS. Use CSS-in-JS or preprocessor for smaller payload.

**No Image Optimization:**
- Issue: Large PNG files in imagens/ directory not optimized
- Files: `imagens/` (multiple files >500KB)
- Impact: Slow page load times, especially on mobile. Each image adds to initial page load.
- Fix approach: Compress images with ImageOptim or TinyPNG. Use WebP with PNG fallback. Implement lazy loading for dashboard cards. Serve responsive images with srcset.

**Iframe Rendering Overhead:**
- Issue: Power BI iframe set on every dashboard view without caching
- Files: `main.js` (line 145)
- Impact: Each dashboard switch reloads the iframe, causing full Power BI re-initialization.
- Fix approach: Cache iframe content. Use iframe src switching with proper cleanup. Preload common dashboards.

## Testing & Quality Gaps

**No Automated Tests:**
- Issue: No test framework or test files in codebase
- Files: Not applicable - no tests exist
- Impact: Regressions go undetected. Refactoring is risky. Critical paths untested.
- Priority: High
- Fix approach: Add Jest or Vitest for unit testing. Test authentication flow, dashboard loading, error handling. Aim for >80% coverage on critical paths.

**No Linting or Code Quality Tools:**
- Issue: No ESLint, Prettier, or code quality configuration
- Files: `main.js`, `index.html`, `style.css`
- Impact: No enforced code style. Inconsistent naming and formatting. Harder to review PRs.
- Fix approach: Add .eslintrc.json with recommended rules. Add .prettierrc for formatting. Run in CI/CD pipeline. Fix existing issues.

**No Documentation:**
- Issue: No README, inline comments, or API documentation
- Files: All files
- Impact: New developers cannot understand how to set up, run, or modify the app. Power BI URLs are unexplained.
- Fix approach: Create README with setup instructions, architecture overview, environment variables needed. Add JSDoc comments to functions. Document each dashboard's source data.

## Fragile Areas

**Hard-Coded Dashboard Configuration:**
- Issue: Dashboard configuration requires direct code edit to add/remove dashboards
- Files: `main.js` (lines 6-56)
- Impact: Every new dashboard requires code change and redeploy. Risk of introducing bugs. No version control of configuration changes.
- Fix approach: Move config to external JSON file loaded via fetch. Implement admin UI for managing dashboards. Use database to store configuration.

**brittle DOM Selectors:**
- Issue: DOM selectors rely on specific IDs that have no protection from accidental changes
- Files: `main.js` (lines 59-68), `index.html` (multiple)
- Impact: Renaming an HTML element breaks JavaScript silently or throws errors.
- Fix approach: Use data attributes instead of IDs. Query with more specific selectors. Add tests to verify DOM structure.

**Manual View Toggling:**
- Issue: View visibility managed with manual class toggling
- Files: `main.js` (lines 125-150)
- Impact: Easy to accidentally leave multiple views visible. Complex state tracking.
- Fix approach: Implement a simple state machine or view manager. One view active at a time. Clear state transitions.

## Missing Critical Features

**No Session Timeout:**
- Issue: Once logged in, session persists indefinitely in sessionStorage
- Files: `main.js` (lines 92-93)
- Impact: If user leaves device unattended, anyone can access dashboards. No security boundary.
- Fix approach: Implement session timeout with countdown warning. Clear session after 30-60 minutes of inactivity. Require re-authentication for sensitive actions.

**No User Profile or Permissions:**
- Issue: No user data returned from login, all users see all dashboards
- Files: `main.js` (lines 89-95)
- Impact: Cannot implement role-based access control. No user tracking for audit logs.
- Fix approach: Return user object from login with roles/permissions. Implement dashboard visibility rules based on user role. Add user ID to all requests for audit logging.

**No Logout Backend Sync:**
- Issue: Logout only clears client-side sessionStorage, backend session not invalidated
- Files: `main.js` (lines 106-109)
- Impact: If token is compromised, attacker can still use it after user logout.
- Fix approach: Make logout call backend API to invalidate token. Add token revocation list. Implement backend session expiry.

**No Error Recovery:**
- Issue: If backend is unreachable, user sees cryptic error with no retry mechanism
- Files: `main.js` (lines 99-102)
- Impact: Network glitches cause permanent failure. No graceful degradation.
- Fix approach: Implement exponential backoff retry logic (3-5 attempts). Cache last known state. Show retry button to user. Provide offline mode if possible.

## Dependency Risks

**External CDN Dependencies:**
- Issue: Tailwind CSS and Fonts loaded from external CDNs
- Files: `index.html` (lines 8-9)
- Impact: Third-party CDN outage breaks styling. CDN could be compromised. No version pinning for Tailwind.
- Fix approach: Pin specific versions. Use subresource integrity (SRI) hashes. Host fonts locally. Build Tailwind locally.

**Power BI Dependency:**
- Issue: Core functionality depends on Power BI embed URLs that could change or expire
- Files: `main.js` (lines 6-56)
- Impact: If Power BI changes embed URL format or auth method, app breaks. No fallback display.
- Fix approach: Abstract Power BI integration behind a service layer. Implement fallback UI if Power BI unavailable. Monitor for breaking changes.

## Code Quality Issues

**No Constants for Magic Values:**
- Issue: Hardcoded strings like 'loggedIn', 'token' scattered throughout
- Files: `main.js` (lines 71, 92-93)
- Impact: Hard to refactor. Easy to typo. Inconsistent naming.
- Fix approach: Create constants object at top of file. Use enums for magic strings.

**Inconsistent Error Messages:**
- Issue: Mix of Portuguese and English in error handling
- Files: `main.js` (line 100 has "Erro ao autenticar", line 153 has English context)
- Impact: Confusing user experience. i18n not implemented.
- Fix approach: Standardize on one language or implement proper i18n library (i18next, react-intl).

**No Input Sanitization:**
- Issue: Username/password not sanitized before display or API call
- Files: `main.js` (lines 79-86)
- Impact: Potential for XSS if credentials contain HTML/script tags. Backend should sanitize but client should validate too.
- Fix approach: Add DOMPurify for output sanitization. Validate input format. Never display user input without escaping.

---

*Concerns audit: 2026-04-07*
