# Phase 5: RBAC - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 05-rbac
**Areas discussed:** Admin UI, First user bootstrap, Manager experience, Allowlist migration

---

## Admin UI for Managing Users

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated admin page | New /admin route with user list table, add/remove managers, assign hospitals via checkboxes | ✓ |
| Modal from header menu | Admin gear icon opens modal overlay for user management | |
| Inline on hospital grid | Admin sees extra controls on each hospital card | |

**User's choice:** Dedicated admin page
**Notes:** User confirmed the mockup with user table showing email, role, and hospital assignment dropdown.

### Hospital Assignment Method

| Option | Description | Selected |
|--------|-------------|----------|
| Checkbox list of hospitals | Toggle hospitals on/off for each manager | ✓ |
| Drag and drop | Drag from available pool to assigned list | |
| You decide | Claude's discretion | |

**User's choice:** Checkbox list of hospitals

---

## First User Bootstrap

| Option | Description | Selected |
|--------|-------------|----------|
| Env var ADMIN_EMAILS | Emails in env var get admin role on first login | ✓ (modified) |
| First login is admin | First person to log in becomes admin | |
| DB seed migration | SQL migration inserts admin record | |

**User's choice:** Configuration modal where admins register managers (combined with ADMIN_EMAILS for bootstrap)
**Notes:** User wants admins from env var, but managers registered through a configuration section in the admin UI.

### Admin Promotion

| Option | Description | Selected |
|--------|-------------|----------|
| Env var only | Only ADMIN_EMAILS creates admins | ✓ |
| Admins can promote | Any admin can promote via UI | |
| You decide | Claude's discretion | |

**User's choice:** Env var only

---

## Manager Experience

| Option | Description | Selected |
|--------|-------------|----------|
| Same grid, fewer cards | Same hospital grid UI, only assigned hospitals shown | ✓ |
| Direct to dashboard if 1 hospital | Skip grid for single-hospital managers | |
| Simplified dashboard view | Different, simpler layout for managers | |

**User's choice:** Same grid, fewer cards
**Notes:** No admin menu visible to managers.

---

## Allowlist Migration

| Option | Description | Selected |
|--------|-------------|----------|
| DB replaces env allowlist | Remove ALLOWED_EMAILS/ALLOWED_DOMAINS, use DB-driven roles only | ✓ |
| Both coexist | Keep env vars, layer DB roles on top | |
| Env var for admins only | ADMIN_EMAILS for admins, ALLOWED_DOMAINS as security fence | |

**User's choice:** DB replaces env allowlist

### Denied User Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Rejected at login | Clear error: "Acesso negado. Contate o administrador." | ✓ |
| Pending approval screen | Waiting page with admin notification | |
| You decide | Claude's discretion | |

**User's choice:** Rejected at login

---

## Claude's Discretion

- Database schema design (tables, relationships, indexes)
- API endpoint structure for admin CRUD operations
- Frontend state management for role-based rendering
- Migration strategy for existing env-var users

## Deferred Ideas

None
