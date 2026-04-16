# Phase 6: Password Security + Recovery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16
**Phase:** 06-password-security-recovery
**Areas discussed:** Password strength rules, Email delivery mechanism, Recovery flow UX, Strength meter UI
**Mode:** --auto (all areas auto-selected, recommended options chosen)

---

## Password Strength Rules

| Option | Description | Selected |
|--------|-------------|----------|
| NIST SP 800-63B (15-char min + blocklist, no composition) | Federal standard, length-focused, healthcare-aligned | |
| Composition rules (uppercase + lowercase + digit + special, 8-char) | Traditional approach, regex-based, NIST now discourages | |
| Entropy-based (zxcvbn library + 12-char floor) | Pattern-aware scoring, library dependency | |
| Common-password blocklist only (top-10k, keep 8-char) | Minimal change, blocks worst offenders | |
| **Pragmatic blend: 10-char min + blocklist, no composition** | NIST spirit with practical threshold for small portal | ✓ |

**User's choice:** [auto] Pragmatic blend — 10-char minimum + embedded top-10k blocklist, no composition rules. Balances NIST guidance with practicality for hospital managers.
**Notes:** Composition rules explicitly avoided per NIST SP 800-63B Rev.4 guidance. Blocklist embedded server-side only.

---

## Email Delivery Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Resend | Go SDK, free tier 3k/mo, South America region | ✓ |
| Amazon SES | Low cost, battle-tested, requires sandbox approval | |
| Gmail SMTP + App Password | Zero setup, fragile, not production-ready | |

**User's choice:** [auto] Resend — free tier sufficient for small user base, official Go SDK, South America sending region.
**Notes:** First email feature in the project. Requires custom domain DNS records for deliverability.

---

## Recovery Flow UX

| Option | Description | Selected |
|--------|-------------|----------|
| Inline forgot-password within PasswordLoginForm | Same-page state toggle, no new routes | |
| Dedicated /forgot-password + /reset-password routes | Clean URL structure, reuses register pattern, audit-friendly | ✓ |
| Modal/drawer over login page | Contextual request step, reset on own route | |

**User's choice:** [auto] Dedicated routes — mirrors existing register page pattern, each page has one job, deep-linkable.
**Notes:** Always show same confirmation message regardless of email existence (user enumeration prevention). Healthcare context favors auditability.

---

## Strength Meter UI

| Option | Description | Selected |
|--------|-------------|----------|
| Segmented color bar + zxcvbn scoring | Industry-standard, library dependency (~400KB) | |
| Requirement checklist (rule-based, no library) | Zero deps, explicit guidance, fully translatable | |
| Hybrid: color bar + inline requirement hints (rule-based) | Best of both, no library, translatable | ✓ |

**User's choice:** [auto] Hybrid — 4-segment color bar with inline hints. Uses palette.css variables, no external library, all text via next-intl.
**Notes:** Reusable component for both register and reset-password pages. Dark mode compatible via existing palette system.

---

## Claude's Discretion

- Database migration design for password_resets table
- Resend SDK integration pattern
- Email template content and styling
- Exact color gradient for strength bar segments
- Token generation method

## Deferred Ideas

None — discussion stayed within phase scope
