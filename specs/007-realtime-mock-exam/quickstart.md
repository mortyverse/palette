# Quickstart: Real-time Mock Exam

## Overview
This feature implements a real-time mock exam system where students can join scheduled exams and submit artwork within a time limit.

## Key Components

### 1. `MockExamService`
The core service managing exam state and "server time" simulation.

```typescript
import { mockExamService } from '@/lib/mock-exam/service';

// Get current server time
const time = mockExamService.getServerTime();

// Create an exam
await mockExamService.createExam({
  title: "Portrait Practice",
  startTime: "2026-01-20T10:00:00Z",
  endTime: "2026-01-20T12:00:00Z",
  topicImageUrl: "..."
});
```

### 2. `useMockExamStore`
Zustand store for reactive UI state.

```typescript
import { useMockExamStore } from '@/store/mock-exam-store';

const { exam, status, timeLeft } = useMockExamStore();
```

### 3. `useServerTime`
Hook to sync UI with simulated server time.

```typescript
import { useServerTime } from '@/hooks/use-server-time';

const serverTime = useServerTime();
// Use this instead of Date.now() for countdowns/validations
```

## Running the Demo

1.  **Login as Mentor**: Go to `/login` (use mock mentor credentials).
2.  **Create Exam**: Navigate to `/mock-exams/create`. Set Start Time to 1 minute from now.
3.  **Switch to Student**: Logout and login as Student (or use Incognito).
4.  **Join Exam**: Go to `/mock-exams`, click "Join".
5.  **Wait**: Watch the countdown. At Start Time, the topic image will appear automatically.
6.  **Submit**: Upload an image before End Time.
7.  **Review**: Switch back to Mentor to see the submission.

## Debugging
- Check `localStorage` keys starting with `palette-mock-` to see persisted data.
- Adjust system clock? No, the `MockService` uses `Date.now()`, so system clock changes affect it. We might add a debug tool to offset "Server Time" if needed.
