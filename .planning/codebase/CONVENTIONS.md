# Coding Conventions

**Analysis Date:** 2026-04-07

## Naming Patterns

**Files:**
- HTML: `index.html` - lowercase, hyphenated separators for compound names
- JavaScript: `main.js` - lowercase, singular descriptive names
- CSS: `style.css` - lowercase, single descriptor name
- Images: `CanoasDasGraças.png` - PascalCase for multi-word descriptors in image filenames

**Functions:**
- Named functions use camelCase: `showDashboard()`, `showLoginView()`, `showDashboardSelection()`
- Event handler functions typically use camelCase verbs: `addEventListener`, `addEventListener`, `submit`
- Private/helper functions prefixed with verb describing action: `show*`, `get*`

**Variables:**
- DOM element references use camelCase with descriptive suffixes: `loginView`, `dashboardSelectionView`, `dashboardView`, `loginForm`, `loginError`, `logoutBtn`, `backBtn`
- Configuration objects use camelCase: `config`, `dashboards`, `res`, `data`, `err`
- Boolean/flag variables use present tense descriptors: `loggedIn`, `ok`
- Loop variables use standard conventions: `e` for event, `card` for items in forEach

**Types:**
- Configuration object structure uses camelCase: `dashboards`, `title`, `url`
- No explicit TypeScript types; vanilla JavaScript with implicit typing

**HTML IDs and Classes:**
- HTML IDs use kebab-case: `login-view`, `dashboard-selection-view`, `dashboard-view`, `login-form`, `login-error`, `logout-btn`, `back-btn`, `dashboard-title`, `powerbi-iframe`, `dashboard-container`, `app`
- CSS classes use kebab-case: `dashboard-card`, `login-container`, `dashboard-iframe`, `suave`, `liquid-glass-box`
- Data attributes use kebab-case: `data-dashboard-id`

## Code Style

**Formatting:**
- No explicit formatter (no .prettierrc, eslint config, or biome.json detected)
- 4-space indentation observed in HTML and JavaScript
- Line length: Files contain lines up to ~100+ characters (no enforced limit detected)
- Semicolon usage: Inconsistent - some statements end with semicolons, some don't (see `main.js` lines 129, 135, 154)

**Linting:**
- No linting tools configured (no .eslintrc, eslint.config.js detected)
- No automated code quality enforcement

**Comments:**
- Inline comments use standard JS format: `// Comment text`
- Comment style: Descriptive, explaining "what" the code does (see lines 3, 70, 116, 139)
- Comments placed above code block they describe (see line 70: "// Check if user is already logged in (simple session persistence)")

## Import Organization

**Order:**
1. External scripts via `<script>` tags in HTML head (Tailwind CDN, Google Fonts)
2. Custom stylesheets: `<link rel="stylesheet" href="./style.css">`
3. Custom scripts: `<script src="./main.js"></script>` (loaded at body end)

**Path Aliases:**
- Relative paths only: `./main.js`, `./style.css`, `./imagens/`
- No path aliases or module aliasing system in place

## Error Handling

**Patterns:**
- Try-catch blocks for async operations: See `main.js` lines 82-103 (fetch wrapper in login form submission)
- Error visibility: Errors logged to console with `console.error('Erro ao autenticar', err)` (line 100)
- User-facing error display: DOM elements manipulated (line 101: `loginError.classList.remove('hidden')`)
- Silent error handling in fallback: `alert('Dashboard não encontrado.')` for missing dashboards (line 153)

**Pattern Example:**
```javascript
try {
    const res = await fetch('https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
        // Handle success
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('loggedIn', 'true');
        showDashboardSelection();
        loginError.classList.add('hidden');
    } else {
        // Handle API error response
        loginError.classList.remove('hidden');
    }
} catch (err) {
    // Handle fetch/network error
    console.error('Erro ao autenticar', err);
    loginError.classList.remove('hidden');
}
```

## Logging

**Framework:** Browser console only - no logging library

**Patterns:**
- Console errors for debugging: `console.error('Erro ao autenticar', err)` (line 100)
- Console errors for missing resources: `console.error('Dashboard not found:', dashboardId)` (line 152)
- Portuguese error messages for user-facing errors: "Credenciais inválidas. Tente novamente.", "Dashboard não encontrado."
- English error messages in console logs

## Comments

**When to Comment:**
- Configuration blocks: Comment at top level (line 5: `// Dashboard configuration - add/remove dashboards here`)
- Complex logic sections: Comment before event listeners (line 116: `// Dashboard Card Click Handlers`)
- Before view management functions (line 124: `// View Management Functions`)

**JSDoc/TSDoc:**
- Not used - no function documentation via JSDoc blocks
- No TypeScript/type annotations present

## Function Design

**Size:** Functions are compact and single-purpose, typically 5-15 lines
- View management functions: `showLoginView()`, `showDashboardSelection()`, `showDashboard()` are 5-7 lines each
- Event handlers in forEach: Typically 1-5 lines

**Parameters:** 
- Minimal parameter passing; functions rely on DOM element references and closure-captured `config` object
- Event handlers receive event object: `function(e)` for form submit, `function()` for others
- Dashboard ID passed as single parameter: `showDashboard(dashboardId)`

**Return Values:**
- No explicit returns; functions modify DOM or application state
- View management functions are void; they manipulate visibility via classList methods

**Pattern Example:**
```javascript
function showDashboard(dashboardId) {
    // Check if dashboard exists in config
    if (config.dashboards[dashboardId]) {
        // Update title
        dashboardTitle.textContent = config.dashboards[dashboardId].title;
        
        // Set iframe source (replace with actual Power BI URL)
        powerbiIframe.src = config.dashboards[dashboardId].url;
        
        // Show dashboard view
        loginView.classList.add('hidden');
        dashboardSelectionView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
    } else {
        console.error('Dashboard not found:', dashboardId);
        alert('Dashboard não encontrado.');
    }
}
```

## Module Design

**Exports:** No module system; monolithic script model
- Single `main.js` file executed in browser context
- All code runs on DOMContentLoaded event (line 2)
- Global scope pollution avoided by wrapping in event listener

**Barrel Files:** Not applicable - no module bundling

**Scope Management:**
- All DOM elements and functions scoped within DOMContentLoaded callback (lines 2-157)
- Configuration object `config` accessible throughout the callback scope
- No polluting global namespace (proper encapsulation via event listener)

## CSS Conventions

**Class Naming:**
- Kebab-case consistently used: `.dashboard-card`, `.login-container`, `.dashboard-iframe`
- Utility-first approach via Tailwind CSS: Classes like `flex`, `items-center`, `justify-center`, `mb-8`, `text-gray-800`
- Custom classes for complex styling: `.suave` (transition effect), `.liquid-glass-box` (glassmorphism effect)

**Spacing & Layout:**
- Tailwind margin/padding utilities: `mb-8`, `p-6`, `px-4`, `py-2`, `mr-4`
- Flex utilities for layout: `flex`, `items-center`, `justify-between`, `justify-center`
- Grid utilities: `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `gap-6`

**Colors:**
- Tailwind color palette: `text-gray-800`, `bg-blue-600`, `text-red-500`, `bg-indigo-100`
- Custom CSS variables: None detected
- Hardcoded color in CSS: `#16AEA6` (border-left on dashboard cards), `#f8fafc` (background)

---

*Convention analysis: 2026-04-07*
