/**
 * Coaching Service Interface
 * Defines the contract for coaching operations
 */

import {
  CoachingSession,
  Feedback,
  CreditTransaction,
} from "@/types/coaching";

export interface ICoachingService {
  // Session Management
  createSession(
    studentId: string,
    mentorId: string,
    originalImageUrl: string,
    initialQuestion: string,
    creditCost: number
  ): Promise<CoachingSession>;

  getSessionById(sessionId: string): Promise<CoachingSession | null>;

  getUserSessions(userId: string): Promise<CoachingSession[]>;

  // Mentor Feedback
  submitFeedback(
    sessionId: string,
    feedback: Feedback
  ): Promise<CoachingSession>;

  // Follow-up Q&A
  submitFollowUp(sessionId: string, question: string): Promise<CoachingSession>;

  replyToFollowUp(sessionId: string, answer: string): Promise<CoachingSession>;

  // Credit Management
  getCreditBalance(userId: string): Promise<number>;

  getTransactionHistory(userId: string): Promise<CreditTransaction[]>;
}
