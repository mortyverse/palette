# Quickstart: Supabase Login Integration

**Feature**: 006-supabase-login
**Date**: 2026-01-15

## Prerequisites

1. Supabase project `palette-dev` is active (region: ap-northeast-2)
2. Node.js 18+ installed
3. Access to the palette repository on branch `006-supabase-login`

## Setup Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eifobfxsoidkcusilepo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZm9iZnhzb2lka2N1c2lsZXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjc0NDksImV4cCI6MjA4Mzk0MzQ0OX0.2D5o06KgR_iWTr6eYCrZqtIPPBnODRejBFf9QaAau0U
```

### 3. Create Supabase Client Files

**Browser Client** (`src/lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server Client** (`src/lib/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in Server Components (read-only)
          }
        },
      },
    }
  )
}
```

### 4. Add Session Refresh Middleware

Create `middleware.ts` in the project root:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 5. Create Auth Callback Route

Create `app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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

### 6. Run Development Server

```bash
npm run dev
```

### 7. Test Authentication

1. Navigate to `http://localhost:3000/signup`
2. Register a new account with email, password, and role
3. Verify you're redirected to the dashboard
4. Check the Supabase dashboard to confirm user was created
5. Test logout and login functionality

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Environment variables configured
- [ ] Development server starts without errors
- [ ] Signup creates user in Supabase auth.users
- [ ] Login authenticates user correctly
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect to login when unauthenticated

## Troubleshooting

### "Invalid API key" Error
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the development server after changing env vars

### Session Not Persisting
- Ensure `middleware.ts` is in the project root (not in `/src`)
- Check browser cookies for `sb-*` prefixed cookies

### Hydration Mismatch Errors
- Ensure `AuthProvider` wraps the app in `layout.tsx`
- Check that auth state is only accessed after hydration

## Next Steps

After completing quickstart:
1. Update `LoginForm.tsx` to use Supabase auth
2. Update `SignupForm.tsx` to use Supabase auth
3. Update `auth-store.ts` to sync with Supabase session
4. Update `ProtectedRoute.tsx` to check Supabase session
5. Remove mock auth service and related files
