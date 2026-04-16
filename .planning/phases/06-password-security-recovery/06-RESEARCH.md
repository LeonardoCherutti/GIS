# Phase 6: Password Security + Recovery - Research

**Researched:** 2026-04-16
**Domain:** Password validation, password reset flow, transactional email (Go + Next.js)
**Confidence:** HIGH

## Summary

This phase adds NIST-aligned password strength enforcement and a self-service forgot-password flow via email. The Go backend gains a password validation module (min 10 chars + blocklist), a `password_resets` table with time-limited single-use tokens, and two new public endpoints for forgot/reset password. The Resend Go SDK v3 handles transactional email delivery. The Next.js frontend adds two new pages (`/forgot-password`, `/reset-password`), a reusable `PasswordStrengthMeter` component, and updates the existing register page to use the new strength rules.

All decisions are locked via CONTEXT.md. The architecture follows established handler -> service -> repository layering in Go and context -> component -> API client patterns in Next.js. No external password-strength libraries are needed -- the validation is rule-based (length + blocklist) per user decision D-01/D-02.

**Primary recommendation:** Implement as three waves: (1) backend password validation + migration, (2) backend reset flow + Resend integration, (3) frontend pages + strength meter component.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Minimum 10 characters, no composition rules (no forced uppercase/number/special). Follows NIST SP 800-63B spirit -- length over complexity.
- **D-02:** Embedded top-10k common password blocklist checked server-side in Go. Static file or Go map (~100KB). No external API calls.
- **D-03:** Frontend validates length in real-time; blocklist check happens server-side only (no shipping the list to the browser).
- **D-04:** Existing invitation accept-password flow updated to enforce the same rules (replaces current 8-char minimum).
- **D-05:** Use Resend as transactional email service. Official Go SDK, free tier (3,000/month), South America region.
- **D-06:** New env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (e.g., `noreply@todogsi.pixelrogue.io`).
- **D-07:** Custom domain DNS records (DKIM/SPF/DMARC) required for production deliverability.
- **D-08:** "Esqueceu a senha?" link below password field in PasswordLoginForm -- links to dedicated `/forgot-password` route.
- **D-09:** `/forgot-password` page: centered card (register page pattern), single email input, submit button. Always shows "Email enviado" confirmation regardless of whether email exists (prevents user enumeration).
- **D-10:** `/reset-password?token=` page: centered card, password + confirmPassword fields with strength meter. Reuses register page visual pattern.
- **D-11:** Reset token: UUID stored in new `password_resets` table, 1-hour TTL, single-use (deleted after successful reset).
- **D-12:** Backend endpoints: `POST /api/auth/forgot-password` (sends email), `GET /api/auth/reset-password/{token}` (validates token), `POST /api/auth/reset-password/{token}` (sets new password).
- **D-13:** Hybrid display: 4-segment color bar + inline requirement hints below password field.
- **D-14:** No external library -- rule-based validation using palette.css color variables (`--palette-destructive` for weak, `--palette-primary` for strong).
- **D-15:** All hint text in pt-BR via next-intl message files. New namespaces: `forgotPassword`, `resetPassword`.
- **D-16:** Strength meter component reused on both register (invitation) page and reset-password page.

### Claude's Discretion
- Database migration design for `password_resets` table
- Resend SDK integration pattern (service layer)
- Email template HTML content and styling
- Exact color gradient for strength bar segments
- Token generation method (crypto/rand UUID)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PWD-01 | Password strength validation enforces minimum 10 chars, uppercase, lowercase, number, and special character | **NOTE:** CONTEXT.md D-01 overrides REQUIREMENTS.md -- user decided NIST approach: min 10 chars + blocklist, NO composition rules. Backend `validatePassword()` function + blocklist map. |
| PWD-02 | Real-time password strength meter with visual feedback during input | `PasswordStrengthMeter` component with 4-segment bar, palette.css colors, length-based scoring on frontend |
| PWD-03 | Forgot password link on login page triggers reset email request | "Esqueceu a senha?" link in `PasswordLoginForm.tsx` linking to `/forgot-password` route |
| PWD-04 | Password reset token is time-limited (1 hour) and single-use | `password_resets` table with `expires_at` TTL, token deleted after use |
| PWD-05 | Reset link leads to set-new-password page with strength validation | `/reset-password?token=` page reusing register card pattern + PasswordStrengthMeter |
| PWD-06 | Backend sends password reset emails (SMTP or transactional email service) | Resend Go SDK v3 (`resend-go/v3`) with `RESEND_API_KEY` env var |
| PWD-07 | Existing invitation accept-password flow also enforces new strength rules | Update `InvitationService.AcceptPassword` from 8-char check to shared `validatePassword()` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `github.com/resend/resend-go/v3` | v3.3.0 | Transactional email sending | Official Go SDK, locked decision D-05 [CITED: pkg.go.dev/github.com/resend/resend-go/v3] |
| `golang.org/x/crypto` | v0.49.0 (already in go.mod) | bcrypt password hashing | Already used in project for password hashing [VERIFIED: go.mod] |
| `crypto/rand` | stdlib | UUID token generation | Standard library, cryptographically secure [VERIFIED: already used in invitation.go] |
| `next-intl` | (already installed) | i18n for new pages/components | Already used throughout frontend [VERIFIED: codebase] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `github.com/google/uuid` | latest | UUID generation for reset tokens | Alternative to manual crypto/rand UUID. Either works. [ASSUMED] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | SMTP directly via `net/smtp` | More control but no deliverability dashboard, no templates, more config. User locked Resend. |
| Embedded blocklist map | External API (Have I Been Pwned) | Real-time breach checks but adds external dependency. User locked embedded list (D-02). |
| `google/uuid` | Manual `crypto/rand` + hex encoding | Both produce cryptographically secure UUIDs. Manual approach avoids one dependency. |

**Installation (Go API only):**
```bash
go get github.com/resend/resend-go/v3
```

No new frontend npm packages needed -- all frontend work uses existing dependencies.

## Architecture Patterns

### Recommended Project Structure (new files only)
```
api/
├── internal/
│   ├── handler/
│   │   └── password_reset.go        # ForgotPassword + ResetPassword handlers
│   ├── service/
│   │   ├── email.go                  # EmailService wrapping Resend SDK
│   │   └── password_reset.go         # PasswordResetService (token CRUD + password update)
│   ├── repository/
│   │   └── password_reset.go         # PasswordResetRepo (DB operations)
│   ├── model/
│   │   └── password_reset.go         # PasswordReset struct, request/response types
│   └── password/
│       ├── validate.go               # validatePassword() + strength rules
│       └── blocklist.go              # Embedded top-10k common passwords map
├── migrations/
│   ├── 007_create_password_resets.up.sql
│   └── 007_create_password_resets.down.sql
frontend/
├── src/
│   ├── app/[locale]/
│   │   ├── forgot-password/page.tsx  # Forgot password form
│   │   └── reset-password/page.tsx   # Reset password form with strength meter
│   ├── components/auth/
│   │   └── PasswordStrengthMeter.tsx # Reusable strength meter component
│   └── messages/pt-BR/
│       ├── forgotPassword.json       # New i18n namespace
│       └── resetPassword.json        # New i18n namespace
```

### Pattern 1: Shared Password Validation (Go)
**What:** Extract password validation into a standalone package so both `InvitationService.AcceptPassword` and `PasswordResetService.ResetPassword` call the same function.
**When to use:** Any endpoint that accepts a new password.
**Example:**
```go
// api/internal/password/validate.go
package password

import (
    "fmt"
    "strings"
)

func Validate(password string) error {
    if len(password) < 10 {
        return fmt.Errorf("senha deve ter pelo menos 10 caracteres")
    }
    if IsCommon(strings.ToLower(password)) {
        return fmt.Errorf("esta senha e muito comum, escolha outra")
    }
    return nil
}
```
[ASSUMED] -- pattern follows Go convention for shared validation packages

### Pattern 2: Embedded Blocklist via Go `embed` Directive
**What:** Use Go's `//go:embed` to compile the 10k password list into the binary as a `map[string]bool`.
**When to use:** For the common password check (D-02).
**Example:**
```go
// api/internal/password/blocklist.go
package password

import (
    _ "embed"
    "strings"
)

//go:embed blocklist.txt
var rawBlocklist string

var blocklist map[string]bool

func init() {
    lines := strings.Split(rawBlocklist, "\n")
    blocklist = make(map[string]bool, len(lines))
    for _, line := range lines {
        pw := strings.TrimSpace(strings.ToLower(line))
        if pw != "" {
            blocklist[pw] = true
        }
    }
}

func IsCommon(password string) bool {
    return blocklist[strings.ToLower(password)]
}
```
[VERIFIED: Go embed is stdlib since Go 1.16, project uses Go 1.25]

### Pattern 3: Resend Email Service Layer
**What:** Thin wrapper around Resend SDK that abstracts email sending behind a service interface.
**When to use:** For sending password reset emails.
**Example:**
```go
// api/internal/service/email.go
package service

import (
    "fmt"
    "github.com/resend/resend-go/v3"
)

type EmailService struct {
    client   *resend.Client
    fromAddr string
}

func NewEmailService(apiKey, fromAddr string) *EmailService {
    return &EmailService{
        client:   resend.NewClient(apiKey),
        fromAddr: fromAddr,
    }
}

func (s *EmailService) SendPasswordReset(toEmail, resetURL string) error {
    params := &resend.SendEmailRequest{
        From:    s.fromAddr,
        To:      []string{toEmail},
        Subject: "Redefinicao de Senha - GSI",
        Html:    fmt.Sprintf(`<p>Voce solicitou a redefinicao de senha.</p><p><a href="%s">Clique aqui para redefinir sua senha</a></p><p>Este link expira em 1 hora.</p>`, resetURL),
    }
    _, err := s.client.Emails.Send(params)
    return err
}
```
[CITED: resend.com/docs/send-with-go]

### Pattern 4: User-Enumeration-Safe Response
**What:** Always return the same success message from forgot-password regardless of whether the email exists.
**When to use:** POST `/api/auth/forgot-password` handler.
**Example:**
```go
// In handler: always return 200 with same message
func (h *PasswordResetHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
    var req ForgotPasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "Requisicao invalida")
        return
    }
    // Fire-and-forget: service handles "email not found" silently
    go h.service.InitiateReset(r.Context(), req.Email)
    writeJSON(w, http.StatusOK, map[string]string{
        "message": "Se o email estiver cadastrado, voce recebera um link de recuperacao",
    })
}
```
[ASSUMED] -- standard anti-enumeration pattern

### Pattern 5: Frontend Strength Meter Component
**What:** Client-side password strength meter using rule-based scoring with palette.css variables.
**When to use:** Register page and reset-password page.
**Example:**
```tsx
// Scoring: 0-3 based on length thresholds
function getStrength(password: string): number {
  if (password.length === 0) return 0
  if (password.length < 10) return 1  // weak
  if (password.length < 14) return 2  // fair
  if (password.length < 18) return 3  // good
  return 4                            // strong
}

const COLORS = [
  'var(--palette-destructive)',   // 1: red/weak
  'var(--palette-accent)',        // 2: orange-ish/fair (accent = #5BBFEA)
  'var(--palette-muted-fg)',      // 3: neutral/good
  'var(--palette-primary)',       // 4: blue/strong
]
```
[VERIFIED: palette.css colors from codebase -- note: no orange/yellow in palette, see Pitfall 2]

### Anti-Patterns to Avoid
- **Composition rules (uppercase/number/special required):** User explicitly chose NIST-aligned length-only approach (D-01). REQUIREMENTS.md PWD-01 text mentions composition rules but CONTEXT.md overrides this.
- **Shipping blocklist to browser:** D-03 explicitly forbids this. Frontend only validates length; blocklist is server-side only.
- **Different validation in invitation vs reset:** Both must call the same `password.Validate()` function (D-04).
- **Exposing user existence in forgot-password:** Always return same response (D-09).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Raw SMTP client | Resend SDK v3 | Deliverability, DKIM handling, dashboards, bounce tracking |
| Password hashing | Custom hash | `bcrypt` via `golang.org/x/crypto` | Already in use, battle-tested, cost factor configurable |
| UUID generation | Math/rand strings | `crypto/rand` (stdlib) | Must be cryptographically unpredictable for security tokens |
| Common password list | Scraping/building own | SecLists 10k-most-common.txt | Community-maintained, well-known, MIT licensed |

**Key insight:** The password validation itself IS simple enough to hand-roll (length check + map lookup). No library needed. But the blocklist data and the email delivery must NOT be hand-rolled.

## Common Pitfalls

### Pitfall 1: Race Condition on Token Consumption
**What goes wrong:** Two concurrent requests with the same reset token both pass validation and both reset the password.
**Why it happens:** SELECT then DELETE is not atomic without proper locking.
**How to avoid:** Use `DELETE FROM password_resets WHERE token = $1 AND expires_at > NOW() RETURNING user_id` -- the DELETE itself is atomic. If no row returned, token was already consumed.
**Warning signs:** Intermittent "token not found" errors in logs after successful resets.

### Pitfall 2: No Orange/Yellow in Palette
**What goes wrong:** The strength meter design calls for red -> orange -> yellow -> green segments, but palette.css has no orange or yellow variables.
**Why it happens:** The palette is a blue/teal healthcare theme. Only red (destructive) and blues (primary, accent) exist.
**How to avoid:** Use inline hex colors for the 4-segment gradient OR define new CSS custom properties in palette.css. Recommended: `--palette-warning: #f59e0b` (amber) and use green `#16a34a` for strong. The decision (D-14) says "use palette.css color variables" but also gives Claude discretion on "exact color gradient for strength bar segments."
**Warning signs:** All segments look blue because only palette colors are available.

### Pitfall 3: Forgot-Password as User Oracle
**What goes wrong:** Timing differences between "user exists" (send email) and "user not found" (skip email) leak information.
**Why it happens:** Sending an email takes ~200ms; skipping is instant. Attackers can distinguish by response time.
**How to avoid:** Return response immediately before sending email (fire-and-forget pattern with goroutine). Both paths return in ~same time.
**Warning signs:** Consistent timing difference in forgot-password responses.

### Pitfall 4: Stale Reset Tokens Accumulate
**What goes wrong:** Users request multiple resets without completing them. Table grows unboundedly.
**Why it happens:** Only successful resets delete tokens. Expired tokens remain.
**How to avoid:** Either (a) add a cleanup query in the forgot-password handler that deletes expired tokens for the same email before creating a new one, or (b) add a periodic cleanup. Option (a) is simpler for v1.
**Warning signs:** Slow queries on password_resets table over time.

### Pitfall 5: Frontend minLength Still 8
**What goes wrong:** Register page has `minLength={8}` hardcoded on password inputs (line 172-173 of register/page.tsx) and validates `password.length < 8` (line 92). These must be updated to 10.
**Why it happens:** Phase 5 set 8-char minimum; Phase 6 raises to 10.
**How to avoid:** Update all frontend validation to use 10, matching backend. Search codebase for "< 8" and "minLength={8}".
**Warning signs:** Frontend allows 8-9 char passwords that backend rejects.

### Pitfall 6: CONTEXT.md vs REQUIREMENTS.md Conflict on PWD-01
**What goes wrong:** Implementer reads REQUIREMENTS.md PWD-01 ("enforces minimum 10 chars, uppercase, lowercase, number, and special character") and adds composition rules.
**Why it happens:** CONTEXT.md D-01 explicitly overrides this with NIST approach (length only, no composition).
**How to avoid:** CONTEXT.md decisions take precedence. The planner must make this override explicit in task descriptions.
**Warning signs:** Code checks for uppercase/lowercase/number/special when it should not.

## Code Examples

### Migration: password_resets table
```sql
-- 007_create_password_resets.up.sql
CREATE TABLE IF NOT EXISTS password_resets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
```
[ASSUMED] -- follows existing migration pattern from 006_add_invitations_and_passwords.up.sql

### Config additions
```go
// In config.go -- add to Config struct:
ResendAPIKey    string
ResendFromEmail string
FrontendURL     string // for building reset links

// In Load():
ResendAPIKey:    os.Getenv("RESEND_API_KEY"),
ResendFromEmail: os.Getenv("RESEND_FROM_EMAIL"),
FrontendURL:     os.Getenv("FRONTEND_URL"),  // e.g., "https://todogsi.pixelrogue.io"
```
[ASSUMED] -- follows existing config pattern

### Router additions
```go
// Public routes -- no auth required
r.Post("/api/auth/forgot-password", passwordResetHandler.ForgotPassword)
r.Get("/api/auth/reset-password/{token}", passwordResetHandler.ValidateToken)
r.Post("/api/auth/reset-password/{token}", passwordResetHandler.ResetPassword)
```
[VERIFIED: matches D-12 endpoint design, follows chi URL param pattern from invitation handler]

### Frontend i18n messages
```json
// frontend/src/messages/pt-BR/forgotPassword.json
{
  "title": "Recuperar Senha",
  "subtitle": "Insira seu email para receber um link de recuperacao",
  "email": "Email",
  "submit": "Enviar Link",
  "success": "Se o email estiver cadastrado, voce recebera um link de recuperacao.",
  "backToLogin": "Voltar ao login",
  "errors": {
    "generic": "Erro ao processar solicitacao"
  }
}
```
```json
// frontend/src/messages/pt-BR/resetPassword.json
{
  "title": "Redefinir Senha",
  "subtitle": "Escolha uma nova senha",
  "password": "Nova senha",
  "confirmPassword": "Confirmar nova senha",
  "submit": "Redefinir Senha",
  "success": "Senha redefinida com sucesso!",
  "loginLink": "Ir para o login",
  "strength": {
    "weak": "Fraca",
    "fair": "Razoavel",
    "good": "Boa",
    "strong": "Forte",
    "minLength": "Minimo 10 caracteres"
  },
  "errors": {
    "invalidToken": "Link invalido ou expirado",
    "passwordMismatch": "As senhas nao coincidem",
    "passwordTooShort": "A senha deve ter ao menos 10 caracteres",
    "commonPassword": "Esta senha e muito comum",
    "generic": "Erro ao redefinir senha"
  }
}
```
[ASSUMED] -- follows existing register.json and auth.json patterns

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 8-char complexity rules | NIST 800-63B: length + blocklist | 2024 (Rev 4 finalized) | No composition rules, min 8 (we use 10), blocklist required |
| SMTP direct send | Transactional email APIs (Resend, Postmark) | 2022+ | Better deliverability, analytics, no SMTP server management |
| zxcvbn client-side scoring | Server-side blocklist + client length hint | Current best practice | Client shows UX hints, server enforces actual rules |

**Deprecated/outdated:**
- Password composition rules (uppercase+number+special): NIST 800-63B Rev 4 explicitly recommends against these [CITED: pages.nist.gov/800-63-4/sp800-63b.html]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `google/uuid` package is a viable alternative for token generation | Standard Stack | LOW -- can use manual crypto/rand instead |
| A2 | User-enumeration-safe forgot-password uses fire-and-forget goroutine | Architecture Patterns | LOW -- could also use fixed-delay response |
| A3 | Migration numbering is 007 (next after 006) | Code Examples | MEDIUM -- if Phase 5 added migrations, number may be higher |
| A4 | `resend-go/v3` v3.3.0 is latest | Standard Stack | LOW -- any v3.x works |
| A5 | Frontend strength scoring uses length thresholds (10/14/18) for 4 segments | Architecture Patterns | LOW -- thresholds are adjustable |
| A6 | `FRONTEND_URL` env var needed for building reset links | Code Examples | MEDIUM -- could derive from request Host header instead |

## Open Questions

1. **Migration sequence number**
   - What we know: Last migration is 006. Phase 5 (RBAC) may add migrations before Phase 6 executes.
   - What's unclear: Will Phase 5 add migration 007?
   - Recommendation: Check existing migrations at implementation time. Use next available number.

2. **Strength meter colors for middle segments**
   - What we know: Palette has red (`--palette-destructive`) and blue (`--palette-primary`) but no orange/yellow/green.
   - What's unclear: Should we add new palette variables or use inline colors?
   - Recommendation: Add `--palette-warning: #f59e0b` and `--palette-success: #16a34a` to palette.css. These are standard semantic colors missing from the current palette.

3. **Reset link URL construction**
   - What we know: Backend needs to build a URL like `https://todogsi.pixelrogue.io/reset-password?token=XXX`
   - What's unclear: Whether to use a `FRONTEND_URL` env var or derive from the request's Host/Origin header.
   - Recommendation: Use `FRONTEND_URL` env var -- more explicit and works correctly behind reverse proxies.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Go runtime | API compilation | Yes | 1.25.0 | -- |
| Resend API | Email delivery | External service | -- | Cannot send reset emails without it; local dev can log URLs instead |
| DNS records (DKIM/SPF) | Production email deliverability | Requires manual setup | -- | Emails may land in spam without it |

**Missing dependencies with no fallback:**
- Resend API key is required for production email sending (obtain from resend.com dashboard)

**Missing dependencies with fallback:**
- For local development, email service can log reset URLs to console instead of actually sending emails

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Password strength via NIST 800-63B (length + blocklist), bcrypt cost 12 |
| V3 Session Management | No | No session changes in this phase |
| V4 Access Control | No | Reset endpoints are public by design |
| V5 Input Validation | Yes | Email format validation, password length check, token UUID format |
| V6 Cryptography | Yes | `crypto/rand` for token generation, bcrypt for hashing -- never hand-roll |

### Known Threat Patterns for Password Reset Flow

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| User enumeration via forgot-password | Information Disclosure | Always return same response regardless of email existence (D-09) |
| Token brute-force | Tampering | UUID tokens (128-bit entropy), rate limiting (future), 1-hour expiry |
| Token replay | Replay | Single-use: DELETE token atomically on use (D-11) |
| Timing oracle on email existence | Information Disclosure | Fire-and-forget email sending, respond before send completes |
| Password in reset email | Information Disclosure | Never include password in email -- only a link with opaque token |
| Clickjacking on reset page | UI Redress | X-Frame-Options / CSP frame-ancestors (already set by Next.js) |

## Sources

### Primary (HIGH confidence)
- [Resend Go SDK v3 docs](https://resend.com/docs/send-with-go) -- API usage, SendEmailRequest struct, client initialization
- [Resend Go SDK on pkg.go.dev](https://pkg.go.dev/github.com/resend/resend-go/v3) -- v3.3.0 published April 2026
- Project codebase -- invitation.go, auth.go, user.go, config.go, PasswordLoginForm.tsx, register/page.tsx, palette.css (all verified via Read tool)

### Secondary (MEDIUM confidence)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) -- password blocklist requirement, no composition rules
- [SecLists 10k-most-common.txt](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt) -- common password blocklist source

### Tertiary (LOW confidence)
- None -- all claims verified or cited

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Resend SDK verified on pkg.go.dev, all other deps already in project
- Architecture: HIGH -- follows established handler/service/repo pattern verified in codebase
- Pitfalls: HIGH -- based on well-known security patterns and verified codebase state

**Research date:** 2026-04-16
**Valid until:** 2026-05-16 (stable domain, unlikely to change)
