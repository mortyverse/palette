// src/lib/auth/supabase-auth.service.ts
'use client'

import { createClient } from '@/lib/supabase/client'
import {
  AuthError,
  supabaseUserToProfile,
  type LoginCredentials,
  type RegisterData,
  type UserProfile,
  type AuthErrorCode,
} from '@/types/auth'
import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js'

/**
 * Map Supabase error codes to application error codes
 */
function mapSupabaseError(error: SupabaseAuthError): { code: AuthErrorCode; message: string } {
  const message = error.message

  if (message.includes('Invalid login credentials')) {
    return { code: 'INVALID_CREDENTIALS', message: '이메일 또는 비밀번호가 올바르지 않습니다' }
  }
  if (message.includes('User already registered') || message.includes('already exists')) {
    return { code: 'EMAIL_ALREADY_EXISTS', message: '이미 사용 중인 이메일입니다' }
  }
  if (message.includes('Password should be at least')) {
    return { code: 'WEAK_PASSWORD', message: '비밀번호가 보안 요구사항을 충족하지 않습니다' }
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return { code: 'RATE_LIMITED', message: '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요' }
  }
  if (message.includes('disabled') || message.includes('banned')) {
    return { code: 'ACCOUNT_DISABLED', message: '계정이 비활성화되었습니다' }
  }
  if (message.includes('network') || message.includes('fetch')) {
    return { code: 'NETWORK_ERROR', message: '네트워크 오류가 발생했습니다' }
  }
  if (error.status === 503 || message.includes('service unavailable')) {
    return { code: 'SERVICE_UNAVAILABLE', message: '서비스를 일시적으로 사용할 수 없습니다' }
  }

  return { code: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다' }
}

class SupabaseAuthService {
  private supabase = createClient()

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      const mapped = mapSupabaseError(error)
      throw new AuthError(mapped.message, mapped.code)
    }

    if (!data.user) {
      throw new AuthError('로그인에 실패했습니다', 'UNKNOWN_ERROR')
    }

    return supabaseUserToProfile(data.user)
  }

  /**
   * Authenticate user with Google OAuth
   */
  async loginWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      const mapped = mapSupabaseError(error)
      throw new AuthError(mapped.message, mapped.code)
    }
  }

  /**
   * Register a new user with role and optional name
   */
  async register(data: RegisterData): Promise<UserProfile> {
    const { data: authData, error } = await this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
        },
      },
    })

    if (error) {
      const mapped = mapSupabaseError(error)
      throw new AuthError(mapped.message, mapped.code)
    }

    if (!authData.user) {
      throw new AuthError('회원가입에 실패했습니다', 'UNKNOWN_ERROR')
    }

    return supabaseUserToProfile(authData.user)
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()

    if (error) {
      const mapped = mapSupabaseError(error)
      throw new AuthError(mapped.message, mapped.code)
    }
  }

  /**
   * Get current authenticated user from session
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return supabaseUserToProfile(user)
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  /**
   * Subscribe to auth state changes
   * Returns an unsubscribe function
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          callback(supabaseUserToProfile(session.user))
        } else {
          callback(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }
}

export const authService = new SupabaseAuthService()
