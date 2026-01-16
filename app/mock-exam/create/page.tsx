'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExamCreationForm } from '@/components/mock-exam/exam-creation-form';
import { useAuthStore } from '@/store/auth-store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CreateExamPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleSuccess = () => {
    router.push('/mock-exam');
  };

  const handleCancel = () => {
    router.back();
  };

  // Only mentors can create exams
  if (user && user.role !== 'mentor') {
    return (
      <main className="min-h-screen bg-[var(--palette-bg)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center py-12 border border-dashed border-[var(--palette-border)] rounded-lg">
            <p className="text-[var(--palette-muted)]">
              멘토만 모의고사를 생성할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[var(--palette-bg)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-semibold text-[var(--palette-text)]">
              모의고사 생성
            </h1>
            <p className="text-[var(--palette-muted)] mt-1">
              새로운 모의고사를 생성하세요. 시작 시간이 되면 학생들에게 주제 이미지가 공개됩니다.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[var(--palette-border)] rounded-lg p-6">
            <ExamCreationForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
