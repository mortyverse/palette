# Feature Specification: 역할 기반 인증 시스템

**Feature Branch**: `001-role-based-auth`
**Created**: 2026-01-14
**Status**: Draft
**Input**: 이메일/비밀번호 기반 회원가입 및 로그인 시스템 구현. 사용자는 가입 시 학생 또는 멘토 역할을 선택해야 한다. 로그인 후 역할에 따라 다른 GNB를 보여주며, 인증되지 않은 사용자는 갤러리 썸네일만 볼 수 있고 상세 페이지 접근 시 로그인 페이지로 리다이렉트된다. Phase 1에서는 Mock 데이터와 Zustand를 사용하여 인증 상태를 관리한다.

## Clarifications

### Session 2026-01-14

- Q: The spec mentions passwords must be "최소 8자 이상" (minimum 8 characters), but doesn't specify any complexity requirements. What password complexity should be enforced? → A: Require at least one number and one letter (8+ characters total)
- Q: The spec states that "Mock 사용자 데이터는 클라이언트 메모리에 저장되며, 페이지 새로고침 시 초기화될 수 있다" but doesn't clarify whether the authentication session should persist across page refreshes. Should the session persist? → A: Persist session using localStorage (survive refresh/browser close)
- Q: Even though Phase 1 uses mock data, how passwords are stored sets important security patterns for future phases. Should mock passwords be stored as plain text or hashed? → A: Store hashed (use bcrypt/similar library)
- Q: Failed login attempts could reveal whether an email exists in the system (security risk). What error message strategy should be used? → A: Generic message for all failures
- Q: The spec mentions validation errors but doesn't specify when validation should occur. When should form validation feedback be displayed? → A: Real-time + on submit

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 신규 사용자 회원가입 (Priority: P1)

신규 사용자가 이메일과 비밀번호를 입력하고, 학생 또는 멘토 역할을 선택하여 계정을 생성한다. 회원가입 완료 후 자동으로 로그인 상태가 되어 서비스를 이용할 수 있다.

**Why this priority**: 사용자 획득의 첫 단계로, 회원가입 없이는 시스템의 핵심 기능을 이용할 수 없다. 모든 인증 기능의 기반이 된다.

**Independent Test**: 회원가입 폼을 통해 새 계정을 생성하고, 역할에 맞는 GNB가 표시되는지 확인하여 독립적으로 테스트할 수 있다.

**Acceptance Scenarios**:

1. **Given** 비로그인 사용자가 회원가입 페이지에 있을 때, **When** 유효한 이메일, 비밀번호를 입력하고 "학생" 역할을 선택하여 가입을 완료하면, **Then** 학생 전용 GNB가 포함된 메인 페이지로 이동하고 로그인 상태가 유지된다.
2. **Given** 비로그인 사용자가 회원가입 페이지에 있을 때, **When** 유효한 이메일, 비밀번호를 입력하고 "멘토" 역할을 선택하여 가입을 완료하면, **Then** 멘토 전용 GNB가 포함된 메인 페이지로 이동하고 로그인 상태가 유지된다.
3. **Given** 비로그인 사용자가 회원가입 페이지에 있을 때, **When** 이미 등록된 이메일로 가입을 시도하면, **Then** "이미 사용 중인 이메일입니다" 오류 메시지가 표시되고 가입이 진행되지 않는다.
4. **Given** 비로그인 사용자가 회원가입 페이지에 있을 때, **When** 역할을 선택하지 않고 가입을 시도하면, **Then** "역할을 선택해주세요" 오류 메시지가 표시되고 가입이 진행되지 않는다.

---

### User Story 2 - 기존 사용자 로그인 (Priority: P1)

기존 회원이 이메일과 비밀번호로 로그인하여 자신의 역할에 맞는 서비스를 이용한다.

**Why this priority**: 회원가입과 동등하게 중요한 핵심 인증 기능으로, 기존 사용자가 서비스에 접근하기 위한 필수 기능이다.

**Independent Test**: 로그인 폼에서 올바른 자격 증명을 입력하여 역할에 맞는 GNB가 표시되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 비로그인 사용자가 로그인 페이지에 있을 때, **When** 학생 계정의 올바른 이메일과 비밀번호를 입력하면, **Then** 학생 전용 GNB가 표시된 메인 페이지로 이동한다.
2. **Given** 비로그인 사용자가 로그인 페이지에 있을 때, **When** 멘토 계정의 올바른 이메일과 비밀번호를 입력하면, **Then** 멘토 전용 GNB가 표시된 메인 페이지로 이동한다.
3. **Given** 비로그인 사용자가 로그인 페이지에 있을 때, **When** 잘못된 비밀번호를 입력하면, **Then** "이메일 또는 비밀번호가 올바르지 않습니다" 오류 메시지가 표시된다(보안상 구체적인 실패 원인을 노출하지 않음).
4. **Given** 비로그인 사용자가 로그인 페이지에 있을 때, **When** 존재하지 않는 이메일로 로그인을 시도하면, **Then** "이메일 또는 비밀번호가 올바르지 않습니다" 오류 메시지가 표시된다(보안상 이메일 존재 여부를 노출하지 않음).

---

### User Story 3 - 역할 기반 네비게이션 표시 (Priority: P2)

로그인한 사용자는 자신의 역할(학생/멘토)에 따라 다른 GNB(Global Navigation Bar)를 보게 된다.

**Why this priority**: 역할에 따른 차별화된 사용자 경험 제공을 위해 중요하나, 기본 인증 기능 이후에 구현되어야 한다.

**Independent Test**: 학생 계정과 멘토 계정으로 각각 로그인하여 GNB 메뉴 항목이 역할에 맞게 다르게 표시되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 학생으로 로그인한 사용자가 있을 때, **When** 페이지 상단 GNB를 확인하면, **Then** 학생 전용 메뉴 항목(갤러리, 학습 자료, 멘토 찾기, 마이페이지)이 표시된다.
2. **Given** 멘토로 로그인한 사용자가 있을 때, **When** 페이지 상단 GNB를 확인하면, **Then** 멘토 전용 메뉴 항목(갤러리, 포트폴리오 관리, 학생 관리, 마이페이지)이 표시된다.
3. **Given** 비로그인 사용자가 있을 때, **When** 페이지 상단 GNB를 확인하면, **Then** 공개 메뉴(갤러리)와 로그인/회원가입 버튼이 표시된다.

---

### User Story 4 - 비인증 사용자 접근 제한 (Priority: P2)

비로그인 사용자는 갤러리의 썸네일 목록만 볼 수 있으며, 상세 페이지에 접근하려고 하면 로그인 페이지로 리다이렉트된다.

**Why this priority**: 콘텐츠 보호와 사용자 전환(회원가입 유도)을 위한 중요한 기능이나, 기본 인증 흐름 이후에 구현된다.

**Independent Test**: 비로그인 상태에서 갤러리 목록을 확인하고, 상세 페이지 접근 시 로그인 페이지로 리다이렉트되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 비로그인 사용자가 있을 때, **When** 갤러리 페이지에 접근하면, **Then** 작품 썸네일 목록이 표시된다.
2. **Given** 비로그인 사용자가 갤러리 페이지에 있을 때, **When** 특정 작품의 썸네일을 클릭하면, **Then** 로그인 페이지로 리다이렉트되며 "상세 내용을 보려면 로그인이 필요합니다" 메시지가 표시된다.
3. **Given** 비로그인 사용자가 로그인 페이지로 리다이렉트되었을 때, **When** 로그인을 완료하면, **Then** 원래 접근하려던 상세 페이지로 자동 이동한다.

---

### User Story 5 - 사용자 로그아웃 (Priority: P3)

로그인한 사용자가 로그아웃하여 세션을 종료하고 비인증 상태로 전환된다.

**Why this priority**: 필수 보안 기능이지만, 로그인/회원가입 기능 이후에 구현 가능하다.

**Independent Test**: 로그인 상태에서 로그아웃 버튼을 클릭하여 비인증 상태 GNB가 표시되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 로그인한 사용자가 있을 때, **When** GNB의 로그아웃 버튼을 클릭하면, **Then** 비로그인 상태가 되고 공개 메뉴만 표시된 GNB가 나타난다.
2. **Given** 로그아웃한 사용자가 있을 때, **When** 브라우저 뒤로가기를 누르거나 보호된 페이지 URL에 직접 접근하면, **Then** 로그인 페이지로 리다이렉트된다.

---

### Edge Cases

- 회원가입 중 네트워크 오류가 발생하면 "일시적인 오류가 발생했습니다. 다시 시도해주세요" 메시지를 표시한다.
- 로그인 세션이 만료된 상태에서 보호된 페이지에 접근하면 로그인 페이지로 리다이렉트되며 적절한 안내 메시지가 표시된다.
- 이메일 형식이 유효하지 않으면(@ 누락, 도메인 없음 등) 입력 필드 포커스 해제(blur) 시 및 제출 시 유효성 검사 오류를 표시한다.
- 비밀번호가 최소 요구사항(8자 이상, 최소 한 개의 숫자와 한 개의 문자)을 충족하지 않으면 입력 필드 포커스 해제(blur) 시 및 제출 시 구체적인 요구사항을 안내한다.
- 로그인 실패 시 이메일 존재 여부나 비밀번호 오류 여부를 구분하지 않고 동일한 일반 메시지("이메일 또는 비밀번호가 올바르지 않습니다")를 표시하여 보안을 강화한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 이메일과 비밀번호를 사용한 회원가입을 지원해야 한다.
- **FR-002**: 시스템은 회원가입 시 사용자가 학생 또는 멘토 역할 중 하나를 필수로 선택하도록 해야 한다.
- **FR-003**: 시스템은 이메일과 비밀번호를 사용한 로그인을 지원해야 한다.
- **FR-004**: 시스템은 이메일 주소의 유효성(형식)을 검증해야 한다.
- **FR-005**: 시스템은 중복 이메일 등록을 방지해야 한다.
- **FR-006**: 시스템은 비밀번호를 최소 8자 이상으로 요구하며, 최소 한 개의 숫자와 한 개의 문자를 포함해야 한다.
- **FR-007**: 시스템은 로그인한 사용자의 역할에 따라 다른 GNB 메뉴를 표시해야 한다.
- **FR-008**: 시스템은 비인증 사용자에게 갤러리 썸네일 목록만 표시해야 한다.
- **FR-009**: 시스템은 비인증 사용자가 상세 페이지 접근 시 로그인 페이지로 리다이렉트해야 한다.
- **FR-010**: 시스템은 리다이렉트 전 원래 목적지 URL을 저장하여 로그인 후 해당 페이지로 이동시켜야 한다.
- **FR-011**: 시스템은 사용자에게 로그아웃 기능을 제공해야 한다.
- **FR-012**: 시스템은 인증 상태를 클라이언트 측에서 상태 관리 라이브러리(Zustand)를 통해 유지해야 하며, localStorage를 사용하여 페이지 새로고침 및 브라우저 재시작 후에도 세션을 유지해야 한다.
- **FR-013**: 시스템은 Phase 1에서 Mock 데이터를 사용하여 인증을 처리해야 한다.
- **FR-014**: 시스템은 비밀번호를 bcrypt 또는 유사한 해시 라이브러리를 사용하여 해시 형태로 저장해야 한다(Phase 1 Mock 데이터 포함).
- **FR-015**: 시스템은 로그인 실패 시 이메일 존재 여부나 비밀번호 오류 여부를 구분하지 않는 일반 오류 메시지를 표시해야 한다.
- **FR-016**: 시스템은 회원가입 및 로그인 폼에서 입력 필드 포커스 해제(blur) 시와 폼 제출 시 유효성 검사를 수행하고 피드백을 표시해야 한다.

### Key Entities

- **User**: 서비스 사용자를 나타내며, 이메일(고유), 비밀번호(해시 형태로 저장), 역할(학생/멘토), 생성일시를 포함한다.
- **Session**: 인증된 사용자의 세션 정보를 나타내며, 현재 로그인한 사용자 정보와 인증 상태를 포함한다.
- **Role**: 사용자 유형을 나타내며, 학생(Student) 또는 멘토(Mentor) 두 가지 값을 가진다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자는 30초 이내에 회원가입을 완료할 수 있다.
- **SC-002**: 사용자는 10초 이내에 로그인을 완료할 수 있다.
- **SC-003**: 비인증 사용자가 보호된 페이지 접근 시 1초 이내에 로그인 페이지로 리다이렉트된다.
- **SC-004**: 로그인 후 1초 이내에 역할에 맞는 GNB가 표시된다.
- **SC-005**: 95% 이상의 사용자가 첫 시도에 회원가입/로그인을 성공적으로 완료한다.
- **SC-006**: 로그인 후 리다이렉트 시 원래 목적지로 100% 정확하게 이동한다.

## Assumptions

- Phase 1에서는 실제 백엔드 API 없이 Mock 데이터로 인증 기능을 구현한다.
- Mock 사용자 데이터는 클라이언트 메모리에 저장되며, 페이지 새로고침 시 초기화될 수 있다.
- 인증 세션(현재 로그인한 사용자 정보)은 localStorage에 저장되어 페이지 새로고침 및 브라우저 재시작 후에도 유지된다.
- Phase 1 Mock 데이터에서도 비밀번호는 bcrypt 해시를 사용하여 저장되며, 이는 Phase 2 실제 백엔드 구현 시 동일한 보안 패턴을 유지하기 위함이다.
- 비밀번호 복구(비밀번호 찾기) 기능은 Phase 1 범위에 포함되지 않는다.
- 이메일 인증(가입 확인 메일) 기능은 Phase 1 범위에 포함되지 않는다.
- 소셜 로그인(OAuth)은 Phase 1 범위에 포함되지 않는다.
- 학생 GNB 메뉴: 갤러리, 학습 자료, 멘토 찾기, 마이페이지
- 멘토 GNB 메뉴: 갤러리, 포트폴리오 관리, 학생 관리, 마이페이지
- 비인증 사용자 GNB: 갤러리, 로그인, 회원가입
