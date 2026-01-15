# Implementation Plan: 1:1 Coaching System

**Branch**: `003-coaching-system` | **Date**: 2026-01-15 | **Spec**: `specs/003-coaching-system/spec.md`
**Input**: Feature specification from `specs/003-coaching-system/spec.md`

## Summary

Implement a credit-based 1:1 coaching system where students can upload artwork for mentor feedback. The system involves a 24h deadline for mentor responses (drawing on a canvas) and allows one follow-up question. This phase focuses on a frontend-only implementation using mock services to simulate state transitions, deadlines, and credit transactions.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.1.1, React 19, Tailwind CSS v4, Zustand (or Context), Lucide React
**Storage**: Mock Data (In-Memory/File-based simulation in `src/mocks/data.ts`)
**Testing**: Manual Validation (Mock-driven scenarios)
**Target Platform**: Web (Responsive)
**Project Type**: Web Application
**Performance Goals**: < 100ms interaction for Canvas & Overlay
**Constraints**: Zero Backend (Phase 1) - Logic must reside in Service Layer
**Scale/Scope**: Feature Module

## Constitution Check

*GATE: Pass* (Constitution is currently a template; proceeding based on standard mock-first architecture).

## Project Structure

### Documentation (this feature)

```text
specs/003-coaching-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
src/
├── components/
│   └── coaching/
│       ├── CanvasEditor.tsx
│       ├── MentorWorkspace.tsx
│       ├── FeedbackViewer.tsx
│       └── ...
├── lib/
│   └── coaching/
│       ├── coaching-service.interface.ts
│       └── mock-coaching.service.ts
├── types/
│   └── coaching.ts
└── mocks/
    └── data.ts

app/
└── coaching/
    ├── request/
    │   └── page.tsx
    └── [id]/
        └── page.tsx
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Mock Logic | To simulate backend timers (refunds/timeouts) without a real server | Essential for testing "User Story 5" (Auto-Refund) in Phase 1 |