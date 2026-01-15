# Feature Specification: Supabase Login Integration

**Feature Branch**: `006-supabase-login`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "supabase mcp를 이용해서 해당 프로젝트에 로그인 기능이 구현되게 만들어."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email/Password Login (Priority: P1)

A registered user visits the palette platform and wants to access their account. They navigate to the login page, enter their email and password, and gain access to the platform with their role-specific features (student or mentor).

**Why this priority**: Login is the fundamental authentication mechanism. Without it, users cannot access any protected features of the application. This is the core entry point for all authenticated functionality.

**Independent Test**: Can be fully tested by creating a test user in Supabase, navigating to the login form, entering credentials, and verifying the user is authenticated and redirected appropriately. Delivers immediate value by enabling access to the platform.

**Acceptance Scenarios**:

1. **Given** a registered user with valid credentials, **When** they enter their email and password and submit the form, **Then** they are authenticated and redirected to the dashboard with their user profile loaded.
2. **Given** a user with incorrect credentials, **When** they attempt to login, **Then** they see a clear error message indicating invalid email or password.
3. **Given** a user who is already logged in, **When** they navigate to the login page, **Then** they are automatically redirected to the dashboard.

---

### User Story 2 - Email/Password Registration (Priority: P1)

A new user wants to join the palette platform. They navigate to the signup page, enter their email, password, name, and select their role (student or mentor), then create their account.

**Why this priority**: Registration enables new users to join the platform. Without registration, the user base cannot grow. This is equally critical as login for platform viability.

**Independent Test**: Can be fully tested by navigating to the signup form, entering valid registration details, submitting, and verifying the account is created in Supabase and the user is logged in.

**Acceptance Scenarios**:

1. **Given** a new user on the signup page, **When** they enter a valid email, password, name, and role and submit, **Then** their account is created and they are logged in automatically.
2. **Given** a user attempting to register with an existing email, **When** they submit the form, **Then** they see an error message indicating the email is already in use.
3. **Given** a user entering a weak password, **When** they submit the form, **Then** they see a validation error with password requirements.

---

### User Story 3 - Session Persistence (Priority: P2)

A logged-in user closes their browser or navigates away. When they return to the platform, they expect to still be logged in without re-entering credentials.

**Why this priority**: Session persistence improves user experience by eliminating repeated logins. While not blocking core functionality, it significantly enhances usability.

**Independent Test**: Can be tested by logging in, closing the browser tab, reopening the application, and verifying the user session is restored automatically.

**Acceptance Scenarios**:

1. **Given** a user who logged in previously, **When** they return to the application within the session validity period, **Then** they are automatically authenticated without needing to log in again.
2. **Given** a user whose session has expired, **When** they return to the application, **Then** they are redirected to the login page.

---

### User Story 4 - Logout (Priority: P2)

A logged-in user wants to sign out of their account, either for security reasons or to switch accounts.

**Why this priority**: Logout is essential for security and multi-user scenarios. Users must be able to end their session voluntarily.

**Independent Test**: Can be tested by logging in, clicking the logout button, and verifying the user is logged out and redirected to the public landing page.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they click the logout button, **Then** their session is terminated and they are redirected to the login page.
2. **Given** a user who just logged out, **When** they try to access a protected route, **Then** they are redirected to the login page.

---

### User Story 5 - Protected Route Access (Priority: P2)

Authenticated users can access role-specific features while unauthenticated users are redirected to login.

**Why this priority**: Route protection ensures security and proper access control based on user roles.

**Independent Test**: Can be tested by attempting to access protected routes both as authenticated and unauthenticated users, verifying appropriate access or redirection.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they try to access a protected route, **Then** they are redirected to the login page with a return URL preserved.
2. **Given** an authenticated student, **When** they access student-specific features, **Then** they can use those features without restriction.
3. **Given** an authenticated mentor, **When** they access mentor-specific features, **Then** they can use those features without restriction.

---

### Edge Cases

- What happens when network connectivity is lost during login? → Display network error message and allow retry.
- How does the system handle login attempts with special characters in email? → Standard email validation; Supabase handles encoding.
- What happens when a user's account is disabled in Supabase? → Display "account disabled" error message.
- How does the system handle concurrent sessions from multiple devices? → Allow multiple concurrent sessions (Supabase default).
- What happens when Supabase authentication service is temporarily unavailable? → Display service unavailable error with retry option.
- What happens after 5 failed login attempts? → Account is temporarily locked for 5 minutes; user sees lockout message with remaining time.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via email and password using Supabase Auth service.
- **FR-002**: System MUST allow new users to register with email, password, name, and role (student/mentor).
- **FR-003**: System MUST persist user sessions across browser sessions using Supabase session management.
- **FR-004**: System MUST provide a logout function that terminates the user session on both client and server.
- **FR-005**: System MUST protect routes based on authentication status.
- **FR-006**: System MUST store user role in Supabase user metadata for role-based access control.
- **FR-007**: System MUST validate email format and password strength on the client before submission.
- **FR-008**: System MUST display user-friendly error messages for authentication failures.
- **FR-009**: System MUST redirect authenticated users away from login/signup pages to the dashboard.
- **FR-010**: System MUST preserve the intended destination URL when redirecting unauthenticated users to login.
- **FR-011**: System MUST replace the existing mock authentication service with real Supabase authentication.
- **FR-012**: System MUST maintain backward compatibility with existing UserProfile type structure.
- **FR-013**: System MUST send email verification asynchronously after registration but allow immediate login without requiring verification.
- **FR-014**: System MUST rate limit login attempts to 5 failed attempts per account, with a 5-minute lockout period before allowing retry.

### Key Entities

- **User**: Represents an authenticated user with id, email, name, role (student/mentor), and creation timestamp. Stored in Supabase auth.users with role stored in user_metadata.
- **Session**: Represents an active authentication session managed by Supabase, including access token, refresh token, and expiration time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the login process in under 5 seconds from form submission to dashboard access.
- **SC-002**: Users can complete registration in under 30 seconds including form completion.
- **SC-003**: 95% of login attempts with valid credentials succeed on the first try.
- **SC-004**: User sessions persist for at least 7 days without requiring re-authentication.
- **SC-005**: All protected routes correctly redirect unauthenticated users to login within 1 second.
- **SC-006**: Error messages are displayed within 2 seconds of a failed authentication attempt.
- **SC-007**: Zero mock authentication code remains in production after migration.

## Clarifications

### Session 2026-01-15

- Q: Should new users verify their email address before they can access the platform? → A: Optional/async (user can login immediately, verification email sent in background)
- Q: How should the system handle repeated failed login attempts? → A: Rate limit after 5 failed attempts (5-minute lockout)
- Q: What should happen to user accounts created with mock authentication during development? → A: Discard (mock data is development-only, no migration needed)

## Assumptions

- The Supabase project `palette-dev` (ap-northeast-2 region) is properly configured and accessible.
- Email/password is the primary authentication method (no OAuth providers required for initial implementation).
- User roles (student/mentor) will be stored in Supabase user_metadata.
- The existing UI components (LoginForm, SignupForm, ProtectedRoute) will be adapted rather than replaced.
- Password requirements follow Supabase defaults (minimum 6 characters).
- Session tokens will be managed automatically by Supabase client library.
- The existing Zustand auth-store will be updated to work with Supabase rather than mock service.
- Mock authentication data (localStorage) is development-only and will be discarded; no migration required.
