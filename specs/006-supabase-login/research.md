# Research: Supabase Login Integration

**Feature**: 006-supabase-login
**Date**: 2026-01-15

## Research Tasks Completed

### 1. Supabase Client Setup for Next.js App Router

**Decision**: Use `@supabase/ssr` package with separate browser/server client factories

**Rationale**:
- `@supabase/ssr` is the official package for SSR frameworks (replaces deprecated `@supabase/auth-helpers-nextjs`)
- Provides `createBrowserClient()` for client components and `createServerClient()` for server components
- Handles cookie-based session storage automatically for SSR compatibility
- Supports Next.js 14+ App Router natively

**Alternatives Considered**:
- `@supabase/supabase-js` alone: Does not handle SSR cookie synchronization properly
- `@supabase/auth-helpers-nextjs`: Deprecated in favor of `@supabase/ssr`

**Implementation Pattern**:
```typescript
// Browser client (src/lib/supabase/client.ts)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server client (src/lib/supabase/server.ts)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

---

### 2. Session Management Strategy

**Decision**: Use Next.js middleware for session refresh + Zustand for client-side state

**Rationale**:
- Middleware runs on every request, ensuring sessions are refreshed before they expire
- Zustand store already exists and handles client-side hydration
- Supabase `onAuthStateChange` listener provides real-time session updates
- Cookie-based sessions enable SSR access to auth state

**Alternatives Considered**:
- Client-only session refresh: Fails on initial SSR render, causes hydration mismatches
- Server actions only: More complex, middleware is simpler for this use case

**Implementation Pattern**:
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser() // Refreshes session if needed
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

### 3. User Metadata Storage for Roles

**Decision**: Store `role` and `name` in Supabase `user_metadata` during signup

**Rationale**:
- `user_metadata` is designed for user-editable data (name, preferences)
- Accessible client-side via `session.user.user_metadata`
- No need for separate profiles table for current requirements
- Simplifies implementation; can migrate to profiles table later if needed

**Alternatives Considered**:
- Separate `public.profiles` table with RLS: More complex, not needed for MVP
- `app_metadata`: Intended for admin-controlled data, not user-editable

**Implementation Pattern**:
```typescript
// Registration with metadata
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: formData.name,
      role: formData.role, // 'student' | 'mentor'
    }
  }
})

// Accessing metadata
const role = session.user.user_metadata.role as UserRole
const name = session.user.user_metadata.name as string
```

---

### 4. Type Compatibility with Existing UserProfile

**Decision**: Create adapter function to transform Supabase User to UserProfile

**Rationale**:
- Existing `UserProfile` type is used throughout the app
- Supabase `User` has different structure (metadata nested)
- Adapter isolates Supabase-specific logic from components
- Zero changes needed to consuming components

**Implementation Pattern**:
```typescript
// src/lib/auth/supabase-auth.service.ts
import type { User } from '@supabase/supabase-js'
import type { UserProfile, UserRole } from '@/types/auth'

export function supabaseUserToProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    role: (user.user_metadata?.role as UserRole) || 'student',
    createdAt: user.created_at,
  }
}
```

---

### 5. Email Verification Strategy

**Decision**: Allow immediate login without email verification (async verification)

**Rationale**:
- Spec explicitly states: "Optional/async (user can login immediately, verification email sent in background)"
- Better UX for development and initial launch
- Supabase default requires verification; must configure project settings
- Can tighten security later by enabling `confirm_email` requirement

**Configuration Required**:
- Supabase Dashboard > Authentication > Settings > Enable "Allow unverified users to sign in"
- Or set `emailRedirectTo` for magic link flow (not used in this implementation)

---

### 6. Rate Limiting for Login Attempts

**Decision**: Implement client-side tracking + rely on Supabase server-side limits

**Rationale**:
- Supabase has built-in rate limiting on auth endpoints
- Client-side tracking provides immediate UX feedback
- Spec requires: 5 failed attempts = 5-minute lockout
- LocalStorage tracks attempts per email for client-side lockout display

**Alternatives Considered**:
- Server-side only: Works but no immediate feedback
- Custom Edge Function: Over-engineered for MVP

**Implementation Pattern**:
```typescript
interface LoginAttempt {
  count: number
  lockedUntil: number | null
}

const LOCK_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 5

function checkRateLimit(email: string): { allowed: boolean; remainingTime?: number } {
  const key = `login-attempts:${email}`
  const data = JSON.parse(localStorage.getItem(key) || '{}') as LoginAttempt

  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    return { allowed: false, remainingTime: data.lockedUntil - Date.now() }
  }

  return { allowed: true }
}

function recordFailedAttempt(email: string): void {
  const key = `login-attempts:${email}`
  const data = JSON.parse(localStorage.getItem(key) || '{"count":0}') as LoginAttempt

  data.count++
  if (data.count >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCK_DURATION
    data.count = 0
  }

  localStorage.setItem(key, JSON.stringify(data))
}
```

---

### 7. Auth Callback Route Handler

**Decision**: Create `/app/auth/callback/route.ts` for code exchange

**Rationale**:
- Required for OAuth flows (future) and email confirmation links
- Supabase redirects to callback URL with auth code
- Route handler exchanges code for session
- Not strictly needed for email/password but good to have for email verification links

**Implementation Pattern**:
```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

---

### 8. Password Validation Requirements

**Decision**: Update Zod schema to match Supabase minimum (6 chars) while keeping current UX rules

**Rationale**:
- Supabase minimum: 6 characters
- Current app schema: 8 chars, letters + numbers required
- Keep stricter client-side validation for better UX
- Supabase will reject if below 6, but our UI enforces 8

**No changes needed**: Current schema (`min 8, letters + numbers`) is stricter than Supabase minimum.

---

## Environment Variables Required

```bash
# .env.local (not committed to git)
NEXT_PUBLIC_SUPABASE_URL=https://eifobfxsoidkcusilepo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note**: The publishable anon key is safe to expose in client-side code. Row Level Security (RLS) on Supabase tables controls data access.

---

## Dependencies to Install

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Version Compatibility**:
- `@supabase/supabase-js`: ^2.47.0 (latest stable)
- `@supabase/ssr`: ^0.5.2 (latest for Next.js 14+)

---

## Migration Checklist

After implementation, the following files should be removed:
- [ ] `src/lib/auth/mock-auth.service.ts`
- [ ] `src/lib/auth/password.ts`
- [ ] Remove `bcryptjs` and `@types/bcryptjs` from package.json (optional, may be used elsewhere)

LocalStorage keys to clear during development:
- `mock-users` (mock user database)
- `auth-storage` (old Zustand persist data - will be replaced)
