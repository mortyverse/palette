'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MentorSelector, Mentor } from '@/components/coaching/MentorSelector';
import { CoachingRequestForm } from '@/components/coaching/CoachingRequestForm';
import { coachingService } from '@/lib/coaching/mock-coaching.service';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const MOCK_MENTORS: Mentor[] = [
  {
    id: 'user-2',
    name: '이멘토',
    title: '미술 입시 전문 멘토',
    bio: '홍익대 미대 졸업. 10년간 입시 지도 경력으로 500명 이상의 학생을 합격시켰습니다.',
    avatar: '/mentors/mentor1.jpg',
    specialties: ['수채화', '정물화', '인체 드로잉'],
  },
  {
    id: 'mentor-2',
    name: '박선생',
    title: '디자인 전공 멘토',
    bio: '서울대 디자인과 졸업. 현직 브랜드 디자이너로 활동 중입니다.',
    avatar: '/mentors/mentor2.jpg',
    specialties: ['타이포그래피', '컬러 이론', '구도'],
  },
];

const CREDIT_COST = 10;

export default function CoachingRequestPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedMentorId, setSelectedMentorId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  // Fetch credits on mount
  useState(() => {
    if (user?.id) {
      coachingService.getCreditBalance(user.id).then(setCredits);
    }
  });

  const handleSubmit = async (data: {
    mentorId: string;
    imageUrl: string;
    initialQuestion: string;
  }) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const session = await coachingService.createSession(
        user.id,
        data.mentorId,
        data.imageUrl,
        data.initialQuestion,
        CREDIT_COST
      );
      router.push(`/coaching/${session.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="max-w-[800px] mx-auto px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'student') {
    return (
      <div className="max-w-[800px] mx-auto px-8 py-16 text-center">
        <h1
          className="text-[2rem] font-normal text-[var(--palette-text)] mb-4"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          접근 권한이 없습니다
        </h1>
        <p className="text-[var(--palette-muted)] mb-8">
          코칭을 요청하려면 학생 계정으로 로그인해주세요.
        </p>
        <Link href="/login">
          <Button variant="primary">로그인하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-8 py-16">
      <div className="mb-8">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-gold)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          갤러리로 돌아가기
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1
          className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          1:1 코칭 요청
        </h1>
        <p className="text-[var(--palette-muted)] text-lg">
          멘토에게 작품에 대한 직접적인 피드백을 받아보세요.
        </p>
        {credits !== null && (
          <p className="mt-4 text-sm">
            현재 보유 크레딧: <span className="font-bold text-[var(--palette-gold)]">{credits}</span>
            <span className="text-[var(--palette-muted)]"> (요청 비용: {CREDIT_COST} 크레딧)</span>
          </p>
        )}
      </div>

      <div className="space-y-12">
        <MentorSelector
          mentors={MOCK_MENTORS}
          selectedMentorId={selectedMentorId}
          onSelect={setSelectedMentorId}
        />

        <div className="border-t border-[var(--palette-border)] pt-8">
          <h2 className="text-lg font-semibold mb-6">작품 업로드 및 질문</h2>
          <CoachingRequestForm
            mentorId={selectedMentorId}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
