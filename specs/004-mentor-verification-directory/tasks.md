---
description: "Tasks for Feature 004: Mentor Verification & Directory"
---

# Tasks: Mentor Verification & Directory

**Input**: Design documents from `/specs/004-mentor-verification-directory/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/mentor-service.contract.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create component directories: `src/components/mentor`, `src/components/directory`, `src/components/admin`
- [X] T002 Create library directories: `src/lib/mentor`
- [X] T003 Create store directory if not exists: `src/store`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Define `MentorProfile` and `VerificationDoc` types in `src/types/mentor.ts`
- [X] T005 Define `MentorService` interface in `src/lib/mentor/mentor-service.interface.ts`
- [X] T006 Implement `MockMentorService` in `src/lib/mentor/mock-mentor.service.ts` (include `localStorage` logic)
- [X] T007 Implement `useMentorStore` in `src/store/mentor-store.ts` (actions for fetch, update, approve/reject)

**Checkpoint**: Foundation ready - Service and Store are available for UI components.

---

## Phase 3: User Story 1 - Mentor Application & Access Control (Priority: P1)

**Goal**: Prospective mentors can upload documents, and unverified mentors are restricted from core features.

**Independent Test**:
1. Register as a mentor.
2. Verify "Pending" status limits access (redirects or shows guard message).
3. Upload documents via Profile Form.

### Implementation for User Story 1

- [X] T008 [US1] Create `MentorProfileForm` component in `src/components/mentor/MentorProfileForm.tsx` (handles file upload simulation and validation for size/type)
- [X] T009 [US1] Create `MentorGuard` component in `src/components/mentor/MentorGuard.tsx` (checks status, blocks children if pending)
- [X] T010 [US1] Create Mentor Application page in `src/app/mentor/apply/page.tsx` (uses `MentorProfileForm`)
- [X] T011 [US1] Wrap protected routes (`app/coaching`, `app/gallery`) with `MentorGuard` in their respective `layout.tsx` or `page.tsx`

**Checkpoint**: Mentors can apply, and unverified mentors are correctly blocked.

---

## Phase 4: User Story 2 - Admin Adjudication (Priority: P1)

**Goal**: Admins can view pending applications and Approve/Reject them.

**Independent Test**:
1. Access Admin Mentor list.
2. See pending application from US1.
3. Approve and Reject (with reason) and verify status change.

### Implementation for User Story 2

- [X] T012 [US2] Create `AdminMentorList` component in `src/components/admin/AdminMentorList.tsx` (lists pending mentors)
- [X] T013 [US2] Create `AdminMentorActions` component in `src/components/admin/AdminMentorActions.tsx` (Approve/Reject buttons + Reason modal)
- [X] T014 [US2] Create Admin Mentors page in `src/app/admin/mentors/page.tsx` (integrates List and Actions)

**Checkpoint**: Admins can manage mentor lifecycle.

---

## Phase 5: User Story 3 - Mentor Directory & Search (Priority: P2)

**Goal**: Students can browse and filter verified mentors.

**Independent Test**:
1. Go to Directory page.
2. See only Approved mentors.
3. Filter by University or Style and verify list updates.

### Implementation for User Story 3

- [X] T015 [US3] Create `MentorCard` component in `src/components/mentor/MentorCard.tsx` (displays badge, tags, university)
- [X] T016 [US3] Create `FilterBar` component in `src/components/directory/FilterBar.tsx` (inputs for university, style using predefined mock constants)
- [X] T017 [US3] Create `MentorGrid` component in `src/components/directory/MentorGrid.tsx` (connects Store, FilterBar, and MentorCards)
- [X] T018 [US3] Create Public Directory page in `src/app/mentors/page.tsx`

**Checkpoint**: Public directory is functional with filtering.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 Update Main Navigation (`src/components/layout/GNB.tsx`) to link to "Mentors" directory
- [X] T020 Add navigation link for "Admin" (mock link for development access)
- [X] T021 Validate all "Independent Test" scenarios from `spec.md`

---

## Dependencies & Execution Order

1. **Phase 1 & 2** (Setup/Foundation) MUST be done first.
2. **Phase 3** (US1) and **Phase 4** (US2) can technically run in parallel, but US2 needs data created by US1 to be useful (or mock data seeding). Recommended: US1 -> US2.
3. **Phase 5** (US3) depends on `MentorCard` and `MockMentorService` filtering logic (implemented in Phase 2), so it can run parallel to US1/US2 if resources allow.

## Implementation Strategy

1. **Foundation**: Build the `MockMentorService` with a robust `localStorage` mock to simulate the "Pending" -> "Approved" state transitions.
2. **MVP**: Complete US1 (Apply) and US2 (Approve) to verify the core loop.
3. **Feature**: Add US3 (Directory) for the student view.
