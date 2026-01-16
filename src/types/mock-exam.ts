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