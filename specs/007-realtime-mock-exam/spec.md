# Feature Specification: Real-time Mock Exam System

**Feature Branch**: `007-realtime-mock-exam`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "실시간 모의고사 시스템 구현. 멘토가 시작 시간, 종료 시간, 주제 이미지를 설정하여 모의고사를 생성한다. 학생은 모의고사에 참가 신청하고 시작 시간이 되면 새로고침 없이 주제 이미지가 자동 공개된다. 종료 시간이 되면 업로드 버튼이 비활성화된다. 시험 시작 후에도 종료 전까지 입장 및 제출이 가능하다. 주최 멘토는 모든 제출작에 피드백을 달아야 채점 완료 상태가 된다. 서버 시간 기준으로 동기화하며 WebSocket 또는 Polling을 사용한다."

## Clarifications

### Session 2026-01-15
- Q: Realtime Simulation Strategy (Phase 1) → A: Option A (Simulated Polling). Components will poll a Mock Service (e.g., every 1-5s) which wraps `Date.now()` to simulate a server time authority and derived state.
- Q: Mock Data Persistence (Phase 1) → A: Option A (LocalStorage). The `MockService` will persist `MockExam`, `ExamParticipation`, and `ExamSubmission` entities to `window.localStorage` to support multi-tab testing and page reloads.
- Q: Exam Entry & Access Control → A: Option A (Auto-Join). Students register/join without mentor approval to facilitate low-friction real-time participation.
- Q: Completion Trigger for Exams with Zero Submissions → A: Option A (Auto-Complete). If zero submissions exist at End Time, the exam transitions to "Completed" automatically to prevent stale "Ended" states.
- Q: Topic Image Security / Obfuscation (Phase 1) → A: Option A (Conditional URL Delivery). The `MockExamService` will omit the `topicImageUrl` from the exam details payload until the `serverTime` is greater than or equal to `startTime` to prevent early discovery.

## User Scenarios & Testing

### User Story 1 - Create Mock Exam (Priority: P1)

As a Mentor, I want to schedule a mock exam with specific timing and a topic image so that I can host a live drawing session for students.

**Why this priority**: Essential for initializing the exam event.

**Independent Test**: Can be tested by a mentor creating an exam and verifying it appears in the schedule.

**Acceptance Scenarios**:

1. **Given** I am a logged-in Mentor, **When** I fill in the exam title, start time, end time, and upload a topic image, **Then** the exam is created with a "Scheduled" status.
2. **Given** I am creating an exam, **When** I set the end time before the start time, **Then** the system shows an error and prevents creation.

---

### User Story 2 - Join and Participate (Priority: P1)

As a Student, I want to join a mock exam and see the topic revealed automatically at the start time without refreshing, so that I can immediately start drawing.

**Why this priority**: Core value proposition of "real-time" exam.

**Independent Test**: Can be tested by simulating the start time and observing the UI update without manual refresh.

**Acceptance Scenarios**:

1. **Given** I have joined a scheduled exam, **When** the current time reaches the exam start time, **Then** the topic image automatically becomes visible on my screen.
2. **Given** the exam has already started but not ended, **When** I join the exam page, **Then** the system checks the simulated Server Time and immediately displays the topic image and "Submit" button.

---

### User Story 3 - Submission Management (Priority: P1)

As a Student, I want to upload my artwork before the time runs out, and be prevented from uploading after the deadline.

**Why this priority**: Enforces the time constraint of a mock exam.

**Independent Test**: Can be tested by attempting uploads just before and just after the end time.

**Acceptance Scenarios**:

1. **Given** the exam is in progress (between start and end time), **When** I upload my artwork, **Then** the submission is accepted and recorded (persisted to LocalStorage).
2. **Given** the exam has ended, **When** I attempt to upload or the page is open, **Then** the upload button is disabled or hidden, and new submissions are rejected.

---

### User Story 4 - Feedback and Completion (Priority: P1)

As a Mentor, I want to provide feedback on student submissions and have the exam marked as "Completed" only after I have reviewed all works.

**Why this priority**: Completes the exam lifecycle and provides value to students.

**Independent Test**: Can be tested by providing feedback to all submissions and checking the exam status.

**Acceptance Scenarios**:

1. **Given** a finished exam with student submissions, **When** I provide feedback on a specific submission, **Then** that submission is marked as "Reviewed".
2. **Given** a finished exam, **When** I have provided feedback for ALL student submissions, **Then** the exam status automatically updates to "Completed".
3. **Given** a finished exam with **zero** submissions, **When** the End Time is reached, **Then** the exam status automatically transitions to "Completed".

### Edge Cases

- **Simulated Server Time**: In Phase 1, the client's local clock is treated as "Server Time" via the Mock Service wrapper to ensure consistency across components, even if the actual system clock drifts slightly.
- **Data Persistence**: All created exams and submissions must survive page reloads (LocalStorage) to allow testing the "Create -> Join" flow across different browser tabs/windows.
- **Security (Anti-Cheating)**: The topic image URL is not served to the client until the exact Start Time is reached, preventing users from finding the image in the DOM/Network tab early.
- What happens if a student is uploading when the time expires? (Upload might fail or grace period applied - strictly following prompt: "disable button at end time").
- What happens if a mentor updates the exam time while it is running? (Should be restricted or handle updates gracefully).

## Requirements

### Functional Requirements

- **FR-001**: Mentors MUST be able to create an exam with Title, Start Time, End Time, and Topic Image.
- **FR-002**: Students MUST be able to register/join a scheduled exam automatically without mentor approval.
- **FR-003**: The System MUST automatically reveal the topic image to connected participants at the Start Time without requiring a page refresh (implemented via Polling in Phase 1).
- **FR-004**: The System MUST allow students to upload submissions only between the Start Time and End Time.
- **FR-005**: The System MUST disable the submission capability immediately when the End Time is reached (based on simulated server time).
- **FR-006**: The System MUST allow students to join and submit even if the exam has already started, as long as it has not ended.
- **FR-007**: Mentors MUST be able to view all submissions for their exam.
- **FR-008**: Mentors MUST be able to add feedback to each submission.
- **FR-009**: The System MUST mark the Exam as "Completed" only when all submissions have received feedback, or automatically at End Time if zero submissions exist.
- **FR-010**: The System MUST synchronize all time-based events (start, end) based on a centralized "Server Time" source (Mock Service), distinguishing it from raw `Date.now()` calls in UI components.
- **FR-011**: The System MUST persist all Exams, Participations, and Submissions to LocalStorage to enable cross-tab testing and state preservation during Phase 1.
- **FR-012**: The System MUST withhold the Topic Image URL until the official Start Time is reached according to the Server Time.

### Key Entities

- **MockExam**: Represents the exam event. Attributes: Title, StartTime, EndTime, TopicImageURL, Status (Scheduled, InProgress, Ended, Completed), MentorID.
- **ExamParticipation**: Records a student's registration. Attributes: ExamID, StudentID, JoinedAt.
- **ExamSubmission**: Represents a student's work. Attributes: ExamID, StudentID, ImageURL, SubmittedAt, FeedbackStatus.
- **ExamFeedback**: Mentor's feedback. Attributes: SubmissionID, Content, CreatedAt.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Topic image is visible to active participants within 5 seconds of the scheduled Start Time (worst-case polling lag).
- **SC-002**: 100% of submissions attempted after the server-side End Time are rejected.
- **SC-003**: Exam status transitions to "Completed" strictly after 100% of submissions have feedback (or immediately if count is 0).
- **SC-004**: Students can join an in-progress exam and see the topic within 2 seconds of loading the page.
