# Implementation Plan: Supabase Login Integration

**Branch**: `006-supabase-login` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-supabase-login/spec.md`

## Summary

Replace the existing mock authentication service with Supabase Auth to enable real email/password authentication with session persistence. The implementation will use `@supabase/ssr` for Next.js App Router integration, storing user roles in `user_metadata` while maintaining backward compatibility with the existing `UserProfile` type structure.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 (React 19.2.3)
**Primary Dependencies**: `@supabase/supabase-js` ^2.x, `@supabase/ssr` ^0.5.x, Zustand 5.0.10, React Hook Form 7.71.1, Zod 4.3.5
**Storage**: Supabase Auth (PostgreSQL-backed, managed), Session cookies via `@supabase/ssr`
**Testing**: Manual testing (no test framework currently configured in package.json)
**Target Platform**: Web (Next.js App Router, SSR + Client components)
**Project Type**: Web application (Next.js monorepo-style with /app and /src directories)
**Performance Goals**: Login/registration under 5 seconds; session persistence 7+ days
**Constraints**: Must maintain backward compatibility with existing `UserProfile` type; no OAuth required initially
**Scale/Scope**: Single Supabase project (`palette-dev`, ap-northeast-2), email/password auth only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is not configured with specific project principles. Proceeding with standard best practices:

- [x] **Simplicity**: Minimal changes to existing components; reuse UI, modify service layer only
- [x] **Type Safety**: Maintain existing TypeScript types; add new types for Supabase integration
- [x] **No Over-Engineering**: Single auth method (email/password); no OAuth complexity initially

## Project Structure

### Documentation (this feature)

```text
specs/006-supabase-login/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (auth API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/page.tsx           # Existing - update to use Supabase
│   └── signup/page.tsx          # Existing - update to use Supabase
├── auth/
│   └── callback/route.ts        # NEW - Supabase auth callback handler
├── layout.tsx                   # Existing - add AuthProvider wrapper
└── page.tsx

src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # Existing - update submit handler
│   │   ├── SignupForm.tsx       # Existing - update submit handler
│   │   ├── ProtectedRoute.tsx   # Existing - update auth check
│   │   └── AuthProvider.tsx     # NEW - session subscription & hydration
│   ├── layout/
│   │   └── GNB.tsx              # Existing - minimal changes
│   └── ui/                      # No changes needed
├── hooks/
│   ├── use-hydration.ts         # Existing - may need adjustment
│   └── use-auth.ts              # NEW - convenient auth hooks
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # NEW - browser client factory
│   │   ├── server.ts            # NEW - server client factory
│   │   └── middleware.ts        # NEW - session refresh middleware
│   ├── auth/
│   │   ├── mock-auth.service.ts # DELETE after migration
│   │   ├── password.ts          # DELETE - Supabase handles hashing
│   │   └── supabase-auth.service.ts  # NEW - Supabase auth wrapper
│   └── validation/
│       └── auth-schemas.ts      # Existing - update password rules
├── store/
│   └── auth-store.ts            # Existing - update to use Supabase session
└── types/
    └── auth.ts                  # Existing - maintain compatibility, add Supabase types

middleware.ts                    # NEW - Next.js middleware for session refresh
.env.local                       # NEW - Supabase credentials (not committed)
```

**Structure Decision**: Web application pattern with clear separation:
- `/app` for Next.js routes and API handlers
- `/src/lib/supabase` for Supabase client configuration
- `/src/lib/auth` for authentication service abstraction
- Existing component structure preserved with minimal modifications

## Complexity Tracking

No constitution violations identified. Implementation follows existing patterns.
