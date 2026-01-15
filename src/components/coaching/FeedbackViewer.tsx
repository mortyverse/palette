'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FeedbackViewerProps {
  originalImageUrl: string;
  feedbackImageUrl: string;
  comment: string;
}

type ViewMode = 'original' | 'feedback' | 'overlay';

export function FeedbackViewer({
  originalImageUrl,
  feedbackImageUrl,
  comment,
}: FeedbackViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('feedback');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setViewMode('original')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            viewMode === 'original'
              ? 'bg-[var(--palette-gold)] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          원본
        </button>
        <button
          onClick={() => setViewMode('feedback')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            viewMode === 'feedback'
              ? 'bg-[var(--palette-gold)] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          피드백
        </button>
        <button
          onClick={() => setViewMode('overlay')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            viewMode === 'overlay'
              ? 'bg-[var(--palette-gold)] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          비교 (오버레이)
        </button>
      </div>

      {/* Image Display */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
        {viewMode === 'original' && (
          <Image
            src={originalImageUrl}
            alt="Original artwork"
            fill
            className="object-contain"
          />
        )}

        {viewMode === 'feedback' && (
          <Image
            src={feedbackImageUrl}
            alt="Feedback from mentor"
            fill
            className="object-contain"
          />
        )}

        {viewMode === 'overlay' && (
          <>
            <Image
              src={originalImageUrl}
              alt="Original artwork"
              fill
              className="object-contain"
            />
            <div
              className="absolute inset-0"
              style={{ opacity: overlayOpacity }}
            >
              <Image
                src={feedbackImageUrl}
                alt="Feedback overlay"
                fill
                className="object-contain"
              />
            </div>
          </>
        )}
      </div>

      {/* Overlay Opacity Slider */}
      {viewMode === 'overlay' && (
        <div className="space-y-2">
          <label className="flex justify-between text-sm text-gray-600">
            <span>피드백 투명도</span>
            <span>{Math.round(overlayOpacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--palette-gold)]"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>원본</span>
            <span>피드백</span>
          </div>
        </div>
      )}

      {/* Comment */}
      <div className="p-4 bg-[var(--palette-card)] rounded-lg border border-[var(--palette-border)]">
        <h3 className="font-semibold mb-2">멘토 코멘트</h3>
        <p className="text-[var(--palette-text)]">{comment}</p>
      </div>
    </div>
  );
}
