# Research: Mentor Verification & Directory System

## 1. Technical Decisions

### D-001: Access Control Strategy (Mock Phase)
- **Decision**: Use a **Client-Side Layout Wrapper** (Higher-Order Component or Context Provider) to restrict access for "Pending" mentors.
- **Rationale**:
  - The project is in "Phase 1 - Frontend Focus (Mock-Driven)" and uses `localStorage` for data persistence.
  - Next.js Middleware (server-side) cannot access `localStorage`.
  - Storing auth state in Cookies (for Middleware) would require changing the existing `MockAuthService` which currently relies on `localStorage`.
  - A Client Component wrapper in `app/layout.tsx` (or specific sub-layouts) can read the Zustand store/localStorage and redirect/block rendering effectively for the prototype.
- **Implications**:
  - Security is "soft" (client-side only) for this phase, which is acceptable for a prototype.
  - Phase 2 (Backend) will move this logic to Middleware/RJS with proper session cookies.

### D-002: Data Persistence
- **Decision**: Store `MentorProfile` data in `localStorage` under key `mock-mentor-profiles`.
- **Rationale**:
  - Consistent with `MockAuthService` usage of `mock-users` key.
  - Allows persistence across browser refreshes during development.
  - Simple to implement and debug.

### D-003: Service Layer Structure
- **Decision**: Create a dedicated `MockMentorService` in `src/lib/mentor/mock-mentor.service.ts`.
- **Rationale**:
  - Follows the separation of concerns. `AuthService` handles User (identity), `MentorService` handles MentorProfile (role-specific data).
  - Aligns with "Library-First" principle where the domain logic is encapsulated.

### D-004: State Management
- **Decision**: Use `zustand` for `useMentorStore` to manage mentor profile state.
- **Rationale**:
  - Matches existing `useAuthStore` pattern.
  - Allows reactive UI updates when status changes (e.g., from Pending -> Approved).

## 2. Unknowns & Clarifications (Resolved)

- **Q**: How to handle "Upload"?
  - **A**: Mock service will accept `File` object, simulate a network delay (500ms), and return a dummy object `{ name: file.name, url: 'https://placeholder.com/...' }`.

- **Q**: Search/Filter implementation?
  - **A**: `MockMentorService.searchMentors(filters)` will filter the in-memory (localStorage) array of mentors.

## 3. Best Practices (Next.js App Router)

- **Route Groups**: Use `(mentor)` or `(protected)` route groups if we want to apply specific layouts to a subset of routes.
- **Composability**: The "Pending Guard" should be a component that wraps children:
  ```tsx
  <MentorGuard>
    {children}
  </MentorGuard>
  ```
