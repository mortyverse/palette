<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version Change: 1.0.0 → 1.1.0 (New principle added)

  Modified Principles: N/A

  Added Sections:
  - Principle VIII: Design System Consistency (UI/UX design reference requirement)

  Removed Sections: N/A

  Templates Status:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (No design-specific sections require update)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure aligns)
  - .specify/templates/agent-file-template.md: ✅ Compatible (No changes needed)
  - .specify/templates/checklist-template.md: ✅ Compatible (No changes needed)

  Follow-up TODOs: None
  ============================================================================
-->

# Palette Constitution

## Core Principles

### I. Mobile-First Design
모든 UI/UX 결정은 모바일 환경을 최우선으로 고려한다.
- 모든 컴포넌트는 반드시 모바일 뷰포트(375px 기준)에서 먼저 설계 및 테스트되어야 한다
- 터치 타겟은 최소 44x44px을 유지해야 한다
- 네비게이션은 햄버거 메뉴 + Drawer 패턴을 기본으로 한다
- **근거**: PRD에서 "모바일 우선 반응형 웹"을 플랫폼 형태로 명시

### II. Role-Based Access Control (RBAC)
4가지 역할(게스트/학생/멘토/관리자)에 따른 엄격한 권한 분리를 적용한다.
- 각 역할별 접근 가능한 GNB 메뉴가 명확히 구분되어야 한다
- 멘토는 반드시 승인 절차를 거쳐야 전체 기능에 접근 가능하다
- 미승인 멘토는 프로필 설정 및 서류 업로드 화면만 접근 가능하다
- 게스트는 갤러리 썸네일만 조회 가능하며, 상세 보기 시 로그인 리다이렉트 처리한다
- **근거**: PRD Section 2의 사용자 역할 및 네비게이션 정의

### III. SLA-Driven Coaching System
1:1 코칭 시스템은 24시간 응답 SLA를 핵심 가치로 한다.
- 질문 등록 시 24시간 카운트다운 타이머가 즉시 시작되어야 한다
- 24시간 내 미답변 시 크레딧 자동 환불 처리가 이루어져야 한다
- 답변 완료 후 48시간 무응답 시 세션이 자동 종료되어야 한다
- 모든 상태 변화(Open → Answered → Closed/Expired)는 추적 가능해야 한다
- **근거**: PRD MODULE 3의 P-02, P-05 기능 명세

### IV. Real-Time Synchronization
모의고사 등 실시간 기능은 서버 시간 기준 동기화를 보장해야 한다.
- 시험 시작/종료 시간은 서버 타임스탬프 기준으로 일관되게 처리한다
- 클라이언트 시간 조작에 의한 부정행위를 방지해야 한다
- 새로고침 없이 주제 이미지 공개가 이루어져야 한다 (WebSocket 또는 Polling)
- 종료 시간 이후에는 업로드 버튼이 즉시 비활성화되어야 한다
- **근거**: PRD MODULE 4의 E-01 시험 동기화 기능

### V. Credit-Based Economy
크레딧 시스템은 투명하고 추적 가능해야 한다.
- 모든 크레딧 변동(지급/사용/환불)은 로그로 기록되어야 한다
- 잔액 부족 시 명확한 안내와 충전 유도가 이루어져야 한다
- 환불 정책은 SLA 미충족 시 자동 처리되어야 한다
- **근거**: PRD MODULE 3의 P-01, P-02 및 MODULE 5의 M-01

### VI. Mentor Verification Pipeline
멘토 인증 절차는 품질 보장을 위해 엄격히 관리되어야 한다.
- 증빙 서류 업로드 → 관리자 검토 → 승인/반려의 명확한 파이프라인을 따른다
- 반려 시 반드시 사유가 명시되어야 하며, 멘토에게 팝업으로 노출되어야 한다
- 승인 완료 시 멘토 배지가 활성화되고 전체 기능 접근이 허용되어야 한다
- **근거**: PRD MODULE 1의 U-02 멘토 심사 프로세스

### VII. Feedback-First UX
피드백 전달의 품질을 최우선으로 하는 UX를 구현한다.
- 멘토 댓글은 시각적으로 강조되어야 한다 (배경색, 배지)
- Canvas 기반 드로잉 피드백 도구를 제공해야 한다
- 원본/수정본 비교 기능(토글 또는 오버레이)을 제공해야 한다
- 모의고사 주최 멘토는 모든 제출물에 코멘트를 달아야 채점 완료가 가능하다
- **근거**: PRD Section 5 디자인 가이드 및 MODULE 4의 E-03

### VIII. Design System Consistency
모든 UI/UX 작업은 프로젝트의 통합 디자인 시스템을 준수해야 한다.
- UI/UX 관련 개발을 수행할 때 반드시 `docs/design-system.md`를 참조해야 한다
- 색상, 타이포그래피, 컴포넌트 스타일은 디자인 시스템에 정의된 값을 사용해야 한다
- 새로운 UI 패턴이 필요한 경우, 디자인 시스템과의 일관성을 먼저 검토해야 한다
- 디자인 시스템에 없는 스타일이 필요한 경우, 디자인 시스템 문서를 먼저 업데이트해야 한다
- **근거**: 브랜드 아이덴티티 일관성 유지 및 개발 효율성 향상

## Technical Constraints

### Technology Stack
- **Frontend**: Next.js (React 18+) with TypeScript
- **State Management**: Zustand 또는 React Query
- **Styling**: Tailwind CSS (Mobile-First utilities)
- **Real-Time**: WebSocket (Socket.io) 또는 Server-Sent Events
- **Canvas**: Fabric.js 또는 Konva.js (드로잉 피드백용)
- **Backend**: Next.js API Routes 또는 별도 Node.js 서버
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js 또는 자체 JWT 구현
- **Storage**: AWS S3 또는 Cloudinary (이미지 최적화 포함)

### Performance Requirements
- First Contentful Paint (FCP): < 1.5s (모바일 3G 기준)
- Time to Interactive (TTI): < 3s
- 이미지 업로드 시 자동 리사이징 및 최적화 적용
- 갤러리 무한 스크롤 시 가상화(Virtualization) 적용 권장

### Security Requirements
- 모든 결제/크레딧 관련 API는 서버 사이드에서만 처리
- 역할 기반 API 접근 제어 미들웨어 필수
- 멘토 증빙 서류는 비공개 스토리지에 저장
- CSRF/XSS 방어 기본 적용

## Development Workflow

### Code Review Requirements
- 모든 PR은 최소 1명의 리뷰 승인 필요
- RBAC 관련 변경은 보안 검토 필수
- 크레딧/결제 로직 변경은 테스트 케이스 필수 첨부
- UI/UX 변경 시 디자인 시스템 준수 여부 확인 필수

### Testing Strategy
- 단위 테스트: 비즈니스 로직 (크레딧 계산, SLA 타이머, 상태 전이)
- 통합 테스트: API 엔드포인트 및 역할별 접근 제어
- E2E 테스트: 주요 사용자 시나리오 (질문하기 → 답변받기 → 세션 종료)

### Deployment Policy
- Staging 환경에서 모든 기능 검증 후 Production 배포
- 크레딧/결제 관련 변경은 롤백 계획 필수

## Governance

### Amendment Procedure
1. Constitution 변경 제안서 작성 (변경 사항, 근거, 영향 범위)
2. 팀 리뷰 및 승인
3. 버전 업데이트 및 문서화
4. 관련 템플릿/가이드 동기화

### Versioning Policy
- **MAJOR**: 핵심 원칙의 삭제 또는 근본적 재정의
- **MINOR**: 새로운 원칙 추가 또는 기존 원칙의 실질적 확장
- **PATCH**: 문구 수정, 오타 교정, 비의미적 개선

### Compliance Review
- 모든 PR/코드 리뷰 시 Constitution 원칙 준수 여부 확인
- 복잡도 추가 시 반드시 정당화 문서화 (plan.md Complexity Tracking)
- 런타임 개발 가이드는 별도 문서로 관리

**Version**: 1.1.0 | **Ratified**: 2025-01-14 | **Last Amended**: 2026-01-14
