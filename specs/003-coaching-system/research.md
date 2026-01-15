# Phase 0: Research & Technical Decisions

**Feature**: 003-coaching-system
**Date**: 2026-01-15

## 1. Canvas Editor Implementation
**Decision**: Custom React Component using HTML5 Canvas API.
**Rationale**: 
- The requirements are specific but simple: drawing strokes, changing colors, undo/redo, and exporting to image.
- A custom implementation allows full control over the "overlay" behavior and state management without fighting a library's abstraction.
- Avoids adding heavy dependencies like `fabric.js` or `konva` for a relatively standard feature.
- Leverage `useRef` for canvas access and `useState` (or `useReducer`) for history stack (undo/redo).

**Alternatives Considered**:
- `react-sketch-canvas`: A viable lightweight alternative, but custom implementation ensures we can strictly match the UI/UX requirements for the "comparison" mode (overlay vs toggle) without hacking the library's styling.
- `fabric.js`: Too heavy for simple stroke drawing.

## 2. Date & Time Management
**Decision**: Native `Date` API with extension of `src/lib/utils/date.ts`.
**Rationale**:
- The project currently does not use `date-fns` or `dayjs`.
- We only need simple operations: `addHours`, `isExpired`, and `formatRemainingTime`.
- We will add these utility functions to `src/lib/utils/date.ts` to maintain consistency and avoid new dependencies.

## 3. State Management
**Decision**: `zustand` for Session/Global state; React Local State for Canvas.
**Rationale**:
- `zustand` is already established in the project (`auth-store.ts`, `gallery-store.ts`).
- We will create `src/store/coaching-store.ts` to manage the user's active coaching sessions and credit balance (UI sync).
- The canvas drawing state (current stroke, history stack) is ephemeral to the editor component and should stay local to avoid unnecessary global re-renders.

## 4. Data Persistence (Mock)
**Decision**: `src/lib/coaching/mock-coaching.service.ts` backed by `src/mocks/data.ts`.
**Rationale**:
- Follows the "Mock-First" architecture defined in `GEMINI.md`.
- Data structures will mirror the `CoachingSession` and `Feedback` entities defined in the Spec.
- "Lazy Evaluation" for timeouts: When fetching a session, the service will check `createdAt` vs `Now` to simulate expiration/refunds on the fly, as real background jobs aren't available in the frontend-only phase.

## 5. UI/UX Components
**Decision**: Extend existing `src/components/ui` with Tailwind CSS v4.
**Rationale**:
- Use `lucide-react` for tool icons (Pen, Undo, Redo, Eraser).
- Use `shadcn/ui` patterns (if available) or existing `Button`/`Input` components.
- Implement the "Slider" for opacity control as a new UI primitive if not present.

## 6. Type Safety & Validation
**Decision**: `zod` schemas shared between forms and "backend" (mock service).
**Rationale**:
- `zod` is already in use.
- Create `src/lib/validation/coaching-schemas.ts` for upload forms and comment inputs.
