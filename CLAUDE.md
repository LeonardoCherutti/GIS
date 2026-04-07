<!-- GSD:project-start source:PROJECT.md -->
## Project

**GIS - Gestao Inteligente em Saude**

A hospital dashboard portal that authenticates users via Google OAuth and presents a grid of hospital cards, each linking to embedded Power BI dashboards. Built as a modern Next.js SPA frontend backed by a Go API and Postgres database. Currently serves ~12 hospitals across Brazil with healthcare analytics dashboards.

**Core Value:** Authenticated users can quickly access hospital-specific Power BI dashboards from a single, clean portal — with the architecture ready to replace Power BI with custom data views in the future.

### Constraints

- **Tech stack**: Next.js latest (SPA, app router) + Go API + Postgres
- **Auth**: Google OAuth popup only, no redirect URI flow. Whitelist via env vars.
- **Standards**: Must match D:\ferreiracontabilidade\app patterns (components, palette.css, app router)
- **Deployment**: Docker Compose (frontend + API + database)
- **Language**: Portuguese (pt-BR) primary, i18n-ready architecture
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 - Markup and page structure (`/d/gitlab/GIS/index.html`)
- CSS3 - Styling and animations (`/d/gitlab/GIS/style.css`)
- JavaScript (ES6+) - Client-side application logic (`/d/gitlab/GIS/main.js`)
## Runtime
- Browser-based (Client-side only)
- No server-side runtime (Static HTML deployment)
- Modern browsers supporting ES6 JavaScript
- Responsive design for mobile and desktop
## Frameworks
- Tailwind CSS 4.x - Utility-first CSS framework
- Google Fonts - Roboto font family (300, 400, 500, 700 weights)
## Key Dependencies
- Tailwind CSS (v4.x via CDN) - UI framework for responsive design
- Google Fonts API - Custom typography
- Power BI Embed - Dashboard visualization platform (embedded via iframes)
## Configuration
- No environment configuration files (.env) present
- Hardcoded Power BI dashboard URLs in `/d/gitlab/GIS/main.js`
- No build system detected
- Direct deployment (static files only)
- Files: `index.html`, `main.js`, `style.css`
## Platform Requirements
- Text editor or IDE for HTML/CSS/JavaScript
- Git for version control (present: `.git/`)
- Browser for testing
- Web server capable of serving static files
- HTTPS support (required for Power BI embedding)
- CORS support (to allow Power BI iframe embedding)
- Backend API at `https://backend-app-113139671688.southamerica-east1.run.app` (authentication endpoint)
## Deployment
- Static file hosting (HTML, CSS, JS, images)
- No minification or optimization pipeline
- Direct CDN usage for Tailwind CSS and Google Fonts
- Image files in `/d/gitlab/GIS/imagens/` directory (PNG format)
- Favicon: `favicon.ico`
## Served Content
- `/index.html` - Main application entry point
- `/main.js` - Application logic
- `/style.css` - Custom styling
- `/imagens/*` - Static image assets
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- HTML: `index.html` - lowercase, hyphenated separators for compound names
- JavaScript: `main.js` - lowercase, singular descriptive names
- CSS: `style.css` - lowercase, single descriptor name
- Images: `CanoasDasGraças.png` - PascalCase for multi-word descriptors in image filenames
- Named functions use camelCase: `showDashboard()`, `showLoginView()`, `showDashboardSelection()`
- Event handler functions typically use camelCase verbs: `addEventListener`, `addEventListener`, `submit`
- Private/helper functions prefixed with verb describing action: `show*`, `get*`
- DOM element references use camelCase with descriptive suffixes: `loginView`, `dashboardSelectionView`, `dashboardView`, `loginForm`, `loginError`, `logoutBtn`, `backBtn`
- Configuration objects use camelCase: `config`, `dashboards`, `res`, `data`, `err`
- Boolean/flag variables use present tense descriptors: `loggedIn`, `ok`
- Loop variables use standard conventions: `e` for event, `card` for items in forEach
- Configuration object structure uses camelCase: `dashboards`, `title`, `url`
- No explicit TypeScript types; vanilla JavaScript with implicit typing
- HTML IDs use kebab-case: `login-view`, `dashboard-selection-view`, `dashboard-view`, `login-form`, `login-error`, `logout-btn`, `back-btn`, `dashboard-title`, `powerbi-iframe`, `dashboard-container`, `app`
- CSS classes use kebab-case: `dashboard-card`, `login-container`, `dashboard-iframe`, `suave`, `liquid-glass-box`
- Data attributes use kebab-case: `data-dashboard-id`
## Code Style
- No explicit formatter (no .prettierrc, eslint config, or biome.json detected)
- 4-space indentation observed in HTML and JavaScript
- Line length: Files contain lines up to ~100+ characters (no enforced limit detected)
- Semicolon usage: Inconsistent - some statements end with semicolons, some don't (see `main.js` lines 129, 135, 154)
- No linting tools configured (no .eslintrc, eslint.config.js detected)
- No automated code quality enforcement
- Inline comments use standard JS format: `// Comment text`
- Comment style: Descriptive, explaining "what" the code does (see lines 3, 70, 116, 139)
- Comments placed above code block they describe (see line 70: "// Check if user is already logged in (simple session persistence)")
## Import Organization
- Relative paths only: `./main.js`, `./style.css`, `./imagens/`
- No path aliases or module aliasing system in place
## Error Handling
- Try-catch blocks for async operations: See `main.js` lines 82-103 (fetch wrapper in login form submission)
- Error visibility: Errors logged to console with `console.error('Erro ao autenticar', err)` (line 100)
- User-facing error display: DOM elements manipulated (line 101: `loginError.classList.remove('hidden')`)
- Silent error handling in fallback: `alert('Dashboard não encontrado.')` for missing dashboards (line 153)
## Logging
- Console errors for debugging: `console.error('Erro ao autenticar', err)` (line 100)
- Console errors for missing resources: `console.error('Dashboard not found:', dashboardId)` (line 152)
- Portuguese error messages for user-facing errors: "Credenciais inválidas. Tente novamente.", "Dashboard não encontrado."
- English error messages in console logs
## Comments
- Configuration blocks: Comment at top level (line 5: `// Dashboard configuration - add/remove dashboards here`)
- Complex logic sections: Comment before event listeners (line 116: `// Dashboard Card Click Handlers`)
- Before view management functions (line 124: `// View Management Functions`)
- Not used - no function documentation via JSDoc blocks
- No TypeScript/type annotations present
## Function Design
- View management functions: `showLoginView()`, `showDashboardSelection()`, `showDashboard()` are 5-7 lines each
- Event handlers in forEach: Typically 1-5 lines
- Minimal parameter passing; functions rely on DOM element references and closure-captured `config` object
- Event handlers receive event object: `function(e)` for form submit, `function()` for others
- Dashboard ID passed as single parameter: `showDashboard(dashboardId)`
- No explicit returns; functions modify DOM or application state
- View management functions are void; they manipulate visibility via classList methods
## Module Design
- Single `main.js` file executed in browser context
- All code runs on DOMContentLoaded event (line 2)
- Global scope pollution avoided by wrapping in event listener
- All DOM elements and functions scoped within DOMContentLoaded callback (lines 2-157)
- Configuration object `config` accessible throughout the callback scope
- No polluting global namespace (proper encapsulation via event listener)
## CSS Conventions
- Kebab-case consistently used: `.dashboard-card`, `.login-container`, `.dashboard-iframe`
- Utility-first approach via Tailwind CSS: Classes like `flex`, `items-center`, `justify-center`, `mb-8`, `text-gray-800`
- Custom classes for complex styling: `.suave` (transition effect), `.liquid-glass-box` (glassmorphism effect)
- Tailwind margin/padding utilities: `mb-8`, `p-6`, `px-4`, `py-2`, `mr-4`
- Flex utilities for layout: `flex`, `items-center`, `justify-between`, `justify-center`
- Grid utilities: `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `gap-6`
- Tailwind color palette: `text-gray-800`, `bg-blue-600`, `text-red-500`, `bg-indigo-100`
- Custom CSS variables: None detected
- Hardcoded color in CSS: `#16AEA6` (border-left on dashboard cards), `#f8fafc` (background)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Pure client-side rendering with vanilla JavaScript (no framework)
- Multi-view application (login, dashboard selection, dashboard display)
- External dashboard embedding via Power BI iframes
- Session-based authentication state persistence
- Configuration-driven dashboard management
## Layers
- Purpose: Render UI views and handle user interactions
- Location: `index.html`, `style.css`
- Contains: HTML markup, CSS styling, DOM element references
- Depends on: Main application script, Tailwind CSS CDN
- Used by: User interactions trigger view transitions
- Purpose: Manage view transitions, authentication, and dashboard routing
- Location: `main.js`
- Contains: Event listeners, view management functions, authentication logic, dashboard configuration
- Depends on: Presentation layer DOM, backend authentication API
- Used by: Browser DOMContentLoaded event, user actions
- Purpose: Store dashboard metadata and external URLs
- Location: `main.js` (config object, lines 4-56)
- Contains: Dashboard IDs, titles, Power BI URLs
- Depends on: None
- Used by: showDashboard() function for routing and loading
- Purpose: Connect to external services
- Location: Fetch API call to backend auth endpoint (line 83), iframe sources from Power BI
- Contains: Authentication API calls, Power BI frame loading
- Depends on: Backend authentication service, Power BI hosting
- Used by: Login submission handler, dashboard display function
## Data Flow
- Login state: sessionStorage.loggedIn (boolean)
- Authentication token: sessionStorage.token (string)
- View state: CSS class "hidden" toggling on DOM elements
- Dashboard selection: data attributes on dashboard cards
## Key Abstractions
- Purpose: Encapsulate distinct application screens
- Examples: `#login-view`, `#dashboard-selection-view`, `#dashboard-view`
- Pattern: Each view is a hidden div; showXxxView() functions toggle visibility
- Purpose: Centralized management of dashboard metadata
- Examples: Lines 6-55 in `main.js`
- Pattern: Object with dashboard ID keys mapping to {title, url} objects
- Purpose: Avoid repeated querySelector calls
- Examples: Lines 59-68 in `main.js`
- Pattern: Variables store references to frequently accessed elements
## Entry Points
- Location: `main.js` (lines 2-3)
- Triggers: DOMContentLoaded event fires when DOM is ready
- Responsibilities: Set up event listeners, check session state, initialize view
- Location: Login form submission handler (lines 76-103)
- Triggers: User submits login form
- Responsibilities: Validate credentials against backend, persist session, transition view
- Location: Dashboard card click handlers (lines 117-122)
- Triggers: User clicks dashboard card
- Responsibilities: Load dashboard configuration, update iframe, show dashboard view
- Location: Logout button handler (lines 106-109)
- Triggers: User clicks logout button
- Responsibilities: Clear session storage, return to login view
## Error Handling
- Authentication errors: Display error message in login view (line 97)
- Dashboard not found: Console error + alert dialog (lines 152-153)
- Network errors: Caught in try-catch, displays generic error message (lines 99-102)
- No explicit error recovery beyond user re-entry
## Cross-Cutting Concerns
- HTML5 form validation (required fields on login inputs)
- Dashboard existence check before displaying (line 140)
- Backend-validated with JWT tokens
- Session persistence via sessionStorage
- Simple check on app init: if loggedIn === 'true', skip login view
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
