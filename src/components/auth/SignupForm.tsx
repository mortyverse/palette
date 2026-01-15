// src/components/auth/SignupForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signupSchema, type SignupFormData } from '@/lib/validation/auth-schemas'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

export function SignupForm() {
  const router = useRouter()
  const registerUser = useAuthStore(state => state.register)
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle)
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null)
      await registerUser(data)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      await loginWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google 회원가입에 실패했습니다')
    }
  }

  const isLoading = isSubmitting

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md border border-[var(--danger)]/20">
            {error}
          </div>
        )}

        <FormField
          {...registerField('email')}
          label="이메일"
          type="email"
          placeholder="example@email.com"
          error={errors.email?.message}
          disabled={isLoading}
        />

        <FormField
          {...registerField('password')}
          label="비밀번호"
          type="password"
          placeholder="최소 8자, 문자와 숫자 포함"
          error={errors.password?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="block font-bold text-[var(--palette-text)]">
            Role
          </label>
          <select
            {...registerField('role')}
            className="w-full px-4 py-3 border border-[var(--palette-border)] rounded-md bg-white text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)] transition-colors"
            disabled={isLoading}
          >
            <option value="">Select your role</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>
          {errors.role && (
            <p className="text-sm text-[var(--danger)]">{errors.role.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isSubmitting ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--palette-border)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[var(--palette-card)] text-[var(--palette-muted)]">Or join with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="action"
        className="w-full justify-center normal-case tracking-normal"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
    </div>
  )
}
