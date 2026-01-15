// src/components/mentor/MentorCard.tsx
'use client'

import type { MentorProfile } from '@/types/mentor'

interface MentorCardProps {
  mentor: MentorProfile
  onClick?: () => void
}

export function MentorCard({ mentor, onClick }: MentorCardProps) {
  return (
    <div
      className="bg-white border border-[var(--palette-border)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header with badge */}
      <div className="relative h-32 bg-gradient-to-br from-[var(--palette-gold)] to-[var(--palette-gold-dark)] p-4">
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
            Verified
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-[var(--palette-gold)]">
            {mentor.major.charAt(0)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[var(--palette-text)] mb-1">
            {mentor.university}
          </h3>
          <p className="text-sm text-[var(--palette-muted)]">{mentor.major}</p>
        </div>

        {/* Style Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mentor.styleTags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[var(--palette-card)] border border-[var(--palette-border)] rounded-full text-xs text-[var(--palette-text)]"
            >
              {tag}
            </span>
          ))}
          {mentor.styleTags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-[var(--palette-muted)]">
              +{mentor.styleTags.length - 3}
            </span>
          )}
        </div>

        {/* Intro Preview */}
        <p className="text-sm text-[var(--palette-muted)] line-clamp-2">
          {mentor.intro}
        </p>
      </div>
    </div>
  )
}
