'use client';

import { create } from 'zustand';
import { MockExam, ExamSubmission, ExamFeedback, ExamStatus } from '@/types/mock-exam';
import { mockExamService } from '@/lib/mock-exam/service';

export type ExamWithStatus = Omit<MockExam, 'topicImageUrl'> & { derivedStatus: ExamStatus; topicImageUrl?: string };
export type SubmissionWithFeedback = ExamSubmission & { feedback?: ExamFeedback };

interface MockExamState {
  // Current exam being viewed
  currentExam: ExamWithStatus | null;
  isLoading: boolean;
  error: string | null;

  // Exam list
  exams: ExamWithStatus[];

  // Current user's participation state
  hasJoined: boolean;
  mySubmission: ExamSubmission | null;

  // For mentor view
  submissions: SubmissionWithFeedback[];

  // Actions
  loadExam: (examId: string) => void;
  loadExams: (filter?: { status?: ExamStatus; mentorId?: string }) => void;
  loadUpcomingExams: () => void;
  refreshExam: () => void;

  createExam: (data: {
    mentorId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    topicImageUrl: string;
  }) => MockExam;

  joinExam: (examId: string, studentId: string) => void;
  checkJoinStatus: (examId: string, studentId: string) => void;

  submitWork: (data: { examId: string; studentId: string; imageUrl: string }) => void;
  loadMySubmission: (examId: string, studentId: string) => void;

  loadSubmissions: (examId: string) => void;
  provideFeedback: (data: {
    submissionId: string;
    mentorId: string;
    content: string;
    drawingUrl?: string;
  }) => void;

  clearError: () => void;
  reset: () => void;
}

export const useMockExamStore = create<MockExamState>()((set, get) => ({
  currentExam: null,
  isLoading: false,
  error: null,
  exams: [],
  hasJoined: false,
  mySubmission: null,
  submissions: [],

  loadExam: (examId: string) => {
    set({ isLoading: true, error: null });
    try {
      const exam = mockExamService.getExamById(examId);
      if (!exam) {
        set({ currentExam: null, error: 'Exam not found', isLoading: false });
        return;
      }
      set({ currentExam: exam, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  loadExams: (filter) => {
    set({ isLoading: true, error: null });
    try {
      const exams = mockExamService.listExams(filter);
      set({ exams, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  loadUpcomingExams: () => {
    set({ isLoading: true, error: null });
    try {
      const exams = mockExamService.getUpcomingExams();
      set({ exams, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  refreshExam: () => {
    const { currentExam } = get();
    if (currentExam) {
      mockExamService.refreshExamStatus(currentExam.id);
      const exam = mockExamService.getExamById(currentExam.id);
      set({ currentExam: exam });
    }
  },

  createExam: (data) => {
    set({ isLoading: true, error: null });
    try {
      const exam = mockExamService.createExam(data);
      // Refresh the exam list
      const exams = mockExamService.listExams({ mentorId: data.mentorId });
      set({ exams, isLoading: false });
      return exam;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  joinExam: (examId: string, studentId: string) => {
    try {
      mockExamService.joinExam(examId, studentId);
      set({ hasJoined: true });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  checkJoinStatus: (examId: string, studentId: string) => {
    const hasJoined = mockExamService.hasJoined(examId, studentId);
    set({ hasJoined });
  },

  submitWork: (data) => {
    set({ isLoading: true, error: null });
    try {
      const submission = mockExamService.submitWork(data);
      set({ mySubmission: submission, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  loadMySubmission: (examId: string, studentId: string) => {
    const submission = mockExamService.getMySubmission(examId, studentId);
    set({ mySubmission: submission });
  },

  loadSubmissions: (examId: string) => {
    set({ isLoading: true, error: null });
    try {
      const submissions = mockExamService.getSubmissions(examId);
      set({ submissions, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  provideFeedback: (data) => {
    set({ isLoading: true, error: null });
    try {
      mockExamService.provideFeedback(data);
      // Reload submissions to reflect updated feedback status
      const { currentExam } = get();
      if (currentExam) {
        const submissions = mockExamService.getSubmissions(currentExam.id);
        // Refresh exam to check if it's now completed
        mockExamService.refreshExamStatus(currentExam.id);
        const exam = mockExamService.getExamById(currentExam.id);
        set({ submissions, currentExam: exam, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      currentExam: null,
      isLoading: false,
      error: null,
      exams: [],
      hasJoined: false,
      mySubmission: null,
      submissions: [],
    }),
}));
