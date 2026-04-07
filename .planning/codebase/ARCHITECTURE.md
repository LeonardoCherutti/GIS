# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Client-side Single-Page Application (SPA) with view-based state management

**Key Characteristics:**
- Pure client-side rendering with vanilla JavaScript (no framework)
- Multi-view application (login, dashboard selection, dashboard display)
- External dashboard embedding via Power BI iframes
- Session-based authentication state persistence
- Configuration-driven dashboard management

## Layers

**Presentation Layer:**
- Purpose: Render UI views and handle user interactions
- Location: `index.html`, `style.css`
- Contains: HTML markup, CSS styling, DOM element references
- Depends on: Main application script, Tailwind CSS CDN
- Used by: User interactions trigger view transitions

**Application Logic Layer:**
- Purpose: Manage view transitions, authentication, and dashboard routing
- Location: `main.js`
- Contains: Event listeners, view management functions, authentication logic, dashboard configuration
- Depends on: Presentation layer DOM, backend authentication API
- Used by: Browser DOMContentLoaded event, user actions

**Configuration Layer:**
- Purpose: Store dashboard metadata and external URLs
- Location: `main.js` (config object, lines 4-56)
- Contains: Dashboard IDs, titles, Power BI URLs
- Depends on: None
- Used by: showDashboard() function for routing and loading

**External Integration Layer:**
- Purpose: Connect to external services
- Location: Fetch API call to backend auth endpoint (line 83), iframe sources from Power BI
- Contains: Authentication API calls, Power BI frame loading
- Depends on: Backend authentication service, Power BI hosting
- Used by: Login submission handler, dashboard display function

## Data Flow

**Authentication Flow:**

1. User enters credentials on login view
2. Form submission event captured (line 76)
3. POST request sent to backend: `https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login`
4. Backend returns token and status
5. On success: token stored in sessionStorage, view transitions to dashboard selection
6. On failure: error message displayed, user remains on login

**Dashboard Selection Flow:**

1. User clicks dashboard card
2. Dashboard ID extracted from data attribute (line 119)
3. showDashboard(dashboardId) function called (line 120)
4. Dashboard lookup in config object (line 140)
5. Title updated in UI (line 142)
6. Power BI iframe src set to dashboard URL (line 145)
7. Dashboard view displayed (line 150)

**View Transition Flow:**

1. showLoginView() → hides all except login view
2. showDashboardSelection() → hides login and dashboard, shows selection grid
3. showDashboard() → hides login and selection, shows dashboard
4. Back/Logout buttons trigger transitions back to previous views

**State Management:**
- Login state: sessionStorage.loggedIn (boolean)
- Authentication token: sessionStorage.token (string)
- View state: CSS class "hidden" toggling on DOM elements
- Dashboard selection: data attributes on dashboard cards

## Key Abstractions

**View System:**
- Purpose: Encapsulate distinct application screens
- Examples: `#login-view`, `#dashboard-selection-view`, `#dashboard-view`
- Pattern: Each view is a hidden div; showXxxView() functions toggle visibility

**Dashboard Configuration:**
- Purpose: Centralized management of dashboard metadata
- Examples: Lines 6-55 in `main.js`
- Pattern: Object with dashboard ID keys mapping to {title, url} objects

**DOM Element Cache:**
- Purpose: Avoid repeated querySelector calls
- Examples: Lines 59-68 in `main.js`
- Pattern: Variables store references to frequently accessed elements

## Entry Points

**Application Initialization:**
- Location: `main.js` (lines 2-3)
- Triggers: DOMContentLoaded event fires when DOM is ready
- Responsibilities: Set up event listeners, check session state, initialize view

**User Authentication:**
- Location: Login form submission handler (lines 76-103)
- Triggers: User submits login form
- Responsibilities: Validate credentials against backend, persist session, transition view

**Dashboard Navigation:**
- Location: Dashboard card click handlers (lines 117-122)
- Triggers: User clicks dashboard card
- Responsibilities: Load dashboard configuration, update iframe, show dashboard view

**Logout:**
- Location: Logout button handler (lines 106-109)
- Triggers: User clicks logout button
- Responsibilities: Clear session storage, return to login view

## Error Handling

**Strategy:** Client-side error messages with console logging

**Patterns:**
- Authentication errors: Display error message in login view (line 97)
- Dashboard not found: Console error + alert dialog (lines 152-153)
- Network errors: Caught in try-catch, displays generic error message (lines 99-102)
- No explicit error recovery beyond user re-entry

## Cross-Cutting Concerns

**Logging:** Basic console.error() for debugging authentication and dashboard issues

**Validation:** 
- HTML5 form validation (required fields on login inputs)
- Dashboard existence check before displaying (line 140)

**Authentication:** 
- Backend-validated with JWT tokens
- Session persistence via sessionStorage
- Simple check on app init: if loggedIn === 'true', skip login view

---

*Architecture analysis: 2026-04-07*
