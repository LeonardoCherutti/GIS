# Phase 4: Polish + i18n - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous)

<domain>
## Phase Boundary

Every visible UI string is served from pt-BR message files and the architecture supports adding new locales without code changes. This phase delivers: next-intl configured with [locale] routing, all UI strings extracted to pt-BR message files, and i18n-ready architecture for future languages.

</domain>

<decisions>
## Implementation Decisions

### i18n Setup
- next-intl with [locale] routing matching ferreiracontabilidade reference pattern
- Default locale: pt-BR
- Message files in JSON format (messages/pt-BR.json)
- Middleware for locale detection and routing
- All hardcoded Portuguese strings extracted to message files

### Architecture
- next-intl middleware handles locale prefix
- Navigation wrapper for locale-aware links
- useTranslations hook in all components with visible text
- Adding a new locale requires only: new JSON file + config entry

### Claude's Discretion
- Message key naming conventions
- Grouping of message keys by feature/component
- Locale detection strategy (browser vs. explicit)

</decisions>

<code_context>
## Existing Code Insights

### Components with hardcoded strings to extract
- AppHeader.tsx (portal name, logout label)
- AppFooter.tsx (copyright, branding)
- LoginButton.tsx (button text, error messages)
- HospitalGrid.tsx (search placeholder, "no results" text)
- HospitalCard.tsx (period label)
- DashboardEmbed.tsx (loading text, error messages)
- DashboardErrorBoundary.tsx (error text, retry button)
- Pagination.tsx (page labels)
- AuthGuard.tsx (loading/redirect text)
- page.tsx (welcome text, login prompts)

### Reference
- D:\ferreiracontabilidade\app uses next-intl 4.x with [locale] routing
- Messages stored in messages/ directory with JSON files per locale

</code_context>

<specifics>
## Specific Ideas

- Follow exact same next-intl pattern as ferreiracontabilidade reference
- pt-BR as the only locale for now, but architecture supports adding en, es, etc.

</specifics>

<deferred>
## Deferred Ideas

- Additional locales (en, es) — future
- Locale selector UI component — future (URL-based switching is sufficient for now)

</deferred>
