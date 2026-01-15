/**
 * Supabase Client Contract
 * Feature: 006-supabase-login
 *
 * This file defines the interfaces for Supabase client factories.
 * These are the entry points for all Supabase operations.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// Environment Configuration
// ============================================================================

/**
 * Required environment variables for Supabase
 *
 * These should be defined in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export interface SupabaseConfig {
  url: string
  anonKey: string
}

// ============================================================================
// Client Factory Interfaces
// ============================================================================

/**
 * Browser Client Factory
 *
 * Creates a Supabase client for use in Client Components.
 * Uses browser cookies for session storage.
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 *
 * function MyComponent() {
 *   const supabase = createClient()
 *   // Use supabase...
 * }
 * ```
 */
export type CreateBrowserClient = () => SupabaseClient

/**
 * Server Client Factory
 *
 * Creates a Supabase client for use in Server Components,
 * Route Handlers, and Server Actions.
 * Uses Next.js cookies() for session storage.
 *
 * Usage:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * async function ServerComponent() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 * }
 * ```
 */
export type CreateServerClient = () => Promise<SupabaseClient>

// ============================================================================
// Auth Callback Route Contract
// ============================================================================

/**
 * Auth Callback Handler
 *
 * Route: GET /auth/callback
 *
 * Query Parameters:
 * - code: string - Auth code from Supabase
 * - next: string - URL to redirect to after auth (optional, defaults to '/')
 *
 * Success Response:
 * - Redirect to `next` parameter or '/'
 *
 * Error Response:
 * - Redirect to '/login?error=auth_callback_failed'
 */
export interface AuthCallbackParams {
  code?: string | null
  next?: string | null
}

// ============================================================================
// Middleware Contract
// ============================================================================

/**
 * Session Refresh Middleware
 *
 * This middleware runs on every request to:
 * 1. Check if a session exists
 * 2. Refresh the session if it's close to expiring
 * 3. Update cookies with new session tokens
 *
 * Excluded paths:
 * - _next/static/*
 * - _next/image/*
 * - favicon.ico
 * - Public assets
 */
export interface MiddlewareConfig {
  matcher: string[]
}

export const MIDDLEWARE_CONFIG: MiddlewareConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// ============================================================================
// Cookie Configuration
// ============================================================================

/**
 * Supabase Auth Cookie Names
 *
 * These cookies are managed by @supabase/ssr:
 * - sb-<project-ref>-auth-token: Main session token (chunked if large)
 * - sb-<project-ref>-auth-token.0, .1, etc.: Token chunks
 */
export const SUPABASE_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
}
