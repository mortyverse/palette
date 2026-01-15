# Feature Specification: 1:1 Coaching System

**Feature Branch**: `003-coaching-system`  
**Created**: 2026년 1월 15일 목요일  
**Status**: Draft  
**Input**: User description: "크레딧 기반 1:1 코칭 시스템 구현. 학생이 멘토를 선택하고 그림과 질문을 업로드하면 크레딧이 차감되며 24시간 카운트다운이 시작된다. 멘토는 Canvas 도구로 학생의 그림 위에 직접 피드백을 그려서 답변한다. 24시간 내 미답변 시 크레딧 자동 환불. 학생은 답변 후 1회 추가 질문 가능. 48시간 동안 추가 질문이 없으면 세션 자동 종료. 원본과 피드백 이미지를 토글 또는 오버레이로 비교할 수 있다."

## Clarifications

### Session 2026-01-15
- Q: How should the single follow-up question and reply be stored? → A: Option B: Fields on CoachingSession (strictly enforces 1-QA limit).
- Q: What data format should be persisted for the mentor's drawing feedback? → A: Option A: Flattened Image URL only (no re-editing of strokes).
- Q: How to simulate Auto-Refund in Phase 1 (frontend-only)? → A: Option A: Lazy Evaluation on Data Fetch (service updates state if deadline passed).
- Q: Primary visual method for comparing feedback? → A: Option C: Both Toggle and Opacity Slider (best flexibility).
- Q: Refund policy for missed follow-up deadline? → A: Option A: Full Refund (maintains SLA integrity).

## User Scenarios & Testing

### User Story 1 - Request Coaching (Priority: P1)

As a Student, I want to select a mentor and upload my artwork with a question so that I can receive professional feedback.

**Why this priority**: Core entry point of the feature. Without this, no coaching can happen.

**Independent Test**: Can be tested by mocking a student account and mentor list, submitting a form, and verifying credit deduction and database record creation.

**Acceptance Scenarios**:

1. **Given** a Student with sufficient credits, **When** they upload an image, select a mentor, and submit a question, **Then** credits are deducted and a new session is created with a 24-hour timer.
2. **Given** a Student with insufficient credits, **When** they try to submit, **Then** an error message is displayed and the process is blocked.

---

### User Story 2 - Mentor Feedback with Canvas (Priority: P1)

As a Mentor, I want to view student requests and use drawing tools to provide visual feedback directly on their image.

**Why this priority**: The core value proposition of the "coaching" is the visual feedback.

**Independent Test**: Can be tested by mocking a coaching session, accessing the mentor interface, using the canvas tools, and saving the result.

**Acceptance Scenarios**:

1. **Given** a pending coaching request, **When** the Mentor opens the workspace, **Then** they see the student's image and drawing tools (pen, color, undo/redo).
2. **Given** a completed drawing, **When** the Mentor submits the feedback, **Then** the session status updates to "Answered", the 24-hour timer stops, and the 48-hour follow-up timer starts.

---

### User Story 3 - Feedback Comparison (Priority: P2)

As a Student, I want to compare the original image with the mentor's feedback using toggle or overlay controls.

**Why this priority**: Critical for the student to understand the specific improvements suggested.

**Independent Test**: Can be tested with a mock session containing both original and feedback images.

**Acceptance Scenarios**:

1. **Given** a session with feedback, **When** the Student views the result, **Then** they can switch between "Original" and "Feedback" views or adjust an overlay opacity slider.

---

### User Story 4 - Follow-up Question (Priority: P2)

As a Student, I want to ask one additional question after receiving feedback to clarify any doubts.

**Why this priority**: Completes the coaching loop and adds value to the interaction.

**Independent Test**: Can be tested by mocking an "Answered" session and submitting a text comment.

**Acceptance Scenarios**:

1. **Given** an answered session within the 48-hour window, **When** the Student posts a comment, **Then** it is recorded as the single allowed follow-up question.
2. **Given** a session where a follow-up has already been asked, **When** the Student tries to ask another, **Then** the input is disabled.

---

### User Story 5 - Auto-Refund & Expiration (Priority: P3)

As a System, I want to automatically enforce time limits to ensure fairness and service quality.

**Why this priority**: Essential for trust and automated platform management.

**Independent Test**: Can be tested by manipulating timestamps of mock sessions.

**Acceptance Scenarios**:

1. **Given** a pending session that exceeds 24 hours without mentor response, **When** the system checks, **Then** the session is cancelled and credits are refunded to the Student.
2. **Given** an answered session that exceeds 48 hours without a follow-up, **When** the system checks, **Then** the session is marked as "Closed".

### Edge Cases

- **Network Failure**: If upload fails, credits should not be deducted (or should be rolled back).
- **Mentor Unavailability**: If a mentor is inactive, they arguably shouldn't appear in the selection list (out of scope for this specific story but relevant context).
- **Concurrent Actions**: Student cancels request while Mentor is drawing (need to handle state lock or check before submit).

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow Students to select a Mentor and upload an image file (supports JPG, PNG).
- **FR-002**: System MUST deduct credits from the Student's balance immediately upon session creation.
- **FR-003**: System MUST provide a Canvas-based editor for Mentors to draw on the student's image layer.
- **FR-004**: System MUST allow Students to view the feedback image overlaid on the original with opacity control OR toggle between them.
- **FR-005**: System MUST enforce a 24-hour deadline for the Mentor to submit initial feedback.
- **FR-006**: System MUST automatically refund credits and cancel the session if the 24-hour deadline is missed.
- **FR-007**: System MUST allow the Student to submit exactly one text-based follow-up question after receiving feedback.
- **FR-008**: System MUST automatically close the session if no follow-up question is submitted within 48 hours of the feedback.
- **FR-009**: System MUST prevent any further interaction (editing, questioning) once a session is Closed or Refunded.
- **FR-010**: System MUST enforce a 24-hour deadline for the Mentor to reply to the follow-up question.
- **FR-011**: System MUST automatically close the session immediately after the Mentor's follow-up reply.
- **FR-012**: System MUST automatically refund credits if the Mentor fails to reply to the follow-up within the 24-hour deadline.

### Key Entities

- **CoachingSession**:
    - `id`: UUID
    - `studentId`: UUID
    - `mentorId`: UUID
    - `originalImageUrl`: String
    - `initialQuestion`: String
    - `status`: Enum (PENDING, ANSWERED, FOLLOWUP_PENDING, COMPLETED, REFUNDED)
    - `createdAt`: DateTime
    - `deadlineAt`: DateTime (24h from create)
    - `answeredAt`: DateTime
    - `closedAt`: DateTime
    - `followUpQuestion`: String (Optional)
    - `followUpAnswer`: String (Optional)
- **Feedback**:
    - `sessionId`: UUID
    - `feedbackImageUrl`: String
    - `mentorComment`: String
- **CreditTransaction**:
    - `userId`: UUID
    - `amount`: Integer
    - `type`: Enum (USE, REFUND, EARN)
    - `relatedEntityId`: UUID (SessionID)

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of sessions where the mentor fails to reply in 24h are automatically refunded.
- **SC-002**: Image toggle/overlay interaction renders in under 100ms on supported devices.
- **SC-003**: Students can successfully submit a coaching request (upload + payment) in under 3 clicks after selecting a mentor.
- **SC-004**: Canvas tool supports basic drawing (stroke) with no perceptible lag (< 30ms latency) for the mentor.

## Assumptions

- A "Credit" system and "User" (Student/Mentor) system already exist or are mocked.
- Image storage service (or mock) handles file uploads.
- "Canvas" refers to an HTML5 Canvas-like drawing capability in the browser.