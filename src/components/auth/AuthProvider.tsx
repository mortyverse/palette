// src/components/auth/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { authService } from '@/lib/auth/supabase-auth.service'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * AuthProvider handles:
 * 1. Initial auth state hydration on mount
 * 2. Subscribing to auth state changes from Supabase
 * 3. Syncing auth state to Zustand store
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    // Initialize auth state on mount
    initialize()

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [initialize, setUser, setLoading])

  return <>{children}</>
}
