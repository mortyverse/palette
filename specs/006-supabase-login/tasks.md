---
description: "Task list for feature 006-supabase-login"
---

# Tasks: Supabase Login Integration

**Input**: Design documents from `/specs/006-supabase-login/`
**Prerequisites**: plan.md, spec.md, data-model.md
**Context**: Next.js App Router, Supabase Auth (`@supabase/ssr`), Zustand

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Supabase dependencies and client configuration

- [X] T001 Install Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
- [X] T002 Create `.env.local` with Supabase credentials (instruction only, do not commit)
- [X] T002b Configure Supabase Dashboard (Auth Providers, Rate Limits, Email Templates) per FR-013/FR-014
- [X] T003 [P] Create Supabase browser client factory in `src/lib/supabase/client.ts`
- [X] T004 [P] Create Supabase server client factory in `src/lib/supabase/server.ts`
- [X] T005 Create Supabase middleware client in `src/lib/supabase/middleware.ts`
- [X] T006 Implement Next.js root middleware in `middleware.ts` for session management

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure and type definitions

**⚠️ CRITICAL**: Must complete before User Stories

- [X] T007 Update `src/types/auth.ts` to include Supabase-compatible types and maintain `UserProfile`
- [X] T008 [P] Implement `src/lib/auth/supabase-auth.service.ts` skeleton (implements `AuthService` interface if exists, or mirrors mock service)
- [X] T009 Create `src/hooks/use-auth.ts` for standardized auth access
- [X] T010 Update `src/store/auth-store.ts` to support Supabase session synchronization
- [X] T011 Create `src/components/auth/AuthProvider.tsx` for client-side session hydration

**Checkpoint**: Application builds with new Supabase structures, though not yet hooked up to UI

---

## Phase 3: User Story 1 - Email/Password Login (Priority: P1) 🎯 MVP

**Goal**: Users can sign in using existing UI connected to Supabase Auth

**Independent Test**: Navigate to /login, enter credentials, verify redirect to dashboard and session creation in Supabase

- [X] T012 [US1] Implement `login` method in `src/lib/auth/supabase-auth.service.ts`
- [X] T013 [US1] Update `src/validation/auth-schemas.ts` if needed (ensure sync with `data-model.md`)
- [X] T014 [US1] Update `src/components/auth/LoginForm.tsx` to use `supabase-auth.service.ts` instead of mock
- [X] T015 [US1] Update `app/(auth)/login/page.tsx` to handle Supabase auth flow/errors and `next` URL redirection
- [ ] T016 [US1] Manual Verify: Test login with valid/invalid credentials

**Checkpoint**: Login works against real Supabase backend

---

## Phase 4: User Story 2 - Email/Password Registration (Priority: P1)

**Goal**: New users can create accounts with role selection

**Independent Test**: Navigate to /signup, create account, verify user created in Supabase with correct metadata

- [X] T017 [US2] Create `app/auth/callback/route.ts` for handling server-side auth code exchange
- [X] T018 [US2] Implement `signup` method in `src/lib/auth/supabase-auth.service.ts` handling user metadata
- [X] T019 [US2] Update `src/components/auth/SignupForm.tsx` to use `supabase-auth.service.ts`
- [X] T020 [US2] Update `app/(auth)/signup/page.tsx` for Supabase registration flow
- [ ] T021 [US2] Manual Verify: Register new student/mentor and check `user_metadata` in Supabase dashboard

**Checkpoint**: Registration works and automatically logs user in

---

## Phase 5: User Story 3 & 4 - Session Persistence & Logout (Priority: P2)

**Goal**: Sessions persist across reloads and users can explicitly sign out

**Independent Test**: Reload page to check persistence; click logout to verify session termination

- [X] T022 [P] [US3] Implement `getSession` and `getUser` in `src/lib/auth/supabase-auth.service.ts`
- [X] T023 [P] [US4] Implement `logout` method in `src/lib/auth/supabase-auth.service.ts`
- [X] T024 [US3] Ensure `AuthProvider.tsx` correctly hydrates Zustand store on mount
- [X] T025 [US4] Update logout trigger in `src/components/layout/GNB.tsx` (or equivalent) to use new logout service
- [ ] T026 [US3] Manual Verify: Login, close tab, reopen, verify still logged in

---

## Phase 6: User Story 5 - Protected Route Access (Priority: P2)

**Goal**: Secure routes based on authentication status and roles

**Independent Test**: Try accessing /admin or /coaching without auth; verify redirect

- [X] T027 [US5] Update `src/components/auth/ProtectedRoute.tsx` to validate against Supabase session
- [X] T028 [US5] Verify `middleware.ts` correctly handles protected route patterns (if applicable)
- [ ] T029 [US5] Manual Verify: Access protected route as guest (redirects to login) and as user (allows access)

---

## Phase 7: Polish & Cleanup

**Purpose**: Remove mock implementations and finalize integration

- [X] T030 Remove `src/lib/auth/mock-auth.service.ts`
- [X] T031 Remove `src/lib/auth/password.ts`
- [X] T032 Verify all `console.log` or debug statements are removed/handled
- [ ] T033 Final full E2E manual test pass (Register -> Login -> Persist -> Logout)

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** must happen first.
2. **Foundational (Phase 2)** blocks all stories.
3. **US1 (Login)** and **US2 (Registration)** are P1 and can be done in parallel after Phase 2, but US1 is good for MVP verification.
4. **US3/4/5** follow P1 tasks.
5. **Cleanup** happens last.

## Implementation Strategy

1. **Setup**: Get the SDKs installed and clients configured.
2. **Foundation**: Build the service layer skeleton and hooks.
3. **Switch**: One by one, wire up the UI components (Login, then Signup) to the new service.
4. **Verify**: Use manual verification at each step since automated tests are not configured.