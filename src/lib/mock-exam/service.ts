import { MockExam, ExamParticipation, ExamSubmission, ExamFeedback, ExamStatus } from '@/types/mock-exam';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  EXAMS: 'palette-mock-exams',
  PARTICIPATIONS: 'palette-mock-participations',
  SUBMISSIONS: 'palette-mock-submissions',
  FEEDBACKS: 'palette-mock-feedbacks',
};

/**
 * MockExamService - LocalStorage-based service for Phase 1
 * All operations persist to localStorage to support cross-tab testing.
 */
class MockExamService {
  // --- LocalStorage Helpers ---

  private get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Server Time Simulation ---

  /**
   * Returns current "server time" as timestamp.
   * In Phase 1, this is just Date.now() but can be offset for testing.
   */
  getServerTime(): number {
    return Date.now();
  }

  /**
   * Calculate derived status based on server time
   */
  private calculateStatus(exam: Pick<MockExam, 'status' | 'startTime' | 'endTime'>): ExamStatus {
    const now = this.getServerTime();
    const startTime = new Date(exam.startTime).getTime();
    const endTime = new Date(exam.endTime).getTime();

    if (exam.status === 'COMPLETED') return 'COMPLETED';
    if (now < startTime) return 'SCHEDULED';
    if (now >= startTime && now < endTime) return 'IN_PROGRESS';
    return 'ENDED';
  }

  /**
   * Get raw exam data from storage (without topic hiding)
   */
  private getRawExamById(id: string): MockExam | null {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);
    return exams.find(e => e.id === id) || null;
  }

  // --- Exam CRUD ---

  /**
   * Create a new mock exam (Mentor only)
   */
  createExam(data: {
    mentorId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    topicImageUrl: string;
  }): MockExam {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);

    const newExam: MockExam = {
      id: uuidv4(),
      mentorId: data.mentorId,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      topicImageUrl: data.topicImageUrl,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    exams.push(newExam);
    this.set(STORAGE_KEYS.EXAMS, exams);
    return newExam;
  }

  /**
   * Get all exams (optionally filtered by status)
   */
  listExams(filter?: { status?: ExamStatus; mentorId?: string }): (MockExam & { derivedStatus: ExamStatus })[] {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);

    return exams
      .map(exam => ({
        ...exam,
        derivedStatus: this.calculateStatus(exam),
      }))
      .filter(exam => {
        if (filter?.status && exam.derivedStatus !== filter.status) return false;
        if (filter?.mentorId && exam.mentorId !== filter.mentorId) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get exam by ID with conditional topic hiding
   * The topicImageUrl is only returned if the exam has started
   */
  getExamById(id: string): (Omit<MockExam, 'topicImageUrl'> & { derivedStatus: ExamStatus; topicImageUrl?: string }) | null {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);
    const exam = exams.find(e => e.id === id);
    if (!exam) return null;

    const derivedStatus = this.calculateStatus(exam);
    const now = this.getServerTime();
    const startTime = new Date(exam.startTime).getTime();

    // Hide topic image until start time (anti-cheating)
    const topicImageUrl = now >= startTime ? exam.topicImageUrl : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { topicImageUrl: _, ...examWithoutTopic } = exam;

    return {
      ...examWithoutTopic,
      derivedStatus,
      topicImageUrl,
    };
  }

  /**
   * Get upcoming exams for students (SCHEDULED or IN_PROGRESS)
   */
  getUpcomingExams(): (Omit<MockExam, 'topicImageUrl'> & { derivedStatus: ExamStatus; topicImageUrl?: string })[] {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);
    const now = this.getServerTime();

    return exams
      .map(exam => {
        const derivedStatus = this.calculateStatus(exam);
        const startTime = new Date(exam.startTime).getTime();
        const topicImageUrl = now >= startTime ? exam.topicImageUrl : undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { topicImageUrl: _, ...examWithoutTopic } = exam;
        return { ...examWithoutTopic, derivedStatus, topicImageUrl };
      })
      .filter(exam => exam.derivedStatus === 'SCHEDULED' || exam.derivedStatus === 'IN_PROGRESS')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  // --- Participation ---

  /**
   * Join an exam (Student auto-join)
   */
  joinExam(examId: string, studentId: string): ExamParticipation {
    const participations = this.get<ExamParticipation>(STORAGE_KEYS.PARTICIPATIONS);

    // Check if already joined
    const existing = participations.find(p => p.examId === examId && p.studentId === studentId);
    if (existing) return existing;

    const newParticipation: ExamParticipation = {
      examId,
      studentId,
      joinedAt: new Date().toISOString(),
    };

    participations.push(newParticipation);
    this.set(STORAGE_KEYS.PARTICIPATIONS, participations);
    return newParticipation;
  }

  /**
   * Check if user has joined an exam
   */
  hasJoined(examId: string, studentId: string): boolean {
    const participations = this.get<ExamParticipation>(STORAGE_KEYS.PARTICIPATIONS);
    return participations.some(p => p.examId === examId && p.studentId === studentId);
  }

  /**
   * Get participants for an exam
   */
  getParticipants(examId: string): ExamParticipation[] {
    const participations = this.get<ExamParticipation>(STORAGE_KEYS.PARTICIPATIONS);
    return participations.filter(p => p.examId === examId);
  }

  // --- Submissions ---

  /**
   * Submit work (Student only, during exam time)
   */
  submitWork(data: {
    examId: string;
    studentId: string;
    imageUrl: string;
  }): ExamSubmission {
    const exam = this.getRawExamById(data.examId);
    if (!exam) throw new Error('Exam not found');

    // Validate time window
    const derivedStatus = this.calculateStatus(exam);
    if (derivedStatus !== 'IN_PROGRESS') {
      throw new Error('Cannot submit: exam is not in progress');
    }

    const submissions = this.get<ExamSubmission>(STORAGE_KEYS.SUBMISSIONS);

    // Check if already submitted (1 submission per student)
    const existing = submissions.find(s => s.examId === data.examId && s.studentId === data.studentId);
    if (existing) {
      throw new Error('Already submitted for this exam');
    }

    const newSubmission: ExamSubmission = {
      id: uuidv4(),
      examId: data.examId,
      studentId: data.studentId,
      imageUrl: data.imageUrl,
      submittedAt: new Date().toISOString(),
      feedbackStatus: 'PENDING',
    };

    submissions.push(newSubmission);
    this.set(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newSubmission;
  }

  /**
   * Get all submissions for an exam (Mentor only)
   */
  getSubmissions(examId: string): (ExamSubmission & { feedback?: ExamFeedback })[] {
    const submissions = this.get<ExamSubmission>(STORAGE_KEYS.SUBMISSIONS);
    const feedbacks = this.get<ExamFeedback>(STORAGE_KEYS.FEEDBACKS);

    return submissions
      .filter(s => s.examId === examId)
      .map(s => ({
        ...s,
        feedback: feedbacks.find(f => f.submissionId === s.id),
      }))
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  }

  /**
   * Get current user's submission for an exam
   */
  getMySubmission(examId: string, studentId: string): ExamSubmission | null {
    const submissions = this.get<ExamSubmission>(STORAGE_KEYS.SUBMISSIONS);
    return submissions.find(s => s.examId === examId && s.studentId === studentId) || null;
  }

  // --- Feedback ---

  /**
   * Provide feedback on a submission (Mentor only)
   */
  provideFeedback(data: {
    submissionId: string;
    mentorId: string;
    content: string;
    drawingUrl?: string;
  }): ExamFeedback {
    const submissions = this.get<ExamSubmission>(STORAGE_KEYS.SUBMISSIONS);
    const submission = submissions.find(s => s.id === data.submissionId);
    if (!submission) throw new Error('Submission not found');

    // Get exam to verify mentor ownership
    const exam = this.getExamById(submission.examId);
    if (!exam) throw new Error('Exam not found');
    if (exam.mentorId !== data.mentorId) throw new Error('Not authorized to provide feedback');

    const feedbacks = this.get<ExamFeedback>(STORAGE_KEYS.FEEDBACKS);

    // Check if feedback already exists
    const existing = feedbacks.find(f => f.submissionId === data.submissionId);
    if (existing) throw new Error('Feedback already provided');

    const newFeedback: ExamFeedback = {
      id: uuidv4(),
      submissionId: data.submissionId,
      mentorId: data.mentorId,
      content: data.content,
      drawingUrl: data.drawingUrl,
      createdAt: new Date().toISOString(),
    };

    feedbacks.push(newFeedback);
    this.set(STORAGE_KEYS.FEEDBACKS, feedbacks);

    // Update submission feedback status
    const submissionIndex = submissions.findIndex(s => s.id === data.submissionId);
    if (submissionIndex !== -1) {
      submissions[submissionIndex].feedbackStatus = 'REVIEWED';
      this.set(STORAGE_KEYS.SUBMISSIONS, submissions);
    }

    // Check if exam should be marked as completed
    this.checkExamCompletion(submission.examId);

    return newFeedback;
  }

  /**
   * Check if all submissions have feedback and mark exam as COMPLETED
   */
  private checkExamCompletion(examId: string): void {
    const exams = this.get<MockExam>(STORAGE_KEYS.EXAMS);
    const examIndex = exams.findIndex(e => e.id === examId);
    if (examIndex === -1) return;

    const exam = exams[examIndex];
    const derivedStatus = this.calculateStatus(exam);

    // Only check completion for ENDED exams
    if (derivedStatus !== 'ENDED') return;

    const submissions = this.getSubmissions(examId);

    // Auto-complete if no submissions or all have feedback
    const shouldComplete = submissions.length === 0 || submissions.every(s => s.feedbackStatus === 'REVIEWED');

    if (shouldComplete && exam.status !== 'COMPLETED') {
      exams[examIndex].status = 'COMPLETED';
      this.set(STORAGE_KEYS.EXAMS, exams);
    }
  }

  /**
   * Force check completion for an exam (called on page load or polling)
   */
  refreshExamStatus(examId: string): void {
    this.checkExamCompletion(examId);
  }
}

export const mockExamService = new MockExamService();
