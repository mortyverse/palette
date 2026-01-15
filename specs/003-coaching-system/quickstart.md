# Quickstart: Coaching System

## Overview
The Coaching System allows students to get 1:1 visual feedback from mentors. This guide covers how to set up the environment and test the flow using mock data.

## Prerequisites
- Node.js 18+
- `npm install` completed

## Running the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:3000/coaching` (route to be created).

## Key Components
- **Request Page**: `/coaching/request` - Upload art and select mentor.
- **Session Detail**: `/coaching/session/[id]` - View progress, feedback, and chat.
- **Mentor Workspace**: `/coaching/mentor/[id]` - Canvas editor for drawing feedback.

## Mock Data Setup
The system uses `src/mocks/data.ts` to simulate database state.
To reset or modify data:
1. Open `src/mocks/data.ts`
2. Locate `MOCK_COACHING_SESSIONS`
3. Add a new session object manually if needed for testing specific states (e.g., `REFUNDED`).

## Testing the Flow
1. **Student Request**:
   - Log in as Student (use mock auth).
   - Go to `/coaching/request`.
   - Upload an image and submit.
   - Verify credit deduction in the navbar.

2. **Mentor Feedback**:
   - Log in as Mentor (use mock auth).
   - Go to Dashboard -> "Pending Requests".
   - Click "Start Coaching".
   - Draw on the canvas and "Submit Feedback".

3. **Review & Compare**:
   - Switch back to Student.
   - Open the session.
   - Use the "Compare" slider to see before/after.
