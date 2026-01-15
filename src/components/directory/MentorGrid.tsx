// src/components/directory/MentorGrid.tsx
'use client'

import { useEffect } from 'react'
import { useMentorStore } from '@/store/mentor-store'
import { MentorCard } from '@/components/mentor/MentorCard'
import { FilterBar } from './FilterBar'

export function MentorGrid() {
  const {
    mentors,
    directoryLoading,
    filters,
    searchMentors,
    setFilters,
    clearFilters,
  } = useMentorStore()

  useEffect(() => {
    searchMentors()
  }, [searchMentors])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    searchMentors(newFilters)
  }

  const handleClearFilters = () => {
    clearFilters()
    searchMentors({})
  }

  if (directoryLoading) {
    return (
      <div>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-xl" />
              <div className="p-4 bg-white rounded-b-xl border border-t-0 border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16" />
                  <div className="h-6 bg-gray-200 rounded-full w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {mentors.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--palette-muted)] text-lg mb-2">
            {filters.university || filters.styleTag
              ? '검색 조건에 맞는 멘토가 없습니다.'
              : '등록된 멘토가 없습니다.'}
          </p>
          {(filters.university || filters.styleTag) && (
            <button
              onClick={handleClearFilters}
              className="text-[var(--palette-gold)] hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-[var(--palette-muted)] mb-4">
            {mentors.length}명의 멘토를 찾았습니다
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentors.map(mentor => (
              <MentorCard key={mentor.userId} mentor={mentor} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
