// src/lib/constants/nav-items.ts
import type { UserRole } from '@/types/auth'

export interface NavItem {
  label: string
  href: string
}

export const GUEST_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
]

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
  { label: '학습 자료', href: '/resources' },
  { label: '멘토 찾기', href: '/mentors' },
  { label: '마이페이지', href: '/profile' },
]

export const MENTOR_NAV_ITEMS: NavItem[] = [
  { label: '갤러리', href: '/gallery' },
  { label: '포트폴리오 관리', href: '/portfolio' },
  { label: '학생 관리', href: '/students' },
  { label: '마이페이지', href: '/profile' },
]

export function getNavItemsForRole(role: UserRole | null): NavItem[] {
  if (!role) return GUEST_NAV_ITEMS

  switch (role) {
    case 'student':
      return STUDENT_NAV_ITEMS
    case 'mentor':
      return MENTOR_NAV_ITEMS
    default:
      return GUEST_NAV_ITEMS
  }
}
