'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMockExamStore } from '@/store/mock-exam-store';
import { ExamStatus } from '@/types/mock-exam';

interface SubmissionUploaderProps {
  examId: string;
  studentId: string;
  status: ExamStatus;
}

export function SubmissionUploader({ examId, studentId, status }: SubmissionUploaderProps) {
  const { mySubmission, submitWork, isLoading, error, clearError } =
    useMockExamStore();
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isDisabled = status !== 'IN_PROGRESS';
  const hasSubmitted = !!mySubmission;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url || null);
    setFormError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!imageUrl.trim()) {
      setFormError('이미지 URL을 입력해주세요.');
      return;
    }

    try {
      submitWork({
        examId,
        studentId,
        imageUrl: imageUrl.trim(),
      });
      setImageUrl('');
      setPreviewUrl(null);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  // Already submitted
  if (hasSubmitted) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold text-green-800">제출 완료</h3>
        </div>

        <div className="aspect-video bg-white rounded-lg overflow-hidden border border-green-200">
          <img
            src={mySubmission.imageUrl}
            alt="내 제출작"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-sm text-green-700 mt-3">
          제출 시간: {new Date(mySubmission.submittedAt).toLocaleString('ko-KR')}
        </p>

        {mySubmission.feedbackStatus === 'REVIEWED' && (
          <p className="text-sm text-purple-600 mt-1">피드백이 도착했습니다!</p>
        )}
      </div>
    );
  }

  // Exam not in progress
  if (isDisabled) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-gray-600">
          {status === 'SCHEDULED'
            ? '시험이 시작되면 제출할 수 있습니다.'
            : '시험이 종료되어 더 이상 제출할 수 없습니다.'}
        </p>
      </div>
    );
  }

  // Upload form
  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit} className="border border-[var(--palette-border)] rounded-lg p-6">
      <h3 className="font-semibold text-[var(--palette-text)] mb-4">작품 제출</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
            이미지 URL
          </label>
          <Input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/my-artwork.jpg"
            disabled={isLoading}
          />
          <p className="text-xs text-[var(--palette-muted)] mt-1">
            작품 이미지의 URL을 입력하세요. (이미지 호스팅 서비스 사용 권장)
          </p>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-[var(--palette-border)]">
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-full h-full object-contain"
              onError={() => setPreviewUrl(null)}
            />
          </div>
        )}

        {displayError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {displayError}
          </div>
        )}

        <Button type="submit" disabled={isLoading || !imageUrl.trim()} className="w-full">
          {isLoading ? '제출 중...' : '제출하기'}
        </Button>
      </div>
    </form>
  );
}
