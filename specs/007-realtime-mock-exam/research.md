# Research: Real-time Mock Exam System

## 1. Time Synchronization & Simulation
**Goal**: Simulate a server authority for time to prevent client-side clock manipulation and ensure synchronized start/end events.

**Decision**: Implement a `MockServerTime` service.
- **Rationale**: Phase 1 is client-only. We cannot trust `new Date()` directly in UI components if we want to simulate server offset or drift later.
- **Implementation**:
  - `MockService.getTime()` returns `Date.now()` (can be offset for testing).
  - React Hook `useServerTime()` polls this service every 1s to provide a reactive "current server time" to the UI.

## 2. Polling Strategy
**Goal**: Update exam state (Scheduled -> InProgress -> Ended) and reveal topic image without page refresh.

**Decision**: Custom Polling Hook (`useExamPolling`) + Zustand.
- **Rationale**: We don't have `swr` or `react-query`. Adding them for just this feature is overkill.
- **Pattern**:
  - A hook that runs `setInterval` (e.g., 2000ms).
  - Calls `MockExamService.getExam(id)`.
  - Updates the `useMockExamStore`.
  - The store compares `serverTime` vs `startTime` to update the `status` field derived from time.

## 3. Topic Image Obfuscation (Phase 1)
**Goal**: Prevent "inspect element" cheating before start time.

**Decision**: Service-side Conditional Logic.
- **Rationale**: In a real backend, the API wouldn't send the field. We must mimic this in the Mock Service.
- **Implementation**:
  - `MockExamService.getExamById(id)`:
    - Get `serverTime`.
    - If `serverTime < exam.startTime`, return object with `topicImageUrl: undefined`.
    - Else, return full object.

## 4. State Management
**Goal**: Handle Exam flow (Join -> Wait -> Start -> Submit -> End).

**Decision**: `zustand` Store (`useMockExamStore`).
- **Rationale**: Consistent with project architecture (`use-auth.ts`, etc.).
- **Structure**:
  - `exam`: Current exam details.
  - `status`: Derived status (Scheduled, InProgress, Ended).
  - `timeLeft`: Calculated duration.
  - `submissions`: List of submissions (for mentor).
  - `mySubmission`: Current user's submission.

## 5. Persistence
**Goal**: Support multi-tab testing.

**Decision**: `localStorage` via `MockStorage` utility.
- **Rationale**: Standard for this project's Phase 1.
- **Key Keys**: `palette-mock-exams`, `palette-mock-participations`, `palette-mock-submissions`.
