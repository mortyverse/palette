// src/components/mentor/MentorGuard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useMentorStore } from '@/store/mentor-store'
import { useHydration } from '@/hooks/use-hydration'
import { Button } from '@/components/ui/Button'
import { MENTOR_STATUS_LABELS } from '@/lib/constants/mentor'
import Link from 'next/link'

interface MentorGuardProps {
  children: React.ReactNode
  requireApproved?: boolean
}

export function MentorGuard({ children, requireApproved = true }: MentorGuardProps) {
  const hydrated = useHydration()
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { myProfile, fetchMyProfile, isLoading } = useMentorStore()
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (hydrated && isAuthenticated && user && !hasFetched) {
      fetchMyProfile(user.id).then(() => setHasFetched(true))
    }
  }, [hydrated, isAuthenticated, user, hasFetched, fetchMyProfile])

  // Not hydrated yet
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--palette-muted)]">로딩 중...</div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    router.replace(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--palette-muted)]">리다이렉트 중...</div>
      </div>
    )
  }

  // Students can access freely (they're not mentors, so no restrictions apply)
  if (user.role === 'student') {
    return <>{children}</>
  }

  // Mentor - loading profile
  if (isLoading || !hasFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--palette-muted)]">멘토 정보 확인 중...</div>
      </div>
    )
  }

  // Mentor without profile - needs to apply
  if (!myProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-[var(--palette-text)]">멘토 등록이 필요합니다</h2>
          <p className="text-[var(--palette-muted)]">
            이 페이지에 접근하려면 먼저 멘토 등록을 완료해야 합니다.
          </p>
          <Link href="/mentor/apply">
            <Button>멘토 등록하기</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mentor with profile but not approved
  if (requireApproved && myProfile.status !== 'APPROVED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-[var(--palette-text)]">
            멘토 승인 대기 중
          </h2>

          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            myProfile.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {MENTOR_STATUS_LABELS[myProfile.status]}
          </div>

          {myProfile.status === 'PENDING' && (
            <p className="text-[var(--palette-muted)]">
              멘토 신청서가 검토 중입니다. 승인이 완료되면 이 페이지에 접근할 수 있습니다.
            </p>
          )}

          {myProfile.status === 'REJECTED' && (
            <div className="space-y-4">
              <p className="text-[var(--palette-muted)]">
                멘토 신청이 반려되었습니다.
              </p>
              {myProfile.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-left">
                  <p className="font-medium text-red-800 mb-1">반려 사유:</p>
                  <p className="text-red-700">{myProfile.rejectionReason}</p>
                </div>
              )}
              <p className="text-sm text-[var(--palette-muted)]">
                서류를 보완하여 다시 신청해주세요.
              </p>
              <Link href="/mentor/apply">
                <Button>다시 신청하기</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Approved mentor - allow access
  return <>{children}</>
}
