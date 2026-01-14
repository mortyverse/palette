// src/hooks/use-hydration.ts
'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    useAuthStore.persist.rehydrate()
    setHydrated(true)
  }, [])

  return hydrated
}
