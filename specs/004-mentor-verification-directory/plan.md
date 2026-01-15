# Implementation Plan: Mentor Verification & Directory System

**Branch**: `004-mentor-verification-directory` | **Date**: 2026-01-15
**Input**: Feature specification from `/specs/004-mentor-verification-directory/spec.md`

## Summary

Implement a mock-based Mentor Verification and Directory system. This includes a `MentorProfile` entity, a `MockMentorService` using `localStorage`, a Client-Side "Pending Guard" layout wrapper to restrict access for unverified mentors, and a Directory UI with client-side filtering.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.1.1 (App Router), React 19, Tailwind CSS v4, Zustand 5.x
**Storage**: `localStorage` (Mock Phase)
**Testing**: Manual verification via User Scenarios (Quickstart)
**Target Platform**: Web (Modern Browsers)
**Project Type**: Next.js Web Application
**Performance Goals**: Instant client-side feedback (<100ms) for directory filtering.
**Constraints**: No backend integration in this phase; strict data isolation using Service Layer pattern.

## Constitution Check

*GATE: Passed. Mock-first approach adhered to. No new external libraries introduced (Zustand already present).*

## Project Structure

### Documentation (this feature)

```text
specs/004-mentor-verification-directory/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Testing guide
├── contracts/           # TypeScript interfaces
│   └── mentor-service.contract.md
└── tasks.md             # Implementation tasks
```

### Source Code

```text
src/
├── components/
│   ├── mentor/
│   │   ├── MentorGuard.tsx       # Access restriction wrapper
│   │   ├── MentorProfileForm.tsx # Setup profile
│   │   └── MentorCard.tsx        # Directory item
│   └── directory/
│       ├── FilterBar.tsx
│       └── MentorGrid.tsx
├── lib/
│   └── mentor/
│       ├── mock-mentor.service.ts
│       └── mentor-service.interface.ts
├── store/
│   └── mentor-store.ts           # Zustand store
└── types/
    └── mentor.ts                 # Type definitions
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |