// src/components/admin/AdminMentorActions.tsx
'use client'

import { useState } from 'react'
import { useMentorStore } from '@/store/mentor-store'
import { Button } from '@/components/ui/Button'

interface AdminMentorActionsProps {
  userId: string
  onActionComplete?: () => void
}

export function AdminMentorActions({ userId, onActionComplete }: AdminMentorActionsProps) {
  const { approveMentor, rejectMentor, applicationsLoading } = useMentorStore()
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await approveMentor(userId)
      onActionComplete?.()
    } catch {
      // Error is handled by store
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setReasonError('거절 사유를 입력해주세요')
      return
    }

    setActionLoading(true)
    try {
      await rejectMentor(userId, rejectReason)
      setShowRejectModal(false)
      setRejectReason('')
      onActionComplete?.()
    } catch {
      // Error is handled by store
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelReject = () => {
    setShowRejectModal(false)
    setRejectReason('')
    setReasonError('')
  }

  const isLoading = applicationsLoading || actionLoading

  return (
    <>
      <div className="flex gap-3 pt-4 border-t border-[var(--palette-border)]">
        <Button
          onClick={handleApprove}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? '처리 중...' : '승인'}
        </Button>
        <Button
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading}
          variant="secondary"
          className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          반려
        </Button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[var(--palette-text)] mb-4">
              멘토 신청 반려
            </h3>
            <p className="text-sm text-[var(--palette-muted)] mb-4">
              신청자에게 전달될 반려 사유를 입력해주세요.
            </p>

            <div className="space-y-2 mb-6">
              <textarea
                value={rejectReason}
                onChange={e => {
                  setRejectReason(e.target.value)
                  setReasonError('')
                }}
                placeholder="예: 서류가 불명확합니다. 재학증명서를 다시 제출해주세요."
                rows={4}
                className={`w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] resize-none ${
                  reasonError ? 'border-red-500' : 'border-[var(--palette-border)]'
                }`}
              />
              {reasonError && (
                <p className="text-sm text-red-500">{reasonError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancelReject}
                disabled={isLoading}
                variant="secondary"
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isLoading ? '처리 중...' : '반려 확정'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
