```typescript
import { CoachingSession, SessionStatus } from '@/types/coaching';

export interface CreateSessionDTO {
  studentId: string;
  mentorId: string;
  originalImageUrl: string;
  initialQuestion: string;
}

export interface SubmitFeedbackDTO {
  sessionId: string;
  feedbackImageUrl: string;
  comment: string;
}

export interface SubmitFollowUpDTO {
  sessionId: string;
  question: string;
}

export interface ReplyFollowUpDTO {
  sessionId: string;
  answer: string;
}

export interface ICoachingService {
  /**
   * Creates a new coaching session and deducts credits.
   * Throws error if insufficient credits.
   */
  createSession(data: CreateSessionDTO): Promise<CoachingSession>;

  /**
   * Retrieves a session by ID.
   * Trigger lazy evaluation of timeouts (updates status if expired).
   */
  getSessionById(id: string): Promise<CoachingSession | null>;

  /**
   * Retrieves all sessions for a user (student or mentor).
   * Trigger lazy evaluation of timeouts.
   */
  getUserSessions(userId: string, role: 'student' | 'mentor'): Promise<CoachingSession[]>;

  /**
   * Mentor submits feedback.
   * Updates status to ANSWERED.
   */
  submitFeedback(data: SubmitFeedbackDTO): Promise<CoachingSession>;

  /**
   * Student submits a follow-up question.
   * Updates status to FOLLOWUP_PENDING.
   */
  submitFollowUp(data: SubmitFollowUpDTO): Promise<CoachingSession>;

  /**
   * Mentor replies to follow-up.
   * Updates status to COMPLETED.
   */
  replyToFollowUp(data: ReplyFollowUpDTO): Promise<CoachingSession>;
  
  /**
   * Calculates refund amount if any.
   * (Internal logic exposed for UI if needed)
   */
  calculateRefund(sessionId: string): Promise<number>;
}
```
