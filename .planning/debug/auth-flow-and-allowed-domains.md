---
status: awaiting_human_verify
trigger: "Two auth issues after RBAC phase: (1) auth flow broken, (2) ALLOWED_DOMAINS env var removed"
created: 2026-04-09T00:00:00Z
updated: 2026-04-09T00:00:00Z
---

## Current Focus

hypothesis: ALLOWED_DOMAINS was completely removed from config.go, auth.go, and docker-compose.yml during RBAC phase. The VerifyAndLogin function only checks ADMIN_EMAILS for auto-creation; any non-admin, non-DB user gets "Acesso negado".
test: Read the three key files and confirm ALLOWED_DOMAINS is absent
expecting: No mention of AllowedDomains in config struct, no domain check in auth.go, no env var in docker-compose
next_action: Confirm root cause and implement the fix

## Symptoms

expected: Users from allowed domains (e.g. @company.com) can log in and get manager role by default. Admins defined by ADMIN_EMAILS env var. Pre-registered managers (added by admin) can also log in. Auth flow works reliably.
actual: Auth is unreliable. ALLOWED_DOMAINS was completely removed during RBAC phase. Anyone from an allowed domain who isn't pre-registered gets "Acesso negado".
errors: "Acesso negado. Contate o administrador." for valid domain users, intermittent auth failures on reload
reproduction: Log in with a Google account from an allowed domain that hasn't been pre-registered by admin -> rejected
started: After Phase 5 RBAC was implemented

## Eliminated

## Evidence

- timestamp: 2026-04-09T00:01:00Z
  checked: api/internal/config/config.go
  found: Config struct has only Port, DatabaseURL, GoogleClientID, JWTSecret, AdminEmails. No AllowedDomains field. Load() only parses ADMIN_EMAILS.
  implication: ALLOWED_DOMAINS env var is completely ignored even if set.

- timestamp: 2026-04-09T00:01:00Z
  checked: api/internal/service/auth.go
  found: VerifyAndLogin at line 43-58 checks if user is nil (not in DB). If not admin email, returns "Acesso negado". No domain check exists.
  implication: Users from allowed domains who aren't pre-registered will always be rejected.

- timestamp: 2026-04-09T00:01:00Z
  checked: docker-compose.yml
  found: API service environment only has PORT, DATABASE_URL, GOOGLE_CLIENT_ID, JWT_SECRET, ADMIN_EMAILS. No ALLOWED_DOMAINS.
  implication: Even if config supported it, the env var isn't passed to the container.

## Resolution

root_cause: ALLOWED_DOMAINS support was completely removed during RBAC Phase 5. The auth flow in VerifyAndLogin only auto-creates admin users (from ADMIN_EMAILS). Any user not already in the DB and not an admin email gets rejected with "Acesso negado", even if their email domain should be allowed.
fix: Restored ALLOWED_DOMAINS support across all three layers — config parsing, auth logic, and docker-compose env passthrough. Users from allowed domains are now auto-created as managers.
verification: Go build succeeds. Auth flow logic: admin emails -> admin role, allowed domains -> manager role, DB users -> existing role, otherwise -> rejected.
files_changed: [api/internal/config/config.go, api/internal/service/auth.go, docker-compose.yml]
