# Tasks: 007-realtime-mock-exam

**Feature**: Real-time Mock Exam System
**Status**: Complete
**Spec**: [specs/007-realtime-mock-exam/spec.md](specs/007-realtime-mock-exam/spec.md)

## Implementation Strategy
- **Mock-First**: All data operations will use `MockExamService` interacting with `localStorage`.
- **Phase-Driven**: Start with core entities, then proceed through the exam lifecycle (Create -> Join -> Submit -> Feedback).
- **Time Simulation**: A `useServerTime` hook will simulate centralized time to test synchronization without a real backend.
- **Strict Separation**: UI components will rely entirely on the Service Layer, not internal state logic.

## Dependencies
- **Phase 1 & 2** (Setup/Foundational) must be completed first.
- **Phase 3** (US1) unblocks exam creation.
- **Phase 4** (US2) depends on US1.
- **Phase 5** (US3) depends on US2.
- **Phase 6** (US4) depends on US3.

## Phase 1: Setup
**Goal**: Initialize project structure and type definitions.

- [X] T001 Create project structure (`src/components/mock-exam`, `src/lib/mock-exam`, `src/types`)
- [X] T002 Define TypeScript interfaces in `src/types/mock-exam.ts` (MockExam, ExamParticipation, ExamSubmission, ExamFeedback)
- [X] T003 [P] Initialize `MockExamService` skeleton in `src/lib/mock-exam/service.ts` with LocalStorage helpers

## Phase 2: Foundational
**Goal**: Implement core logic for time simulation and state management.

- [X] T004 Implement `useServerTime` hook in `src/hooks/use-server-time.ts` (simulating server time drift/sync)
- [X] T005 Implement `MockExamStore` in `src/store/mock-exam-store.ts` using Zustand
- [X] T006 Implement data seeding helper in `src/lib/mock-exam/utils.ts` to clear/init LocalStorage for testing

## Phase 3: Create Mock Exam (User Story 1)
**Goal**: Allow Mentors to schedule exams.
**Story**: [US1] As a Mentor, I want to schedule a mock exam with specific timing and a topic image.

- [X] T007 [US1] Implement `createExam` method in `src/lib/mock-exam/service.ts`
- [X] T008 [US1] Create `ExamCreationForm` component in `src/components/mock-exam/exam-creation-form.tsx`
- [X] T009 [US1] Create Mentor Exam Dashboard page at `app/mock-exam/create/page.tsx`
- [X] T010 [US1] Integrate `createExam` with Store and UI

## Phase 4: Join and Participate (User Story 2)
**Goal**: Students can join and see topic revealed at start time.
**Story**: [US2] As a Student, I want to join a mock exam and see the topic revealed automatically.

- [X] T011 [US2] Implement `joinExam` method in `src/lib/mock-exam/service.ts` (handle auto-join)
- [X] T012 [US2] Implement `getExam` method in `src/lib/mock-exam/service.ts` with conditional topic URL hiding (based on time)
- [X] T013 [US2] Create `ExamTimer` component in `src/components/mock-exam/exam-timer.tsx` using `useServerTime`
- [X] T014 [US2] Create `TopicReveal` component in `src/components/mock-exam/topic-reveal.tsx` (polling/timer logic)
- [X] T015 [US2] Create Exam Room page at `app/mock-exam/[id]/page.tsx`
- [X] T016 [US2] Integrate `ExamTimer` and `TopicReveal` into Exam Room

## Phase 5: Submission Management (User Story 3)
**Goal**: Students can upload work within the time window.
**Story**: [US3] As a Student, I want to upload my artwork before the time runs out.

- [X] T017 [US3] Implement `submitWork` method in `src/lib/mock-exam/service.ts` (validate time)
- [X] T018 [US3] Create `SubmissionUploader` component in `src/components/mock-exam/submission-uploader.tsx`
- [X] T019 [US3] Integrate `SubmissionUploader` into Exam Room with time-based disable logic
- [X] T020 [US3] Update `MockExamStore` to track current user's submission status

## Phase 6: Feedback and Completion (User Story 4)
**Goal**: Mentors review work and exam completes.
**Story**: [US4] As a Mentor, I want to provide feedback and have the exam marked as "Completed".

- [X] T021 [US4] Implement `getSubmissions` method in `src/lib/mock-exam/service.ts`
- [X] T022 [US4] Implement `provideFeedback` method in `src/lib/mock-exam/service.ts` (trigger auto-complete check)
- [X] T023 [US4] Implement `checkExamCompletion` logic in `src/lib/mock-exam/service.ts`
- [X] T024 [US4] Create `SubmissionGallery` component in `src/components/mock-exam/submission-gallery.tsx`
- [X] T025 [US4] Create `FeedbackModal` component in `src/components/mock-exam/feedback-modal.tsx`
- [X] T026 [US4] Integrate Mentor Review view into Exam Room (conditional rendering for Mentor role)

## Phase 7: Polish & Cross-Cutting
**Goal**: Ensure robust UX and design consistency.

- [X] T027 Refine `TopicReveal` animation and empty states
- [X] T028 Add loading states and error toasts (using existing UI components)
- [X] T029 Verify `localStorage` persistence across page reloads
- [X] T030 Final design review against `docs/design-system.md`
