# Gallery Service Contract

This contract defines the TypeScript interface that the Service Layer must implement.
The Phase 1 implementation will use Mock Data/LocalStorage, while Phase 2 will use Supabase.

## Types

```typescript
export interface Artwork {
  id: string;
  authorId: string;
  authorName: string; // Joined for display
  authorAvatar?: string; // Joined for display
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;   // Derived for current user
  isScrapped: boolean; // Derived for current user
}

export interface Comment {
  id: string;
  artworkId: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'mentor' | 'admin';
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CreateArtworkParams {
  title: string;
  description: string;
  imageUrl: string; // Base64
}
```

## Service Interface

```typescript
export interface GalleryService {
  /**
   * Fetches a paginated list of artworks.
   * Should simulate network delay.
   */
  getArtworks(page: number, limit: number): Promise<{
    data: Artwork[];
    nextPage: number | null;
  }>;

  /**
   * Fetches a single artwork by ID.
   */
  getArtwork(id: string): Promise<Artwork | null>;

  /**
   * Uploads a new artwork.
   * Throws error if user is not a Student.
   */
  uploadArtwork(params: CreateArtworkParams): Promise<Artwork>;

  /**
   * Deletes an artwork.
   * Throws error if user is not the author.
   */
  deleteArtwork(id: string): Promise<void>;

  /**
   * Toggles the like status for the current user.
   */
  toggleLike(artworkId: string): Promise<{ isLiked: boolean; likeCount: number }>;

  /**
   * Toggles the scrap status for the current user.
   */
  toggleScrap(artworkId: string): Promise<{ isScrapped: boolean }>;

  /**
   * Fetches comments for an artwork.
   */
  getComments(artworkId: string): Promise<Comment[]>;

  /**
   * Posts a new comment.
   */
  postComment(artworkId: string, content: string): Promise<Comment>;
}
```
