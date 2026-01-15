'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { coachingService } from '@/lib/coaching/mock-coaching.service';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';
import { CoachingSession, SessionStatus } from '@/types/coaching';
import { Button } from '@/components/ui/Button';
import { MentorWorkspace } from '@/components/coaching/MentorWorkspace';
import { FeedbackViewer } from '@/components/coaching/FeedbackViewer';
import { FollowUpSection } from '@/components/coaching/FollowUpSection';

function formatTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return '만료됨';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}일 ${hours % 24}시간 남음`;
  }

  return `${hours}시간 ${minutes}분 남음`;
}

function getStatusInfo(status: SessionStatus) {
  switch (status) {
    case SessionStatus.PENDING:
      return {
        label: '대기중',
        description: '멘토의 피드백을 기다리고 있습니다.',
        icon: Clock,
        color: 'text-yellow-600 bg-yellow-50',
      };
    case SessionStatus.ANSWERED:
      return {
        label: '피드백 완료',
        description: '멘토의 피드백이 도착했습니다!',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50',
      };
    case SessionStatus.FOLLOWUP_PENDING:
      return {
        label: '추가 답변 대기',
        description: '멘토의 추가 답변을 기다리고 있습니다.',
        icon: Clock,
        color: 'text-blue-600 bg-blue-50',
      };
    case SessionStatus.COMPLETED:
      return {
        label: '완료',
        description: '코칭이 성공적으로 완료되었습니다.',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50',
      };
    case SessionStatus.REFUNDED:
      return {
        label: '환불됨',
        description: '기한 내 응답이 없어 크레딧이 환불되었습니다.',
        icon: AlertCircle,
        color: 'text-orange-600 bg-orange-50',
      };
    case SessionStatus.CLOSED:
      return {
        label: '종료',
        description: '세션이 자동으로 종료되었습니다.',
        icon: XCircle,
        color: 'text-gray-600 bg-gray-50',
      };
  }
}

export default function CoachingSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const isWorkspaceMode = searchParams.get('mode') === 'workspace';
  const hydrated = useHydration();
  const { user, isAuthenticated } = useAuthStore();
  const [session, setSession] = useState<CoachingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated || !sessionId) return;

    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const data = await coachingService.getSessionById(sessionId);
        if (!data) {
          setError('세션을 찾을 수 없습니다.');
        } else {
          setSession(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '세션을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [hydrated, sessionId]);

  if (!hydrated || isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-gray-200 rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-[1000px] mx-auto px-8 py-16 text-center">
        <h1
          className="text-[2rem] font-normal text-[var(--palette-text)] mb-4"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          로그인이 필요합니다
        </h1>
        <Link href="/login">
          <Button variant="primary">로그인하기</Button>
        </Link>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-[1000px] mx-auto px-8 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1
          className="text-[2rem] font-normal text-[var(--palette-text)] mb-4"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          {error || '세션을 찾을 수 없습니다'}
        </h1>
        <Link href="/coaching/request">
          <Button variant="primary">새 코칭 요청하기</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(session.status);
  const StatusIcon = statusInfo.icon;
  const isStudent = user?.id === session.studentId;
  const isMentor = user?.id === session.mentorId;

  const handleFeedbackSubmit = async (feedbackImageUrl: string, comment: string) => {
    setIsSubmitting(true);
    try {
      await coachingService.submitFeedback(sessionId, {
        feedbackImageUrl,
        comment,
      });
      // Refresh session data
      const updatedSession = await coachingService.getSessionById(sessionId);
      if (updatedSession) {
        setSession(updatedSession);
      }
      // Redirect back to normal view
      router.push(`/coaching/${sessionId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFollowUpQuestion = async (question: string) => {
    setIsSubmitting(true);
    try {
      await coachingService.submitFollowUp(sessionId, question);
      const updatedSession = await coachingService.getSessionById(sessionId);
      if (updatedSession) {
        setSession(updatedSession);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFollowUpAnswer = async (answer: string) => {
    setIsSubmitting(true);
    try {
      await coachingService.replyToFollowUp(sessionId, answer);
      const updatedSession = await coachingService.getSessionById(sessionId);
      if (updatedSession) {
        setSession(updatedSession);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check access permission
  if (!isStudent && !isMentor) {
    return (
      <div className="max-w-[1000px] mx-auto px-8 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1
          className="text-[2rem] font-normal text-[var(--palette-text)] mb-4"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          접근 권한이 없습니다
        </h1>
        <p className="text-[var(--palette-muted)] mb-8">
          이 세션에 대한 접근 권한이 없습니다.
        </p>
      </div>
    );
  }

  // Mentor Workspace Mode
  if (isWorkspaceMode && isMentor && session.status === SessionStatus.PENDING) {
    return (
      <div className="max-w-[900px] mx-auto px-8 py-16">
        <div className="mb-8">
          <Link
            href={`/coaching/${sessionId}`}
            className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-gold)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            세션 상세로 돌아가기
          </Link>
        </div>

        <div className="mb-8">
          <h1
            className="text-[2rem] font-normal text-[var(--palette-text)] mb-2"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            피드백 작성
          </h1>
          <p className="text-[var(--palette-muted)]">
            학생의 작품 위에 직접 그려서 피드백을 제공해주세요.
          </p>
        </div>

        <MentorWorkspace
          originalImageUrl={session.originalImageUrl}
          studentQuestion={session.initialQuestion}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-16">
      <div className="mb-8">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-gold)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          갤러리로 돌아가기
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.color} mb-4`}>
          <StatusIcon className="h-4 w-4" />
          <span className="font-medium">{statusInfo.label}</span>
        </div>
        <h1
          className="text-[2rem] font-normal text-[var(--palette-text)] mb-2"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          1:1 코칭 세션
        </h1>
        <p className="text-[var(--palette-muted)]">{statusInfo.description}</p>

        {/* Show deadline for active sessions */}
        {[SessionStatus.PENDING, SessionStatus.ANSWERED, SessionStatus.FOLLOWUP_PENDING].includes(session.status) && (
          <p className="text-sm mt-2 text-[var(--palette-muted)]">
            <Clock className="h-4 w-4 inline mr-1" />
            {formatTimeRemaining(new Date(session.deadlineAt))}
          </p>
        )}
      </div>

      {/* Content - Use FeedbackViewer for answered sessions, grid for pending */}
      {session.feedback && [SessionStatus.ANSWERED, SessionStatus.FOLLOWUP_PENDING, SessionStatus.COMPLETED, SessionStatus.CLOSED].includes(session.status) ? (
        <div className="space-y-8">
          {/* Question */}
          <div>
            <h2 className="text-lg font-semibold mb-2">질문</h2>
            <p className="text-[var(--palette-text)] bg-[var(--palette-card)] p-4 rounded-lg border border-[var(--palette-border)]">
              {session.initialQuestion}
            </p>
          </div>

          {/* Feedback Viewer with comparison */}
          <div>
            <h2 className="text-lg font-semibold mb-4">멘토 피드백</h2>
            <FeedbackViewer
              originalImageUrl={session.originalImageUrl}
              feedbackImageUrl={session.feedback.feedbackImageUrl}
              comment={session.feedback.comment}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Image */}
          <div>
            <h2 className="text-lg font-semibold mb-4">원본 작품</h2>
            <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={session.originalImageUrl}
                alt="Original artwork"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Question & Feedback */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">질문</h2>
              <p className="text-[var(--palette-text)] bg-[var(--palette-card)] p-4 rounded-lg border border-[var(--palette-border)]">
                {session.initialQuestion}
              </p>
            </div>

          {/* Student Actions */}
          {isStudent && session.status === SessionStatus.PENDING && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                멘토의 피드백을 기다리고 있습니다. 24시간 내에 응답이 없으면 자동으로 환불됩니다.
              </p>
            </div>
          )}

          {/* Mentor Actions - Will show workspace link when mentor is viewing PENDING session */}
          {isMentor && session.status === SessionStatus.PENDING && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-4">
                  학생이 피드백을 기다리고 있습니다. 그림 위에 직접 그려서 피드백을 제공해주세요.
                </p>
                <Link href={`/coaching/${session.id}?mode=workspace`}>
                  <Button variant="primary" className="w-full">
                    피드백 작성하기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Follow-up Section - Interactive component for asking/answering follow-up */}
      {[SessionStatus.ANSWERED, SessionStatus.FOLLOWUP_PENDING, SessionStatus.COMPLETED].includes(session.status) && (
        <div className="mt-8">
          <FollowUpSection
            sessionStatus={session.status}
            existingFollowUp={session.followUp}
            isStudent={isStudent}
            isMentor={isMentor}
            onSubmitQuestion={handleSubmitFollowUpQuestion}
            onSubmitAnswer={handleSubmitFollowUpAnswer}
          />
        </div>
      )}
    </div>
  );
}
