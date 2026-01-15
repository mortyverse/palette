# Research: Gallery Community Implementation

## 1. Infinite Scroll Strategy
**Decision**: Custom `useInfiniteScroll` hook using `IntersectionObserver`.
**Rationale**:
- **Simplicity**: Avoids introducing heavy fetching libraries (like TanStack Query) just for mock data.
- **Control**: Direct control over the "fetch" trigger, making it easier to hook into our mock service.
- **Dependencies**: Uses native browser APIs, keeping the bundle size small.

**Alternatives Considered**:
- *TanStack Query (React Query)*: Powerful but overkill for Phase 1 local mocks.
- *Button "Load More"*: Simpler but violates "infinite scroll" requirement.

## 2. State Management
**Decision**: `zustand` for `useGalleryStore`.
**Rationale**:
- **Consistency**: Project already uses `zustand` (`auth-store.ts`).
- **Feature Fit**: Perfect for holding the list of artworks, loading state, and "page" cursor.
- **Separation**: Decouples UI from data fetching logic.

## 3. Data Persistence (Mock)
**Decision**: Repository Pattern with `localStorage` adapter.
**Rationale**:
- **Requirement**: Spec demands persistence across refreshes.
- **Future-Proofing**: `GalleryService` interface can be implemented by `MockGalleryService` now and `SupabaseGalleryService` later.
- **Isolation**: UI components will call `GalleryService.getArtworks()`, unaware of the underlying storage.

## 4. Image Handling (Phase 1)
**Decision**: Base64 Strings stored in `localStorage`.
**Rationale**:
- **Feasibility**: Simplest way to store images "locally" without a backend file server.
- **Constraint**: Must enforce strict file size limits (e.g., < 500KB) to avoid hitting `localStorage` quota (usually 5MB-10MB).
- **Optimization**: Use `next/image` with the Base64 string as `src`.

## 5. Testing
**Decision**: Manual verification per User Scenarios.
**Rationale**:
- **Current State**: No test runner (Jest/Vitest) configured in `package.json`.
- **Action**: Rely on "Independent Test" steps defined in PRD.
