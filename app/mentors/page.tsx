// app/mentors/page.tsx
'use client'

import { MentorGrid } from '@/components/directory/MentorGrid'

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-[var(--palette-bg)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            멘토 찾기
          </h1>
          <p className="text-[var(--palette-muted)] text-lg">
            검증된 멘토를 찾아 1:1 코칭을 받아보세요
          </p>
        </div>

        <MentorGrid />
      </div>
    </div>
  )
}
