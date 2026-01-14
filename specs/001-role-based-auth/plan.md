# Implementation Plan: 역할 기반 인증 시스템

**Branch**: `001-role-based-auth` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-role-based-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

이메일/비밀번호 기반 회원가입 및 로그인 시스템을 구현하여 사용자가 학생 또는 멘토 역할을 선택할 수 있도록 한다. 인증된 사용자는 역할에 따라 다른 GNB(Global Navigation Bar)를 보게 되며, 비인증 사용자는 갤러리 썸네일만 볼 수 있고 상세 페이지 접근 시 로그인 페이지로 리다이렉트된다. Phase 1에서는 Mock 데이터와 Zustand를 사용하여 인증 상태를 관리하며, localStorage를 통해 세션 지속성을 보장한다. 비밀번호는 bcrypt 해싱을 사용하여 저장하고, 보안을 위해 로그인 실패 시 일반 오류 메시지를 표시한다.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 (React 19.2.3)
**Primary Dependencies**:
- Zustand (상태 관리)
- bcryptjs (비밀번호 해싱)
- React Hook Form (폼 관리)
- Zod (유효성 검사 스키마)

**Storage**: localStorage (Phase 1 세션 지속성), 클라이언트 메모리 (Mock 사용자 데이터)
**Testing**: Jest + React Testing Library (단위/통합 테스트)
**Target Platform**: Web (모바일 우선 반응형, 375px 기준)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**:
- 로그인/회원가입 폼 제출 시 응답 시간 < 200ms
- 페이지 리다이렉트 < 1초
- GNB 역할 전환 렌더링 < 1초

**Constraints**:
- 모바일 우선 UI (최소 터치 타겟 44x44px)
- localStorage에 민감한 정보(비밀번호) 저장 금지
- Phase 1에서는 백엔드 API 없이 클라이언트 측에서만 동작

**Scale/Scope**:
- 4개 페이지 (회원가입, 로그인, 갤러리 목록, 갤러리 상세)
- 2개 역할 (학생, 멘토) + 게스트
- Mock 사용자 데이터 약 5-10명 규모

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Mobile-First Design ✅
- **Status**: PASS
- **Compliance**:
  - 모든 UI 컴포넌트는 375px 모바일 뷰포트 기준으로 설계
  - 터치 타겟 44x44px 이상 (버튼, 링크)
  - 햄버거 메뉴 + Drawer 패턴으로 GNB 구현 (모바일)
- **Rationale**: Constitution Principle I 준수

### II. Role-Based Access Control (RBAC) ✅
- **Status**: PASS
- **Compliance**:
  - 게스트: 갤러리 썸네일만 조회, 상세 페이지 접근 시 로그인 리다이렉트
  - 학생: 갤러리, 학습 자료, 멘토 찾기, 마이페이지 접근
  - 멘토: 갤러리, 포트폴리오 관리, 학생 관리, 마이페이지 접근
  - 관리자: 이 Phase에서는 범위 외
- **Rationale**: Constitution Principle II 준수
- **Note**: 멘토 승인 절차는 향후 Phase에서 구현 예정

### III. SLA-Driven Coaching System ⏭️
- **Status**: NOT APPLICABLE (향후 Phase)
- **Rationale**: 이 기능은 1:1 코칭 시스템 구현 시 적용 예정

### IV. Real-Time Synchronization ⏭️
- **Status**: NOT APPLICABLE (향후 Phase)
- **Rationale**: 이 Phase에서는 실시간 기능 없음

### V. Credit-Based Economy ⏭️
- **Status**: NOT APPLICABLE (향후 Phase)
- **Rationale**: 크레딧 시스템은 향후 Phase에서 구현 예정

### VI. Mentor Verification Pipeline ⏭️
- **Status**: PARTIAL - 향후 확장 필요
- **Rationale**: Phase 1에서는 역할 선택만 구현, 멘토 인증 파이프라인은 향후 Phase 구현 예정

### VII. Feedback-First UX ⏭️
- **Status**: NOT APPLICABLE (향후 Phase)
- **Rationale**: 피드백 기능은 향후 Phase에서 구현 예정

### Technical Constraints Compliance

#### Technology Stack ✅
- **Frontend**: Next.js (React 19+) with TypeScript ✅
- **State Management**: Zustand ✅
- **Styling**: Tailwind CSS (Mobile-First utilities) ✅
- **Authentication**: 자체 구현 (Phase 1 Mock) ✅

#### Security Requirements ✅
- **Status**: PASS
- **Compliance**:
  - 비밀번호 bcrypt 해싱 처리
  - 역할 기반 라우트 보호 구현
  - localStorage에 비밀번호 원본 저장 금지 (해시도 저장하지 않음)
  - XSS 방어: React의 기본 escaping 활용

## Project Structure

### Documentation (this feature)

```text
specs/001-role-based-auth/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                           # Next.js App Router
├── (auth)/                    # Auth route group
│   ├── login/
│   │   └── page.tsx          # 로그인 페이지
│   └── signup/
│       └── page.tsx          # 회원가입 페이지
├── gallery/
│   ├── page.tsx              # 갤러리 목록 페이지 (공개)
│   └── [id]/
│       └── page.tsx          # 갤러리 상세 페이지 (보호됨)
├── layout.tsx                # Root layout with GNB
└── page.tsx                  # Home page

src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── GNB.tsx           # Global Navigation Bar (역할 기반)
│   │   ├── GuestGNB.tsx
│   │   ├── StudentGNB.tsx
│   │   └── MentorGNB.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── FormField.tsx
├── lib/
│   ├── auth/
│   │   ├── auth.ts           # 인증 유틸 함수
│   │   ├── password.ts       # 비밀번호 해싱/검증
│   │   └── mock-users.ts     # Mock 사용자 데이터
│   ├── validation/
│   │   └── auth-schemas.ts   # Zod 스키마 정의
│   └── utils.ts
├── store/
│   └── auth-store.ts         # Zustand 인증 상태 관리
└── types/
    └── auth.ts               # 인증 관련 타입 정의

__tests__/
├── components/
│   └── auth/
│       ├── LoginForm.test.tsx
│       └── SignupForm.test.tsx
├── lib/
│   └── auth/
│       ├── auth.test.ts
│       └── password.test.ts
└── integration/
    └── auth-flow.test.tsx
```

**Structure Decision**: Next.js App Router 구조를 사용하여 파일 시스템 기반 라우팅을 활용한다. `(auth)` 라우트 그룹을 사용하여 인증 관련 페이지를 그룹화하고, `src/` 디렉토리에 재사용 가능한 컴포넌트, 라이브러리, 상태 관리 코드를 배치한다. 이 구조는 Next.js의 관례를 따르며, 향후 확장성을 고려한다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

해당 사항 없음 - 모든 Constitution 원칙을 준수하거나 향후 Phase로 명확히 구분되어 있음.

---

## Phase 1 Design Artifacts

### Generated Documents

이 구현 계획의 Phase 0 (연구) 및 Phase 1 (설계) 단계에서 다음 문서들이 생성되었습니다:

1. **research.md**: 기술 선택 및 모범 사례 연구 결과
   - Zustand localStorage 지속성 패턴
   - bcryptjs 브라우저 사용 가이드
   - React Hook Form + Zod 통합 패턴
   - Next.js App Router 라우트 보호 전략
   - Mock 인증 패턴 및 API 전환 전략

2. **data-model.md**: 데이터 모델 정의
   - Core Entities (User, Session)
   - Form Data Types (LoginFormData, SignupFormData)
   - Response Types (AuthResponse, AuthError)
   - Enums & Constants (UserRole, GNB Menu Items)
   - Storage Schema (localStorage 구조)
   - Phase 2 Migration Notes (PostgreSQL 스키마)

3. **contracts/auth-service.contract.md**: 서비스 계약 정의
   - IAuthService 인터페이스
   - Operation Contracts (login, register, logout, etc.)
   - Error Handling Contract
   - Implementation Requirements (Phase 1 & Phase 2)
   - Testing Contract

4. **quickstart.md**: 개발자 빠른 시작 가이드
   - 의존성 설치
   - 프로젝트 구조 생성
   - 단계별 구현 지침 (타입, 스키마, 서비스, 스토어, 컴포넌트)
   - Phase 2 API 통합 준비
   - Troubleshooting 가이드

### Post-Design Constitution Check

Phase 1 설계 완료 후 Constitution 재검토:

#### I. Mobile-First Design ✅
- **Status**: PASS (재확인 완료)
- **Design Compliance**:
  - 모든 폼 컴포넌트는 모바일 우선으로 설계됨
  - 버튼 및 링크는 44x44px 터치 타겟 권장사항 포함
  - Tailwind CSS 모바일 우선 유틸리티 사용 계획
  - 햄버거 메뉴는 향후 구현 예정 (현재 단계에서는 기본 GNB만)

#### II. Role-Based Access Control (RBAC) ✅
- **Status**: PASS (재확인 완료)
- **Design Compliance**:
  - UserRole enum ('student' | 'mentor') 정의
  - 역할별 NavItems 매핑 (getNavItemsForRole 함수)
  - ProtectedRoute 컴포넌트로 라우트 레벨 보호
  - GNB 컴포넌트에서 역할에 따른 메뉴 표시

#### Technical Constraints Compliance ✅
- **Status**: PASS (재확인 완료)
- **Technology Stack**:
  - Next.js 16.1.1 (React 19.2.3) with TypeScript 5.x ✅
  - Zustand (persist middleware) ✅
  - Tailwind CSS ✅
  - bcryptjs ✅
  - React Hook Form + Zod ✅

#### Security Requirements ✅
- **Status**: PASS (재확인 완료)
- **Design Compliance**:
  - 비밀번호 bcrypt 해싱 (Salt rounds: 10)
  - localStorage에 passwordHash 저장 금지 (UserProfile 타입에서 제외)
  - 로그인 실패 시 일반 오류 메시지 (보안상 구체적 원인 노출 금지)
  - Phase 2 마이그레이션 경로 명확 (httpOnly cookies, CSRF 보호)

### 설계 결정사항 요약

1. **서비스 추상화**: IAuthService 인터페이스로 Mock ↔ API 전환 용이
2. **타입 안전성**: TypeScript + Zod로 런타임 유효성 검사
3. **상태 관리**: Zustand persist로 세션 지속성 보장
4. **폼 관리**: React Hook Form + Zod로 선언적 유효성 검사
5. **라우트 보호**: 다층 방어 (Middleware + 컴포넌트 가드)
6. **Hydration 전략**: skipHydration + useHydration 훅으로 SSR 불일치 방지

### 다음 단계

Phase 1 설계가 완료되었습니다. 다음 명령어로 task 분해를 진행하세요:

```bash
/speckit.tasks 001
```

이 명령어는 설계 문서를 기반으로 구현 가능한 작업 단위로 분해하여 `tasks.md` 파일을 생성합니다.
