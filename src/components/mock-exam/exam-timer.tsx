'use client';

import React from 'react';
import { useTimeRemaining, useServerTime } from '@/hooks/use-server-time';
import { ExamStatus } from '@/types/mock-exam';

interface ExamTimerProps {
  startTime: string;
  endTime: string;
  status: ExamStatus;
}

export function ExamTimer({ startTime, endTime, status }: ExamTimerProps) {
  // For SCHEDULED, count down to start. For IN_PROGRESS, count down to end.
  const targetTime = status === 'SCHEDULED' ? startTime : status === 'IN_PROGRESS' ? endTime : null;
  const { formatted, isExpired } = useTimeRemaining(targetTime);
  const serverTime = useServerTime();

  const getStatusInfo = () => {
    switch (status) {
      case 'SCHEDULED':
        return {
          label: '시작까지',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'IN_PROGRESS':
        return {
          label: '남은 시간',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'ENDED':
        return {
          label: '종료됨',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
      case 'COMPLETED':
        return {
          label: '채점 완료',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        };
      default:
        return {
          label: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const info = getStatusInfo();

  // Show urgency styling when less than 5 minutes remaining
  const isUrgent =
    status === 'IN_PROGRESS' &&
    !isExpired &&
    new Date(endTime).getTime() - serverTime < 5 * 60 * 1000;

  return (
    <div
      className={`inline-flex flex-col items-center px-6 py-4 rounded-lg border ${
        isUrgent
          ? 'bg-red-50 border-red-300'
          : `${info.bgColor} ${info.borderColor}`
      }`}
    >
      <span
        className={`text-xs font-medium uppercase tracking-wider ${
          isUrgent ? 'text-red-600' : info.color
        }`}
      >
        {info.label}
      </span>

      {(status === 'SCHEDULED' || status === 'IN_PROGRESS') && !isExpired ? (
        <span
          className={`font-mono text-3xl font-bold mt-1 ${
            isUrgent ? 'text-red-700 animate-pulse' : info.color
          }`}
        >
          {formatted}
        </span>
      ) : (
        <span className={`text-lg font-semibold mt-1 ${info.color}`}>
          {status === 'ENDED' ? '시험 종료' : status === 'COMPLETED' ? '완료' : '-'}
        </span>
      )}
    </div>
  );
}
