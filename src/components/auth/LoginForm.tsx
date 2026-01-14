// src/components/auth/LoginForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema, type LoginFormData } from '@/lib/validation/auth-schemas'
import { useAuthStore } from '@/store/auth-store'
import { useState, Suspense } from 'react'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const login = useAuthStore(state => state.login)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data)
      // Redirect to returnUrl if present, otherwise to home
      router.push(returnUrl || '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {returnUrl && (
        <div className="p-3 text-sm text-blue-600 bg-blue-50 rounded">
          상세 내용을 보려면 로그인이 필요합니다
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <FormField
        {...register('email')}
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        disabled={isSubmitting}
      />

      <FormField
        {...register('password')}
        label="비밀번호"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
      <LoginFormInner />
    </Suspense>
  )
}
