// src/hooks/use-hydration.ts
'use client'

import { useSyncExternalStore } from 'react'
import { useAuthStore } from '@/store/auth-store'

// Client-side only: always mounted
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Hook for checking if auth state has been hydrated from Supabase
 * Returns true once the initial auth check is complete
 */
export function useHydration() {
  const isLoading = useAuthStore((state) => state.isLoading)

  // useSyncExternalStore is safe for hydration and avoids cascading renders
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Hydrated when component is mounted AND auth is no longer loading
  return mounted && !isLoading
}
