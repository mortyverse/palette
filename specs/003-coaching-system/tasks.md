# Tasks: 1:1 Coaching System

**Feature**: `003-coaching-system`
**Status**: Complete
**Spec**: `specs/003-coaching-system/spec.md`

## Dependencies

1.  **Phase 1: Setup**
2.  **Phase 2: Foundation**
3.  **Phase 3: Request Coaching** (User Story 1 - P1)
4.  **Phase 4: Mentor Feedback** (User Story 2 - P1)
5.  **Phase 5: Feedback Comparison** (User Story 3 - P2)
6.  **Phase 6: Follow-up Question** (User Story 4 - P2)
7.  **Phase 7: Auto-Refund & Expiration** (User Story 5 - P3)
8.  **Phase 8: Polish**

## Implementation Strategy

-   **Mock-First**: All data interactions will go through `MockCoachingService`.
-   **No Backend**: Logic for refunds and timeouts will be simulated via lazy evaluation in the service layer.
-   **Canvas**: Using native HTML5 Canvas API for the mentor drawing tool to minimize dependencies.

---

## Phase 1: Setup

**Goal**: Initialize directory structure and configuration.

- [X] T001 Create directory `src/components/coaching` for feature components
- [X] T002 Create directory `src/lib/coaching` for service logic
- [X] T003 Create directory `app/coaching` for routes

## Phase 2: Foundation

**Goal**: Define core types and the mock service layer that underpins all stories.

- [X] T004 Create `src/types/coaching.ts` with `CoachingSession`, `Feedback`, `FollowUp`, and `SessionStatus` enums
- [X] T005 Create `src/lib/coaching/coaching-service.interface.ts` defining `ICoachingService` contract
- [X] T006 Create `src/lib/coaching/mock-coaching.service.ts` with initial empty implementation
- [X] T007 Update `src/mocks/data.ts` to include initial mock data for students, mentors, and coaching sessions

## Phase 3: User Story 1 - Request Coaching (P1)

**Goal**: Allow students to request coaching by uploading art and selecting a mentor.
**Story**: [US1] As a Student, I want to select a mentor and upload my artwork...

- [X] T008 [US1] Implement `createSession` method in `src/lib/coaching/mock-coaching.service.ts` (ensure credit deduction logic)
- [X] T009 [US1] Create `MentorSelector` component in `src/components/coaching/MentorSelector.tsx`
- [X] T010 [US1] Create `CoachingRequestForm` component in `src/components/coaching/CoachingRequestForm.tsx`
- [X] T011 [US1] Create page `app/coaching/request/page.tsx` assembling the form
- [X] T012 [US1] Create page `app/coaching/[id]/page.tsx` for session details (initial student view)

## Phase 4: User Story 2 - Mentor Feedback (P1)

**Goal**: Provide mentors with a drawing tool to give feedback.
**Story**: [US2] As a Mentor, I want to view student requests and use drawing tools...

- [X] T013 [US2] Implement `submitFeedback` method in `src/lib/coaching/mock-coaching.service.ts`
- [X] T014 [US2] Create `CanvasEditor` component in `src/components/coaching/CanvasEditor.tsx` (drawing logic)
- [X] T015 [US2] Create `ColorPicker` and `BrushControls` in `src/components/coaching/CanvasControls.tsx`
- [X] T016 [US2] Create `MentorWorkspace` component in `src/components/coaching/MentorWorkspace.tsx`
- [X] T017 [US2] Update `app/coaching/[id]/page.tsx` to conditionally render workspace for mentors

## Phase 5: User Story 3 - Feedback Comparison (P2)

**Goal**: Enable students to compare original art with mentor feedback.
**Story**: [US3] As a Student, I want to compare the original image with the mentor's feedback...

- [X] T018 [US3] Create `FeedbackViewer` component in `src/components/coaching/FeedbackViewer.tsx`
- [X] T019 [US3] Add toggle/slider logic to `src/components/coaching/FeedbackViewer.tsx` to switch between images
- [X] T020 [US3] Integrate `FeedbackViewer` into `app/coaching/[id]/page.tsx` for `ANSWERED` sessions

## Phase 6: User Story 4 - Follow-up Question (P2)

**Goal**: Allow a single follow-up Q&A exchange.
**Story**: [US4] As a Student, I want to ask one additional question...

- [X] T021 [US4] Implement `submitFollowUp` and `replyToFollowUp` in `src/lib/coaching/mock-coaching.service.ts`
- [X] T022 [US4] Create `FollowUpSection` component in `src/components/coaching/FollowUpSection.tsx`
- [X] T023 [US4] Integrate `FollowUpSection` into `app/coaching/[id]/page.tsx` ensuring 1-question limit logic

## Phase 7: User Story 5 - Auto-Refund & Expiration (P3)

**Goal**: Simulate system automation for timeouts and refunds.
**Story**: [US5] As a System, I want to automatically enforce time limits...

- [X] T024 [US5] Implement `checkSessionTimeouts` private method in `src/lib/coaching/mock-coaching.service.ts` (Lazy evaluation: auto-refund on answer/reply miss, auto-close on follow-up miss)
- [X] T025 [US5] Update `getSessionById` in `src/lib/coaching/mock-coaching.service.ts` to call timeout check before returning
- [X] T026 [US5] Update `getUserSessions` in `src/lib/coaching/mock-coaching.service.ts` to call timeout check
- [X] T027 [US5] Update session detail view `app/coaching/[id]/page.tsx` to display `REFUNDED` or `CLOSED` states

## Phase 8: Polish

**Goal**: Final clean-up and UI refinements.

- [X] T028 Add loading states and error handling to all coaching components
- [X] T029 Run `npm run lint` and fix any new linting errors
- [X] T030 Verify all user scenarios from `spec.md` manually
- [X] T031 Verify SC-002 (Overlay <100ms) and SC-004 (Canvas <30ms) performance requirements
