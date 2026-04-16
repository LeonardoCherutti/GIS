# Phase 6: Password Security + Recovery - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Enforce strong passwords for password-based login users and provide a self-service forgot-password flow via email. Applies to: invitation acceptance (register page), password reset page, and backend validation. Does NOT add new auth methods or change Google OAuth flow.

</domain>

<decisions>
## Implementation Decisions

### Password Strength Rules
- **D-01:** Minimum 10 characters, no composition rules (no forced uppercase/number/special). Follows NIST SP 800-63B spirit — length over complexity.
- **D-02:** Embedded top-10k common password blocklist checked server-side in Go. Static file or Go map (~100KB). No external API calls.
- **D-03:** Frontend validates length in real-time; blocklist check happens server-side only (no shipping the list to the browser).
- **D-04:** Existing invitation accept-password flow updated to enforce the same rules (replaces current 8-char minimum).

### Email Delivery
- **D-05:** Use Resend as transactional email service. Official Go SDK, free tier (3,000/month), South America region.
- **D-06:** New env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (e.g., `noreply@todogsi.pixelrogue.io`).
- **D-07:** Custom domain DNS records (DKIM/SPF/DMARC) required for production deliverability.

### Recovery Flow UX
- **D-08:** "Esqueceu a senha?" link below password field in PasswordLoginForm — links to dedicated `/forgot-password` route.
- **D-09:** `/forgot-password` page: centered card (register page pattern), single email input, submit button. Always shows "Email enviado" confirmation regardless of whether email exists (prevents user enumeration).
- **D-10:** `/reset-password?token=` page: centered card, password + confirmPassword fields with strength meter. Reuses register page visual pattern.
- **D-11:** Reset token: UUID stored in new `password_resets` table, 1-hour TTL, single-use (deleted after successful reset).
- **D-12:** Backend endpoints: `POST /api/auth/forgot-password` (sends email), `GET /api/auth/reset-password/{token}` (validates token), `POST /api/auth/reset-password/{token}` (sets new password).

### Strength Meter UI
- **D-13:** Hybrid display: 4-segment color bar + inline requirement hints below password field.
- **D-14:** No external library — rule-based validation using palette.css color variables (`--palette-destructive` for weak, `--palette-primary` for strong).
- **D-15:** All hint text in pt-BR via next-intl message files. New namespaces: `forgotPassword`, `resetPassword`.
- **D-16:** Strength meter component reused on both register (invitation) page and reset-password page.

### Claude's Discretion
- Database migration design for `password_resets` table
- Resend SDK integration pattern (service layer)
- Email template HTML content and styling
- Exact color gradient for strength bar segments
- Token generation method (crypto/rand UUID)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Password & Auth System
- `api/internal/service/invitation.go` — Current 8-char password validation (must be upgraded to new rules)
- `api/internal/service/auth.go` — PasswordLogin service (reference for password flow patterns)
- `api/internal/handler/auth.go` — LoginPassword handler (reference for new forgot/reset handlers)
- `api/internal/handler/invitation.go` — AcceptPassword handler (reference for password submission pattern)
- `api/internal/repository/user.go` — SetPassword, FindByEmailWithPassword (must add reset token methods)
- `api/internal/model/invitation.go` — AcceptPasswordRequest, PasswordLoginRequest models

### Database Schema
- `api/migrations/006_add_invitations_and_passwords.up.sql` — Current password_hash column migration

### Frontend Auth Components
- `frontend/src/components/auth/PasswordLoginForm.tsx` — Login form (add "forgot password" link)
- `frontend/src/app/[locale]/register/page.tsx` — Invitation acceptance page (add strength meter, update validation)
- `frontend/src/contexts/AuthContext.tsx` — Auth context (reference for API call patterns)

### i18n Messages
- `frontend/src/messages/pt-BR/auth.json` — Existing auth messages
- `frontend/src/messages/pt-BR/register.json` — Existing register messages (has password-related keys)

### Styling & Patterns
- `frontend/src/app/globals.css` — palette.css variables for theming
- Reference project: `D:\ferreiracontabilidade\app` — Component and routing patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PasswordLoginForm` (`frontend/src/components/auth/PasswordLoginForm.tsx`): Add "Esqueceu a senha?" link below password field
- `register/page.tsx` (`frontend/src/app/[locale]/register/page.tsx`): Visual pattern for centered card with password fields — reuse for forgot-password and reset-password pages
- `apiFetch` (`frontend/src/lib/api/client.ts`): Generic API client for new endpoints
- `InvitationService.AcceptPassword` (`api/internal/service/invitation.go`): Password validation point to upgrade
- `UserRepo.SetPassword` (`api/internal/repository/user.go`): Reusable for password reset

### Established Patterns
- Go API: handler -> service -> repository layered architecture
- Frontend: Context providers -> components -> API client
- DB: UUID primary keys, timestamptz columns, sequential migration files in `api/migrations/`
- i18n: next-intl with `useTranslations()`, message files per namespace in `pt-BR/`
- Routing: `[locale]` prefix, page.tsx per route

### Integration Points
- Router (`api/internal/router/router.go`): Add `/api/auth/forgot-password` and `/api/auth/reset-password/{token}` routes
- PasswordLoginForm: Add forgot-password link
- Register page: Add PasswordStrengthMeter component
- New pages: `/forgot-password`, `/reset-password` under `[locale]` routing
- New Go service: EmailService wrapping Resend SDK
- New migration: `007_create_password_resets.up.sql`

</code_context>

<specifics>
## Specific Ideas

- "Esqueceu a senha?" link text below password field, small secondary text style
- Confirmation always says "Se o email estiver cadastrado, voce recebera um link de recuperacao" (prevents user enumeration)
- Reset email contains a link to `/reset-password?token={uuid}` with 1-hour expiry
- Strength meter segments: 1 (red/weak), 2 (orange/fair), 3 (yellow/good), 4 (green/strong)
- Hint text below bar shows: "Minimo 10 caracteres" with checkmark when met

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-password-security-recovery*
*Context gathered: 2026-04-16*
