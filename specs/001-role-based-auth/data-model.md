# Data Model: 역할 기반 인증 시스템

**Feature**: 001-role-based-auth
**Date**: 2026-01-14
**Purpose**: Phase 1 데이터 모델 정의 - 엔티티, 타입, 유효성 검사 규칙

## Overview

이 문서는 역할 기반 인증 시스템의 데이터 모델을 정의한다. Phase 1에서는 클라이언트 측 localStorage에 Mock 데이터를 저장하며, Phase 2에서 백엔드 데이터베이스로 마이그레이션 예정이다.

---

## Core Entities

### 1. User

사용자 계정을 나타내는 핵심 엔티티.

#### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 format | 사용자 고유 식별자 |
| `email` | `string` | Yes | Valid email format, Unique | 사용자 이메일 주소 (로그인 ID) |
| `passwordHash` | `string` | Yes | bcrypt hash | 해시된 비밀번호 (평문 저장 금지) |
| `name` | `string` | No | 2-50 characters | 사용자 표시 이름 (선택적) |
| `role` | `UserRole` | Yes | 'student' \| 'mentor' | 사용자 역할 |
| `createdAt` | `string` | Yes | ISO 8601 datetime | 계정 생성 시각 |

#### TypeScript Definition

```typescript
export interface User {
  id: string
  email: string
  passwordHash: string // 저장용 (클라이언트에 노출 금지)
  name?: string
  role: UserRole
  createdAt: string
}

export interface UserProfile {
  // 클라이언트에 노출되는 사용자 정보 (passwordHash 제외)
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: string
}

export type UserRole = 'student' | 'mentor'
```

#### Validation Rules

```typescript
// Zod schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .max(100, '이메일은 100자를 초과할 수 없습니다'),
  passwordHash: z.string(),
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 50자를 초과할 수 없습니다')
    .optional(),
  role: z.enum(['student', 'mentor'], {
    required_error: '역할을 선택해주세요'
  }),
  createdAt: z.string().datetime(),
})

// Password validation (before hashing)
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .max(100, '비밀번호는 100자를 초과할 수 없습니다')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    '비밀번호는 최소 한 개의 문자와 숫자를 포함해야 합니다'
  )
```

#### Uniqueness Constraints
- **email**: 시스템 전체에서 고유해야 함
- **id**: UUID v4로 생성, 중복 불가

#### State Transitions
사용자 엔티티는 상태 전이가 없음 (단순 CRUD). 향후 Phase에서 계정 활성화/비활성화 상태 추가 가능.

---

### 2. Session

인증된 사용자의 세션 정보를 나타내는 엔티티.

#### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `user` | `UserProfile` | Yes | - | 현재 로그인한 사용자 정보 |
| `isAuthenticated` | `boolean` | Yes | - | 인증 상태 플래그 |
| `loginAt` | `string` | No | ISO 8601 datetime | 로그인 시각 |

#### TypeScript Definition

```typescript
export interface Session {
  user: UserProfile | null
  isAuthenticated: boolean
  loginAt?: string
}
```

#### Storage
- **Phase 1**: localStorage에 Zustand persist middleware를 통해 저장
- **Phase 2**: httpOnly cookies + 서버 세션 관리로 마이그레이션

#### Lifecycle
1. **로그인 성공**: `isAuthenticated = true`, `user` 설정
2. **로그아웃**: `isAuthenticated = false`, `user = null`
3. **페이지 새로고침**: localStorage에서 복원 (hydration)
4. **브라우저 재시작**: localStorage에 저장되어 세션 유지

---

## Form Data Types

### LoginFormData

로그인 폼 입력 데이터.

```typescript
export interface LoginFormData {
  email: string
  password: string
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
})

export type LoginFormData = z.infer<typeof loginSchema>
```

### SignupFormData

회원가입 폼 입력 데이터.

```typescript
export interface SignupFormData {
  email: string
  password: string
  role: UserRole
}

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

export type SignupFormData = z.infer<typeof signupSchema>
```

---

## Response Types

### AuthResponse

인증 작업(로그인, 회원가입)의 응답 데이터.

```typescript
export interface AuthResponse {
  user: UserProfile
  message?: string
}

// Phase 2에서 token 추가 예정:
// export interface AuthResponse {
//   user: UserProfile
//   token: string
//   message?: string
// }
```

### AuthError

인증 오류 응답.

```typescript
export interface AuthError {
  message: string
  code?: 'INVALID_CREDENTIALS' | 'EMAIL_EXISTS' | 'VALIDATION_ERROR'
}

// 표준 오류 메시지 (보안상 구체적 실패 원인 노출 금지)
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
  EMAIL_EXISTS: '이미 사용 중인 이메일입니다',
  VALIDATION_ERROR: '입력 정보를 확인해주세요',
  NETWORK_ERROR: '일시적인 오류가 발생했습니다. 다시 시도해주세요',
} as const
```

---

## Enums & Constants

### UserRole

```typescript
export enum UserRole {
  Student = 'student',
  Mentor = 'mentor',
}

// Type-safe role labels
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Student]: '학생',
  [UserRole.Mentor]: '멘토',
}
```

### GNB Menu Items

역할별 Global Navigation Bar 메뉴 항목.

```typescript
export interface NavItem {
  label: string
  href: string
}

export const GUEST_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
]

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
  { label: '학습 자료', href: '/resources' },
  { label: '멘토 찾기', href: '/mentors' },
  { label: '마이페이지', href: '/profile' },
]

export const MENTOR_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
  { label: '포트폴리오 관리', href: '/portfolio' },
  { label: '학생 관리', href: '/students' },
  { label: '마이페이지', href: '/profile' },
]

export function getNavItemsForRole(role: UserRole | null): NavItem[] {
  if (!role) return GUEST_NAV_ITEMS

  switch (role) {
    case UserRole.Student:
      return STUDENT_NAV_ITEMS
    case UserRole.Mentor:
      return MENTOR_NAV_ITEMS
    default:
      return GUEST_NAV_ITEMS
  }
}
```

---

## Data Relationships

```
┌─────────────────────────────────────────────┐
│                   Session                    │
│ ─────────────────────────────────────────── │
│ + user: UserProfile | null                  │
│ + isAuthenticated: boolean                  │
│ + loginAt?: string                          │
└─────────────────────────────────────────────┘
                    │
                    │ 1:1 (if authenticated)
                    ▼
┌─────────────────────────────────────────────┐
│                 UserProfile                  │
│ ─────────────────────────────────────────── │
│ + id: string (UUID)                         │
│ + email: string (unique)                    │
│ + name?: string                             │
│ + role: UserRole                            │
│ + createdAt: string                         │
└─────────────────────────────────────────────┘
                    │
                    │ derived from
                    ▼
┌─────────────────────────────────────────────┐
│                    User                      │
│ ─────────────────────────────────────────── │
│ + id: string (UUID)                         │
│ + email: string (unique)                    │
│ + passwordHash: string (bcrypt)             │
│ + name?: string                             │
│ + role: UserRole                            │
│ + createdAt: string                         │
└─────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────────┐
│                 NavItems                     │
│ ─────────────────────────────────────────── │
│ Determined by role:                         │
│ - student → STUDENT_NAV_ITEMS              │
│ - mentor → MENTOR_NAV_ITEMS                │
│ - null → GUEST_NAV_ITEMS                   │
└─────────────────────────────────────────────┘
```

---

## Storage Schema

### localStorage Structure (Phase 1)

```typescript
// Key: 'mock-users'
// Value: Record<userId, User>
{
  "550e8400-e29b-41d4-a716-446655440000": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@example.com",
    "passwordHash": "$2a$10$N9qo8uLOickgx2ZMRZoM...",
    "name": "김학생",
    "role": "student",
    "createdAt": "2026-01-14T10:30:00.000Z"
  },
  "6ba7b810-9dad-11d1-80b4-00c04fd430c8": {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "email": "mentor@example.com",
    "passwordHash": "$2a$10$k7z5vL3NxYm3g6Q8r1U...",
    "name": "박멘토",
    "role": "mentor",
    "createdAt": "2026-01-14T09:15:00.000Z"
  }
}

// Key: 'auth-storage' (Zustand persist)
// Value: Session state
{
  "state": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "name": "김학생",
      "role": "student",
      "createdAt": "2026-01-14T10:30:00.000Z"
    },
    "isAuthenticated": true,
    "loginAt": "2026-01-14T12:45:30.123Z"
  },
  "version": 0
}
```

---

## Validation Summary

### Client-Side Validation (Real-time)

Zod schemas를 사용하여 React Hook Form과 통합:
- **이메일**: 필수, 형식 검증, 최대 100자
- **비밀번호**: 최소 8자, 최대 100자, 최소 1개 문자 + 1개 숫자
- **역할**: 필수, 'student' 또는 'mentor'만 허용

### Storage-Level Validation

- **이메일 중복 체크**: 회원가입 시 기존 사용자 이메일과 중복 확인
- **비밀번호 해싱**: bcrypt를 사용하여 저장 전 해싱 (Salt rounds: 10)
- **UUID 생성**: `crypto.randomUUID()`로 고유 ID 생성

---

## Migration Notes (Phase 1 → Phase 2)

### 데이터베이스 스키마 (PostgreSQL 예상)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(50),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'mentor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Session management (if using DB sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

### 주요 변경사항

1. **Storage**: localStorage → PostgreSQL
2. **Session**: 클라이언트 측 → httpOnly cookies + 서버 세션
3. **Validation**: 클라이언트 측만 → 클라이언트 + 서버 측 이중 검증
4. **Password Hashing**: 클라이언트 측 → 서버 측 (더 안전)
5. **Token**: Mock token → JWT 또는 Session ID

---

## Conclusion

이 데이터 모델은 Phase 1의 클라이언트 측 Mock 인증을 지원하면서도, Phase 2의 백엔드 통합을 위한 명확한 구조를 제공한다. 모든 타입은 TypeScript와 Zod로 정의되어 타입 안전성과 런타임 유효성 검사를 모두 보장한다.
