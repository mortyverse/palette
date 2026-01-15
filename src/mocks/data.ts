import { Artwork, Comment } from '@/types/gallery';
import { CoachingSession, CreditTransaction } from '@/types/coaching';

// Users with credits
export const MOCK_USERS = [
  { id: 'user-1', name: '김학생', role: 'student', credits: 50 },
  { id: 'user-2', name: '이멘토', role: 'mentor', credits: 0 },
  { id: 'user-3', name: '박학생', role: 'student', credits: 100 },
];

// In-memory store for coaching data
export const COACHING_DATA = {
  sessions: new Map<string, CoachingSession>(),
  transactions: new Map<string, CreditTransaction>(),
  userCredits: new Map<string, number>([
    ['user-1', 50],
    ['user-2', 0],
    ['user-3', 100],
  ]),
};

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    authorId: 'user-1',
    authorName: '김학생',
    authorRole: 'student',
    title: '입시 정물 수채화',
    description: '사과와 항아리를 주제로 한 정물 수채화입니다. 질감 표현에 집중했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-01-10T10:00:00Z',
    likeCount: 15,
    commentCount: 2,
  },
  {
    id: 'art-2',
    authorId: 'user-2',
    authorName: '이멘토',
    authorRole: 'mentor',
    title: '인체 소묘 예시작',
    description: '인체의 구조와 비례를 설명하기 위한 시범작입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-01-11T14:30:00Z',
    likeCount: 42,
    commentCount: 5,
  },
  {
    id: 'art-3',
    authorId: 'user-1',
    authorName: '김학생',
    authorRole: 'student',
    title: '풍경 수채화 연습',
    description: '공원의 풍경을 수채화로 담아보았습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1541450805268-4822a3a71476?q=80&w=1000&auto=format&fit=crop',
    createdAt: '2026-01-12T09:15:00Z',
    likeCount: 8,
    commentCount: 1,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'com-1',
    artworkId: 'art-1',
    authorId: 'user-2',
    authorName: '이멘토',
    authorRole: 'mentor',
    content: '항아리의 양감이 아주 잘 표현되었습니다. 사과의 하이라이트 부분을 조금 더 날카롭게 잡아주면 좋겠네요.',
    createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'com-2',
    artworkId: 'art-1',
    authorId: 'user-3',
    authorName: '박학생',
    authorRole: 'student',
    content: '우와, 색감이 너무 예뻐요! 저도 이렇게 그리고 싶네요.',
    createdAt: '2026-01-10T12:30:00Z',
  },
];
