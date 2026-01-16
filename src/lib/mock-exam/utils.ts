import { MockExam } from '@/types/mock-exam';

const STORAGE_KEYS = {
  EXAMS: 'palette-mock-exams',
  PARTICIPATIONS: 'palette-mock-participations',
  SUBMISSIONS: 'palette-mock-submissions',
  FEEDBACKS: 'palette-mock-feedbacks',
};

/**
 * Clear all mock exam data from localStorage
 */
export function clearMockExamData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Seed initial test data for development
 */
export function seedMockExamData(): void {
  if (typeof window === 'undefined') return;

  const now = new Date();

  // Create some test exams with various states
  const testExams: MockExam[] = [
    {
      id: 'test-exam-1',
      mentorId: 'user-2', // 이멘토
      title: '정물 수채화: 빛과 그림자',
      description: '빛의 방향에 따른 그림자의 변화를 중점적으로 표현해보세요.',
      topicImageUrl: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=1000&auto=format&fit=crop',
      startTime: new Date(now.getTime() + 1000 * 60 * 5).toISOString(), // Starts in 5 minutes
      endTime: new Date(now.getTime() + 1000 * 60 * 65).toISOString(), // 1 hour duration
      status: 'SCHEDULED',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // Created 1 hour ago
    },
    {
      id: 'test-exam-2',
      mentorId: 'user-2',
      title: '인체 드로잉: 손의 표정',
      description: '다양한 각도에서의 손을 관찰하고 그려보세요.',
      topicImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      startTime: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // Started 30 mins ago
      endTime: new Date(now.getTime() + 1000 * 60 * 90).toISOString(), // Ends in 90 mins
      status: 'SCHEDULED', // Will be derived as IN_PROGRESS
      createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'test-exam-3',
      mentorId: 'user-2',
      title: '풍경화 스케치',
      description: '자연 풍경을 빠르게 스케치해봅시다.',
      topicImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop',
      startTime: new Date(now.getTime() - 1000 * 60 * 180).toISOString(), // Started 3 hours ago
      endTime: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // Ended 1 hour ago
      status: 'SCHEDULED', // Will be derived as ENDED
      createdAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(testExams));
  localStorage.setItem(STORAGE_KEYS.PARTICIPATIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify([]));
}

/**
 * Check if mock exam data exists in localStorage
 */
export function hasMockExamData(): boolean {
  if (typeof window === 'undefined') return false;
  const exams = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return exams !== null && exams !== '[]';
}

/**
 * Initialize mock data if it doesn't exist
 */
export function initMockExamDataIfEmpty(): void {
  if (!hasMockExamData()) {
    seedMockExamData();
  }
}

/**
 * Format duration between two dates as human-readable string
 */
export function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const durationMs = end - start;

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  } else if (hours > 0) {
    return `${hours}시간`;
  } else {
    return `${minutes}분`;
  }
}

/**
 * Format date for display
 */
export function formatExamDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
