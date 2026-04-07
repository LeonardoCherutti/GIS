# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
GIS/
├── index.html          # Main HTML entry point with all views
├── main.js             # Application logic and view management
├── style.css           # Custom styling for dashboard components
├── imagens/            # Image assets (logos, hospital icons, favicon)
└── .planning/          # GSD planning and documentation
    └── codebase/       # Architecture and structure analysis
```

## Directory Purposes

**Root Directory:**
- Purpose: Project entry point and core application files
- Contains: HTML markup, JavaScript logic, CSS styling, static assets
- Key files: `index.html` (entry), `main.js` (logic), `style.css` (styling)

**imagens/ Directory:**
- Purpose: Store hospital logos, UI icons, and brand imagery
- Contains: PNG and ICO image files for dashboard cards and UI elements
- Key files: `1.png` (company logo), hospital-specific PNGs for card icons, `favicon.ico`

**.planning/codebase/ Directory:**
- Purpose: Store generated codebase analysis documents
- Contains: Architecture and structure analysis (ARCHITECTURE.md, STRUCTURE.md)
- Generated: Yes
- Committed: Yes (for documentation reference)

## Key File Locations

**Entry Points:**
- `index.html`: Main application file - loads on browser navigation, contains all HTML views and markup

**Configuration:**
- `main.js` (lines 4-56): Dashboard configuration object with all hospital dashboard metadata

**Core Logic:**
- `main.js` (lines 2-157): All application logic including event handlers, view management, authentication, and dashboard routing

**Styling:**
- `style.css`: CSS customizations for components not covered by Tailwind CDN

**Testing:**
- Not applicable - no test files present

## Naming Conventions

**Files:**
- `index.html`: Standard HTML entry point name
- `main.js`: Standard JavaScript application file
- `style.css`: Standard CSS stylesheet
- Image files in `imagens/`: Descriptive names (e.g., `Hospital*.png`, `CenterClínicas.png`)

**Directories:**
- `imagens/`: Portuguese plural form for "images"
- `.planning/`: Hidden directory (dot-prefixed) for documentation

**HTML Elements:**
- View containers: `[name]-view` suffix (e.g., `login-view`, `dashboard-selection-view`)
- Buttons: action-descriptive names (e.g., `login-btn`, `logout-btn`, `back-btn`)
- Form elements: semantic names (e.g., `username`, `password`, `login-form`)
- Data attributes: `data-dashboard-id` for routing parameters

**JavaScript Functions:**
- View management: `show[ViewName]()` pattern (e.g., `showLoginView()`, `showDashboardSelection()`)
- Event handlers: Inline arrow functions in addEventListener calls
- Configuration object: `config` (centralized, single instance)

**CSS Classes:**
- Tailwind classes: Used extensively for layout and basic styling
- Custom classes: `dashboard-iframe`, `login-container`, `dashboard-card`, `suave`, `liquid-glass-box`
- State classes: `hidden` (Bootstrap/Tailwind convention for display: none)

## Where to Add New Code

**New Hospital Dashboard:**
1. Add dashboard entry to `config.dashboards` object in `main.js` (follow estudo-a pattern)
2. Add new dashboard card to grid in `index.html` inside dashboard-selection-view
3. Add hospital logo image to `imagens/` directory
4. Update card with new image src, title, CNES, and period

**New Feature (View-based):**
1. Add new view div to `index.html` with id `[name]-view`
2. Add hidden class to new view
3. Create show[NewView]() function in `main.js` following showLoginView pattern
4. Add event listener to trigger view transition
5. Add styling to `style.css` if needed beyond Tailwind classes

**Styling Changes:**
- Use Tailwind classes first (already included via CDN)
- Add only necessary custom CSS to `style.css`
- Dashboard-specific styling: Define custom classes in `style.css` and apply to HTML

**Authentication/Backend Changes:**
- Update backend API URL in `main.js` login form submission (currently line 83)
- Update sessionStorage keys if backend token structure changes (currently `token` and `loggedIn`)
- Add header configuration if API requires authentication header

## Special Directories

**imagens/ Directory:**
- Purpose: Contains all images for UI rendering (logos, icons, hospital pictures)
- Generated: No
- Committed: Yes (static assets)
- Note: All images referenced in HTML/CSS must exist in this directory

**.planning/ Directory:**
- Purpose: GSD documentation and planning artifacts
- Generated: Yes (by GSD orchestrator)
- Committed: Yes (documentation is version-controlled)
- Note: Do not manually edit .planning/codebase/* files

**.git/ Directory:**
- Purpose: Git repository metadata and history
- Generated: Yes (by git)
- Committed: No (hidden system directory)
- Note: Standard git directory, do not edit manually

## Import and Dependency Resolution

**HTML Imports:**
- Tailwind CSS: `<script src="https://cdn.tailwindcss.com"></script>` (CDN)
- Google Fonts: `<link href="https://fonts.googleapis.com/css2?family=Roboto:...">` (CDN)
- Local CSS: `<link rel="stylesheet" href="./style.css">`
- Local JavaScript: `<script src="./main.js"></script>`

**JavaScript Dependencies:**
- Fetch API (native browser): Used for authentication API calls
- sessionStorage (native browser): Used for session persistence
- No external npm packages or bundler required

**Asset Resolution:**
- Images: Referenced with relative paths `./imagens/[filename]`
- All paths are relative to project root for proper resolution in browser

---

*Structure analysis: 2026-04-07*
