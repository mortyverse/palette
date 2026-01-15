# Tasks: Implement Gallery Community

**Feature Branch**: `002-implement-gallery-community`
**Status**: Ready for Development

## Phase 1: Setup
**Goal**: Initialize the project structure, types, and mock data layer required for the Gallery feature.

- [x] T001 [P] Define Gallery Data Types in src/types/gallery.ts
- [x] T002 [P] Define Gallery Service Interface in src/lib/gallery/gallery-service.interface.ts
- [x] T003 Implement Mock Data Seeding for Artworks and Comments in src/mocks/data.ts
- [x] T004 Create Mock Gallery Service with LocalStorage persistence in src/lib/gallery/mock-gallery.service.ts
- [x] T005 [P] Export Gallery Service Instance in src/lib/gallery/index.ts

## Phase 2: Foundational
**Goal**: Set up state management and shared UI components that are prerequisites for specific user stories.

- [x] T006 Initialize Zustand Gallery Store (artworks list, filters) in src/store/gallery-store.ts
- [x] T007 [P] Create reusable ArtworkCard component shell in src/components/gallery/ArtworkCard.tsx
- [x] T008 [P] Create reusable ArtworkGrid layout component in src/components/gallery/ArtworkGrid.tsx
- [x] T009 [P] Create custom useInfiniteScroll hook in src/hooks/use-infinite-scroll.ts

## Phase 3: User Story 1 - Student Uploads Artwork
**Goal**: Allow Student users to upload their artwork (saved to LocalStorage).
**Priority**: P1
**Independent Test**: Log in as Student -> Navigate to Upload -> Submit form -> Verify image appears in list.

- [x] T010 [US1] Implement uploadArtwork method in src/lib/gallery/mock-gallery.service.ts
- [x] T011 [US1] Create UploadForm component with image preview in src/components/gallery/UploadForm.tsx
- [x] T012 [US1] Create Upload Page route in app/gallery/upload/page.tsx
- [x] T013 [US1] Add navigation link to Upload page in src/components/layout/GNB.tsx
- [x] T014 [US1] [P] Implement validation schema for Upload Form in src/lib/validation/gallery-schemas.ts
- [x] T036 [US1] Implement deleteArtwork method in src/lib/gallery/mock-gallery.service.ts
- [x] T037 [US1] Add Delete button to ArtworkCard (visible only to author) in src/components/gallery/ArtworkCard.tsx

## Phase 4: User Story 2 - Gallery Browsing
**Goal**: Display artworks in a grid with infinite scroll.
**Priority**: P1
**Independent Test**: Visit Gallery page -> Scroll down -> Verify new items load.

- [x] T015 [US2] Implement getArtworks pagination logic in src/lib/gallery/mock-gallery.service.ts
- [x] T016 [US2] Integrate Gallery Store with Service in src/store/gallery-store.ts
- [x] T017 [US2] Connect ArtworkGrid to Gallery Store in src/components/gallery/ArtworkGrid.tsx
- [x] T018 [US2] Implement Gallery Main Page with Infinite Scroll in app/gallery/page.tsx
- [x] T019 [US2] [P] Implement Thumbnail optimization (CSS/Next Image) in src/components/gallery/ArtworkCard.tsx

## Phase 5: User Story 3 - Engagement (Likes & Comments)
**Goal**: Enable users to like artworks and post comments.
**Priority**: P2
**Independent Test**: Click Like -> Count updates. Post Comment -> Comment appears.

- [x] T020 [US3] Implement toggleLike method in src/lib/gallery/mock-gallery.service.ts
- [x] T021 [US3] Implement getComments and postComment methods in src/lib/gallery/mock-gallery.service.ts
- [x] T022 [US3] Create CommentList component in src/components/gallery/CommentList.tsx
- [x] T023 [US3] Create CommentInput component in src/components/gallery/CommentInput.tsx
- [x] T024 [US3] Implement Artwork Detail Page in app/gallery/[id]/page.tsx
- [x] T025 [US3] Add Like button interaction to ArtworkCard in src/components/gallery/ArtworkCard.tsx

## Phase 6: User Story 4 - Distinct Mentor Feedback
**Goal**: Visually distinguish Mentor comments.
**Priority**: P2
**Independent Test**: Post comment as Mentor -> Verify distinct style.

- [x] T026 [US4] Update CommentList to render Mentor styles in src/components/gallery/CommentList.tsx
- [x] T027 [US4] [P] Add visual badge for Mentor users in src/components/ui/UserBadge.tsx

## Phase 7: User Story 5 - Scrap to My Page
**Goal**: Allow students to save/scrap artworks.
**Priority**: P3
**Independent Test**: Click Scrap -> Verify button state -> Check My Page.

- [x] T028 [US5] Implement toggleScrap method in src/lib/gallery/mock-gallery.service.ts
- [x] T029 [US5] Add Scrap button to ArtworkCard in src/components/gallery/ArtworkCard.tsx
- [x] T030 [US5] Implement getScrappedArtworks in src/lib/gallery/mock-gallery.service.ts
- [x] T031 [US5] Create My Page Scrapbook View in app/mypage/scraps/page.tsx

## Phase 8: Polish & Cross-Cutting
**Goal**: Refine UI/UX and ensure performance.

- [x] T032 Create Skeleton Loading state for ArtworkGrid in src/components/gallery/ArtworkGridSkeleton.tsx
- [x] T033 Handle Empty States (No Artworks, No Comments) in src/components/gallery/EmptyState.tsx
- [x] T034 Verify Mobile Responsiveness for Grid and Detail views
- [x] T035 Manual Verification of all User Scenarios

## Dependencies
- US1 & US2 can run in parallel after Phase 2, but US2 depends on Data/Service structure.
- US3 depends on US2 (Detail page needs list/id).
- US4 depends on US3.
- US5 is independent of US3/US4.

## Implementation Strategy
- **MVP**: Complete Phase 1, 2, 3, and 4 (Upload & Browse).
- **Increment 1**: Add Engagement (US3 & US4).
- **Increment 2**: Add Personalization (US5).
