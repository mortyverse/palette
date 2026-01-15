# Data Model: Coaching System

## Entities

### 1. CoachingSession
Represents a single 1:1 coaching interaction between a Student and a Mentor.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Unique identifier |
| `studentId` | `string` (UUID) | Yes | ID of the student requesting coaching |
| `mentorId` | `string` (UUID) | Yes | ID of the mentor selected |
| `originalImageUrl` | `string` (URL) | Yes | URL of the student's uploaded artwork |
| `initialQuestion` | `string` | Yes | The student's primary question |
| `status` | `SessionStatus` | Yes | Current state of the session |
| `createdAt` | `Date` (ISO) | Yes | Timestamp of creation (starts 24h timer) |
| `deadlineAt` | `Date` (ISO) | Yes | `createdAt` + 24 hours |
| `answeredAt` | `Date` (ISO) | No | Timestamp when mentor submitted feedback |
| `closedAt` | `Date` (ISO) | No | Timestamp when session was finalized |
| `feedback` | `Feedback` | No | Nested feedback object (if answered) |
| `followUp` | `FollowUp` | No | Nested follow-up interaction (if occurred) |

### 2. Feedback
The mentor's response to the coaching request.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `feedbackImageUrl` | `string` (URL) | Yes | URL of the image with mentor's drawing |
| `comment` | `string` | Yes | Mentor's text explanation |

### 3. FollowUp
The single Q&A exchange allowed after feedback.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | `string` | Yes | Student's follow-up question |
| `questionAt` | `Date` (ISO) | Yes | Timestamp of the question |
| `answer` | `string` | No | Mentor's reply |
| `answerAt` | `Date` (ISO) | No | Timestamp of the reply |

### 4. CreditTransaction (Mock Support)
Tracks credit usage and refunds.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Unique identifier |
| `userId` | `string` (UUID) | Yes | User involved |
| `amount` | `number` | Yes | Amount (negative for use, positive for refund) |
| `type` | `TransactionType` | Yes | `USE`, `REFUND`, `EARN` |
| `sessionId` | `string` (UUID) | Yes | Related session ID |
| `createdAt` | `Date` (ISO) | Yes | Timestamp |

## Enums

### SessionStatus
- `PENDING`: Waiting for mentor feedback (timer running).
- `ANSWERED`: Feedback provided, waiting for student follow-up (48h timer).
- `FOLLOWUP_PENDING`: Student asked follow-up, waiting for mentor reply (24h timer).
- `COMPLETED`: Session finished normally.
- `REFUNDED`: Mentor missed deadline, credits returned.
- `CLOSED`: Auto-closed after 48h of inactivity.

## State Transitions

1. **Create**: `null` -> `PENDING` (Credits deducted)
2. **Mentor Answer**: `PENDING` -> `ANSWERED` (Stops refund timer, starts follow-up timer)
3. **Timeout (Mentor)**: `PENDING` -> `REFUNDED` (System action, credits returned)
4. **Student Follow-up**: `ANSWERED` -> `FOLLOWUP_PENDING` (Stops follow-up timer)
5. **Timeout (Student)**: `ANSWERED` -> `CLOSED` (System action, no refund)
6. **Mentor Reply**: `FOLLOWUP_PENDING` -> `COMPLETED`
7. **Timeout (Mentor Reply)**: `FOLLOWUP_PENDING` -> `REFUNDED` (Credits returned)

## Validation Rules

1. **File Upload**: Max 10MB, JPG/PNG only.
2. **Initial Question**: Min 10 chars, Max 500 chars.
3. **Follow-up Question**: Min 10 chars, Max 300 chars.
