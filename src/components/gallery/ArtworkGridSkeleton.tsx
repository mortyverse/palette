'use client';

interface ArtworkGridSkeletonProps {
  count?: number;
}

export function ArtworkGridSkeleton({ count = 8 }: ArtworkGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-gray-200 rounded-t-xl" />
          <div className="p-4 bg-white rounded-b-xl border border-t-0 border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-10" />
              <div className="h-4 bg-gray-200 rounded w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
