---
phase: 05-rbac
plan: 04
subsystem: admin-ui
tags: [rbac, admin, react, next-intl, user-management, hospital-assignment]
dependency_graph:
  requires:
    - admin-crud-api
    - auth-context
    - app-header
  provides:
    - admin-page-ui
    - admin-guard-component
    - role-aware-auth-context
    - role-aware-app-header
  affects: [frontend-routing, header, auth]
tech_stack:
  added: []
  patterns: [admin-guard-pattern, role-conditional-rendering, checkbox-list-assignment]
key_files:
  created:
    - frontend/src/components/auth/AdminGuard.tsx
    - frontend/src/app/[locale]/admin/layout.tsx
    - frontend/src/app/[locale]/admin/page.tsx
    - frontend/src/components/admin/UserTable.tsx
    - frontend/src/components/admin/HospitalCheckboxList.tsx
    - frontend/src/components/admin/AddManagerForm.tsx
    - frontend/src/messages/pt-BR/admin.json
  modified:
    - frontend/src/contexts/AuthContext.tsx
    - frontend/src/components/layout/AppHeader.tsx
    - frontend/src/messages/pt-BR/common.json
    - frontend/src/i18n/request.ts
key-decisions:
  - "Use next/link for admin link (consistent with HospitalCard pattern)"
  - "AdminGuard returns null during loading to prevent flash of admin content"
  - "Inline HospitalCheckboxList expands below user row instead of modal"
  - "Admin users show read-only row (no delete/edit actions per D-06)"
patterns-established:
  - "AdminGuard: role-based route guard following AuthGuard pattern"
  - "Inline expand pattern for sub-forms in table rows"
requirements-completed: [RBAC-08, RBAC-09, RBAC-10, RBAC-11, RBAC-12]
metrics:
  duration: 3min
  completed: "2026-04-09"
  tasks: 2
  files: 11
---

# Phase 5 Plan 4: Frontend Admin UI Summary

**Role-aware AuthContext, AdminGuard route protection, admin page with user table, hospital checkbox assignment, and add-manager form -- all strings in pt-BR via next-intl**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-09T15:15:22Z
- **Completed:** 2026-04-09T15:18:11Z
- **Tasks:** 2 (auto) + 1 (checkpoint, documented only)
- **Files modified:** 11

## Accomplishments
- Extended AuthContext with role field parsed from JWT, with 'manager' fallback for legacy tokens
- Created AdminGuard component that redirects non-admin users and prevents flash of admin content
- Added conditional "Admin" link to AppHeader visible only to admin-role users
- Built complete admin page at /[locale]/admin with user table, hospital assignment, and manager creation
- All admin UI strings externalized to pt-BR/admin.json via next-intl

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend AuthContext with role, create AdminGuard, update AppHeader** - `2703bf9` (feat)
2. **Task 2: Build admin page with user management and hospital assignment** - `2165190` (feat)
3. **Task 3: Verify RBAC end-to-end** - checkpoint (human-verify, documented below)

## Files Created/Modified

- `frontend/src/contexts/AuthContext.tsx` - Added role to AuthUser interface and parseJwt extraction
- `frontend/src/components/auth/AdminGuard.tsx` - Role-based route guard, redirects non-admins
- `frontend/src/components/layout/AppHeader.tsx` - Conditional admin link for admin users
- `frontend/src/messages/pt-BR/common.json` - Added "admin" key
- `frontend/src/app/[locale]/admin/layout.tsx` - Admin layout wrapping children in AdminGuard
- `frontend/src/app/[locale]/admin/page.tsx` - Admin page wiring UserTable, AddManagerForm, apiFetch
- `frontend/src/components/admin/UserTable.tsx` - User list with role display, hospital list, edit/delete actions
- `frontend/src/components/admin/HospitalCheckboxList.tsx` - Checkbox list for hospital assignment
- `frontend/src/components/admin/AddManagerForm.tsx` - Email input form to create manager via POST
- `frontend/src/messages/pt-BR/admin.json` - 26 admin UI i18n strings
- `frontend/src/i18n/request.ts` - Registered admin namespace in message imports

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use `next/link` for admin link | Consistent with HospitalCard pattern already in codebase |
| AdminGuard returns null during loading | Prevents flash of admin content per RESEARCH.md pitfall 5 |
| Inline expand for hospital checkboxes | Simpler than modal, keeps context visible in table row |
| Admin rows are read-only in UserTable | Per D-06, admins cannot be removed from UI |

## Deviations from Plan

None -- plan executed exactly as written.

## Checkpoint: RBAC End-to-End Verification (Task 3)

The following manual verification steps should be performed:

1. Run `docker compose up --build` (ensure ADMIN_EMAILS contains your Google email)
2. Open browser to the app URL
3. Log in with your Google account (should auto-create admin user)
4. Verify "Admin" link appears in header
5. Click Admin link -- verify user table shows your email with "Administrador" role
6. Add a test manager: enter a Google email, click Adicionar
7. Verify the new manager appears in the table with "Gerente" role
8. Click "Editar Hospitais" on the manager row -- verify checkbox list of all hospitals appears
9. Check 2-3 hospitals, click Save -- verify assignments update
10. Log in as the manager (different browser/incognito) -- verify only assigned hospitals appear in grid
11. Verify manager does NOT see "Admin" link in header
12. Verify manager cannot access /admin directly (redirected)
13. Log in with an unregistered Google account -- verify "Acesso negado. Contate o administrador." error

## Known Stubs

None -- all components are wired to real API endpoints via apiFetch.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- RBAC frontend layer complete
- All 4 plans in Phase 5 executed
- Requires end-to-end manual verification (Task 3 checkpoint) before marking phase complete

---
*Phase: 05-rbac*
*Completed: 2026-04-09*
