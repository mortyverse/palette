'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useMockExamStore } from '@/store/mock-exam-store';
import { useAuthStore } from '@/store/auth-store';
import { ExamCard } from '@/components/mock-exam/exam-card';
import { Button } from '@/components/ui/Button';
import { initMockExamDataIfEmpty } from '@/lib/mock-exam/utils';

export default function MockExamListPage() {
  const user = useAuthStore((state) => state.user);
  const { exams, isLoading, loadExams, loadUpcomingExams } = useMockExamStore();

  const isMentor = user?.role === 'mentor';

  useEffect(() => {
    // Initialize mock data if needed
    initMockExamDataIfEmpty();

    if (isMentor && user) {
      // Mentors see their hosted exams
      loadExams({ mentorId: user.id });
    } else {
      // Students see upcoming exams
      loadUpcomingExams();
    }
  }, [user, isMentor, loadExams, loadUpcomingExams]);

  // Polling for real-time updates (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMentor && user) {
        loadExams({ mentorId: user.id });
      } else {
        loadUpcomingExams();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, isMentor, loadExams, loadUpcomingExams]);

  return (
    <main className="min-h-screen bg-[var(--palette-bg)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-semibold text-[var(--palette-text)]">
              {isMentor ? '내 모의고사' : '모의고사'}
            </h1>
            <p className="text-[var(--palette-muted)] mt-1">
              {isMentor
                ? '생성한 모의고사를 관리하세요.'
                : '참여 가능한 모의고사를 확인하세요.'}
            </p>
          </div>

          {isMentor && (
            <Link href="/mock-exam/create">
              <Button>+ 모의고사 생성</Button>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading && exams.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--palette-gold)] mx-auto"></div>
            <p className="text-[var(--palette-muted)] mt-4">로딩 중...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && exams.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[var(--palette-border)] rounded-lg">
            <svg
              className="w-12 h-12 mx-auto text-[var(--palette-muted)] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-[var(--palette-muted)]">
              {isMentor
                ? '아직 생성한 모의고사가 없습니다.'
                : '참여 가능한 모의고사가 없습니다.'}
            </p>
            {isMentor && (
              <Link href="/mock-exam/create" className="inline-block mt-4">
                <Button variant="secondary">첫 모의고사 만들기</Button>
              </Link>
            )}
          </div>
        )}

        {/* Exam Grid */}
        {exams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isMentor={isMentor} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
