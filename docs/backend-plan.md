# Backend Integration Strategy: Palette Project

## 1. Core Development Philosophy: UI-First (Mock-Driven)
**"Frontend completion takes precedence over Backend implementation."**

The project is strictly divided into two distinct phases to ensure rapid iteration and clear requirements.

---

## 2. Phase 1: Frontend Completion (Mock Environment)
**Goal:** Build a **fully functional application** where all logic works, but data is ephemeral (not persistent). This is **NOT** just static markup/publishing.

### ✅ Definition of Done (for Phase 1)
1.  **Full Interaction**: All buttons, forms, modals, and page navigations must function exactly as they would in the final product.
2.  **Strict Mock Data**:
    *   All data must be sourced from `src/mocks/data.ts`.
    *   **Crucial**: The mock data structure must 100% mirror the ERD defined in the PRD to prevent refactoring later.
3.  **Service Layer Abstraction**:
    *   Components must **never** access mock data directly.
    *   Implement a Service Layer (e.g., `services/auth.ts`, `services/gallery.ts`).
    *   In Phase 1, these services return **Mock Data** with a simulated network delay (e.g., `setTimeout`).
4.  **State Management**:
    *   Global state (e.g., Login status via Zustand, Filter settings) must work perfectly within the session.

**🚫 Constraints for Phase 1:**
*   **DO NOT** set up the Supabase project or dashboard yet.
*   **DO NOT** write any SQL or backend API logic.

---

## 3. Phase 2: Backend Integration (Supabase)
This phase begins only after Phase 1 is fully approved. The goal is to **"Swap the Data Pipeline"** without altering the UI components.

### 🛠 Tech Stack
*   **Database**: Supabase (PostgreSQL)
*   **Auth**: Supabase Auth (Email/Password, Social)
*   **Storage**: Supabase Storage (Images/Files)
*   **Logic**: Supabase Edge Functions (Complex transactions, Cron jobs)

### 🔗 Integration Priority
1.  **Auth**: Replace the mock login logic with the Supabase Auth SDK.
2.  **Database (CRUD)**: Update `src/services/*.ts` to call the Supabase Client instead of returning mocks.
3.  **Storage**: Replace local image paths with actual file upload logic.
4.  **Edge Functions**:
    *   Implement 1:1 Coaching credit deduction logic.
    *   Implement Live Exam synchronization and auto-end timers.

---

## 4. Data Model Structure (For Mocking)
Ensure `src/mocks/data.ts` strictly follows these entity structures (based on PRD):

*   **Users**: `id` (UUID), `role` ('student' | 'mentor' | 'admin'), `nickname`, `profile_image`
*   **Artworks**: `id`, `user_id`, `image_url`, `title`, `description`, `created_at`
*   **CoachingTickets**: `id`, `student_id`, `mentor_id`, `status` ('pending' | 'completed'), `feedback_image_url`
*   **Exams**: `id`, `subject_image_url`, `start_time`, `end_time`, `status` ('scheduled' | 'live' | 'ended')

---

## 5. Instructions for AI Planner
When generating the development plan (`plan.md` / `tasks.md`), adhere to the following sequence:

1.  **Prioritize UI Tasks**: Schedule all frontend page and component development first. Ensure they rely entirely on the **Service Layer + Mock Data**.
2.  **Defer Backend Tasks**: Schedule Supabase setup, Table creation, and API integration tasks **only after** all UI tasks are marked as complete.
3.  **Enforce Architecture**: Explicitly require the **Service Repository Pattern** in the frontend code. This is critical for seamless migration from Mock to Real API in Phase 2.