// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1
            className="text-[2.5rem] text-[var(--palette-text)] mb-2"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Welcome Back
          </h1>
          <p className="text-[var(--palette-muted)]">Sign in to continue your creative journey.</p>
        </div>

        <div className="bg-[var(--palette-card)] p-10 rounded-xl shadow-[0_4px_20px_rgba(62,54,46,0.04)] border border-[var(--palette-text)]/[0.03]">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-[var(--palette-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[var(--palette-gold)] hover:text-[var(--palette-gold-dark)] font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
