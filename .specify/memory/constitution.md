# Palette Project Constitution

## Core Principles

### I. Mock-First Architecture (Phase 1)
All features must be implemented using ephemeral (mock) data simulation first. **NEVER** access a real backend or database directly in UI components during Phase 1. Logic must work fully with local state or `localStorage` to simulate network delays.

### II. Service Layer Pattern
UI components must **NEVER** access data sources directly. They must communicate exclusively through a typed **Service Layer** (e.g., `services/gallery.ts`). This allows swapping the underlying data source (Mock -> Supabase) without changing UI code.

### III. Conventional Consistency
Strictly adhere to existing project conventions (Next.js App Router, React 19, Tailwind CSS v4). Analyze surrounding code before implementing to mimic style, naming, and structure.

### IV. Test-Driven & Type-Safe
Changes must be type-safe (TypeScript strict mode). Verification tests (manual or automated) are required for all feature implementations.

## Governance
This constitution supersedes generic templates. Amendments require explicit updates to `GEMINI.md` and this file.