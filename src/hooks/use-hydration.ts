// src/hooks/use-hydration.ts
'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    useAuthStore.persist.rehydrate()
    // Use a microtask to avoid the linter warning about synchronous setState
    queueMicrotask(() => setHydrated(true))
  }, [])

  return hydrated
}
