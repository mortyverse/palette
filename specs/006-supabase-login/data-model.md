# Data Model: Supabase Login Integration

**Feature**: 006-supabase-login
**Date**: 2026-01-15

## Entities

### 1. User (Supabase Auth)

**Storage**: `auth.users` table (managed by Supabase)

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | `uuid` | Primary key, auto-generated | Supabase |
| `email` | `string` | User's email address (unique) | Registration |
| `encrypted_password` | `string` | Bcrypt hash (managed by Supabase) | Registration |
| `user_metadata` | `jsonb` | Custom user data (name, role) | Registration |
| `created_at` | `timestamp` | Account creation time | Supabase |
| `email_confirmed_at` | `timestamp?` | Email verification time | Supabase |
| `last_sign_in_at` | `timestamp?` | Last login time | Supabase |

**user_metadata Structure**:
```typescript
interface UserMetadata {
  name?: string       // Display name
  role: 'student' | 'mentor'  // User role for RBAC
}
```

**Validation Rules**:
- `email`: Valid email format, unique across all users
- `password`: Minimum 6 characters (Supabase), app enforces 8+ with letters/numbers
- `role`: Must be 'student' or 'mentor'
- `name`: Optional, max 100 characters

---

### 2. Session (Supabase Auth)

**Storage**: `auth.sessions` table + client cookies (managed by Supabase)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `uuid` | Session identifier |
| `user_id` | `uuid` | Foreign key to auth.users |
| `created_at` | `timestamp` | Session start time |
| `updated_at` | `timestamp` | Last refresh time |
| `user_agent` | `string?` | Browser/device info |
| `ip` | `inet?` | Client IP address |

**Client-Side Session Object** (from Supabase JS):
```typescript
interface Session {
  access_token: string    // JWT for API calls
  refresh_token: string   // Token to refresh session
  expires_in: number      // Seconds until expiry
  expires_at: number      // Unix timestamp of expiry
  token_type: 'bearer'
  user: User              // Full user object
}
```

**Session Lifecycle**:
1. **Creation**: On successful login/signup
2. **Refresh**: Automatic via middleware or `supabase.auth.getUser()`
3. **Expiration**: Default 1 hour for access token, 1 week for refresh token
4. **Termination**: On explicit logout or token revocation

---

### 3. UserProfile (Application Type)

**Storage**: Client-side (derived from Supabase User)

```typescript
interface UserProfile {
  id: string          // Maps from auth.users.id
  email: string       // Maps from auth.users.email
  name?: string       // Maps from user_metadata.name
  role: UserRole      // Maps from user_metadata.role
  createdAt: string   // Maps from auth.users.created_at (ISO string)
}

type UserRole = 'student' | 'mentor'
```

**Transformation Function**:
```typescript
function supabaseUserToProfile(user: SupabaseUser): UserProfile {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    role: user.user_metadata?.role || 'student',
    createdAt: user.created_at,
  }
}
```

---

### 4. LoginAttempt (Client-Side Rate Limiting)

**Storage**: `localStorage` under key `login-attempts:{email}`

```typescript
interface LoginAttempt {
  count: number           // Failed attempts since last reset
  lockedUntil: number | null  // Unix timestamp when lockout ends
}
```

**State Transitions**:
```
Initial → { count: 0, lockedUntil: null }
    ↓ Failed login
{ count: 1-4, lockedUntil: null }
    ↓ 5th failed login
{ count: 0, lockedUntil: now + 5min }
    ↓ Lockout expires
{ count: 0, lockedUntil: null }
    ↓ Successful login
{ count: 0, lockedUntil: null } (reset)
```

---

## Entity Relationships

```
┌─────────────────────┐
│   auth.users        │
│  (Supabase managed) │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ user_metadata ──────┼──► { name, role }
│ created_at          │
└─────────┬───────────┘
          │
          │ 1:N
          ▼
┌─────────────────────┐
│   auth.sessions     │
│  (Supabase managed) │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ created_at          │
│ updated_at          │
└─────────────────────┘

          ↓ transforms to (client-side)

┌─────────────────────┐
│   UserProfile       │
│  (Application type) │
├─────────────────────┤
│ id                  │
│ email               │
│ name?               │
│ role                │
│ createdAt           │
└─────────────────────┘
```

---

## Validation Schemas (Zod)

### Login Schema
```typescript
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(1, 'Password is required'),
})
```

### Signup Schema
```typescript
const signupSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .max(100, 'Email too long')
    .email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[a-zA-Z]/, 'Password must contain letters')
    .regex(/[0-9]/, 'Password must contain numbers'),
  role: z.enum(['student', 'mentor']),
  name: z.string().max(100).optional(),
})
```

---

## Security Considerations

1. **Password Storage**: Handled entirely by Supabase (bcrypt, salted)
2. **Session Tokens**: Stored in HTTP-only cookies via `@supabase/ssr`
3. **RLS**: Supabase Auth tables have built-in Row Level Security
4. **Rate Limiting**: Supabase applies server-side limits; client-side for UX
5. **HTTPS**: Required for cookie security (Supabase enforces)
