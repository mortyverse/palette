'use client';

import React from 'react';
import Link from 'next/link';
import { ExamStatus } from '@/types/mock-exam';
import { ExamWithStatus } from '@/store/mock-exam-store';
import { Button } from '@/components/ui/Button';
import { formatExamDate, formatDuration } from '@/lib/mock-exam/utils';

interface ExamCardProps {
  exam: ExamWithStatus;
  showActions?: boolean;
  isMentor?: boolean;
}

const statusConfig: Record<ExamStatus, { label: string; className: string }> = {
  SCHEDULED: { label: '예정', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: '진행중', className: 'bg-green-100 text-green-800' },
  ENDED: { label: '종료', className: 'bg-gray-100 text-gray-800' },
  COMPLETED: { label: '채점완료', className: 'bg-purple-100 text-purple-800' },
};

export function ExamCard({ exam, showActions = true, isMentor = false }: ExamCardProps) {
  const status = statusConfig[exam.derivedStatus];

  return (
    <div className="border border-[var(--palette-border)] rounded-lg overflow-hidden bg-white hover:border-[var(--palette-gold)] transition-colors">
      {/* Topic Image Preview (blurred if not started) */}
      <div className="relative h-40 bg-gray-100">
        {exam.topicImageUrl ? (
          <img
            src={exam.topicImageUrl}
            alt={exam.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
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
              <p className="text-sm text-gray-500">시작 시간에 공개</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--palette-text)] mb-1 line-clamp-1">
          {exam.title}
        </h3>

        {exam.description && (
          <p className="text-sm text-[var(--palette-muted)] mb-3 line-clamp-2">
            {exam.description}
          </p>
        )}

        <div className="text-xs text-[var(--palette-muted)] space-y-1">
          <p>
            <span className="font-medium">시작:</span> {formatExamDate(exam.startTime)}
          </p>
          <p>
            <span className="font-medium">시간:</span> {formatDuration(exam.startTime, exam.endTime)}
          </p>
        </div>

        {showActions && (
          <div className="mt-4">
            <Link href={`/mock-exam/${exam.id}`}>
              <Button
                variant={exam.derivedStatus === 'IN_PROGRESS' ? 'primary' : 'secondary'}
                className="w-full"
              >
                {isMentor
                  ? exam.derivedStatus === 'ENDED' || exam.derivedStatus === 'COMPLETED'
                    ? '채점하기'
                    : '상세보기'
                  : exam.derivedStatus === 'IN_PROGRESS'
                  ? '입장하기'
                  : exam.derivedStatus === 'SCHEDULED'
                  ? '대기하기'
                  : '결과보기'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
