'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMockExamStore } from '@/store/mock-exam-store';
import { useAuthStore } from '@/store/auth-store';

interface ExamCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExamCreationForm({ onSuccess, onCancel }: ExamCreationFormProps) {
  const user = useAuthStore((state) => state.user);
  const createExam = useMockExamStore((state) => state.createExam);
  const error = useMockExamStore((state) => state.error);
  const clearError = useMockExamStore((state) => state.clearError);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicImageUrl, setTopicImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!user) {
      setFormError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      setFormError('시험 제목을 입력해주세요.');
      return;
    }

    if (!topicImageUrl.trim()) {
      setFormError('주제 이미지 URL을 입력해주세요.');
      return;
    }

    if (!startDate || !startTime) {
      setFormError('시작 날짜와 시간을 입력해주세요.');
      return;
    }

    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration < 5) {
      setFormError('시험 시간은 최소 5분 이상이어야 합니다.');
      return;
    }

    // Combine date and time
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    // Validate start time is in the future
    if (startDateTime.getTime() <= Date.now()) {
      setFormError('시작 시간은 현재 시간 이후로 설정해야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      createExam({
        mentorId: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        topicImageUrl: topicImageUrl.trim(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setTopicImageUrl('');
      setStartDate('');
      setStartTime('');
      setDurationMinutes('60');

      onSuccess?.();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
          시험 제목 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 정물 수채화 연습"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
          설명 (선택)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="시험에 대한 간단한 설명을 입력하세요."
          className="w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] border-[var(--palette-border)] min-h-[80px] resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
          주제 이미지 URL <span className="text-red-500">*</span>
        </label>
        <Input
          type="url"
          value={topicImageUrl}
          onChange={(e) => setTopicImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
        {topicImageUrl && (
          <div className="mt-2">
            <p className="text-xs text-[var(--palette-muted)] mb-1">미리보기:</p>
            <img
              src={topicImageUrl}
              alt="Topic preview"
              className="w-32 h-32 object-cover rounded border border-[var(--palette-border)]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
            시작 날짜 <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
            시작 시간 <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--palette-text)] mb-2">
          시험 시간 (분) <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          min="5"
          max="480"
          placeholder="60"
          required
        />
        <p className="text-xs text-[var(--palette-muted)] mt-1">
          최소 5분, 최대 8시간 (480분)
        </p>
      </div>

      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {displayError}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : '모의고사 생성'}
        </Button>
      </div>
    </form>
  );
}
