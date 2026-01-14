# Authentication Service Contract

**Feature**: 001-role-based-auth
**Date**: 2026-01-14
**Purpose**: Phase 1 서비스 계약 정의 - Mock과 API 구현 모두 준수해야 하는 인터페이스

## Overview

이 문서는 인증 서비스가 구현해야 하는 계약(contract)을 정의한다. Phase 1의 MockAuthService와 Phase 2의 ApiAuthService는 모두 이 계약을 준수해야 하며, 이를 통해 구현 교체 시 컴포넌트 변경 없이 전환할 수 있다.

---

## Service Interface

### IAuthService

```typescript
export interface IAuthService {
  /**
   * 사용자 로그인
   * @param credentials - 이메일과 비밀번호
   * @returns 사용자 프로필
   * @throws AuthError - 인증 실패 시
   */
  login(credentials: LoginCredentials): Promise<UserProfile>

  /**
   * 사용자 회원가입
   * @param data - 회원가입 정보
   * @returns 생성된 사용자 프로필
   * @throws AuthError - 이메일 중복 또는 유효성 검사 실패 시
   */
  register(data: RegisterData): Promise<UserProfile>

  /**
   * 사용자 로그아웃
   * @returns void
   */
  logout(): Promise<void>

  /**
   * 현재 인증된 사용자 조회
   * @returns 현재 사용자 프로필 또는 null
   */
  getCurrentUser(): Promise<UserProfile | null>

  /**
   * 이메일 중복 확인
   * @param email - 확인할 이메일
   * @returns 사용 가능 여부 (true: 사용 가능, false: 중복)
   */
  checkEmailAvailability(email: string): Promise<boolean>
}
```

---

## Operation Contracts

### 1. Login

#### Input

```typescript
interface LoginCredentials {
  email: string    // Valid email format
  password: string // Plain text password (client-side)
}
```

#### Output (Success)

```typescript
interface UserProfile {
  id: string
  email: string
  name?: string
  role: 'student' | 'mentor'
  createdAt: string
}
```

#### Errors

| Error Code | HTTP Status | Message | When |
|-----------|-------------|---------|------|
| `INVALID_CREDENTIALS` | 401 | "이메일 또는 비밀번호가 올바르지 않습니다" | 이메일이 존재하지 않거나 비밀번호가 틀린 경우 |
| `VALIDATION_ERROR` | 400 | "입력 정보를 확인해주세요" | 이메일 형식이 잘못된 경우 |
| `NETWORK_ERROR` | 500 | "일시적인 오류가 발생했습니다. 다시 시도해주세요" | 네트워크 또는 서버 오류 |

#### Behavior Specification

1. **입력 유효성 검사**:
   - 이메일 형식 검증
   - 비밀번호 비어있지 않은지 확인

2. **인증 처리**:
   - Phase 1: localStorage에서 사용자 조회 후 bcrypt로 비밀번호 검증
   - Phase 2: 서버 API 호출 및 응답 처리

3. **오류 처리**:
   - 이메일이 존재하지 않는 경우: `INVALID_CREDENTIALS`
   - 비밀번호가 틀린 경우: `INVALID_CREDENTIALS` (동일한 메시지, 보안상 구분하지 않음)
   - 네트워크 오류: `NETWORK_ERROR`

4. **성공 시**:
   - 사용자 프로필 반환 (passwordHash 제외)
   - Phase 1: Zustand store가 세션 상태 업데이트 처리
   - Phase 2: httpOnly cookie 설정은 서버에서 처리

#### Example Usage

```typescript
try {
  const userProfile = await authService.login({
    email: 'student@example.com',
    password: 'Password123'
  })

  // Success: userProfile contains { id, email, name, role, createdAt }
  console.log(`Logged in as ${userProfile.role}`)
} catch (error) {
  if (error instanceof AuthError) {
    // Handle specific auth errors
    console.error(error.message)
  }
}
```

---

### 2. Register

#### Input

```typescript
interface RegisterData {
  email: string        // Valid email format, unique
  password: string     // Min 8 chars, must contain letter + number
  role: 'student' | 'mentor'
  name?: string        // Optional, 2-50 characters if provided
}
```

#### Output (Success)

```typescript
interface UserProfile {
  id: string           // Generated UUID
  email: string
  name?: string
  role: 'student' | 'mentor'
  createdAt: string    // ISO 8601 datetime
}
```

#### Errors

| Error Code | HTTP Status | Message | When |
|-----------|-------------|---------|------|
| `EMAIL_EXISTS` | 409 | "이미 사용 중인 이메일입니다" | 이메일이 이미 등록된 경우 |
| `VALIDATION_ERROR` | 400 | "입력 정보를 확인해주세요" | 유효성 검사 실패 (이메일 형식, 비밀번호 규칙 등) |
| `NETWORK_ERROR` | 500 | "일시적인 오류가 발생했습니다. 다시 시도해주세요" | 네트워크 또는 서버 오류 |

#### Behavior Specification

1. **입력 유효성 검사**:
   - 이메일: 형식 검증, 최대 100자
   - 비밀번호: 최소 8자, 최소 1개 문자 + 1개 숫자 포함
   - 역할: 'student' 또는 'mentor'만 허용
   - 이름(선택적): 2-50자 (제공된 경우)

2. **중복 확인**:
   - 이메일 중복 확인
   - 중복 시 `EMAIL_EXISTS` 오류 발생

3. **사용자 생성**:
   - Phase 1:
     - UUID 생성: `crypto.randomUUID()`
     - 비밀번호 해싱: `bcrypt.hash(password, 10)`
     - localStorage에 사용자 저장
   - Phase 2:
     - 서버 API로 POST 요청
     - 서버에서 UUID 생성 및 비밀번호 해싱 처리

4. **성공 시**:
   - 생성된 사용자 프로필 반환
   - 자동 로그인 처리 (Zustand store 업데이트)

#### Example Usage

```typescript
try {
  const userProfile = await authService.register({
    email: 'newuser@example.com',
    password: 'SecurePass123',
    role: 'student',
    name: '김학생'
  })

  // Success: auto-logged in
  console.log(`Registered as ${userProfile.role}`)
} catch (error) {
  if (error instanceof AuthError && error.code === 'EMAIL_EXISTS') {
    console.error('이메일이 이미 사용 중입니다')
  }
}
```

---

### 3. Logout

#### Input

```typescript
void
```

#### Output (Success)

```typescript
void
```

#### Errors

이 작업은 실패하지 않는다. 오류가 발생해도 조용히 무시한다.

#### Behavior Specification

1. **Phase 1**:
   - Zustand store의 세션 상태 초기화 (store가 처리)
   - 특별한 서비스 로직 불필요

2. **Phase 2**:
   - 서버 API로 POST /auth/logout 요청
   - 서버에서 세션/토큰 무효화 처리
   - httpOnly cookie 삭제는 서버에서 처리

3. **항상 성공**:
   - 네트워크 오류가 발생해도 클라이언트 측 상태는 초기화됨
   - 사용자 경험에 영향 없음

#### Example Usage

```typescript
await authService.logout()
// Always succeeds, state is cleared
```

---

### 4. GetCurrentUser

#### Input

```typescript
void
```

#### Output (Success)

```typescript
UserProfile | null

// null: Not authenticated
// UserProfile: Currently authenticated user
```

#### Errors

이 작업은 오류를 던지지 않는다. 인증되지 않은 경우 `null`을 반환한다.

#### Behavior Specification

1. **Phase 1**:
   - localStorage의 'auth-storage' 키에서 세션 조회
   - Zustand persist가 이미 상태 관리하므로 실제로는 store에서 조회
   - 이 메서드는 주로 페이지 새로고침 시 hydration용

2. **Phase 2**:
   - 서버 API로 GET /auth/me 요청
   - httpOnly cookie가 자동으로 전송됨
   - 서버에서 세션 검증 후 사용자 정보 반환

3. **반환 값**:
   - 유효한 세션: `UserProfile` 객체
   - 세션 없음/만료: `null`

#### Example Usage

```typescript
const currentUser = await authService.getCurrentUser()

if (currentUser) {
  console.log(`Logged in as ${currentUser.email}`)
} else {
  console.log('Not authenticated')
}
```

---

### 5. CheckEmailAvailability

#### Input

```typescript
email: string // Email to check
```

#### Output (Success)

```typescript
boolean

// true: Email is available
// false: Email is already registered
```

#### Errors

| Error Code | HTTP Status | Message | When |
|-----------|-------------|---------|------|
| `VALIDATION_ERROR` | 400 | "올바른 이메일 형식이 아닙니다" | 이메일 형식이 잘못된 경우 |
| `NETWORK_ERROR` | 500 | "일시적인 오류가 발생했습니다. 다시 시도해주세요" | 네트워크 또는 서버 오류 |

#### Behavior Specification

1. **입력 유효성 검사**:
   - 이메일 형식 검증
   - 형식이 잘못된 경우 `VALIDATION_ERROR` 발생

2. **중복 확인**:
   - Phase 1: localStorage의 모든 사용자에서 이메일 검색
   - Phase 2: 서버 API로 GET /auth/check-email?email={email} 요청

3. **반환 값**:
   - `true`: 사용 가능 (중복 없음)
   - `false`: 이미 사용 중 (중복 있음)

#### Example Usage

```typescript
const isAvailable = await authService.checkEmailAvailability('test@example.com')

if (isAvailable) {
  console.log('Email is available')
} else {
  console.log('Email is already taken')
}
```

---

## Error Handling Contract

### AuthError Class

```typescript
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

### Error Response Format

모든 구현은 동일한 오류 형식을 따라야 한다:

```typescript
throw new AuthError(
  '이메일 또는 비밀번호가 올바르지 않습니다',
  'INVALID_CREDENTIALS'
)
```

---

## Implementation Requirements

### Phase 1: MockAuthService

Phase 1 구현은 다음을 준수해야 한다:

1. **Storage**:
   - `localStorage.getItem('mock-users')`: 사용자 데이터 저장소
   - Key: User ID (UUID)
   - Value: User 객체 (passwordHash 포함)

2. **Password Hashing**:
   - bcryptjs 사용: `bcrypt.hash(password, 10)`
   - 비동기 메서드만 사용 (UI 블로킹 방지)

3. **Error Messages**:
   - 모든 오류 메시지는 한국어
   - 보안상 로그인 실패 시 구체적 원인 노출 금지

4. **Performance**:
   - 모든 작업 200ms 이내 완료 (localStorage 읽기/쓰기)
   - 비밀번호 해싱은 예외 (약 100-300ms 소요 가능)

### Phase 2: ApiAuthService

Phase 2 구현은 다음을 준수해야 한다:

1. **API Endpoints**:
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/logout
   - GET /api/auth/me
   - GET /api/auth/check-email

2. **Authentication**:
   - httpOnly cookies 사용
   - CSRF 토큰 포함
   - 모든 요청에 자동으로 쿠키 전송

3. **Error Handling**:
   - HTTP 상태 코드에 따라 적절한 AuthError 생성
   - 네트워크 오류는 `NETWORK_ERROR`로 변환

4. **Performance**:
   - API 응답 시간 < 500ms
   - 타임아웃: 10초
   - 재시도 로직 (네트워크 오류 시)

---

## Testing Contract

### Unit Test Requirements

모든 구현은 다음 테스트를 통과해야 한다:

```typescript
describe('IAuthService Contract', () => {
  describe('login', () => {
    it('should return user profile on valid credentials', async () => {
      const profile = await authService.login({
        email: 'test@example.com',
        password: 'Password123'
      })
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('email', 'test@example.com')
      expect(profile).toHaveProperty('role')
      expect(profile).not.toHaveProperty('passwordHash')
    })

    it('should throw INVALID_CREDENTIALS on wrong password', async () => {
      await expect(authService.login({
        email: 'test@example.com',
        password: 'WrongPassword'
      })).rejects.toThrow(AuthError)
    })

    it('should throw INVALID_CREDENTIALS on non-existent email', async () => {
      await expect(authService.login({
        email: 'notexist@example.com',
        password: 'Password123'
      })).rejects.toThrow(AuthError)
    })
  })

  describe('register', () => {
    it('should create user and return profile', async () => {
      const profile = await authService.register({
        email: 'newuser@example.com',
        password: 'Password123',
        role: 'student'
      })
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('email', 'newuser@example.com')
      expect(profile).toHaveProperty('role', 'student')
    })

    it('should throw EMAIL_EXISTS on duplicate email', async () => {
      await authService.register({
        email: 'duplicate@example.com',
        password: 'Password123',
        role: 'student'
      })

      await expect(authService.register({
        email: 'duplicate@example.com',
        password: 'Password123',
        role: 'mentor'
      })).rejects.toThrow(AuthError)
    })

    it('should throw VALIDATION_ERROR on invalid password', async () => {
      await expect(authService.register({
        email: 'test@example.com',
        password: 'short', // Too short, no number
        role: 'student'
      })).rejects.toThrow(AuthError)
    })
  })

  describe('logout', () => {
    it('should complete without errors', async () => {
      await expect(authService.logout()).resolves.not.toThrow()
    })
  })

  describe('getCurrentUser', () => {
    it('should return null when not authenticated', async () => {
      const user = await authService.getCurrentUser()
      expect(user).toBeNull()
    })

    it('should return user profile when authenticated', async () => {
      await authService.login({
        email: 'test@example.com',
        password: 'Password123'
      })

      const user = await authService.getCurrentUser()
      expect(user).toHaveProperty('email', 'test@example.com')
    })
  })

  describe('checkEmailAvailability', () => {
    it('should return true for available email', async () => {
      const available = await authService.checkEmailAvailability('new@example.com')
      expect(available).toBe(true)
    })

    it('should return false for existing email', async () => {
      await authService.register({
        email: 'existing@example.com',
        password: 'Password123',
        role: 'student'
      })

      const available = await authService.checkEmailAvailability('existing@example.com')
      expect(available).toBe(false)
    })
  })
})
```

---

## Conclusion

이 계약을 준수하면 Phase 1과 Phase 2 구현을 원활하게 전환할 수 있다. 모든 구현은 동일한 인터페이스, 오류 형식, 동작을 따라야 하며, 이를 통해 컴포넌트 코드 변경 없이 서비스 교체가 가능하다.
