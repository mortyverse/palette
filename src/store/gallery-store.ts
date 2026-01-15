'use client';

import { create } from 'zustand';
import { Artwork, UserRole } from '@/types/gallery';
import { galleryService } from '@/lib/gallery';

interface GalleryState {
  artworks: Artwork[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  filters: {
    role?: UserRole;
  };

  // Actions
  fetchArtworks: (isInitial?: boolean) => Promise<void>;
  setFilter: (role?: UserRole) => void;
  resetGallery: () => void;
  
  // Optimistic updates or single item actions
  addArtwork: (artwork: Artwork) => void;
  removeArtwork: (id: string) => void;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  artworks: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  filters: {},

  fetchArtworks: async (isInitial = false) => {
    const { page, artworks, filters, isLoading, hasMore } = get();
    
    if (isLoading || (!hasMore && !isInitial)) return;

    set({ isLoading: true, error: null });

    try {
      const currentPage = isInitial ? 1 : page;
      const { data, nextPage } = await galleryService.getArtworks(currentPage, 10, filters);

      set({
        artworks: isInitial ? data : [...artworks, ...data],
        page: nextPage || currentPage,
        hasMore: !!nextPage,
        isLoading: false,
      });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '갤러리를 불러오는 중 오류가 발생했습니다.', 
        isLoading: false 
      });
    }
  },

  setFilter: (role) => {
    set({ filters: { role }, page: 1, hasMore: true, artworks: [] });
    get().fetchArtworks(true);
  },

  resetGallery: () => {
    set({ artworks: [], page: 1, hasMore: true, filters: {}, error: null });
  },

  addArtwork: (artwork) => {
    set((state) => ({ artworks: [artwork, ...state.artworks] }));
  },

  removeArtwork: (id) => {
    set((state) => ({ artworks: state.artworks.filter((a) => a.id !== id) }));
  },

  updateArtwork: (id, updates) => {
    set((state) => ({
      artworks: state.artworks.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },
}));
