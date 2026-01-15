/**
 * Mock Coaching Service Implementation
 * Simulates all coaching operations and lazy-evaluates timeouts/refunds
 */

import { ICoachingService } from "./coaching-service.interface";
import {
  CoachingSession,
  Feedback,
  SessionStatus,
  CreditTransaction,
  TransactionType,
} from "@/types/coaching";
import { COACHING_DATA } from "@/mocks/data";
import { v4 as uuidv4 } from "uuid";

export class MockCoachingService implements ICoachingService {
  // Session Management

  async createSession(
    studentId: string,
    mentorId: string,
    originalImageUrl: string,
    initialQuestion: string,
    creditCost: number
  ): Promise<CoachingSession> {
    // Check student has enough credits
    const studentCredits = COACHING_DATA.userCredits.get(studentId) || 0;
    if (studentCredits < creditCost) {
      throw new Error("Insufficient credits");
    }

    // Deduct credits
    COACHING_DATA.userCredits.set(studentId, studentCredits - creditCost);

    // Create session
    const sessionId = uuidv4();
    const now = new Date();
    const deadlineAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const session: CoachingSession = {
      id: sessionId,
      studentId,
      mentorId,
      originalImageUrl,
      initialQuestion,
      status: SessionStatus.PENDING,
      createdAt: now,
      deadlineAt,
    };

    COACHING_DATA.sessions.set(sessionId, session);

    // Record transaction
    const transaction: CreditTransaction = {
      id: uuidv4(),
      userId: studentId,
      amount: -creditCost,
      type: TransactionType.USE,
      sessionId,
      createdAt: now,
    };
    COACHING_DATA.transactions.set(transaction.id, transaction);

    return session;
  }

  async getSessionById(sessionId: string): Promise<CoachingSession | null> {
    const session = COACHING_DATA.sessions.get(sessionId);
    if (!session) return null;

    // Check for timeouts before returning
    this.checkSessionTimeouts(session);
    return COACHING_DATA.sessions.get(sessionId) || null;
  }

  async getUserSessions(userId: string): Promise<CoachingSession[]> {
    const sessions = Array.from(COACHING_DATA.sessions.values()).filter(
      (s) => s.studentId === userId || s.mentorId === userId
    );

    // Check timeouts for all sessions
    sessions.forEach((session) => {
      this.checkSessionTimeouts(session);
    });

    return Array.from(COACHING_DATA.sessions.values()).filter(
      (s) => s.studentId === userId || s.mentorId === userId
    );
  }

  // Mentor Feedback

  async submitFeedback(
    sessionId: string,
    feedback: Feedback
  ): Promise<CoachingSession> {
    const session = COACHING_DATA.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    if (session.status !== SessionStatus.PENDING) {
      throw new Error("Session is not in PENDING status");
    }

    session.feedback = feedback;
    session.status = SessionStatus.ANSWERED;
    session.answeredAt = new Date();

    // Update deadline to 48h from now for follow-up
    session.deadlineAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    COACHING_DATA.sessions.set(sessionId, session);
    return session;
  }

  // Follow-up Q&A

  async submitFollowUp(sessionId: string, question: string): Promise<CoachingSession> {
    const session = COACHING_DATA.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    if (session.status !== SessionStatus.ANSWERED) {
      throw new Error("Session is not in ANSWERED status");
    }

    session.followUp = {
      question,
      questionAt: new Date(),
    };
    session.status = SessionStatus.FOLLOWUP_PENDING;

    // Update deadline to 24h from now for mentor reply
    session.deadlineAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    COACHING_DATA.sessions.set(sessionId, session);
    return session;
  }

  async replyToFollowUp(sessionId: string, answer: string): Promise<CoachingSession> {
    const session = COACHING_DATA.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    if (session.status !== SessionStatus.FOLLOWUP_PENDING) {
      throw new Error("Session is not in FOLLOWUP_PENDING status");
    }

    if (!session.followUp) {
      throw new Error("No follow-up found");
    }

    session.followUp.answer = answer;
    session.followUp.answerAt = new Date();
    session.status = SessionStatus.COMPLETED;
    session.closedAt = new Date();

    COACHING_DATA.sessions.set(sessionId, session);
    return session;
  }

  // Credit Management

  async getCreditBalance(userId: string): Promise<number> {
    return COACHING_DATA.userCredits.get(userId) || 0;
  }

  async getTransactionHistory(userId: string): Promise<CreditTransaction[]> {
    return Array.from(COACHING_DATA.transactions.values()).filter(
      (t) => t.userId === userId
    );
  }

  // Private: Timeout checking (lazy evaluation)

  private checkSessionTimeouts(session: CoachingSession): void {
    const now = new Date();

    // If already finalized, no timeout needed
    if (
      [
        SessionStatus.COMPLETED,
        SessionStatus.REFUNDED,
        SessionStatus.CLOSED,
      ].includes(session.status)
    ) {
      return;
    }

    // Check deadline exceeded
    if (now > session.deadlineAt) {
      if (session.status === SessionStatus.PENDING) {
        // Mentor missed deadline -> refund
        this.applyRefund(session);
        session.status = SessionStatus.REFUNDED;
        session.closedAt = now;
      } else if (session.status === SessionStatus.ANSWERED) {
        // Student didn't ask follow-up within 48h -> close
        session.status = SessionStatus.CLOSED;
        session.closedAt = now;
      } else if (session.status === SessionStatus.FOLLOWUP_PENDING) {
        // Mentor didn't reply to follow-up within 24h -> refund
        this.applyRefund(session);
        session.status = SessionStatus.REFUNDED;
        session.closedAt = now;
      }
      COACHING_DATA.sessions.set(session.id, session);
    }
  }

  private applyRefund(session: CoachingSession): void {
    const creditCost = 10; // Default cost (can be tracked in transaction if needed)
    const studentCredits = COACHING_DATA.userCredits.get(session.studentId) || 0;
    COACHING_DATA.userCredits.set(session.studentId, studentCredits + creditCost);

    // Record refund transaction
    const transaction: CreditTransaction = {
      id: uuidv4(),
      userId: session.studentId,
      amount: creditCost,
      type: TransactionType.REFUND,
      sessionId: session.id,
      createdAt: new Date(),
    };
    COACHING_DATA.transactions.set(transaction.id, transaction);
  }
}

// Singleton instance
export const coachingService = new MockCoachingService();
