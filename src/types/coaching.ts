/**
 * Coaching System Types
 * Defines all data structures for the 1:1 coaching feature
 */

export enum SessionStatus {
  PENDING = "PENDING",
  ANSWERED = "ANSWERED",
  FOLLOWUP_PENDING = "FOLLOWUP_PENDING",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
  CLOSED = "CLOSED",
}

export enum TransactionType {
  USE = "USE",
  REFUND = "REFUND",
  EARN = "EARN",
}

export interface Feedback {
  feedbackImageUrl: string;
  comment: string;
}

export interface FollowUp {
  question: string;
  questionAt: Date;
  answer?: string;
  answerAt?: Date;
}

export interface CoachingSession {
  id: string;
  studentId: string;
  mentorId: string;
  originalImageUrl: string;
  initialQuestion: string;
  status: SessionStatus;
  createdAt: Date;
  deadlineAt: Date;
  answeredAt?: Date;
  closedAt?: Date;
  feedback?: Feedback;
  followUp?: FollowUp;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  sessionId: string;
  createdAt: Date;
}
