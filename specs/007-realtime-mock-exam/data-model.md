# Data Model: Real-time Mock Exam

## Entities

### 1. MockExam
Represents a scheduled mock exam event.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier |
| `mentorId` | string (UUID) | Yes | Creator (Mentor) ID |
| `title` | string | Yes | Exam title |
| `description` | string | No | Optional instructions |
| `startTime` | string (ISO8601) | Yes | When the exam starts |
| `endTime` | string (ISO8601) | Yes | When the exam ends |
| `topicImageUrl` | string (URL) | Yes | The subject to draw |
| `status` | Enum | Yes | `SCHEDULED` \| `IN_PROGRESS` \| `ENDED` \| `COMPLETED` |
| `createdAt` | string (ISO8601) | Yes | Creation timestamp |

### 2. ExamParticipation
Records a student's intent to participate.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `examId` | string (UUID) | Yes | FK to MockExam |
| `studentId` | string (UUID) | Yes | FK to User (Student) |
| `joinedAt` | string (ISO8601) | Yes | When they registered |

### 3. ExamSubmission
A student's uploaded artwork.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier |
| `examId` | string (UUID) | Yes | FK to MockExam |
| `studentId` | string (UUID) | Yes | FK to User (Student) |
| `imageUrl` | string (URL) | Yes | Uploaded artwork |
| `submittedAt` | string (ISO8601) | Yes | Timestamp of upload |
| `feedbackStatus` | Enum | Yes | `PENDING` \| `REVIEWED` |

### 4. ExamFeedback
Mentor's feedback on a submission.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier |
| `submissionId` | string (UUID) | Yes | FK to ExamSubmission |
| `mentorId` | string (UUID) | Yes | FK to User (Mentor) |
| `content` | string | Yes | Text feedback |
| `drawingUrl` | string (URL) | No | Optional overlay drawing |
| `createdAt` | string (ISO8601) | Yes | Timestamp |

## Relationships

- **MockExam** `1:N` **ExamParticipation**
- **MockExam** `1:N` **ExamSubmission**
- **ExamSubmission** `1:1` **ExamFeedback** (Initially 1:1 for simplicity, could be 1:N later)
- **User** (Mentor) `1:N` **MockExam**
- **User** (Student) `1:N` **ExamParticipation**

## TypeScript Interfaces

```typescript
export type ExamStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'ENDED' | 'COMPLETED';

export interface MockExam {
  id: string;
  mentorId: string;
  title: string;
  description?: string;
  startTime: string; // ISO Date
  endTime: string;   // ISO Date
  topicImageUrl: string;
  status: ExamStatus;
  createdAt: string;
}

export interface ExamParticipation {
  examId: string;
  studentId: string;
  joinedAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  imageUrl: string;
  submittedAt: string;
  feedbackStatus: 'PENDING' | 'REVIEWED';
}

export interface ExamFeedback {
  id: string;
  submissionId: string;
  mentorId: string;
  content: string;
  drawingUrl?: string;
  createdAt: string;
}
```
