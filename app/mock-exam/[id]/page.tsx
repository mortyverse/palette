'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMockExamStore } from '@/store/mock-exam-store';
import { useAuthStore } from '@/store/auth-store';
import { ExamTimer } from '@/components/mock-exam/exam-timer';
import { TopicReveal } from '@/components/mock-exam/topic-reveal';
import { SubmissionUploader } from '@/components/mock-exam/submission-uploader';
import { SubmissionGallery } from '@/components/mock-exam/submission-gallery';
import { Button } from '@/components/ui/Button';
import { formatExamDate, formatDuration } from '@/lib/mock-exam/utils';

export default function ExamRoomPage() {
  const params = useParams();
  const examId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const {
    currentExam,
    isLoading,
    error,
    hasJoined,
    submissions,
    loadExam,
    joinExam,
    checkJoinStatus,
    loadMySubmission,
    loadSubmissions,
    refreshExam,
  } = useMockExamStore();

  const isMentor = user?.role === 'mentor';
  const isOwner = isMentor && currentExam?.mentorId === user?.id;

  // Load exam data
  useEffect(() => {
    loadExam(examId);
  }, [examId, loadExam]);

  // Check join status and load submission for students
  useEffect(() => {
    if (currentExam && user && !isMentor) {
      checkJoinStatus(examId, user.id);
      loadMySubmission(examId, user.id);
    }
  }, [currentExam, user, isMentor, examId, checkJoinStatus, loadMySubmission]);

  // Load submissions for mentors
  useEffect(() => {
    if (currentExam && isOwner) {
      loadSubmissions(examId);
    }
  }, [currentExam, isOwner, examId, loadSubmissions]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshExam();
      if (user && !isMentor) {
        loadMySubmission(examId, user.id);
      }
      if (isOwner) {
        loadSubmissions(examId);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [examId, user, isMentor, isOwner, refreshExam, loadMySubmission, loadSubmissions]);

  // Auto-join for students when entering the room
  useEffect(() => {
    if (currentExam && user && !isMentor && !hasJoined) {
      joinExam(examId, user.id);
    }
  }, [currentExam, user, isMentor, hasJoined, examId, joinExam]);

  // Loading state
  if (isLoading && !currentExam) {
    return (
      <main className="min-h-screen bg-[var(--palette-bg)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--palette-gold)] mx-auto"></div>
            <p className="text-[var(--palette-muted)] mt-4">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !currentExam) {
    return (
      <main className="min-h-screen bg-[var(--palette-bg)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12 border border-dashed border-[var(--palette-border)] rounded-lg">
            <p className="text-[var(--palette-muted)]">
              {error || '모의고사를 찾을 수 없습니다.'}
            </p>
            <Link href="/mock-exam" className="inline-block mt-4">
              <Button variant="secondary">목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--palette-bg)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Navigation */}
        <Link
          href="/mock-exam"
          className="inline-flex items-center text-[var(--palette-muted)] hover:text-[var(--palette-gold)] transition-colors mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        {/* Header with Timer */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-[var(--palette-text)]">
              {currentExam.title}
            </h1>
            {currentExam.description && (
              <p className="text-[var(--palette-muted)] mt-2">{currentExam.description}</p>
            )}
            <div className="text-sm text-[var(--palette-muted)] mt-3 space-y-1">
              <p>시작: {formatExamDate(currentExam.startTime)}</p>
              <p>시간: {formatDuration(currentExam.startTime, currentExam.endTime)}</p>
            </div>
          </div>

          <ExamTimer
            startTime={currentExam.startTime}
            endTime={currentExam.endTime}
            status={currentExam.derivedStatus}
          />
        </div>

        {/* Topic Reveal */}
        <div className="mb-8">
          <TopicReveal
            topicImageUrl={currentExam.topicImageUrl}
            status={currentExam.derivedStatus}
            title={currentExam.title}
          />
        </div>

        {/* Student View: Submission Uploader */}
        {user && !isMentor && (
          <div className="mb-8">
            <SubmissionUploader
              examId={examId}
              studentId={user.id}
              status={currentExam.derivedStatus}
            />
          </div>
        )}

        {/* Mentor View: Submission Gallery */}
        {isOwner && (
          <div className="mb-8">
            <SubmissionGallery
              examId={examId}
              mentorId={user!.id}
              submissions={submissions}
              examStatus={currentExam.derivedStatus}
            />
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="text-center py-8 border border-dashed border-[var(--palette-border)] rounded-lg">
            <p className="text-[var(--palette-muted)] mb-4">
              시험에 참여하려면 로그인이 필요합니다.
            </p>
            <Link href="/login">
              <Button>로그인</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
