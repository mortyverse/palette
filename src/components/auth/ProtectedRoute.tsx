// src/components/auth/ProtectedRoute.tsx
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useHydration } from '@/hooks/use-hydration'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const hydrated = useHydration()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const returnUrl = window.location.pathname + window.location.search
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">리다이렉트 중...</div>
      </div>
    )
  }

  return <>{children}</>
}
