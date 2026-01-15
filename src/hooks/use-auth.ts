// src/hooks/use-auth.ts
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useCallback } from 'react'

/**
 * Hook for accessing auth state and actions
 * Provides convenient selectors for common auth patterns
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }
}

/**
 * Hook for checking user role
 */
export function useUserRole() {
  const user = useAuthStore((state) => state.user)
  return user?.role ?? null
}

/**
 * Hook for checking if user has a specific role
 */
export function useHasRole(role: 'student' | 'mentor') {
  const userRole = useUserRole()
  return userRole === role
}

/**
 * Hook for protected actions that require authentication
 * Returns a wrapped function that only executes if authenticated
 */
export function useProtectedAction<T extends (...args: unknown[]) => unknown>(
  action: T
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useCallback(
    (...args: Parameters<T>) => {
      if (!isAuthenticated) {
        return undefined
      }
      return action(...args) as ReturnType<T>
    },
    [isAuthenticated, action]
  )
}
