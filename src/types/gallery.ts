export type UserRole = 'student' | 'mentor' | 'admin';

export interface GalleryUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Artwork {
  id: string;
  authorId: string;
  authorName: string; // For display convenience in Phase 1
  authorRole: UserRole; // For display convenience (Mentor badge)
  title: string;
  description: string;
  imageUrl: string; // Base64 for Phase 1
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean; // Derived for current user
  isScrapped?: boolean; // Derived for current user
}

export interface Comment {
  id: string;
  artworkId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Like {
  userId: string;
  artworkId: string;
  createdAt: string;
}

export interface Scrap {
  userId: string;
  artworkId: string;
  createdAt: string;
}

export interface ArtworkDetail extends Artwork {
  comments: Comment[];
  isLiked: boolean;
  isScrapped: boolean;
}

export interface GalleryFilters {
  role?: UserRole;
  sortBy?: 'latest' | 'popular';
  page: number;
  limit: number;
}
