# Implementation Plan: 007-realtime-mock-exam

**Branch**: `007-realtime-mock-exam` | **Date**: 2026-01-15 | **Spec**: [specs/007-realtime-mock-exam/spec.md](specs/007-realtime-mock-exam/spec.md)
**Input**: Feature specification from `specs/007-realtime-mock-exam/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Real-time mock exam system where Mentors schedule exams and Students participate via auto-joining. The system uses simulated "Server Time" and polling to reveal the topic image automatically at the start time without page refresh. Submissions are restricted to the exam window. Phase 1 implementation uses `localStorage` and client-side mocks.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Next.js 16.1.1, React 19
**Primary Dependencies**: Tailwind CSS v4, Zustand, Lucide React
**Storage**: localStorage (Phase 1)
**Testing**: Manual, Integration
**Target Platform**: Web
**Project Type**: Web Application
**Performance Goals**: Topic reveal within 5s of start time
**Constraints**: Mock-First (No backend), Client-Side Only
**Scale/Scope**: < 100 concurrent users (simulated)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Mock-First**: Compliant (using `MockService` and `localStorage`).
- **Next.js App Router**: Compliant.
- **Service Layer**: Compliant (using `MockExamService`).

## Project Structure

### Documentation (this feature)

```text
specs/007-realtime-mock-exam/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── mock-exam/
│   │   ├── exam-card.tsx
│   │   ├── exam-timer.tsx
│   │   ├── topic-reveal.tsx
│   │   └── submission-uploader.tsx
│   └── ui/
├── hooks/
│   ├── use-mock-exam.ts
│   └── use-server-time.ts
├── lib/
│   └── mock-exam/
│       ├── service.ts
│       └── utils.ts
├── store/
│   └── mock-exam-store.ts
└── types/
    └── mock-exam.ts
```

**Structure Decision**: Standard Feature Structure within `src/` following existing patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |