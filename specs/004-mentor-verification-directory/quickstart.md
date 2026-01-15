# Quickstart: Mentor Verification & Directory

## Prerequisites

1. Ensure the app is running: `npm run dev`
2. Open `http://localhost:3000`

## Test Scenarios

### 1. Mentor Application Flow

1.  **Sign Up**:
    -   Go to `/signup`.
    -   Create a new account with role **Mentor**.
    -   *Result*: You should be redirected to the profile setup or receive a prompt.
2.  **Access Restriction**:
    -   Try to navigate to `/coaching` or `/gallery`.
    -   *Result*: You should see a "Waiting for Approval" screen or be redirected to `/mypage/profile`.
3.  **Submit Profile**:
    -   Go to `/mypage/profile`.
    -   Fill in details (University, Style).
    -   Upload a dummy file for verification.
    -   *Result*: Profile status remains "Pending".

### 2. Admin Approval Flow

1.  **Access Admin Panel** (Simulated):
    -   Currently, we don't have a dedicated Admin UI implemented in this spec (focus is on Mentor/Student).
    -   *Workaround*: Open Browser Console.
    -   Run: `window.mockMentorService.approveMentor('YOUR_USER_ID')` (We will expose this for testing).
    -   *Or*: Edit `localStorage` key `mock-mentor-profiles`, find your user, set `status: "APPROVED"`.
2.  **Verify Access**:
    -   Refresh the page.
    -   Navigate to `/coaching`.
    -   *Result*: Access is now granted.

### 3. Mentor Directory

1.  **View Directory**:
    -   Go to `/mentors` (or wherever the directory is linked).
    -   *Result*: You should see your approved mentor card.
2.  **Filter**:
    -   Use the university filter.
    -   *Result*: List updates to show matching mentors.

## Troubleshooting

-   **Clear Data**: Run `localStorage.clear()` in console to reset all users and profiles.
-   **Logs**: Check console logs for `MockMentorService` actions.
