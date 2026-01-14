// app/(auth)/signup/page.tsx
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1
            className="text-[2.5rem] text-[var(--palette-text)] mb-2"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Join Palette
          </h1>
          <p className="text-[var(--palette-muted)]">Start your creative journey today.</p>
        </div>

        <div className="bg-[var(--palette-card)] p-10 rounded-xl shadow-[0_4px_20px_rgba(62,54,46,0.04)] border border-[var(--palette-text)]/[0.03]">
          <SignupForm />
          <p className="mt-6 text-center text-sm text-[var(--palette-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--palette-gold)] hover:text-[var(--palette-gold-dark)] font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
