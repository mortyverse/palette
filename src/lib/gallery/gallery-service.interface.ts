import { Artwork, Comment, UserRole } from '@/types/gallery';

export interface CreateArtworkParams {
  title: string;
  description: string;
  imageUrl: string; // Base64 for Phase 1
}

export interface GalleryService {
  /**
   * Fetches a paginated list of artworks.
   * Should simulate network delay.
   */
  getArtworks(page: number, limit: number, filters?: { role?: UserRole }): Promise<{
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

  /**
   * Fetches artworks scrapped by the current user.
   */
  getScrappedArtworks(): Promise<Artwork[]>;
}
