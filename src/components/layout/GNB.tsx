// src/components/layout/GNB.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useHydration } from '@/hooks/use-hydration'
import { getNavItemsForRole } from '@/lib/constants/nav-items'
import { Button } from '@/components/ui/Button'

export function GNB() {
  const hydrated = useHydration()
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!hydrated) {
    return (
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="text-gray-400">로딩 중...</div>
        </div>
      </nav>
    )
  }

  const navItems = getNavItemsForRole(user?.role || null)

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            Palette
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="text-sm"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="primary" className="text-sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" className="text-sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
