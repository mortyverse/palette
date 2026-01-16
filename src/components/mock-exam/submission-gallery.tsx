'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FeedbackModal } from './feedback-modal';
import { SubmissionWithFeedback } from '@/store/mock-exam-store';
import { ExamStatus } from '@/types/mock-exam';

interface SubmissionGalleryProps {
  examId: string;
  mentorId: string;
  submissions: SubmissionWithFeedback[];
  examStatus: ExamStatus;
}

export function SubmissionGallery({
  mentorId,
  submissions,
  examStatus,
}: SubmissionGalleryProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithFeedback | null>(null);

  const pendingCount = submissions.filter((s) => s.feedbackStatus === 'PENDING').length;
  const reviewedCount = submissions.filter((s) => s.feedbackStatus === 'REVIEWED').length;

  // Show message for in-progress exams
  if (examStatus === 'SCHEDULED' || examStatus === 'IN_PROGRESS') {
    return (
      <div className="border border-[var(--palette-border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--palette-text)] mb-4">제출 현황</h3>

        <div className="text-center py-8">
          <p className="text-[var(--palette-muted)]">
            {examStatus === 'SCHEDULED'
              ? '시험이 시작되면 제출 현황을 확인할 수 있습니다.'
              : `현재 ${submissions.length}명이 제출했습니다. 시험이 종료되면 채점할 수 있습니다.`}
          </p>

          {submissions.length > 0 && (
            <div className="mt-4 text-sm text-[var(--palette-muted)]">
              제출 완료: {submissions.length}명
            </div>
          )}
        </div>
      </div>
    );
  }

  // No submissions
  if (submissions.length === 0) {
    return (
      <div className="border border-[var(--palette-border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--palette-text)] mb-4">제출 현황</h3>

        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-[var(--palette-muted)] mb-3"
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
          <p className="text-[var(--palette-muted)]">제출된 작품이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--palette-border)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--palette-text)]">제출 현황</h3>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-[var(--palette-muted)]">
            총 <span className="font-medium text-[var(--palette-text)]">{submissions.length}</span>건
          </span>
          {pendingCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              대기 {pendingCount}
            </span>
          )}
          {reviewedCount > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              완료 {reviewedCount}
            </span>
          )}
        </div>
      </div>

      {/* Completion Message */}
      {examStatus === 'COMPLETED' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-700 text-sm">
          모든 피드백이 완료되어 시험이 종료되었습니다.
        </div>
      )}

      {/* Submissions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className={`relative border rounded-lg overflow-hidden ${
              submission.feedbackStatus === 'REVIEWED'
                ? 'border-green-200'
                : 'border-[var(--palette-border)]'
            }`}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100">
              <img
                src={submission.imageUrl}
                alt="제출작"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  submission.feedbackStatus === 'REVIEWED'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}
              >
                {submission.feedbackStatus === 'REVIEWED' ? '완료' : '대기'}
              </span>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-xs text-[var(--palette-muted)]">
                {new Date(submission.submittedAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              {submission.feedbackStatus === 'REVIEWED' && submission.feedback ? (
                <p className="text-sm text-green-700 mt-2 line-clamp-2">
                  {submission.feedback.content}
                </p>
              ) : (
                <Button
                  variant="primary"
                  className="w-full mt-2 text-sm py-1"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  피드백 작성
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {selectedSubmission && (
        <FeedbackModal
          submission={selectedSubmission}
          mentorId={mentorId}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
