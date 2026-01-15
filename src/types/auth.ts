// src/types/auth.ts
import type { User as SupabaseUser } from '@supabase/supabase-js'

export type UserRole = 'student' | 'mentor'

/**
 * User metadata stored in Supabase user_metadata
 */
export interface UserMetadata {
  name?: string
  role: UserRole
}

/**
 * Application-level user profile
 * Derived from Supabase User + user_metadata
 */
export interface UserProfile {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: UserRole
  name?: string
}

export interface AuthResponse {
  user: UserProfile
  message?: string
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'RATE_LIMITED'
  | 'ACCOUNT_DISABLED'
  | 'NETWORK_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR'

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: AuthErrorCode
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Transform Supabase User to application UserProfile
 */
export function supabaseUserToProfile(user: SupabaseUser): UserProfile {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    role: (user.user_metadata?.role as UserRole) || 'student',
    createdAt: user.created_at,
  }
}
