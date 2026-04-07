# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- HTML5 - Markup and page structure (`/d/gitlab/GIS/index.html`)
- CSS3 - Styling and animations (`/d/gitlab/GIS/style.css`)
- JavaScript (ES6+) - Client-side application logic (`/d/gitlab/GIS/main.js`)

## Runtime

**Environment:**
- Browser-based (Client-side only)
- No server-side runtime (Static HTML deployment)

**Supported Browsers:**
- Modern browsers supporting ES6 JavaScript
- Responsive design for mobile and desktop

## Frameworks

**Core:**
- Tailwind CSS 4.x - Utility-first CSS framework
  - CDN: `https://cdn.tailwindcss.com`
  - Purpose: Responsive layout, styling, grid system

**Fonts:**
- Google Fonts - Roboto font family (300, 400, 500, 700 weights)
  - CDN: `https://fonts.googleapis.com/css2?family=Roboto`

## Key Dependencies

**Critical:**
- Tailwind CSS (v4.x via CDN) - UI framework for responsive design
- Google Fonts API - Custom typography

**External Assets:**
- Power BI Embed - Dashboard visualization platform (embedded via iframes)

## Configuration

**Environment:**
- No environment configuration files (.env) present
- Hardcoded Power BI dashboard URLs in `/d/gitlab/GIS/main.js`

**Build:**
- No build system detected
- Direct deployment (static files only)
- Files: `index.html`, `main.js`, `style.css`

## Platform Requirements

**Development:**
- Text editor or IDE for HTML/CSS/JavaScript
- Git for version control (present: `.git/`)
- Browser for testing

**Production:**
- Web server capable of serving static files
- HTTPS support (required for Power BI embedding)
- CORS support (to allow Power BI iframe embedding)
- Backend API at `https://backend-app-113139671688.southamerica-east1.run.app` (authentication endpoint)

## Deployment

**Current:**
- Static file hosting (HTML, CSS, JS, images)
- No minification or optimization pipeline
- Direct CDN usage for Tailwind CSS and Google Fonts

**Assets:**
- Image files in `/d/gitlab/GIS/imagens/` directory (PNG format)
- Favicon: `favicon.ico`

## Served Content

**Endpoints:**
- `/index.html` - Main application entry point
- `/main.js` - Application logic
- `/style.css` - Custom styling
- `/imagens/*` - Static image assets

---

*Stack analysis: 2026-04-07*
