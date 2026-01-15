// app/admin/mentors/page.tsx
'use client'

import { useMentorStore } from '@/store/mentor-store'
import { AdminMentorList } from '@/components/admin/AdminMentorList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminMentorsPage() {
  const { fetchApplications } = useMentorStore()

  const handleActionComplete = () => {
    // Refresh the list after an action
    fetchApplications()
  }

  return (
    <div className="min-h-screen bg-[var(--palette-bg)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-gold)] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>

          <h1 className="text-3xl font-bold text-[var(--palette-text)] mb-2">
            멘토 신청 관리
          </h1>
          <p className="text-[var(--palette-muted)]">
            대기 중인 멘토 신청을 검토하고 승인 또는 반려합니다.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>개발 모드:</strong> 이 페이지는 개발 테스트용입니다. 실제 배포 시에는 관리자 인증이 필요합니다.
          </p>
        </div>

        <AdminMentorList onActionComplete={handleActionComplete} />
      </div>
    </div>
  )
}
