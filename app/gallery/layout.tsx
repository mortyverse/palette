// app/gallery/layout.tsx
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useHydration } from '@/hooks/use-hydration'
import { MentorGuard } from '@/components/mentor/MentorGuard'

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrated = useHydration()
  const user = useAuthStore(state => state.user)

  // For mentors, wrap content with MentorGuard to ensure they're approved
  // Students and guests can view the gallery without restrictions
  if (hydrated && user?.role === 'mentor') {
    return <MentorGuard>{children}</MentorGuard>
  }

  return <>{children}</>
}
