'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SessionStatus } from '@/types/coaching';

interface FollowUpSectionProps {
  sessionStatus: SessionStatus;
  existingFollowUp?: {
    question: string;
    questionAt: Date;
    answer?: string;
    answerAt?: Date;
  };
  isStudent: boolean;
  isMentor: boolean;
  onSubmitQuestion: (question: string) => Promise<void>;
  onSubmitAnswer: (answer: string) => Promise<void>;
}

export function FollowUpSection({
  sessionStatus,
  existingFollowUp,
  isStudent,
  isMentor,
  onSubmitQuestion,
  onSubmitAnswer,
}: FollowUpSectionProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canAskFollowUp = isStudent && sessionStatus === SessionStatus.ANSWERED && !existingFollowUp;
  const canAnswerFollowUp = isMentor && sessionStatus === SessionStatus.FOLLOWUP_PENDING && existingFollowUp && !existingFollowUp.answer;

  const handleSubmitQuestion = async () => {
    if (question.length < 10) {
      setError('질문은 최소 10자 이상이어야 합니다.');
      return;
    }
    if (question.length > 300) {
      setError('질문은 최대 300자까지 입력 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmitQuestion(question);
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '질문 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (answer.length < 10) {
      setError('답변은 최소 10자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmitAnswer(answer);
      setAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display existing follow-up
  if (existingFollowUp) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">추가 질문</h3>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">Q:</p>
            <p className="text-[var(--palette-text)]">{existingFollowUp.question}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(existingFollowUp.questionAt).toLocaleString('ko-KR')}
            </p>
          </div>

          {existingFollowUp.answer ? (
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">A:</p>
              <p className="text-[var(--palette-text)]">{existingFollowUp.answer}</p>
              {existingFollowUp.answerAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(existingFollowUp.answerAt).toLocaleString('ko-KR')}
                </p>
              )}
            </div>
          ) : canAnswerFollowUp ? (
            <div className="space-y-3 border-t border-blue-200 pt-4">
              <label className="block text-sm font-medium text-blue-800">
                답변 작성
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="학생의 질문에 대한 답변을 작성해주세요 (최소 10자)"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                disabled={isSubmitting}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || answer.length < 10}
                variant="primary"
                className="w-full"
              >
                {isSubmitting ? '제출 중...' : '답변 제출'}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-blue-800 italic">
              멘토의 답변을 기다리고 있습니다...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Form for asking follow-up question
  if (canAskFollowUp) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">추가 질문하기</h3>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
          <p className="text-sm text-green-800">
            멘토에게 한 번의 추가 질문을 할 수 있습니다. 48시간 내에 질문하지 않으면 세션이 자동으로 종료됩니다.
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="추가 질문을 작성해주세요 (최소 10자, 최대 300자)"
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>최소 10자, 최대 300자</span>
            <span>{question.length}/300</span>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button
            onClick={handleSubmitQuestion}
            disabled={isSubmitting || question.length < 10}
            variant="primary"
            className="w-full"
          >
            {isSubmitting ? '제출 중...' : '추가 질문 제출'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
