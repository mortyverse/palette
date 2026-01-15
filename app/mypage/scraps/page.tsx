'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, ArrowLeft, Loader2 } from 'lucide-react';
import { ArtworkCard } from '@/components/gallery/ArtworkCard';
import { Button } from '@/components/ui/Button';
import { galleryService } from '@/lib/gallery';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';
import { Artwork } from '@/types/gallery';

export default function ScrapsPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { isAuthenticated } = useAuthStore();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/login?redirect=/mypage/scraps');
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;

    async function fetchScraps() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await galleryService.getScrappedArtworks();
        setArtworks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scraps');
      } finally {
        setIsLoading(false);
      }
    }

    fetchScraps();
  }, [hydrated, isAuthenticated]);

  if (!hydrated) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/3] bg-gray-200 rounded-t-xl" />
                <div className="p-4 bg-white rounded-b-xl border border-t-0 border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-16">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-text)] mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Gallery
      </Link>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--palette-gold)]/10 rounded-full mb-4">
          <Bookmark className="h-8 w-8 text-[var(--palette-gold)]" />
        </div>
        <h1
          className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          My Scraps
        </h1>
        <p className="text-[var(--palette-muted)] text-lg">
          Artworks you&apos;ve saved for later
        </p>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--palette-muted)]" />
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--palette-muted)] text-lg mb-4">
            You haven&apos;t scrapped any artworks yet.
          </p>
          <Link href="/gallery">
            <Button variant="primary">Browse Gallery</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
