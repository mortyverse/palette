'use client';

import Link from 'next/link';
import { ImageOff, MessageSquareOff, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type EmptyStateType = 'artworks' | 'comments' | 'scraps';

interface EmptyStateProps {
  type: EmptyStateType;
  showAction?: boolean;
  isAuthenticated?: boolean;
  userRole?: string | null;
}

const emptyStateConfig: Record<
  EmptyStateType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
  }
> = {
  artworks: {
    icon: <ImageOff className="h-12 w-12 text-[var(--palette-muted)]" />,
    title: 'No Artworks Yet',
    description: 'Be the first to share your creativity with the community.',
    actionLabel: 'Upload Artwork',
    actionHref: '/gallery/upload',
  },
  comments: {
    icon: <MessageSquareOff className="h-12 w-12 text-[var(--palette-muted)]" />,
    title: 'No Comments Yet',
    description: 'Start the conversation by sharing your thoughts.',
  },
  scraps: {
    icon: <ImageOff className="h-12 w-12 text-[var(--palette-muted)]" />,
    title: 'No Scraps Yet',
    description: "You haven't saved any artworks yet. Browse the gallery to find inspiration.",
    actionLabel: 'Browse Gallery',
    actionHref: '/gallery',
  },
};

export function EmptyState({
  type,
  showAction = true,
  isAuthenticated = false,
  userRole = null,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];

  const canShowAction =
    showAction &&
    config.actionHref &&
    config.actionLabel &&
    (type !== 'artworks' || (isAuthenticated && userRole === 'student'));

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4">{config.icon}</div>
      <h3
        className="text-xl font-normal text-[var(--palette-text)] mb-2"
        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
      >
        {config.title}
      </h3>
      <p className="text-[var(--palette-muted)] text-center max-w-md mb-6">
        {config.description}
      </p>
      {canShowAction && (
        <Link href={config.actionHref!}>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {config.actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
