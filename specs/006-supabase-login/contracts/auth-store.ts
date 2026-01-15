/**
 * Auth Store Contract
 * Feature: 006-supabase-login
 *
 * This file defines the interface for the Zustand auth store.
 * Updates the existing store to work with Supabase.
 */

import type { UserProfile } from '@/types/auth'

// ============================================================================
// Store State
// ============================================================================

export interface AuthState {
  /**
   * Current authenticated user, or null if not logged in
   */
  user: UserProfile | null

  /**
   * Whether the user is currently authenticated
   * Derived from user !== null, but kept for convenience
   */
  isAuthenticated: boolean

  /**
   * Whether the auth state is still being determined
   * True during initial load and session refresh
   */
  isLoading: boolean

  /**
   * Timestamp of when the user logged in (ISO string)
   * Used for session tracking
   */
  loginAt?: string
}

// ============================================================================
// Store Actions
// ============================================================================

export interface AuthActions {
  /**
   * Authenticate user with email and password
   *
   * @param credentials - Email and password
   * @throws Error if login fails
   */
  login(credentials: { email: string; password: string }): Promise<void>

  /**
   * Register a new user and log them in
   *
   * @param data - Registration data
   * @throws Error if registration fails
   */
  register(data: {
    email: string
    password: string
    name?: string
    role: 'student' | 'mentor'
  }): Promise<void>

  /**
   * Sign out the current user
   * Clears all auth state and cookies
   */
  logout(): Promise<void>

  /**
   * Set the current user (used by AuthProvider)
   * @internal
   */
  setUser(user: UserProfile | null): void

  /**
   * Set loading state (used by AuthProvider)
   * @internal
   */
  setLoading(isLoading: boolean): void

  /**
   * Initialize auth state from Supabase session
   * Called on app mount by AuthProvider
   * @internal
   */
  initialize(): Promise<void>
}

// ============================================================================
// Combined Store Type
// ============================================================================

export type AuthStore = AuthState & AuthActions

// ============================================================================
// Store Selectors
// ============================================================================

/**
 * Recommended selectors for consuming components
 *
 * Usage:
 * ```typescript
 * const user = useAuthStore(selectUser)
 * const isAuthenticated = useAuthStore(selectIsAuthenticated)
 * ```
 */
export const selectUser = (state: AuthStore) => state.user
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated
export const selectIsLoading = (state: AuthStore) => state.isLoading
export const selectRole = (state: AuthStore) => state.user?.role

// ============================================================================
// Store Configuration
// ============================================================================

export const AUTH_STORE_CONFIG = {
  /**
   * LocalStorage key for Zustand persist middleware
   * Note: With Supabase, we don't persist user data to localStorage
   * Session is stored in cookies by @supabase/ssr
   */
  storageKey: 'auth-storage',

  /**
   * Whether to skip hydration on server
   * Required for SSR to prevent hydration mismatches
   */
  skipHydration: true,
} as const

// ============================================================================
// Provider Contract
// ============================================================================

/**
 * AuthProvider Component
 *
 * Wraps the app to:
 * 1. Initialize auth state on mount
 * 2. Subscribe to auth state changes
 * 3. Handle session refresh
 *
 * Props:
 * - children: React.ReactNode
 *
 * Usage:
 * ```tsx
 * // app/layout.tsx
 * <AuthProvider>
 *   {children}
 * </AuthProvider>
 * ```
 */
export interface AuthProviderProps {
  children: React.ReactNode
}
