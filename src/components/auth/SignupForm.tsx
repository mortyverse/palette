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
  const register = useAuthStore(state => state.register)
  const [error, setError] = useState<string | null>(null)
  const [isHashing, setIsHashing] = useState(false)

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
      setIsHashing(true)
      await register(data)
      setIsHashing(false)
      router.push('/')
    } catch (err) {
      setIsHashing(false)
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다')
    }
  }

  const isLoading = isSubmitting || isHashing

  return (
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
        {isHashing ? '처리 중...' : isSubmitting ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  )
}
