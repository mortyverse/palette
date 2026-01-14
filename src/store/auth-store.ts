// src/store/auth-store.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/lib/auth/mock-auth.service'
import type { UserProfile, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  loginAt?: string
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginAt: undefined,

      login: async (credentials) => {
        const user = await authService.login(credentials)
        set({
          user,
          isAuthenticated: true,
          loginAt: new Date().toISOString()
        })
      },

      register: async (data) => {
        const user = await authService.register(data)
        set({
          user,
          isAuthenticated: true,
          loginAt: new Date().toISOString()
        })
      },

      logout: async () => {
        await authService.logout()
        set({
          user: null,
          isAuthenticated: false,
          loginAt: undefined
        })
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)
