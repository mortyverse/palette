'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';
import { useGalleryStore } from '@/store/gallery-store';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';
import { Button } from '@/components/ui/Button';

export default function GalleryPage() {
  const hydrated = useHydration();
  const { artworks, isLoading, error, hasMore, fetchArtworks } = useGalleryStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hydrated) {
      fetchArtworks(true);
    }
  }, [hydrated, fetchArtworks]);

  const handleLoadMore = () => {
    fetchArtworks(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          Gallery
        </h1>
        <p className="text-[var(--palette-muted)] text-lg">
          Click on any artwork to view detailed feedback and critiques.
        </p>
      </div>

      {/* Upload Button for Students */}
      {isAuthenticated && user?.role === 'student' && (
        <div className="flex justify-end mb-8">
          <Link href="/gallery/upload">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Artwork
            </Button>
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      {!hydrated ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-t-xl" />
              <div className="p-4 bg-white rounded-b-xl border border-t-0 border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : artworks.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <p className="text-[var(--palette-muted)] text-lg mb-4">
            No artworks yet.
          </p>
          {isAuthenticated && user?.role === 'student' && (
            <Link href="/gallery/upload">
              <Button variant="primary">Be the first to upload!</Button>
            </Link>
          )}
        </div>
      ) : (
        <ArtworkGrid
          artworks={artworks}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}
