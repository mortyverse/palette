# Quickstart: Gallery Community

## Prerequisites
- Node.js 18+
- npm installed

## Running the Feature

1. **Start Development Server**
   ```bash
   npm run dev
   ```
2. **Open in Browser**
   - Navigate to `http://localhost:3000/gallery`

## Manual Testing Steps

### 1. Upload Artwork (Student)
1. Log in as a Student (use `student` / `password`).
2. Go to `/gallery`.
3. Click "Upload" button (Floating Action Button or Header).
4. Fill form:
   - Title: "Test Art"
   - Description: "Testing upload"
   - Image: Select a small file (< 500KB).
5. Submit.
6. **Verify**: You should be redirected to Gallery and see your new image at the top.

### 2. Infinite Scroll
1. Ensure there are > 12 items (Upload more or check `src/mocks/data.ts` initialization).
2. Scroll to bottom.
3. **Verify**: Loading spinner appears, then more items load.

### 3. Mentor Feedback
1. Log in as Mentor (use `mentor` / `password`).
2. Open any artwork detail page.
3. Post a comment: "Great work!".
4. **Verify**: Comment has colored background and "Mentor" badge.

### 4. Like & Scrap
1. As any user, click the "Heart" icon.
2. **Verify**: Count goes up, heart turns red.
3. Click "Bookmark" icon.
4. **Verify**: Icon fills.
5. Go to `/mypage` (if implemented) or check console logs for persistence.
