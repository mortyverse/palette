'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { ExamStatus } from '@/types/mock-exam';

interface TopicRevealProps {
  topicImageUrl?: string;
  status: ExamStatus;
  title: string;
}

export function TopicReveal({ topicImageUrl, status, title }: TopicRevealProps) {
  const prevTopicImageUrlRef = useRef<string | undefined>(undefined);
  const revealingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle reveal animation when topic becomes visible
  const triggerRevealAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const overlay = container.querySelector('.reveal-overlay');

    // Add animation classes
    container.classList.add('animate-reveal');
    if (overlay) {
      overlay.classList.add('animate-reveal-flash');
    }

    // Remove after animation completes
    setTimeout(() => {
      container.classList.remove('animate-reveal');
      if (overlay) {
        overlay.classList.remove('animate-reveal-flash');
      }
      revealingRef.current = false;
    }, 1000);
  }, []);

  // Track when topic transitions from hidden to revealed
  useEffect(() => {
    const wasHidden = prevTopicImageUrlRef.current === undefined;
    const isNowVisible = !!topicImageUrl;

    if (wasHidden && isNowVisible && !revealingRef.current) {
      revealingRef.current = true;
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        triggerRevealAnimation();
      });
    }

    // Update ref after processing
    prevTopicImageUrlRef.current = topicImageUrl;
  }, [topicImageUrl, triggerRevealAnimation]);

  // Topic is hidden (before start time)
  if (!topicImageUrl) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          {/* Lock Icon with Animation */}
          <div className="relative">
            <svg
              className="w-20 h-20 text-gray-400 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-gray-300">{title}</h3>
          <p className="mt-2 text-gray-500">시작 시간이 되면 주제가 공개됩니다</p>

          {/* Scanning Line Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--palette-gold)] to-transparent opacity-30"
              style={{
                animation: 'scan 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes scan {
            0%, 100% {
              top: 0%;
            }
            50% {
              top: 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  // Topic is revealed
  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-lg overflow-hidden"
    >
      <img
        src={topicImageUrl}
        alt={`주제: ${title}`}
        className="w-full h-full object-contain bg-gray-100"
      />

      {/* Reveal Animation Overlay */}
      <div className="reveal-overlay absolute inset-0 bg-[var(--palette-gold)] pointer-events-none opacity-0" />

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'IN_PROGRESS'
              ? 'bg-green-500 text-white'
              : status === 'ENDED'
              ? 'bg-gray-500 text-white'
              : 'bg-purple-500 text-white'
          }`}
        >
          {status === 'IN_PROGRESS'
            ? '진행중'
            : status === 'ENDED'
            ? '종료'
            : '채점완료'}
        </span>
      </div>

      <style jsx>{`
        @keyframes reveal {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        :global(.animate-reveal) {
          animation: reveal 0.5s ease-out;
        }
        @keyframes reveal-flash {
          0% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        :global(.animate-reveal-flash) {
          animation: reveal-flash 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
