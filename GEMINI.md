# Palette Project Context

## 1. Project Overview
**Palette** is a premium feedback community platform designed for art entrance exam students. It facilitates high-quality feedback by connecting students with mentors through features like artwork galleries, 1:1 coaching with canvas tools, and live mock exams.

*   **Type:** Next.js Application (App Router)
*   **Key Technologies:**
    *   Next.js 16.1.1
    *   React 19
    *   Tailwind CSS v4
    *   TypeScript
*   **Current Stage:** **Phase 1 - Frontend Completion (Mock-Driven)**.

## 2. Architecture & Development Strategy
**CRITICAL:** This project strictly follows a **Mock-First** approach as defined in `docs/backend-plan.md`.

### Phase 1: Frontend Focus (Current)
*   **Goal:** Build a fully functional application where all logic works using ephemeral (mock) data.
*   **Service Layer Pattern:**
    *   **NEVER** access data directly in UI components.
    *   Always use a **Service Layer** (e.g., `services/gallery.ts`, `services/auth.ts`).
    *   In this phase, services must return **Mock Data** (simulating network delay).
*   **Mock Data:**
    *   Data structures must strictly mirror the ERD defined in `docs/PRD.md`.
    *   Intended location for mocks: `src/mocks/data.ts` (or `mocks/data.ts` if `src` is not used).
*   **No Backend:** Do not set up Supabase or write SQL/API logic in this phase.

### Phase 2: Backend Integration (Future)
*   Switch the Service Layer to use the **Supabase SDK**.
*   The UI components should require **zero changes** during this transition.

## 3. Key Directories
*   `app/`: Main Next.js application code (App Router).
*   `docs/`: Critical project documentation.
    *   `PRD.md`: Functional requirements and user roles (Student, Mentor, Admin).
    *   `backend-plan.md`: Data model and integration strategy.
*   `specs/`: Detailed feature specifications and checklists.
*   `public/`: Static assets.

## 4. Building & Running
*   **Start Development Server:**
    ```bash
    npm run dev
    ```
*   **Build for Production:**
    ```bash
    npm run build
    ```
*   **Lint Code:**
    ```bash
    npm run lint
    ```

## 5. User Roles (Summary)
*   **Student:** Uploads art, asks for feedback, takes exams.
*   **Mentor:** Provides feedback (text/drawing), hosts exams.
*   **Admin:** Manages users, payments, and content.
