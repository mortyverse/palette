# Quickstart: 역할 기반 인증 시스템

**Feature**: 001-role-based-auth
**Date**: 2026-01-14
**Purpose**: 개발자를 위한 빠른 시작 가이드

## 개요

이 가이드는 역할 기반 인증 시스템 구현을 시작하는 개발자를 위한 단계별 지침을 제공한다. Phase 1(Mock 인증)부터 Phase 2(API 통합)까지의 전체 과정을 다룬다.

---

## Prerequisites

### Required Tools

- Node.js 20+ (LTS 권장)
- npm 또는 yarn
- Git
- 코드 에디터 (VS Code 권장)

### Required Knowledge

- TypeScript 기본 지식
- React 및 React Hooks
- Next.js App Router 기본 개념
- 상태 관리 라이브러리 경험 (선호사항)

---

## Phase 1: Mock 인증 구현

### Step 1: 의존성 설치

```bash
# Navigate to project root
cd /path/to/palette

# Install dependencies
npm install zustand bcryptjs react-hook-form zod @hookform/resolvers

# Install dev dependencies
npm install -D @types/bcryptjs
```

### Step 2: 프로젝트 구조 생성

```bash
# Create directory structure
mkdir -p src/{components/{auth,layout,ui},lib/{auth,validation},store,types}
mkdir -p app/\(auth\)/{login,signup}
mkdir -p app/gallery/[id]
mkdir -p __tests__/{components/auth,lib/auth,integration}
```

### Step 3: 타입 정의 생성

`src/types/auth.ts` 파일을 생성하고 핵심 타입을 정의한다:

```typescript
// src/types/auth.ts
export type UserRole = 'student' | 'mentor'

export interface User {
  id: string
  email: string
  passwordHash: string
  name?: string
  role: UserRole
  createdAt: string
}

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

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: 'INVALID_CREDENTIALS' | 'EMAIL_EXISTS' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
```

### Step 4: Zod 스키마 생성

`src/lib/validation/auth-schemas.ts` 파일을 생성한다:

```typescript
// src/lib/validation/auth-schemas.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
})

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .max(100, '이메일은 100자를 초과할 수 없습니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 100자를 초과할 수 없습니다')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      '비밀번호는 최소 한 개의 문자와 숫자를 포함해야 합니다'
    ),
  role: z.enum(['student', 'mentor'], {
    required_error: '역할을 선택해주세요'
  })
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
```

### Step 5: 비밀번호 유틸리티 생성

`src/lib/auth/password.ts` 파일을 생성한다:

```typescript
// src/lib/auth/password.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

### Step 6: Mock 인증 서비스 생성

`src/lib/auth/mock-auth.service.ts` 파일을 생성한다:

```typescript
// src/lib/auth/mock-auth.service.ts
import { hashPassword, verifyPassword } from './password'
import type {
  LoginCredentials,
  RegisterData,
  UserProfile,
  User,
  AuthError
} from '@/types/auth'

const MOCK_USERS_KEY = 'mock-users'

class MockAuthService {
  private getUsers(): Record<string, User> {
    if (typeof window === 'undefined') return {}
    const users = localStorage.getItem(MOCK_USERS_KEY)
    return users ? JSON.parse(users) : {}
  }

  private saveUsers(users: Record<string, User>) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
  }

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const users = this.getUsers()
    const user = Object.values(users).find(u => u.email === credentials.email)

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const isValid = await verifyPassword(credentials.password, user.passwordHash)
    if (!isValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const { passwordHash, ...userProfile } = user
    return userProfile
  }

  async register(data: RegisterData): Promise<UserProfile> {
    const users = this.getUsers()

    if (Object.values(users).some(u => u.email === data.email)) {
      throw new Error('이미 사용 중인 이메일입니다')
    }

    const passwordHash = await hashPassword(data.password)
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      createdAt: new Date().toISOString(),
    }

    users[user.id] = user
    this.saveUsers(users)

    const { passwordHash: _, ...userProfile } = user
    return userProfile
  }

  async logout(): Promise<void> {
    // Zustand store handles state clearing
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    // Zustand persist handles this
    return null
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const users = this.getUsers()
    return !Object.values(users).some(u => u.email === email)
  }
}

export const authService = new MockAuthService()
```

### Step 7: Zustand 스토어 생성

`src/store/auth-store.ts` 파일을 생성한다:

```typescript
// src/store/auth-store.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/lib/auth/mock-auth.service'
import type { UserProfile, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  loginAt?: string
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginAt: undefined,

      login: async (credentials) => {
        const user = await authService.login(credentials)
        set({
          user,
          isAuthenticated: true,
          loginAt: new Date().toISOString()
        })
      },

      register: async (data) => {
        const user = await authService.register(data)
        set({
          user,
          isAuthenticated: true,
          loginAt: new Date().toISOString()
        })
      },

      logout: async () => {
        await authService.logout()
        set({
          user: null,
          isAuthenticated: false,
          loginAt: undefined
        })
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)
```

### Step 8: Hydration 훅 생성

`src/hooks/use-hydration.ts` 파일을 생성한다:

```typescript
// src/hooks/use-hydration.ts
'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    useAuthStore.persist.rehydrate()
    setHydrated(true)
  }, [])

  return hydrated
}
```

### Step 9: 인증 폼 컴포넌트 생성

로그인 폼 (`src/components/auth/LoginForm.tsx`):

```typescript
// src/components/auth/LoginForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { loginSchema, type LoginFormData } from '@/lib/validation/auth-schemas'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore(state => state.login)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          이메일
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="mt-1 block w-full rounded border px-3 py-2"
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          비밀번호
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="mt-1 block w-full rounded border px-3 py-2"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
```

회원가입 폼은 유사한 패턴으로 생성 (`src/components/auth/SignupForm.tsx`)

### Step 10: 라우트 보호 컴포넌트 생성

`src/components/auth/ProtectedRoute.tsx` 파일을 생성한다:

```typescript
// src/components/auth/ProtectedRoute.tsx
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useHydration } from '@/hooks/use-hydration'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const returnUrl = window.location.pathname
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) {
    return <div>로딩 중...</div>
  }

  if (!isAuthenticated) {
    return <div>리다이렉트 중...</div>
  }

  return <>{children}</>
}
```

### Step 11: GNB 컴포넌트 생성

`src/components/layout/GNB.tsx` 파일을 생성한다:

```typescript
// src/components/layout/GNB.tsx
'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useHydration } from '@/hooks/use-hydration'

const GUEST_NAV = [
  { label: '갤러리', href: '/gallery' },
]

const STUDENT_NAV = [
  { label: '갤러리', href: '/gallery' },
  { label: '학습 자료', href: '/resources' },
  { label: '멘토 찾기', href: '/mentors' },
  { label: '마이페이지', href: '/profile' },
]

const MENTOR_NAV = [
  { label: '갤러리', href: '/gallery' },
  { label: '포트폴리오 관리', href: '/portfolio' },
  { label: '학생 관리', href: '/students' },
  { label: '마이페이지', href: '/profile' },
]

export function GNB() {
  const hydrated = useHydration()
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!hydrated) {
    return <nav className="border-b p-4">로딩 중...</nav>
  }

  const navItems = !isAuthenticated
    ? GUEST_NAV
    : user?.role === 'student'
    ? STUDENT_NAV
    : MENTOR_NAV

  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span>{user?.email}</span>
              <button
                onClick={() => logout()}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                로그인
              </Link>
              <Link href="/signup" className="px-3 py-1 text-sm bg-gray-200 rounded">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
```

### Step 12: 페이지 생성

로그인 페이지 (`app/(auth)/login/page.tsx`):

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <LoginForm />
      </div>
    </div>
  )
}
```

갤러리 상세 페이지 (보호됨) (`app/gallery/[id]/page.tsx`):

```typescript
// app/gallery/[id]/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">갤러리 상세 페이지</h1>
        <p>작품 ID: {params.id}</p>
        <p>이 페이지는 로그인한 사용자만 볼 수 있습니다.</p>
      </div>
    </ProtectedRoute>
  )
}
```

### Step 13: 테스트

```bash
# Start development server
npm run dev

# Test flow:
# 1. 회원가입: http://localhost:3000/signup
# 2. 로그인: http://localhost:3000/login
# 3. 갤러리 상세: http://localhost:3000/gallery/1 (로그인 필요)
# 4. 로그아웃 후 다시 갤러리 상세 접근 시 로그인 페이지로 리다이렉트 확인
```

---

## Phase 2: API 통합 (향후)

### Step 1: API 서비스 생성

`src/lib/auth/api-auth.service.ts` 파일을 생성한다:

```typescript
// src/lib/auth/api-auth.service.ts
import type {
  LoginCredentials,
  RegisterData,
  UserProfile
} from '@/types/auth'

class ApiAuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // httpOnly cookies
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const data = await response.json()
    return data.user
  }

  async register(data: RegisterData): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '회원가입에 실패했습니다')
    }

    const result = await response.json()
    return result.user
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      credentials: 'include',
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.user
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/auth/check-email?email=${encodeURIComponent(email)}`,
      { credentials: 'include' }
    )

    if (!response.ok) return false

    const data = await response.json()
    return data.available
  }
}

export const authService = new ApiAuthService()
```

### Step 2: 서비스 전환

`src/lib/auth/index.ts` 파일을 생성하여 서비스를 선택한다:

```typescript
// src/lib/auth/index.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

export const authService = USE_MOCK
  ? require('./mock-auth.service').authService
  : require('./api-auth.service').authService
```

모든 import를 `@/lib/auth/index`로 변경:

```typescript
// Before
import { authService } from '@/lib/auth/mock-auth.service'

// After
import { authService } from '@/lib/auth'
```

### Step 3: 환경 변수 설정

`.env.local` 파일에 추가:

```bash
# Phase 1: Mock
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Phase 2: API
# NEXT_PUBLIC_USE_MOCK_AUTH=false
# NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

---

## Troubleshooting

### Hydration Mismatch Error

**문제**: "Text content does not match server-rendered HTML" 오류 발생

**해결**:
1. `useHydration` 훅을 사용하여 hydration 완료까지 로딩 표시
2. `skipHydration: true` 옵션이 Zustand persist에 설정되어 있는지 확인

### localStorage Not Defined

**문제**: "localStorage is not defined" 오류 (SSR 환경)

**해결**:
1. 모든 localStorage 접근을 `typeof window !== 'undefined'`로 보호
2. Mock 서비스에 이미 구현되어 있음

### bcrypt Hashing Too Slow

**문제**: 비밀번호 해싱 중 UI가 멈춤

**해결**:
1. 비동기 메서드(`bcrypt.hash`, `bcrypt.compare`) 사용 확인
2. Salt rounds를 10 이하로 유지
3. 로딩 표시기 추가

---

## Next Steps

1. **UI 개선**: Tailwind CSS를 사용한 모바일 우선 디자인 구현
2. **테스트 작성**: Jest + React Testing Library로 단위/통합 테스트
3. **API 백엔드 구현**: Phase 2 준비를 위한 서버 API 개발
4. **보안 강화**: Phase 2에서 httpOnly cookies, CSRF 보호 추가

---

## Resources

- [Next.js 문서](https://nextjs.org/docs)
- [Zustand 문서](https://zustand.docs.pmnd.rs/)
- [React Hook Form 문서](https://react-hook-form.com/)
- [Zod 문서](https://zod.dev/)
- [프로젝트 Spec 문서](./spec.md)
- [구현 계획 문서](./plan.md)
- [데이터 모델 문서](./data-model.md)
- [서비스 계약 문서](./contracts/auth-service.contract.md)
