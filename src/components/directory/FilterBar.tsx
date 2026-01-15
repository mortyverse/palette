// src/components/directory/FilterBar.tsx
'use client'

import { UNIVERSITIES, STYLE_TAGS } from '@/lib/constants/mentor'
import type { MentorSearchFilters } from '@/types/mentor'

interface FilterBarProps {
  filters: MentorSearchFilters
  onFilterChange: (filters: MentorSearchFilters) => void
  onClear: () => void
}

export function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
  const handleUniversityChange = (university: string) => {
    onFilterChange({ ...filters, university: university || undefined })
  }

  const handleStyleTagChange = (styleTag: string) => {
    onFilterChange({ ...filters, styleTag: styleTag || undefined })
  }

  const hasFilters = filters.university || filters.styleTag

  return (
    <div className="bg-white border border-[var(--palette-border)] rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* University Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--palette-text)] mb-1">
            대학교
          </label>
          <select
            value={filters.university || ''}
            onChange={e => handleUniversityChange(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--palette-border)] rounded-md bg-white text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)]"
          >
            <option value="">전체</option>
            {UNIVERSITIES.map(uni => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Style Tag Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--palette-text)] mb-1">
            스타일
          </label>
          <select
            value={filters.styleTag || ''}
            onChange={e => handleStyleTagChange(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--palette-border)] rounded-md bg-white text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)]"
          >
            <option value="">전체</option>
            {STYLE_TAGS.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <div className="flex items-end">
          <button
            onClick={onClear}
            disabled={!hasFilters}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              hasFilters
                ? 'text-[var(--palette-gold)] hover:bg-[var(--palette-card)] cursor-pointer'
                : 'text-[var(--palette-muted)] cursor-not-allowed'
            }`}
          >
            초기화
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasFilters && (
        <div className="mt-3 pt-3 border-t border-[var(--palette-border)]">
          <div className="flex flex-wrap gap-2">
            {filters.university && (
              <span className="inline-flex items-center px-3 py-1 bg-[var(--palette-gold)]/10 text-[var(--palette-gold)] rounded-full text-sm">
                {filters.university}
                <button
                  onClick={() => handleUniversityChange('')}
                  className="ml-2 hover:text-[var(--palette-gold-dark)]"
                >
                  ×
                </button>
              </span>
            )}
            {filters.styleTag && (
              <span className="inline-flex items-center px-3 py-1 bg-[var(--palette-gold)]/10 text-[var(--palette-gold)] rounded-full text-sm">
                {filters.styleTag}
                <button
                  onClick={() => handleStyleTagChange('')}
                  className="ml-2 hover:text-[var(--palette-gold-dark)]"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
