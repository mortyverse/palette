'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CoachingRequestFormProps {
  onSubmit: (data: {
    mentorId: string;
    imageUrl: string;
    initialQuestion: string;
  }) => Promise<void>;
  mentorId?: string;
  isLoading?: boolean;
}

export function CoachingRequestForm({
  onSubmit,
  mentorId,
  isLoading,
}: CoachingRequestFormProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    }
  };

  const validateForm = (): boolean => {
    if (!mentorId) {
      setError('멘토를 선택해주세요');
      return false;
    }
    if (!imageUrl) {
      setError('이미지 URL을 입력해주세요');
      return false;
    }
    if (question.length < 10) {
      setError('질문은 최소 10자 이상이어야 합니다');
      return false;
    }
    if (question.length > 500) {
      setError('질문은 최대 500자까지 입력 가능합니다');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        mentorId: mentorId!,
        imageUrl,
        initialQuestion: question,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          작품 이미지 URL
        </label>
        <Input
          type="url"
          placeholder="https://example.com/artwork.jpg"
          value={imageUrl}
          onChange={handleImageUrlChange}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          JPG, PNG 형식만 지원하며 최대 10MB입니다
        </p>
      </div>

      {imagePreview && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">이미지 미리보기</p>
          <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="artwork preview"
              fill
              className="object-contain"
              onError={() => setImagePreview('')}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          피드백 요청 질문 *
        </label>
        <textarea
          placeholder="예: 이 그림의 명암 표현을 어떻게 개선할 수 있을까요?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          rows={4}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>최소 10자, 최대 500자</span>
          <span>{question.length}/500</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !mentorId}
        className="w-full"
      >
        {isLoading ? '요청 중...' : '피드백 요청하기'}
      </Button>
    </form>
  );
}
