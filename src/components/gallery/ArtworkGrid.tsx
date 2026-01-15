'use client';

import { ArtworkCard } from './ArtworkCard';
import { Artwork } from '@/types/gallery';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Loader2 } from 'lucide-react';

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ArtworkGrid({
  artworks,
  isLoading,
  hasMore,
  onLoadMore,
}: ArtworkGridProps) {
  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {/* Loading indicator / Sentinel for infinite scroll */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-[var(--palette-muted)]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && artworks.length > 0 && (
          <p className="text-[var(--palette-muted)] text-sm">
            No more artworks to load
          </p>
        )}
      </div>
    </div>
  );
}
