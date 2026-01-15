'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artwork } from '@/types/gallery';
import { Heart, MessageCircle, Bookmark, Trash2 } from 'lucide-react';
import { galleryService } from '@/lib/gallery';
import { useAuthStore } from '@/store/auth-store';
import { useGalleryStore } from '@/store/gallery-store';

interface ArtworkCardProps {
  artwork: Artwork;
  showActions?: boolean;
}

export function ArtworkCard({ artwork, showActions = true }: ArtworkCardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { updateArtwork, removeArtwork } = useGalleryStore();
  const [isLiked, setIsLiked] = useState(artwork.isLiked || false);
  const [likeCount, setLikeCount] = useState(artwork.likeCount);
  const [isScrapped, setIsScrapped] = useState(artwork.isScrapped || false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = user?.id === artwork.authorId;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      const result = await galleryService.toggleLike(artwork.id);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
      updateArtwork(artwork.id, { likeCount: result.likeCount });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleScrap = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      const result = await galleryService.toggleScrap(artwork.id);
      setIsScrapped(result.isScrapped);
    } catch (error) {
      console.error('Failed to toggle scrap:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canDelete || isDeleting) return;

    if (!confirm('Are you sure you want to delete this artwork?')) return;

    setIsDeleting(true);
    try {
      await galleryService.deleteArtwork(artwork.id);
      removeArtwork(artwork.id);
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md">
      <Link href={`/gallery/${artwork.id}`} className="block aspect-[4/3] overflow-hidden bg-gray-100 relative">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            title="Delete artwork"
          >
            <Trash2 className={`h-4 w-4 ${isDeleting ? 'text-gray-400' : 'text-red-500'}`} />
          </button>
        )}
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{artwork.authorName}</span>
          {artwork.authorRole === 'mentor' && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              Mentor
            </span>
          )}
        </div>

        <Link href={`/gallery/${artwork.id}`} className="block">
          <h3 className="mb-3 line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-600">
            {artwork.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-500">
            {showActions && isAuthenticated ? (
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart
                  size={16}
                  className={isLiked ? 'fill-red-500 text-red-500' : ''}
                />
                <span className="text-xs">{likeCount}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span className="text-xs">{likeCount}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span className="text-xs">{artwork.commentCount}</span>
            </div>
          </div>

          {showActions && isAuthenticated && (
            <button
              onClick={handleScrap}
              className="text-gray-500 hover:text-[var(--palette-gold)] transition-colors"
              title={isScrapped ? 'Remove from scraps' : 'Save to scraps'}
            >
              <Bookmark
                size={16}
                className={isScrapped ? 'fill-[var(--palette-gold)] text-[var(--palette-gold)]' : ''}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
