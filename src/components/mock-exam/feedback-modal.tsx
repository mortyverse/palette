'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useMockExamStore, SubmissionWithFeedback } from '@/store/mock-exam-store';

interface FeedbackModalProps {
  submission: SubmissionWithFeedback;
  mentorId: string;
  onClose: () => void;
}

export function FeedbackModal({ submission, mentorId, onClose }: FeedbackModalProps) {
  const { provideFeedback, isLoading, error, clearError } = useMockExamStore();
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!content.trim()) {
      setFormError('피드백 내용을 입력해주세요.');
      return;
    }

    try {
      provideFeedback({
        submissionId: submission.id,
        mentorId,
        content: content.trim(),
      });
      onClose();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const displayError = formError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--palette-border)]">
          <h2 className="text-lg font-semibold text-[var(--palette-text)]">피드백 작성</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Submission Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={submission.imageUrl}
              alt="제출작"
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-sm text-[var(--palette-muted)] mb-4">
            제출 시간: {new Date(submission.submittedAt).toLocaleString('ko-KR')}
          </p>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
                피드백 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="학생에게 전달할 피드백을 작성해주세요..."
                className="w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] border-[var(--palette-border)] min-h-[120px] resize-y"
                required
              />
            </div>

            {displayError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
                {displayError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading || !content.trim()}>
                {isLoading ? '저장 중...' : '피드백 저장'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
