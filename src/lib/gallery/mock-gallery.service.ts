import { Artwork, Comment, UserRole } from '@/types/gallery';
import { GalleryService, CreateArtworkParams } from './gallery-service.interface';
import { MOCK_ARTWORKS, MOCK_COMMENTS } from '@/mocks/data';
import { useAuthStore } from '@/store/auth-store';

const STORAGE_KEYS = {
  ARTWORKS: 'palette-artworks',
  COMMENTS: 'palette-comments',
  LIKES: 'palette-likes',
  SCRAPS: 'palette-scraps',
};

export class MockGalleryService implements GalleryService {
  private async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getData<T>(key: string, initialData: T): T {
    if (typeof window === 'undefined') return initialData;
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(stored);
  }

  private saveData<T>(key: string, data: T) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getArtworks(page: number, limit: number, filters?: { role?: UserRole }): Promise<{
    data: Artwork[];
    nextPage: number | null;
  }> {
    await this.delay();
    let artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const currentUser = useAuthStore.getState().user;
    const likes = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.LIKES, []);
    const scraps = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.SCRAPS, []);

    if (filters?.role) {
      artworks = artworks.filter((a) => a.authorRole === filters.role);
    }

    // Sort by latest by default
    artworks = [...artworks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = artworks.slice(start, end).map(art => ({
      ...art,
      isLiked: currentUser ? likes.some(l => l.userId === currentUser.id && l.artworkId === art.id) : false,
      isScrapped: currentUser ? scraps.some(s => s.userId === currentUser.id && s.artworkId === art.id) : false,
    }));

    return {
      data: paginated,
      nextPage: end < artworks.length ? page + 1 : null,
    };
  }

  async getArtwork(id: string): Promise<Artwork | null> {
    await this.delay();
    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const artwork = artworks.find((a) => a.id === id);
    if (!artwork) return null;

    const currentUser = useAuthStore.getState().user;
    const likes = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.LIKES, []);
    const scraps = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.SCRAPS, []);

    return {
      ...artwork,
      isLiked: currentUser ? likes.some(l => l.userId === currentUser.id && l.artworkId === id) : false,
      isScrapped: currentUser ? scraps.some(s => s.userId === currentUser.id && s.artworkId === id) : false,
    };
  }

  async uploadArtwork(params: CreateArtworkParams): Promise<Artwork> {
    await this.delay();
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('로그인이 필요합니다.');
    if (user.role !== 'student') throw new Error('학생 사용자만 작품을 업로드할 수 있습니다.');

    const newArtwork: Artwork = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name || 'Anonymous',
      authorRole: user.role as UserRole,
      title: params.title,
      description: params.description,
      imageUrl: params.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    };

    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    this.saveData(STORAGE_KEYS.ARTWORKS, [newArtwork, ...artworks]);

    return newArtwork;
  }

  async deleteArtwork(id: string): Promise<void> {
    await this.delay();
    const user = useAuthStore.getState().user;
    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const artwork = artworks.find((a) => a.id === id);

    if (!artwork) throw new Error('작품을 찾을 수 없습니다.');
    if (user?.id !== artwork.authorId) {
      throw new Error('삭제 권한이 없습니다.');
    }

    this.saveData(STORAGE_KEYS.ARTWORKS, artworks.filter((a) => a.id !== id));
  }

  async toggleLike(artworkId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    await this.delay();
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('로그인이 필요합니다.');

    const likes = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.LIKES, []);
    const existingIndex = likes.findIndex((l) => l.userId === user.id && l.artworkId === artworkId);
    
    let isLiked = false;
    if (existingIndex > -1) {
      likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      likes.push({ userId: user.id, artworkId });
      isLiked = true;
    }
    this.saveData(STORAGE_KEYS.LIKES, likes);

    // Update likeCount in artworks
    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const artwork = artworks.find((a) => a.id === artworkId);
    if (artwork) {
      artwork.likeCount += isLiked ? 1 : -1;
      this.saveData(STORAGE_KEYS.ARTWORKS, artworks);
    }

    return { isLiked, likeCount: artwork?.likeCount || 0 };
  }

  async toggleScrap(artworkId: string): Promise<{ isScrapped: boolean }> {
    await this.delay();
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('로그인이 필요합니다.');

    const scraps = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.SCRAPS, []);
    const existingIndex = scraps.findIndex((s) => s.userId === user.id && s.artworkId === artworkId);
    
    let isScrapped = false;
    if (existingIndex > -1) {
      scraps.splice(existingIndex, 1);
      isScrapped = false;
    } else {
      scraps.push({ userId: user.id, artworkId });
      isScrapped = true;
    }
    this.saveData(STORAGE_KEYS.SCRAPS, scraps);

    return { isScrapped };
  }

  async getComments(artworkId: string): Promise<Comment[]> {
    await this.delay();
    const comments = this.getData<Comment[]>(STORAGE_KEYS.COMMENTS, MOCK_COMMENTS);
    return comments
      .filter((c) => c.artworkId === artworkId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async postComment(artworkId: string, content: string): Promise<Comment> {
    await this.delay();
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('로그인이 필요합니다.');

    const newComment: Comment = {
      id: crypto.randomUUID(),
      artworkId,
      authorId: user.id,
      authorName: user.name || 'Anonymous',
      authorRole: user.role as UserRole,
      content,
      createdAt: new Date().toISOString(),
    };

    const comments = this.getData<Comment[]>(STORAGE_KEYS.COMMENTS, MOCK_COMMENTS);
    this.saveData(STORAGE_KEYS.COMMENTS, [newComment, ...comments]);

    // Update commentCount in artworks
    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const artwork = artworks.find((a) => a.id === artworkId);
    if (artwork) {
      artwork.commentCount += 1;
      this.saveData(STORAGE_KEYS.ARTWORKS, artworks);
    }

    return newComment;
  }

  async getScrappedArtworks(): Promise<Artwork[]> {
    await this.delay();
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('로그인이 필요합니다.');

    const artworks = this.getData<Artwork[]>(STORAGE_KEYS.ARTWORKS, MOCK_ARTWORKS);
    const scraps = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.SCRAPS, []);
    const likes = this.getData<{ userId: string; artworkId: string }[]>(STORAGE_KEYS.LIKES, []);

    const userScraps = scraps.filter((s) => s.userId === user.id);
    const scrapArtworkIds = new Set(userScraps.map((s) => s.artworkId));

    return artworks
      .filter((a) => scrapArtworkIds.has(a.id))
      .map((art) => ({
        ...art,
        isLiked: likes.some((l) => l.userId === user.id && l.artworkId === art.id),
        isScrapped: true,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const galleryService = new MockGalleryService();
