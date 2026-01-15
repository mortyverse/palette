'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UploadForm } from '@/components/gallery/UploadForm';
import { useAuthStore } from '@/store/auth-store';
import { useHydration } from '@/hooks/use-hydration';

export default function UploadPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/login?redirect=/gallery/upload');
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (hydrated && isAuthenticated && user?.role !== 'student') {
      router.push('/gallery');
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="h-64 bg-gray-200 rounded mb-6" />
          <div className="h-10 bg-gray-200 rounded mb-4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          Upload Artwork
        </h1>
        <p className="text-[var(--palette-muted)] text-lg">
          Share your artwork with the community
        </p>
      </div>

      <div className="bg-[var(--palette-card)] rounded-xl p-8 shadow-sm border border-[var(--palette-text)]/[0.03]">
        <UploadForm />
      </div>
    </div>
  );
}
