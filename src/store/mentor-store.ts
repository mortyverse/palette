// src/store/mentor-store.ts
'use client'

import { create } from 'zustand'
import { mentorService } from '@/lib/mentor/mock-mentor.service'
import type {
  MentorProfile,
  CreateMentorProfileData,
  UpdateMentorProfileData,
  MentorSearchFilters,
} from '@/types/mentor'

interface MentorState {
  // My profile (for logged-in mentor)
  myProfile: MentorProfile | null
  isLoading: boolean
  error: string | null

  // Directory (for public view)
  mentors: MentorProfile[]
  directoryLoading: boolean
  filters: MentorSearchFilters

  // Admin applications
  applications: MentorProfile[]
  applicationsLoading: boolean

  // Actions - My Profile
  fetchMyProfile: (userId: string) => Promise<void>
  createProfile: (data: CreateMentorProfileData) => Promise<void>
  updateProfile: (userId: string, data: UpdateMentorProfileData) => Promise<void>
  uploadDocs: (userId: string, files: File[]) => Promise<void>

  // Actions - Directory
  searchMentors: (filters?: MentorSearchFilters) => Promise<void>
  setFilters: (filters: MentorSearchFilters) => void
  clearFilters: () => void

  // Actions - Admin
  fetchApplications: () => Promise<void>
  approveMentor: (userId: string) => Promise<void>
  rejectMentor: (userId: string, reason: string) => Promise<void>

  // Utility
  clearError: () => void
  reset: () => void
}

const initialState = {
  myProfile: null,
  isLoading: false,
  error: null,
  mentors: [],
  directoryLoading: false,
  filters: {},
  applications: [],
  applicationsLoading: false,
}

export const useMentorStore = create<MentorState>()((set, get) => ({
  ...initialState,

  // My Profile Actions
  fetchMyProfile: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const profile = await mentorService.getMyProfile(userId)
      set({ myProfile: profile, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '프로필 조회에 실패했습니다'
      set({ error: message, isLoading: false })
    }
  },

  createProfile: async (data: CreateMentorProfileData) => {
    set({ isLoading: true, error: null })
    try {
      const profile = await mentorService.createProfile(data)
      set({ myProfile: profile, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '프로필 생성에 실패했습니다'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  updateProfile: async (userId: string, data: UpdateMentorProfileData) => {
    set({ isLoading: true, error: null })
    try {
      const profile = await mentorService.updateProfile(userId, data)
      set({ myProfile: profile, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '프로필 수정에 실패했습니다'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  uploadDocs: async (userId: string, files: File[]) => {
    set({ isLoading: true, error: null })
    try {
      const profile = await mentorService.uploadVerificationDocs(userId, files)
      set({ myProfile: profile, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '문서 업로드에 실패했습니다'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  // Directory Actions
  searchMentors: async (filters?: MentorSearchFilters) => {
    const searchFilters = filters || get().filters
    set({ directoryLoading: true })
    try {
      const mentors = await mentorService.searchMentors(searchFilters)
      set({ mentors, directoryLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '멘토 검색에 실패했습니다'
      set({ error: message, directoryLoading: false })
    }
  },

  setFilters: (filters: MentorSearchFilters) => {
    set({ filters })
  },

  clearFilters: () => {
    set({ filters: {} })
  },

  // Admin Actions
  fetchApplications: async () => {
    set({ applicationsLoading: true })
    try {
      const applications = await mentorService.getAllApplications()
      set({ applications, applicationsLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '신청 목록 조회에 실패했습니다'
      set({ error: message, applicationsLoading: false })
    }
  },

  approveMentor: async (userId: string) => {
    set({ applicationsLoading: true, error: null })
    try {
      await mentorService.approveMentor(userId)
      // Refresh the applications list
      const applications = await mentorService.getAllApplications()
      set({ applications, applicationsLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '승인에 실패했습니다'
      set({ error: message, applicationsLoading: false })
      throw err
    }
  },

  rejectMentor: async (userId: string, reason: string) => {
    set({ applicationsLoading: true, error: null })
    try {
      await mentorService.rejectMentor(userId, reason)
      // Refresh the applications list
      const applications = await mentorService.getAllApplications()
      set({ applications, applicationsLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '거절에 실패했습니다'
      set({ error: message, applicationsLoading: false })
      throw err
    }
  },

  // Utility Actions
  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))
