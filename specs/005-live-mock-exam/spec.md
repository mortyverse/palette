# Feature Specification: Implement Real-time Mock Exam System

**Feature Branch**: `005-live-mock-exam`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "실시간 모의고사 시스템 구현. 멘토가 시작 시간, 종료 시간, 주제 이미지를 설정하여 모의고사를 생성한다. 학생은 모의고사에 참가 신청하고 시작 시간이 되면 새로고침 없이 주제 이미지가 자동 공개된다. 종료 시간이 되면 업로드 버튼이 비활성화된다. 시험 시작 후에도 종료 전까지 입장 및 제출이 가능하다. 주최 멘토는 모든 제출작에 피드백을 달아야 채점 완료 상태가 된다. 서버 시간 기준으로 동기화하며 WebSocket 또는 Polling을 사용한다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mentor Creates Mock Exam (Priority: P1)

A mentor creates a new mock exam session by setting the schedule and uploading a topic image, so that students can prepare to participate.

**Why this priority**: Foundational step; without an exam, no other interactions can occur.

**Independent Test**: Can be tested by a mentor user creating an exam and verifying it appears in the upcoming exams list.

**Acceptance Scenarios**:

1. **Given** a logged-in mentor, **When** they fill out the exam form with start time, end time, and topic image, **Then** a new exam is created with "Scheduled" status.
2. **Given** an invalid time range (End Time < Start Time), **When** the mentor attempts to create the exam, **Then** the system shows an error message.

---

### User Story 2 - Student Participation & Real-time Execution (Priority: P1)

A student registers for an exam, waits in the exam room, sees the topic image automatically at the start time, and uploads their artwork before the end time.

**Why this priority**: Core value proposition of the "Real-time" exam.

**Independent Test**: Can be tested by a student user entering the exam room before start time and observing the transition to "In Progress" and image reveal.

**Acceptance Scenarios**:

1. **Given** a student registered for an upcoming exam, **When** they enter the exam waiting room before the start time, **Then** they see a countdown or waiting message and the topic image is hidden.
2. **Given** students waiting in the exam room, **When** the server time reaches the Start Time, **Then** the topic image is automatically revealed to all connected students without a page refresh.
3. **Given** an exam in progress, **When** a student uploads an image, **Then** it is saved as their submission.
4. **Given** the exam has reached End Time, **When** a student attempts to upload, **Then** the upload button is disabled/hidden and submission is rejected.

---

### User Story 3 - Late Entry (Priority: P2)

A student joins an exam that has already started but not yet ended, so they can still participate if they are late.

**Why this priority**: Increases participation and flexibility for students.

**Independent Test**: Can be tested by a student entering the exam URL after the start time.

**Acceptance Scenarios**:

1. **Given** an exam in progress (Start Time < Now < End Time), **When** a student registers/enters, **Then** they immediately see the topic image and can upload a submission.

---

### User Story 4 - Mentor Feedback & Grading Completion (Priority: P1)

The hosting mentor reviews all submissions after the exam ends and provides feedback, marking the exam as fully complete.

**Why this priority**: Closes the loop for the educational value of the mock exam.

**Independent Test**: Can be tested by a mentor providing feedback to submissions and observing the status change.

**Acceptance Scenarios**:

1. **Given** an ended exam with submissions, **When** the mentor views the dashboard, **Then** they see a list of student submissions.
2. **Given** a submission, **When** the mentor adds text/drawing feedback, **Then** the feedback is saved.
3. **Given** an exam where NOT all submissions have feedback, **When** the mentor checks the status, **Then** the exam is NOT marked as "Grading Complete".
4. **Given** an exam where ALL submissions have feedback, **When** the mentor submits the final feedback, **Then** the exam status updates to "Grading Complete".

### Edge Cases

- **Network Disconnection**: If a student disconnects during the exam and reconnects, they should verify the current state (e.g., if exam ended while disconnected, they cannot submit).
- **Time Sync**: Client clock differs significantly from server clock. System must rely on server time for all critical events (reveal, lock).
- **Zero Submissions**: An exam ends with no students or no submissions. Status should probably be handled gracefully (e.g., auto-complete or manual close).
- **Mentor Abandonment**: Mentor never provides feedback. (Out of scope for this feature, but worth noting as a system limitation).

### Assumptions

- **Mentor Authorization**: Only users with the "Mentor" role can create and host mock exams.
- **Image Hosting**: The system has a reliable method for storing and serving large topic images and student artworks.
- **Connectivity**: Users have a stable internet connection; offline support is not a primary requirement for this real-time feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Mentors to create a Mock Exam with `Title`, `Start Time`, `End Time`, and `Topic Image`.
- **FR-002**: System MUST allow Students to register for a Mock Exam.
- **FR-003**: System MUST prevent Students from registering/entering if the exam is closed (Grading Complete or specific archival rules).
- **FR-004**: System MUST synchronize the exam state (Waiting -> In Progress -> Ended) based on Server Time.
- **FR-005**: System MUST automatically push the `Topic Image` to connected clients at `Start Time` (Real-time reveal).
- **FR-006**: System MUST allow Students to upload an artwork image as a submission during the "In Progress" state.
- **FR-007**: System MUST reject submissions attempted after `End Time` (based on Server Time).
- **FR-008**: System MUST allow Mentors to view all submissions for their hosted exam.
- **FR-009**: System MUST allow Mentors to create Feedback (Text comments and/or Image overlay) for each submission.
- **FR-010**: System MUST automatically or manually transition the Exam status to "Grading Complete" ONLY when all submissions have received feedback.

### Key Entities

- **Mock Exam**: Represents the event. Attributes: `Host (Mentor)`, `Topic Image`, `Start Time`, `End Time`, `Status` (Scheduled, In Progress, Ended, Grading Complete).
- **Submission**: Represents a student's work. Attributes: `Student`, `Exam`, `Image URL`, `Submitted At`.
- **Feedback**: Represents the mentor's evaluation. Attributes: `Submission`, `Mentor`, `Content` (Text/Image), `Created At`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Topic image is revealed to connected clients within 5 seconds of the scheduled Start Time.
- **SC-002**: Submission uploads are strictly blocked 0 seconds after the Server End Time (grace period depends on implementation, but UX should be strict).
- **SC-003**: 100% of exams marked "Grading Complete" have feedback for every submission.
- **SC-004**: Students can join an in-progress exam and see the topic image within 5 seconds of entry.