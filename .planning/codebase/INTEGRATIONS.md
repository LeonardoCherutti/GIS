# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**Authentication:**
- Backend API Service - Custom authentication
  - Endpoint: `https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login`
  - Method: POST
  - Purpose: User login and token generation
  - SDK/Client: Native Fetch API
  - Implementation: `/d/gitlab/GIS/main.js` lines 83-103
  - Request format: JSON with `username` and `password` fields
  - Response: JSON with `token` field
  - Error handling: Displays login error message on authentication failure

**Business Intelligence:**
- Microsoft Power BI - Dashboard visualization and reporting
  - Purpose: Display hospital performance dashboards
  - Integration: Embedded iframes in dashboard view
  - Dashboard URLs: Configured in `/d/gitlab/GIS/main.js` lines 6-55
  - Authentication: Power BI sharing tokens (embedded in URLs)
  - Number of dashboards: 12 hospital/healthcare facility dashboards
  - URL pattern: `https://app.powerbi.com/view?r=[encoded-report-id]&ti=[tenant-id]`

## Data Storage

**Databases:**
- Not detected - Data stored on backend service

**Session Storage:**
- Browser sessionStorage
  - Purpose: Client-side session persistence
  - Implementation: `/d/gitlab/GIS/main.js` lines 71-72, 92-93, 107
  - Keys:
    - `loggedIn` - Boolean flag for authentication state
    - `token` - JWT or session token from backend

**File Storage:**
- Local filesystem only
  - Static assets: `/d/gitlab/GIS/imagens/` directory
  - Image formats: PNG, ICO

**Caching:**
- None detected - CDN caching via Tailwind CSS and Google Fonts CDNs

## Authentication & Identity

**Auth Provider:**
- Custom backend service
  - Service URL: `https://backend-app-113139671688.southamerica-east1.run.app`
  - Implementation: REST API endpoint `/api/auth/login`
  - Approach: Username/password authentication with token generation
  - Token storage: Browser sessionStorage
  - Session persistence: Simple flag-based (vulnerable to replay attacks)

**Authentication Flow:**
1. User enters username and password in login form
2. Frontend sends POST request to backend auth endpoint
3. Backend validates credentials and returns token
4. Token stored in sessionStorage
5. User redirected to dashboard selection view
6. Session persists across page refreshes (until browser closed)

## Monitoring & Observability

**Error Tracking:**
- None detected - Basic console.error logging only
  - Implementation: `/d/gitlab/GIS/main.js` lines 100

**Logs:**
- Browser console only
  - No remote logging infrastructure
  - Error messages logged to console when authentication fails

## CI/CD & Deployment

**Hosting:**
- Not specified - Presumed to be static file hosting
- Backend infrastructure: Google Cloud Run (southamerica-east1 region)

**CI Pipeline:**
- None detected - Manual deployment process

## Environment Configuration

**Required env vars:**
- None explicitly required (hardcoded values in code)

**API Endpoints (Hardcoded):**
- Authentication: `https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login`
- Power BI: Multiple report IDs embedded in dashboard configuration

**Secrets location:**
- Power BI report IDs stored in frontend code (`/d/gitlab/GIS/main.js`)
- Backend token stored in browser sessionStorage

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Power BI iframe - One-way embedding (no callbacks)

## Data Flow

**Authentication Flow:**
1. Login form submission → Backend API POST request
2. Backend validates and returns token
3. Token persisted in sessionStorage
4. User session checked on page load (line 71)

**Dashboard Access Flow:**
1. User selects dashboard from grid (12 available)
2. Dashboard ID mapped to Power BI report URL
3. iFrame src updated with report URL
4. Power BI report embedded in dashboard view

## Network Requirements

**CORS:**
- Required for:
  - Backend API calls from frontend
  - Power BI iframe embedding
  - Google Fonts CDN
  - Tailwind CSS CDN

**HTTPS:**
- Required for Power BI embedding
- Required for secure token transmission

---

*Integration audit: 2026-04-07*
