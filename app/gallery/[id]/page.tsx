'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Bookmark, Share2, Trash2, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CommentList } from '@/components/gallery/CommentList';
import { CommentInput } from '@/components/gallery/CommentInput';
import { Button } from '@/components/ui/Button';
import { galleryService } from '@/lib/gallery';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';
import { Artwork, Comment } from '@/types/gallery';

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydration();
  const { user, isAuthenticated } = useAuthStore();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isScrapped, setIsScrapped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = artwork && user?.id === artwork.authorId;

  useEffect(() => {
    if (!hydrated) return;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [artworkData, commentsData] = await Promise.all([
          galleryService.getArtwork(id),
          galleryService.getComments(id),
        ]);

        if (!artworkData) {
          setError('Artwork not found');
          return;
        }

        setArtwork(artworkData);
        setComments(commentsData);
        setIsLiked(artworkData.isLiked || false);
        setLikeCount(artworkData.likeCount);
        setIsScrapped(artworkData.isScrapped || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, hydrated]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await galleryService.toggleLike(id);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleScrap = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await galleryService.toggleScrap(id);
      setIsScrapped(result.isScrapped);
    } catch (error) {
      console.error('Failed to toggle scrap:', error);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    setIsDeleting(true);
    try {
      await galleryService.deleteArtwork(id);
      router.push('/gallery');
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      setIsDeleting(false);
    }
  };

  const handlePostComment = async (content: string) => {
    const newComment = await galleryService.postComment(id, content);
    setComments((prev) => [newComment, ...prev]);
    if (artwork) {
      setArtwork({ ...artwork, commentCount: artwork.commentCount + 1 });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch {
      alert('Failed to copy link');
    }
  };

  if (!hydrated || isLoading) {
    return (
      <ProtectedRoute>
        <div className="max-w-[1100px] mx-auto my-12 px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !artwork) {
    return (
      <ProtectedRoute>
        <div className="max-w-[1100px] mx-auto my-12 px-6 text-center">
          <p className="text-red-500 mb-4">{error || 'Artwork not found'}</p>
          <Link href="/gallery">
            <Button variant="secondary">Back to Gallery</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-[1100px] mx-auto my-12 px-6">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[var(--palette-muted)] hover:text-[var(--palette-text)] mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* Left: Artwork */}
          <main className="flex flex-col gap-6">
            <div className="relative w-full bg-[var(--palette-border)] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={1000}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-3 justify-end flex-wrap">
              <Button
                variant="action"
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={isLiked ? 'border-red-400 text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
                Like ({likeCount})
              </Button>
              <Button
                variant="action"
                onClick={handleScrap}
                disabled={!isAuthenticated}
                className={isScrapped ? 'border-[var(--palette-gold)] text-[var(--palette-gold)]' : ''}
              >
                <Bookmark className={`h-4 w-4 ${isScrapped ? 'fill-[var(--palette-gold)]' : ''}`} />
                Scrap
              </Button>
              <Button variant="action" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {canDelete && (
                <Button
                  variant="action"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hover:border-red-400 hover:text-red-500"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              )}
            </div>
          </main>

          {/* Right: Info */}
          <aside className="flex flex-col gap-8">
            <div className="border-b border-[var(--palette-border)] pb-6">
              <div className="flex items-center gap-2 font-bold mb-2">
                <div className="w-8 h-8 bg-[var(--palette-border)] rounded-full flex items-center justify-center text-sm">
                  {artwork.authorName.charAt(0)}
                </div>
                <span>{artwork.authorName}</span>
                {artwork.authorRole === 'mentor' && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Mentor
                  </span>
                )}
              </div>
              <h1
                className="text-[2rem] mb-2 text-[var(--palette-text)]"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
              >
                {artwork.title}
              </h1>
              <p className="text-[var(--palette-muted)] text-[0.95rem]">
                {artwork.description}
              </p>
            </div>

            <h3
              className="text-xl"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
            >
              Critiques & Comments ({comments.length})
            </h3>

            <CommentList comments={comments} />

            {isAuthenticated ? (
              <CommentInput onSubmit={handlePostComment} />
            ) : (
              <p className="text-center text-[var(--palette-muted)] py-4">
                <Link href="/login" className="text-[var(--palette-gold)] hover:underline">
                  Log in
                </Link>{' '}
                to leave a comment
              </p>
            )}
          </aside>
        </div>
      </div>
    </ProtectedRoute>
  );
}
