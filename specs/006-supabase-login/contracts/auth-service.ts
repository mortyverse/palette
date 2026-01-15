/**
 * Authentication Service Contract
 * Feature: 006-supabase-login
 *
 * This file defines the interface for the authentication service.
 * The implementation will use Supabase Auth under the hood.
 */

import type { UserProfile, UserRole } from '@/types/auth'

// ============================================================================
// Input Types
// ============================================================================

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  role: UserRole
}

// ============================================================================
// Response Types
// ============================================================================

export interface AuthResult<T = void> {
  success: boolean
  data?: T
  error?: AuthErrorInfo
}

export interface AuthErrorInfo {
  code: AuthErrorCode
  message: string
  details?: string
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'RATE_LIMITED'
  | 'ACCOUNT_DISABLED'
  | 'NETWORK_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN_ERROR'

export interface SessionInfo {
  user: UserProfile
  expiresAt: number // Unix timestamp
}

// ============================================================================
// Service Interface
// ============================================================================

export interface IAuthService {
  /**
   * Authenticate user with email and password
   *
   * @param credentials - Email and password
   * @returns AuthResult with session info on success
   *
   * Error codes:
   * - INVALID_CREDENTIALS: Email or password is incorrect
   * - RATE_LIMITED: Too many failed attempts
   * - ACCOUNT_DISABLED: Account has been disabled
   * - NETWORK_ERROR: Connection failed
   * - SERVICE_UNAVAILABLE: Supabase is down
   */
  login(credentials: LoginCredentials): Promise<AuthResult<SessionInfo>>

  /**
   * Register a new user account
   *
   * @param data - Registration data including email, password, name, role
   * @returns AuthResult with session info on success (auto-login)
   *
   * Error codes:
   * - EMAIL_ALREADY_EXISTS: Email is already registered
   * - WEAK_PASSWORD: Password doesn't meet requirements
   * - NETWORK_ERROR: Connection failed
   * - SERVICE_UNAVAILABLE: Supabase is down
   */
  register(data: RegisterData): Promise<AuthResult<SessionInfo>>

  /**
   * Sign out the current user
   *
   * Terminates the session on both client and server.
   * Clears all auth-related cookies and local storage.
   *
   * @returns AuthResult indicating success/failure
   */
  logout(): Promise<AuthResult>

  /**
   * Get the current authenticated user
   *
   * @returns UserProfile if authenticated, null otherwise
   */
  getCurrentUser(): Promise<UserProfile | null>

  /**
   * Check if a session exists and is valid
   *
   * @returns true if user is authenticated
   */
  isAuthenticated(): Promise<boolean>

  /**
   * Subscribe to authentication state changes
   *
   * @param callback - Function called when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(
    callback: (user: UserProfile | null) => void
  ): () => void
}

// ============================================================================
// Rate Limiting Interface
// ============================================================================

export interface IRateLimiter {
  /**
   * Check if login is allowed for this email
   *
   * @param email - User email to check
   * @returns Object with allowed status and remaining lockout time
   */
  checkLimit(email: string): RateLimitStatus

  /**
   * Record a failed login attempt
   *
   * @param email - User email that failed login
   */
  recordFailure(email: string): void

  /**
   * Reset attempts after successful login
   *
   * @param email - User email that logged in successfully
   */
  resetAttempts(email: string): void
}

export interface RateLimitStatus {
  allowed: boolean
  remainingTime?: number // milliseconds until lockout ends
  attemptsRemaining?: number // attempts before lockout
}

// ============================================================================
// Constants
// ============================================================================

export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  SESSION_DURATION_DAYS: 7,
  MIN_PASSWORD_LENGTH: 8,
} as const
