// src/store/auth-store.ts
'use client'

import { create } from 'zustand'
import { authService } from '@/lib/auth/supabase-auth.service'
import type { UserProfile, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  loginAt?: string
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  setLoading: (isLoading: boolean) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginAt: undefined,

  login: async (credentials) => {
    const user = await authService.login(credentials)
    set({
      user,
      isAuthenticated: true,
      loginAt: new Date().toISOString(),
    })
  },

  loginWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await authService.loginWithGoogle()
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (data) => {
    const user = await authService.register(data)
    set({
      user,
      isAuthenticated: true,
      loginAt: new Date().toISOString(),
    })
  },

  logout: async () => {
    await authService.logout()
    set({
      user: null,
      isAuthenticated: false,
      loginAt: undefined,
    })
  },

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      loginAt: user ? new Date().toISOString() : undefined,
    })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  initialize: async () => {
    set({ isLoading: true })
    try {
      const user = await authService.getCurrentUser()
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        loginAt: user ? new Date().toISOString() : undefined,
      })
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))
