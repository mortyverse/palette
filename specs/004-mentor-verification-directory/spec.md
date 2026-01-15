# Feature Specification: Mentor Verification & Directory System

**Feature Branch**: `004-mentor-verification-directory`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "멘토 검증 및 디렉토리 시스템 구현. 멘토 지망자는 증빙 서류를 업로드하고 승인을 기다린다. 승인 전에는 프로필 설정만 가능하고 다른 메뉴 접근 시 승인 대기 중 안내가 표시된다. 관리자는 서류를 검토하여 승인 또는 반려(사유 필수)할 수 있다. 승인된 멘토는 배지가 활성화되고 멘토 디렉토리에 노출된다. 학생은 대학, 스타일 태그로 멘토를 필터링하여 검색할 수 있다."

## Clarifications

### Session 2026-01-15
- Q: How should `MentorProfile` be associated with the `User` entity? → A: Separate collection keyed by `userId`.
- Q: How should verification document "uploads" be handled in the mock service layer? → A: Store dummy metadata only (name, placeholder URL).
- Q: When a Mentor is "Rejected", what triggers the transition back to "Pending" for a re-application? → A: Status automatically resets to "Pending" when the user uploads a new document.
- Q: How should the access restriction for "Pending" mentors be enforced across the Next.js application? → A: Layout-level Wrapper (intercepts routes and displays "Pending" notice).
- Q: In the mentor directory, should the search/filtering happen on the client-side or be simulated as a "server-side" operation? → A: Service Layer (simulate server-side filtering with parameters).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mentor Application & Access Control (Priority: P1)

As a prospective mentor, I want to upload verification documents and see my status, while being restricted from core features until approved, so that I can securely join the platform as a verified expert.

**Why this priority**: Prevents unverified users from acting as mentors, which is the core trust mechanism of the platform.

**Independent Test**: Can be tested by creating a new mentor account, uploading a document, and verifying that navigation to "Coaching" or "Exams" is blocked while "Profile" is accessible.

**Acceptance Scenarios**:

1. **Given** a new mentor account, **When** I log in, **Then** I am prompted to upload verification documents (e.g., student ID, degree).
2. **Given** a mentor account with "Pending" status, **When** I attempt to access features other than "Profile" (e.g., Coaching, Gallery), **Then** I see a "Waiting for Approval" notice and cannot proceed (handled by Layout Wrapper).
3. **Given** a mentor account with "Pending" status, **When** I access "Profile", **Then** I can edit my basic information and portfolio.
4. **Given** a rejected mentor, **When** they upload a new verification document, **Then** their status automatically resets to "Pending".

---

### User Story 2 - Admin Adjudication (Priority: P1)

As an administrator, I want to review mentor applications and approve or reject them with a reason, so that I can vet the quality of mentors.

**Why this priority**: Essential administrative function to unblock valid mentors and reject invalid ones.

**Independent Test**: Can be tested via an admin interface (or API mock) by processing a pending request and verifying the mentor's status update.

**Acceptance Scenarios**:

1. **Given** a list of pending mentor applications, **When** I select an applicant, **Then** I can view their uploaded documents and profile details.
2. **Given** a pending application, **When** I click "Approve", **Then** the mentor's status changes to "Approved" and they gain full access.
3. **Given** a pending application, **When** I click "Reject", **Then" I must enter a rejection reason.
4. **Given** a rejection attempt without a reason, **When** I submit, **Then** the system prevents the action and requests a reason.

---

### User Story 3 - Mentor Directory & Search (Priority: P2)

As a student, I want to browse and filter approved mentors by university and style, so that I can find a coach that matches my goals.

**Why this priority**: Connects the demand (students) with supply (mentors), but requires P1 to be populated first.

**Independent Test**: Can be tested by having a set of mock mentors with different tags and verifying that filters exclude non-matching results.

**Acceptance Scenarios**:

1. **Given** the mentor directory, **When** I view the list, **Then** only "Approved" mentors are visible (no Pending or Rejected).
2. **Given** a list of mentors, **When** I filter by "University" (e.g., Hongik Univ), **Then** only mentors from that university are shown.
3. **Given** a list of mentors, **When** I filter by "Style" (e.g., Watercolor, Design), **Then** only mentors with that style tag are shown.
4. **Given** an approved mentor in the list, **When** I view their card, **Then** I see a "Verified" badge.

### Edge Cases

- **File Upload Failure**: What happens if the verification document is too large or an unsupported format? (System should show an error).
- **Re-application**: Can a rejected mentor re-apply? (Yes, uploading a new document automatically resets status to "Pending").
- **Revocation**: What happens if an admin revokes an already approved mentor? (They should immediately lose access to mentor features).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users with "Mentor" role to upload verification files (images/PDF).
- **FR-002**: System MUST default new Mentor accounts to "Pending" status upon document submission.
- **FR-003**: System MUST restrict "Pending" and "Rejected" mentors to the "Profile" section only; all other routes MUST be wrapped in a layout that intercepts access and displays an approval status message.
- **FR-004**: Admin interface MUST list all "Pending" mentor applications.
- **FR-005**: Admin MUST be able to download or view verification documents (using dummy metadata/placeholders in Phase 1).
- **FR-006**: Admin MUST be able to change status to "Approved" or "Rejected".
- **FR-007**: System MUST enforce a mandatory text reason when status is changed to "Rejected".
- **FR-008**: Approved mentors MUST have a visible "Verified" badge on their profile and directory card.
- **FR-009**: System MUST provide a public directory of Approved mentors.
- **FR-010**: Directory MUST support filtering by 'University' and 'Style' tags via Service Layer parameters.
- **FR-011**: Unapproved mentors MUST NOT appear in the public directory.

### Key Entities

- **User**: (Existing entity, remains unchanged)
- **MentorProfile** (linked by `userId`):
  - `userId`: String (Unique identifier)
  - `status`: Enum (Pending, Approved, Rejected)
  - `university`: String
  - `styleTags`: List<String>
  - `verificationDocs`: List<{ name: String, url: String }>
  - `rejectionReason`: String (optional)
  - `isVerified`: Boolean (derived from status)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **100%** of unapproved mentors are blocked from accessing Coaching/Exam features.
- **SC-002**: Directory filters return results in under **100ms** for a dataset of 100 mentors.
- **SC-003**: Admins can complete an approval/rejection action (UI interaction) in under **3 clicks**.
- **SC-004**: Mentor badge appears immediately upon approval without page refresh (optimistic UI or fast re-fetch).