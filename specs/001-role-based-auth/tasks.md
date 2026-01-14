# Tasks: 역할 기반 인증 시스템

**Input**: Design documents from `/specs/001-role-based-auth/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-service.contract.md

**Tests**: This feature does NOT explicitly request tests in Phase 1, so test tasks are excluded per /speckit.tasks guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install project dependencies: zustand, bcryptjs, react-hook-form, zod, @hookform/resolvers
- [X] T002 Install dev dependencies: @types/bcryptjs
- [X] T003 [P] Create directory structure: src/components/{auth,layout,ui}
- [X] T004 [P] Create directory structure: src/lib/{auth,validation}
- [X] T005 [P] Create directory structure: src/store, src/types, src/hooks
- [X] T006 [P] Create directory structure: app/(auth)/{login,signup}
- [X] T007 [P] Create directory structure: app/gallery/[id]

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Define core types in src/types/auth.ts (User, UserProfile, UserRole, LoginCredentials, RegisterData, AuthResponse, AuthError)
- [X] T009 [P] Create Zod validation schemas in src/lib/validation/auth-schemas.ts (loginSchema, signupSchema)
- [X] T010 [P] Implement password utilities in src/lib/auth/password.ts (hashPassword, verifyPassword using bcryptjs)
- [X] T011 Implement MockAuthService in src/lib/auth/mock-auth.service.ts (login, register, logout, getCurrentUser, checkEmailAvailability)
- [X] T012 Create Zustand auth store in src/store/auth-store.ts with persist middleware (skipHydration: true)
- [X] T013 Create useHydration hook in src/hooks/use-hydration.ts for SSR hydration guard
- [X] T014 [P] Create base UI components in src/components/ui/Button.tsx
- [X] T015 [P] Create base UI components in src/components/ui/Input.tsx
- [X] T016 [P] Create base UI components in src/components/ui/FormField.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 신규 사용자 회원가입 (Priority: P1) 🎯 MVP

**Goal**: 신규 사용자가 이메일, 비밀번호, 역할을 입력하여 계정을 생성하고 자동 로그인된다.

**Independent Test**: 회원가입 페이지에서 유효한 정보를 입력하여 계정을 생성하고, 역할에 맞는 GNB가 표시되는지 확인한다.

### Implementation for User Story 1

- [X] T017 [P] [US1] Create SignupForm component in src/components/auth/SignupForm.tsx (use React Hook Form + Zod resolver, onBlur validation mode)
- [X] T018 [P] [US1] Create signup page in app/(auth)/signup/page.tsx (render SignupForm with proper layout)
- [X] T019 [US1] Integrate SignupForm with Zustand auth store register action (handle success/error states, loading indicators)
- [X] T020 [US1] Add form validation error display in SignupForm (email format, password complexity, role selection)
- [X] T021 [US1] Implement auto-login after successful registration (redirect to home page with role-based GNB)
- [X] T022 [US1] Handle duplicate email error in SignupForm ("이미 사용 중인 이메일입니다")
- [X] T023 [US1] Add loading state during bcrypt password hashing (display "처리 중..." message)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register with student/mentor role and see appropriate GNB

---

## Phase 4: User Story 2 - 기존 사용자 로그인 (Priority: P1)

**Goal**: 기존 회원이 이메일과 비밀번호로 로그인하여 역할에 맞는 서비스를 이용한다.

**Independent Test**: 로그인 페이지에서 올바른 자격 증명을 입력하여 역할에 맞는 GNB가 표시되는지 확인한다.

### Implementation for User Story 2

- [X] T024 [P] [US2] Create LoginForm component in src/components/auth/LoginForm.tsx (use React Hook Form + Zod resolver, onBlur validation mode)
- [X] T025 [P] [US2] Create login page in app/(auth)/login/page.tsx (render LoginForm with proper layout)
- [X] T026 [US2] Integrate LoginForm with Zustand auth store login action (handle success/error states, loading indicators)
- [X] T027 [US2] Add form validation error display in LoginForm (email format, password required)
- [X] T028 [US2] Implement generic error message for login failures ("이메일 또는 비밀번호가 올바르지 않습니다" for security)
- [X] T029 [US2] Handle returnUrl query parameter in login page (redirect to original destination after login)
- [X] T030 [US2] Add loading state during login authentication process

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can register, login, and see role-based navigation

---

## Phase 5: User Story 3 - 역할 기반 네비게이션 표시 (Priority: P2)

**Goal**: 로그인한 사용자는 자신의 역할(학생/멘토)에 따라 다른 GNB를 보게 된다.

**Independent Test**: 학생 계정과 멘토 계정으로 각각 로그인하여 GNB 메뉴 항목이 역할에 맞게 표시되는지 확인한다.

### Implementation for User Story 3

- [X] T031 [P] [US3] Define navigation items constants in src/lib/constants/nav-items.ts (GUEST_NAV_ITEMS, STUDENT_NAV_ITEMS, MENTOR_NAV_ITEMS)
- [X] T032 [P] [US3] Create helper function getNavItemsForRole in src/lib/constants/nav-items.ts
- [X] T033 [US3] Create GNB component in src/components/layout/GNB.tsx (display nav items based on user role, show login/signup for guests)
- [X] T034 [US3] Integrate GNB with useHydration hook (prevent hydration mismatch, show loading state)
- [X] T035 [US3] Add user email display and logout button in GNB for authenticated users
- [X] T036 [US3] Update root layout in app/layout.tsx to include GNB component
- [X] T037 [US3] Implement logout functionality in GNB (call auth store logout, clear session state)

**Checkpoint**: At this point, GNB correctly displays different menu items based on user role (student/mentor/guest)

---

## Phase 6: User Story 4 - 비인증 사용자 접근 제한 (Priority: P2)

**Goal**: 비로그인 사용자는 갤러리 썸네일만 볼 수 있으며, 상세 페이지 접근 시 로그인 페이지로 리다이렉트된다.

**Independent Test**: 비로그인 상태에서 갤러리 목록을 확인하고, 상세 페이지 접근 시 로그인 페이지로 리다이렉트되는지 확인한다.

### Implementation for User Story 4

- [X] T038 [P] [US4] Create ProtectedRoute component in src/components/auth/ProtectedRoute.tsx (check authentication, redirect to login with returnUrl)
- [X] T039 [P] [US4] Create gallery list page in app/gallery/page.tsx (public access, display thumbnails for all users)
- [X] T040 [US4] Create gallery detail page in app/gallery/[id]/page.tsx (wrap with ProtectedRoute, show content only to authenticated users)
- [X] T041 [US4] Implement returnUrl save and restore in ProtectedRoute (save original destination, redirect after login)
- [X] T042 [US4] Add loading state in ProtectedRoute while checking authentication (prevent content flash)
- [X] T043 [US4] Display informative message in login page when redirected ("상세 내용을 보려면 로그인이 필요합니다")

**Checkpoint**: Gallery list is public, gallery detail pages are protected and redirect unauthenticated users to login

---

## Phase 7: User Story 5 - 사용자 로그아웃 (Priority: P3)

**Goal**: 로그인한 사용자가 로그아웃하여 세션을 종료하고 비인증 상태로 전환된다.

**Independent Test**: 로그인 상태에서 로그아웃 버튼을 클릭하여 비인증 상태 GNB가 표시되는지 확인한다.

### Implementation for User Story 5

- [X] T044 [US5] Implement logout action in Zustand auth store (clear user state, reset isAuthenticated flag)
- [X] T045 [US5] Connect logout button in GNB to logout action (show confirmation if needed)
- [X] T046 [US5] Redirect to home page after logout (clear any protected route state)
- [X] T047 [US5] Implement browser back button protection (redirect to login if accessing protected pages after logout)
- [X] T048 [US5] Clear any returnUrl state on logout (prevent unwanted redirects)

**Checkpoint**: All 5 user stories are now complete - full authentication flow works end-to-end

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, validation, and documentation

- [X] T049 [P] Add mobile-first responsive styling to all forms and GNB (minimum touch target 44x44px, test at 375px viewport)
- [X] T050 [P] Implement consistent error message styling across all forms
- [X] T051 [P] Add loading spinners for async operations (login, register, password hashing)
- [X] T052 [P] Ensure all forms have proper accessibility (ARIA labels, keyboard navigation, focus management)
- [X] T053 [P] Add form submission prevention during loading states (disable buttons)
- [X] T054 Validate all validation error messages match spec requirements (Korean messages, security-conscious)
- [X] T055 Test complete authentication flow following quickstart.md validation steps
- [X] T056 Verify localStorage persistence works across page refresh and browser restart
- [X] T057 Test edge cases: duplicate email, wrong password, invalid formats, network errors
- [X] T058 Verify hydration handling works correctly (no SSR/client mismatch warnings)
- [X] T059 Ensure bcrypt hashing is non-blocking (UI remains responsive during password processing)
- [X] T060 Create seed data for development (2-3 mock users with student and mentor roles)
- [X] T061 Document Phase 2 migration path in CLAUDE.md (API integration, httpOnly cookies transition)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Foundational (Phase 2) - MUST complete first
    ↓
    ├─→ User Story 1 (회원가입) - P1 🎯 MVP - Independent, no dependencies
    ├─→ User Story 2 (로그인) - P1 - Independent, no dependencies
    ├─→ User Story 3 (역할 기반 GNB) - P2 - Integrates with US1/US2 but independently testable
    ├─→ User Story 4 (접근 제한) - P2 - Uses US2 login flow but independently testable
    └─→ User Story 5 (로그아웃) - P3 - Uses US2/US3 but independently testable
```

### Within Each User Story

- **User Story 1**: SignupForm → signup page → store integration → validation → error handling → auto-login
- **User Story 2**: LoginForm → login page → store integration → validation → error handling → returnUrl
- **User Story 3**: Nav constants → GNB component → hydration handling → logout button → layout integration
- **User Story 4**: ProtectedRoute → gallery pages → returnUrl handling → loading states → redirect message
- **User Story 5**: Logout action → button integration → redirect → back button protection → state cleanup

### Parallel Opportunities

**Setup Phase (Phase 1)**:
```bash
# All directory creation tasks can run in parallel:
T003, T004, T005, T006, T007
```

**Foundational Phase (Phase 2)**:
```bash
# These can run in parallel:
T008 (types), T009 (schemas), T010 (password utils), T014 (Button), T015 (Input), T016 (FormField)

# Then these sequentially:
T011 (MockAuthService) - depends on T008, T009, T010
T012 (auth store) - depends on T011
T013 (useHydration) - depends on T012
```

**User Story 1**:
```bash
# These can start in parallel after Foundational:
T017 (SignupForm), T018 (signup page)

# Then sequential integration:
T019 → T020 → T021 → T022 → T023
```

**User Story 2**:
```bash
# These can start in parallel after Foundational:
T024 (LoginForm), T025 (login page)

# Then sequential integration:
T026 → T027 → T028 → T029 → T030
```

**User Story 3**:
```bash
# These can start in parallel:
T031 (nav constants), T032 (getNavItemsForRole)

# Then sequential:
T033 → T034 → T035 → T036 → T037
```

**User Story 4**:
```bash
# These can start in parallel:
T038 (ProtectedRoute), T039 (gallery list), T040 (gallery detail)

# Then sequential:
T041 → T042 → T043
```

**User Story 5**:
```bash
# Sequential implementation:
T044 → T045 → T046 → T047 → T048
```

**Polish Phase (Phase 8)**:
```bash
# Most polish tasks can run in parallel:
T049, T050, T051, T052, T053

# Sequential validation tasks:
T054 → T055 → T056 → T057 → T058 → T059 → T060 → T061
```

**Cross-Story Parallelization** (if multiple developers):
```bash
# After Foundational completes, all user stories can start in parallel:
Developer A: User Story 1 (T017-T023)
Developer B: User Story 2 (T024-T030)
Developer C: User Story 3 (T031-T037)
Developer D: User Story 4 (T038-T043)
Developer E: User Story 5 (T044-T048)
```

---

## Parallel Example: Foundational Phase

```bash
# Launch these tasks together (different files, no dependencies):
Task: "Define core types in src/types/auth.ts"
Task: "Create Zod validation schemas in src/lib/validation/auth-schemas.ts"
Task: "Implement password utilities in src/lib/auth/password.ts"
Task: "Create base UI components in src/components/ui/Button.tsx"
Task: "Create base UI components in src/components/ui/Input.tsx"
Task: "Create base UI components in src/components/ui/FormField.tsx"

# Wait for above to complete, then:
Task: "Implement MockAuthService in src/lib/auth/mock-auth.service.ts"
Task: "Create Zustand auth store in src/store/auth-store.ts with persist middleware"
Task: "Create useHydration hook in src/hooks/use-hydration.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T016) - CRITICAL BLOCKER
3. Complete Phase 3: User Story 1 - 회원가입 (T017-T023)
4. Complete Phase 4: User Story 2 - 로그인 (T024-T030)
5. **STOP and VALIDATE**: Test registration and login flows independently
6. Deploy/demo MVP with basic authentication

### Incremental Delivery

1. **Foundation** (Phases 1-2): Install deps, create types, services, store → Foundation ready
2. **MVP** (Phase 3-4): Add registration + login → Test independently → Deploy (MVP!)
3. **Role-Based UI** (Phase 5): Add GNB navigation → Test role switching → Deploy
4. **Access Control** (Phase 6): Add route protection → Test redirects → Deploy
5. **Logout** (Phase 7): Add logout → Test session cleanup → Deploy
6. **Polish** (Phase 8): Refine UX, validate edge cases, document

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - Developer A: User Story 1 (회원가입) - T017-T023
   - Developer B: User Story 2 (로그인) - T024-T030
   - Developer C: User Story 3 (GNB) - T031-T037
   - Developer D: User Story 4 (접근 제한) - T038-T043
   - Developer E: User Story 5 (로그아웃) - T044-T048
3. Stories complete and integrate independently
4. Polish phase together (Phase 8)

---

## Task Count Summary

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKING)
- **Phase 3 (US1 - 회원가입)**: 7 tasks
- **Phase 4 (US2 - 로그인)**: 7 tasks
- **Phase 5 (US3 - 역할 기반 GNB)**: 7 tasks
- **Phase 6 (US4 - 접근 제한)**: 6 tasks
- **Phase 7 (US5 - 로그아웃)**: 5 tasks
- **Phase 8 (Polish)**: 13 tasks

**Total**: 61 tasks

**Parallel Opportunities**:
- Setup: 5 tasks can run in parallel (T003-T007)
- Foundational: 6 tasks can run in parallel (T008-T010, T014-T016)
- User stories: All 5 stories can run in parallel after Foundational completes
- Polish: 5 tasks can run in parallel (T049-T053)

**MVP Scope**: Phases 1-4 (30 tasks) - Registration and Login only

**Suggested First Milestone**: Complete through Phase 4 (US1 + US2) for functional authentication MVP

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3, US4, US5)
- Each user story should be independently completable and testable
- Tests are NOT included as Phase 1 spec does not explicitly request them
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths follow Next.js App Router structure from plan.md
- bcryptjs is used for password hashing (async methods only for non-blocking UI)
- Zustand persist with skipHydration prevents SSR/client hydration mismatches
- Security: Generic error messages, no passwordHash in client state, returnUrl validation
