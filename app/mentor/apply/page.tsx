// app/mentor/apply/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useMentorStore } from '@/store/mentor-store'
import { useHydration } from '@/hooks/use-hydration'
import { MentorProfileForm } from '@/components/mentor/MentorProfileForm'
import { MENTOR_STATUS_LABELS } from '@/lib/constants/mentor'
import Link from 'next/link'

export default function MentorApplyPage() {
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

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login?returnUrl=/mentor/apply')
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || (isAuthenticated && (isLoading || !hasFetched))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--palette-muted)]">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--palette-muted)]">리다이렉트 중...</div>
      </div>
    )
  }

  // Student cannot apply as mentor
  if (user.role === 'student') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-[var(--palette-text)]">멘토 신청 불가</h2>
          <p className="text-[var(--palette-muted)]">
            학생 계정으로는 멘토 신청이 불가능합니다. 멘토로 활동하시려면 멘토 계정으로 가입해주세요.
          </p>
          <Link
            href="/"
            className="inline-block text-[var(--palette-gold)] hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // Already approved mentor
  if (myProfile?.status === 'APPROVED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-[var(--palette-text)]">이미 승인된 멘토입니다</h2>
          <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {MENTOR_STATUS_LABELS.APPROVED}
          </div>
          <p className="text-[var(--palette-muted)]">
            멘토로 승인되었습니다. 이제 코칭 기능을 이용하실 수 있습니다.
          </p>
          <Link
            href="/coaching"
            className="inline-block text-[var(--palette-gold)] hover:underline"
          >
            코칭 페이지로 이동
          </Link>
        </div>
      </div>
    )
  }

  const handleSuccess = () => {
    // Refresh to show updated status
    if (user) {
      fetchMyProfile(user.id)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--palette-bg)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--palette-text)] mb-2">
            {myProfile ? '멘토 프로필 수정' : '멘토 신청'}
          </h1>
          <p className="text-[var(--palette-muted)]">
            {myProfile
              ? '프로필 정보를 수정하거나 추가 서류를 업로드할 수 있습니다.'
              : '멘토로 활동하기 위한 정보를 입력해주세요.'}
          </p>

          {myProfile?.status === 'PENDING' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                현재 상태: <strong>{MENTOR_STATUS_LABELS.PENDING}</strong> - 관리자 검토 중입니다.
              </p>
            </div>
          )}

          {myProfile?.status === 'REJECTED' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 mb-2">
                현재 상태: <strong>{MENTOR_STATUS_LABELS.REJECTED}</strong>
              </p>
              {myProfile.rejectionReason && (
                <p className="text-red-700">
                  반려 사유: {myProfile.rejectionReason}
                </p>
              )}
              <p className="text-sm text-red-600 mt-2">
                서류를 보완하여 다시 업로드해주세요.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[var(--palette-border)] p-6">
          <MentorProfileForm
            existingProfile={myProfile}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  )
}
