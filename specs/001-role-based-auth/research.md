# Research: 역할 기반 인증 시스템

**Feature**: 001-role-based-auth
**Date**: 2026-01-14
**Purpose**: Phase 0 연구 결과 - 기술 선택 및 구현 패턴 문서화

## Overview

이 문서는 클라이언트 측 인증 시스템 구현을 위한 기술 결정사항과 모범 사례를 정리한다. Zustand, bcryptjs, React Hook Form, Zod, Next.js App Router를 활용하여 Phase 1 Mock 인증을 구현하고, Phase 2 API 통합으로의 명확한 전환 경로를 제시한다.

---

## 1. Zustand localStorage 지속성

### Decision
Zustand의 persist middleware를 hydration guard와 함께 사용하여 SSR 불일치를 방지한다.

### Rationale
- Zustand persist middleware는 localStorage와의 원활한 통합을 제공
- `skipHydration: true` 옵션으로 SSR/SSG와 클라이언트 스토리지 간 hydration 불일치 방지
- Hydration 플래그를 사용하여 잘못된 인증 상태의 깜빡임(flash) 방지
- Next.js App Router와 호환되는 패턴

### Alternatives Considered
1. **Cookie 기반 지속성**: 더 안전(httpOnly), 하지만 서버 설정 필요 (Phase 2에서 적용 예정)
2. **sessionStorage**: 더 안전(탭 닫힘 시 삭제), 하지만 "로그인 유지" 기능에 불리
3. **IndexedDB**: 더 복잡하고, 단순 인증 상태에는 과도함
4. **이중 렌더링**: SSR/클라이언트 불일치를 허용하고 콘솔 경고 수용 (좋지 않은 UX)

### Implementation Pattern
```typescript
// stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // ... actions
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // SSR hydration 문제 방지
    }
  )
)

// hooks/use-hydration.ts - hydration guard
export function useHydration() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    useAuthStore.persist.rehydrate()
    setHydrated(true)
  }, [])
  return hydrated
}
```

### Security Considerations
- **XSS 취약점**: localStorage는 같은 origin의 모든 JavaScript에서 접근 가능
- **완화 방안**: Phase 1에서는 허용 가능한 위험, Phase 2에서 httpOnly cookie로 마이그레이션
- **저장 금지**: 비밀번호, 전체 신용카드 번호 등 민감한 데이터는 절대 저장하지 않음

---

## 2. 브라우저 환경에서 bcryptjs 사용

### Decision
브라우저에서 모든 비밀번호 작업에 bcryptjs의 비동기 메서드(hash/compare)를 사용한다.

### Rationale
- **성능**: 해싱은 CPU 집약적이므로 비동기 처리로 UI 블로킹 방지
- **UX**: 비동기 처리로 비밀번호 해싱 중 진행 표시기 표시 가능
- **브라우저 호환성**: bcryptjs는 순수 JavaScript로 모든 브라우저에서 동작
- **구현**: 비동기 메서드는 청크 단위 계산을 사용하여 이벤트 루프에 양보

### Technical Details
- Salt rounds: 10 (클라이언트 측에서 보안과 성능의 균형)
- 각 청크 완료 시 다음 청크를 이벤트 큐에 배치
- 비싼 작업 중에도 브라우저가 멈추지 않음

### Alternatives Considered
1. **동기 메서드**: UI 블로킹, 나쁜 UX, 더 간단한 코드
2. **Web Crypto API**: 네이티브, 더 빠름, 하지만 더 복잡한 API
3. **서버 측만**: 더 안전하지만 Phase 1에 백엔드 필요
4. **argon2**: 더 안전하지만 브라우저 지원 제한적

### Implementation Pattern
```typescript
// lib/auth/password.ts
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

// 사용 예시 - 로딩 표시와 함께
const handleRegister = async (data: RegisterFormData) => {
  setIsLoading(true)
  try {
    const hashedPassword = await hashPassword(data.password)
    await authStore.register({ ...data, password: hashedPassword })
  } finally {
    setIsLoading(false)
  }
}
```

---

## 3. React Hook Form + Zod 통합

### Decision
`@hookform/resolvers/zod`를 사용하고, 유효성 검사 모드는 "onBlur"(초기) + "onChange"(오류 발생 후)로 설정한다.

### Rationale
- **최고의 UX**: 사용자가 필드를 벗어날 때까지 유효성 검사하지 않음 (덜 방해적)
- **즉각적 피드백**: 오류 표시 후에는 변경 시 유효성 검사 (사용자가 문제를 쉽게 수정)
- **타입 안전성**: Zod 스키마가 전체 TypeScript 타입 추론 제공
- **코드 재사용**: 동일한 스키마를 클라이언트와 서버 측에서 사용 가능

### Alternatives Considered
1. **Formik**: 더 성숙하지만 무겁고 덜 성능적
2. **수동 유효성 검사**: 완전한 제어, 하지만 많은 보일러플레이트
3. **Yup**: Zod와 유사하지만 Zod가 더 나은 TypeScript 통합
4. **onSubmit만**: 더 간단하지만 오류를 조기에 발견하는 UX가 나쁨

### Implementation Pattern
```typescript
// lib/validation/auth-schemas.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
})

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
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

// components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',             // blur 시 초기 유효성 검사
    reValidateMode: 'onChange',  // 첫 오류 후에는 변경 시 유효성 검사
  })

  // ...
}
```

### Validation Mode Comparison
| Mode | When Validates | Best For |
|------|---------------|----------|
| `onSubmit` | 폼 제출 시만 | 단순한 폼, 덜 방해적 |
| `onBlur` | 필드 벗어날 때 | **인증 폼 권장** - 좋은 UX 균형 |
| `onChange` | 모든 키 입력마다 | 실시간 유효성 검사, 방해적일 수 있음 |
| `onTouched` | 첫 blur, 그 다음 onChange | onBlur와 onChange 사이 균형 |

---

## 4. Next.js App Router 라우트 보호

### Decision
**다층 방어**: Middleware(리다이렉트) + 컴포넌트 레벨 가드 + 데이터 접근 검증(향후)을 함께 사용한다.

### Rationale
- **CVE-2025-29927**: Middleware만으로는 불충분, 심층 방어 필요
- **성능**: Middleware는 렌더링 전 엣지에서 실행 (가장 빠름)
- **UX**: 승인되지 않은 페이지 로드 방지 및 리소스 낭비 차단
- **보안**: 컴포넌트 가드 + 데이터 검증으로 우회 공격 방지

### Critical Security Update (2025)
CVE-2025-29927에 따라 애플리케이션은 반드시:
1. Next.js 15.2.3+, 14.2.25+, 13.5.9+, 또는 12.3.5+ 로 업그레이드
2. 권한 부여를 middleware에만 의존하지 말 것
3. 모든 데이터 접근 지점에서 세션 검증 (Data Access Layer 패턴)

### Alternatives Considered
1. **Middleware만**: 불충분(CVE-2025-29927), 하지만 리다이렉트에는 좋음
2. **컴포넌트만**: 나쁜 UX(콘텐츠 깜빡임), 클라이언트 측만
3. **Server Components**: 데이터 가져오기에 좋음, 인증 컨텍스트 설정 필요
4. **HOC 패턴**: 작동하지만 가드보다 덜 조합 가능

### Implementation Pattern
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // localStorage는 서버에서 접근 불가하므로
  // Phase 1에서는 기본 경로 기반 보호만 수행
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/gallery/') &&
                         request.nextUrl.pathname.split('/').length > 2

  // Phase 2에서는 cookie 기반 검증 추가 예정
  return NextResponse.next()
}

export const config = {
  matcher: ['/gallery/:path*', '/login', '/signup']
}

// components/auth/ProtectedRoute.tsx - 클라이언트 측 가드
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // 원래 목적지 URL 저장
      const returnUrl = window.location.pathname
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div>리다이렉트 중...</div>
  }

  return <>{children}</>
}
```

### Performance Optimization
- `matcher` 설정으로 middleware 범위 제한 (모든 경로에서 실행 방지)
- Middleware는 가볍게 유지 (무거운 계산 금지)
- 정적 자산에서는 middleware 실행 방지

---

## 5. Mock 인증 패턴

### Decision
서비스 레이어 추상화를 사용하여 localStorage 기반 Mock 구현을 제공하고, API 전환이 쉽도록 설계한다.

### Rationale
- **관심사 분리**: 인증 로직이 Mock 데이터로부터 격리됨
- **쉬운 전환**: 컴포넌트 변경 없이 서비스 구현만 교체
- **테스팅**: Mock 서비스로 쉬운 단위 테스트 가능
- **타입 안전성**: 공유 타입으로 API 계약 일관성 보장

### Alternatives Considered
1. **스토어에 직접 localStorage**: 강하게 결합됨, 전환 어려움
2. **MSW (Mock Service Worker)**: 테스팅에 훌륭하지만 단순 Mock에는 과도함
3. **JSON 파일**: 정적 데이터, 회원가입/비밀번호 변경 처리 불가
4. **메모리만**: 새로고침 시 손실, 나쁜 UX

### Implementation Pattern
```typescript
// types/auth.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'mentor'
  createdAt: string
}

export interface AuthService {
  login(credentials: Credentials): Promise<AuthResponse>
  register(data: RegisterData): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
}

// lib/auth/mock-auth.service.ts
class MockAuthService implements AuthService {
  private getUsers(): Record<string, User & { passwordHash: string }> {
    const users = localStorage.getItem('mock-users')
    return users ? JSON.parse(users) : {}
  }

  async login(credentials: Credentials): Promise<AuthResponse> {
    const users = this.getUsers()
    const user = Object.values(users).find(u => u.email === credentials.email)

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const isValid = await verifyPassword(credentials.password, user.passwordHash)
    if (!isValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const { passwordHash, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const users = this.getUsers()

    if (Object.values(users).some(u => u.email === data.email)) {
      throw new Error('이미 사용 중인 이메일입니다')
    }

    const passwordHash = await hashPassword(data.password)
    const user: User & { passwordHash: string } = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name || data.email.split('@')[0],
      role: data.role,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    users[user.id] = user
    localStorage.setItem('mock-users', JSON.stringify(users))

    const { passwordHash: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  }

  async logout(): Promise<void> {
    // Phase 1에서는 클라이언트 측 상태 관리만
  }

  async getCurrentUser(): Promise<User | null> {
    // Zustand persist에서 관리되므로 여기서는 null 반환
    return null
  }
}

export const authService = new MockAuthService()

// lib/auth/index.ts
export { authService } from './mock-auth.service'
// Phase 2: export { authService } from './api-auth.service'
```

### Transition Strategy (Phase 1 → Phase 2)
1. **Phase 1**: `MockAuthService`를 localStorage와 함께 사용
2. **API 계약 생성**: 공유 타입 및 인터페이스 정의
3. **API 서비스 구현**: 동일한 인터페이스를 만족하는 `ApiAuthService` 구축
4. **환경 변수 토글**: `NEXT_PUBLIC_USE_MOCK_AUTH`로 전환
5. **테스팅**: 두 서비스 모두 테스트하여 계약 준수 확인
6. **점진적 마이그레이션**: 환경별로 전환 (dev, staging, prod)
7. **Mock 제거**: 전체 API 전환 후 Mock 서비스 삭제

---

## 보안 고려사항 요약

### XSS 취약점
- **localStorage**: 모든 JavaScript에서 접근 가능, XSS에 취약
- **완화**: 입력 정제, Content Security Policy (CSP)
- **Phase 2**: 토큰 저장을 httpOnly cookies로 마이그레이션

### 클라이언트 측 해싱
- **위험**: 클라이언트 측에 해시된 비밀번호가 저장되지만, XSS가 스토리지를 손상시키면 여전히 취약
- **완화**: Phase 1에서는 허용 가능한 위험, Phase 2에서 해싱을 서버 측으로 이동
- **절대 저장 금지**: 평문 비밀번호, 임시로도 안 됨

### 데이터 노출
- **localStorage**: 모든 확장 프로그램, 개발자 도구, XSS 공격으로 읽기 가능
- **저장 가능**: 사용자 ID, 이름, 이메일, 비민감 설정
- **절대 저장 금지**: 비밀번호, 결제 정보, 주민등록번호, 민감한 개인정보

### OWASP 권장사항 (2026)
- localStorage에 세션 식별자를 저장하지 말 것
- 프로덕션 인증에는 httpOnly, Secure, SameSite 쿠키 사용
- Content Security Policy (CSP) 헤더 구현
- 모든 사용자 입력 유효성 검사 및 정제
- 프로덕션에서 HTTPS 사용

### Phase 2 마이그레이션 우선순위
1. 인증을 서버 측 API로 이동
2. httpOnly 쿠키 기반 세션 구현
3. CSRF 보호 추가
4. Rate limiting 구현
5. 감사 로깅 추가
6. 보안 세션 관리 라이브러리 사용

---

## 구현 체크리스트

### Phase 1: 클라이언트 측 Mock 인증

- [ ] 의존성 설치: `zustand`, `bcryptjs`, `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] 로그인/회원가입 폼용 Zod 스키마 생성
- [ ] localStorage 기반 MockAuthService 구현
- [ ] persist middleware를 사용한 Zustand 스토어 생성
- [ ] Hydration guard 구현 (AuthGuard 컴포넌트)
- [ ] React Hook Form + Zod로 로그인/회원가입 폼 생성
- [ ] 라우트 보호 middleware 구현
- [ ] 컴포넌트 레벨 RouteGuard 추가
- [ ] 비동기 작업 중 로딩 상태 추가
- [ ] 전체 인증 플로우 테스트 (회원가입 → 로그인 → 보호된 경로 → 로그아웃)

### Phase 2: API 통합

- [ ] API 엔드포인트 생성 (login, register, logout, verify)
- [ ] 인터페이스를 만족하는 ApiAuthService 구현
- [ ] 서비스 토글용 환경 변수 추가
- [ ] httpOnly 쿠키 기반 세션 구현
- [ ] CSRF 보호 추가
- [ ] 비밀번호 해싱을 서버 측으로 이동
- [ ] Rate limiting 구현
- [ ] 감사 로깅 추가
- [ ] 쿠키에서 읽도록 middleware 업데이트
- [ ] API 통합 테스트
- [ ] Mock 서비스 제거

---

## 결론

이 인증 시스템은 빠른 Phase 1 개발과 명확한 Phase 2 마이그레이션 경로의 균형을 맞춘다. 주요 결정사항은 다음을 우선시한다:

1. **개발자 경험**: 최소한의 보일러플레이트로 타입 안전하고 유효성 검사된 폼
2. **사용자 경험**: 적절한 로딩 상태를 갖춘 빠르고 반응적인 UI
3. **보안**: 프로덕션 수준 인증으로의 명확한 업그레이드 경로를 가진 심층 방어
4. **유지보수성**: 서비스 추상화로 쉬운 테스팅과 API 전환 가능

Mock 우선 접근 방식은 프로덕션 요구사항으로 확장되는 아키텍처 패턴을 유지하면서 즉각적인 기능 개발을 가능하게 한다.
