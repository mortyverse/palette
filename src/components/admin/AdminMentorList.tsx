// src/components/admin/AdminMentorList.tsx
'use client'

import { useEffect } from 'react'
import { useMentorStore } from '@/store/mentor-store'
import { MENTOR_STATUS_LABELS } from '@/lib/constants/mentor'
import { AdminMentorActions } from './AdminMentorActions'
import type { MentorProfile } from '@/types/mentor'

interface AdminMentorListProps {
  onActionComplete?: () => void
}

export function AdminMentorList({ onActionComplete }: AdminMentorListProps) {
  const { applications, applicationsLoading, error, fetchApplications } = useMentorStore()

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleActionComplete = () => {
    onActionComplete?.()
  }

  if (applicationsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse p-4 border border-[var(--palette-border)] rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--palette-muted)] text-lg">
          현재 대기 중인 멘토 신청이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map(application => (
        <MentorApplicationCard
          key={application.userId}
          application={application}
          onActionComplete={handleActionComplete}
        />
      ))}
    </div>
  )
}

interface MentorApplicationCardProps {
  application: MentorProfile
  onActionComplete?: () => void
}

function MentorApplicationCard({ application, onActionComplete }: MentorApplicationCardProps) {
  return (
    <div className="p-6 bg-white border border-[var(--palette-border)] rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-[var(--palette-muted)]">
              User ID: {application.userId.slice(0, 8)}...
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {MENTOR_STATUS_LABELS[application.status]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[var(--palette-text)]">
            {application.university} / {application.major}
          </h3>
        </div>
        <div className="text-sm text-[var(--palette-muted)]">
          {new Date(application.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-[var(--palette-muted)] mb-1">스타일 태그</p>
        <div className="flex flex-wrap gap-2">
          {application.styleTags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-[var(--palette-card)] border border-[var(--palette-border)] rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-[var(--palette-muted)] mb-1">자기소개</p>
        <p className="text-[var(--palette-text)] bg-[var(--palette-card)] p-3 rounded-md text-sm">
          {application.intro}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-[var(--palette-muted)] mb-1">
          인증 서류 ({application.verificationDocs.length}개)
        </p>
        <ul className="space-y-1">
          {application.verificationDocs.map(doc => (
            <li
              key={doc.id}
              className="flex items-center justify-between p-2 bg-[var(--palette-card)] rounded-md text-sm"
            >
              <span className="truncate">{doc.name}</span>
              <span className="text-[var(--palette-muted)] text-xs">
                {new Date(doc.uploadedAt).toLocaleDateString('ko-KR')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <AdminMentorActions
        userId={application.userId}
        onActionComplete={onActionComplete}
      />
    </div>
  )
}
