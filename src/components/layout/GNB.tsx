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
      <header className="flex justify-between items-center px-12 py-6 border-b border-[var(--palette-text)]/[0.08] bg-[var(--palette-bg)]">
        <div className="text-[var(--palette-muted)]">Loading...</div>
      </header>
    )
  }

  const navItems = getNavItemsForRole(user?.role || null)

  return (
    <header className="flex justify-between items-center px-12 py-6 border-b border-[var(--palette-text)]/[0.08] bg-[var(--palette-bg)]">
      {/* Logo / Brand */}
      <Link
        href="/"
        className="font-[var(--font-playfair)] text-2xl font-semibold tracking-tight text-[var(--palette-text)]"
        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
      >
        Palette
      </Link>

      {/* Navigation Items */}
      <nav>
        <ul className="flex items-center gap-8">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[var(--palette-text)] font-medium text-[0.95rem] transition-colors hover:text-[var(--palette-gold)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Auth Section */}
      <div>
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--palette-muted)]">{user.email}</span>
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="text-xs py-2 px-4"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="primary" className="text-xs py-2 px-4">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" className="text-xs py-2 px-4">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
