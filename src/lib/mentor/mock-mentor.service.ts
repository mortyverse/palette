// src/lib/mentor/mock-mentor.service.ts
import type { MentorService } from './mentor-service.interface'
import type {
  MentorProfile,
  CreateMentorProfileData,
  UpdateMentorProfileData,
  MentorSearchFilters,
  VerificationDoc,
} from '@/types/mentor'
import { MentorError } from '@/types/mentor'

const MOCK_MENTOR_PROFILES_KEY = 'mock-mentor-profiles'
const SIMULATED_DELAY = 500

class MockMentorService implements MentorService {
  private getProfiles(): Record<string, MentorProfile> {
    if (typeof window === 'undefined') return {}
    const profiles = localStorage.getItem(MOCK_MENTOR_PROFILES_KEY)
    return profiles ? JSON.parse(profiles) : {}
  }

  private saveProfiles(profiles: Record<string, MentorProfile>) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_MENTOR_PROFILES_KEY, JSON.stringify(profiles))
  }

  private delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
  }

  private createVerificationDoc(file: File): VerificationDoc {
    return {
      id: crypto.randomUUID(),
      name: file.name,
      url: `https://placeholder.com/docs/${crypto.randomUUID()}/${encodeURIComponent(file.name)}`,
      uploadedAt: new Date().toISOString(),
    }
  }

  async createProfile(data: CreateMentorProfileData): Promise<MentorProfile> {
    await this.delay()

    const profiles = this.getProfiles()

    if (profiles[data.userId]) {
      throw new MentorError('이미 멘토 프로필이 존재합니다', 'ALREADY_EXISTS')
    }

    const verificationDocs = data.files.map(file => this.createVerificationDoc(file))
    const now = new Date().toISOString()

    const profile: MentorProfile = {
      userId: data.userId,
      status: 'PENDING',
      university: data.university,
      major: data.major,
      styleTags: data.styleTags,
      intro: data.intro,
      verificationDocs,
      createdAt: now,
      updatedAt: now,
    }

    profiles[data.userId] = profile
    this.saveProfiles(profiles)

    // console.log('[MockMentorService] Profile created:', profile.userId)
    return profile
  }

  async updateProfile(userId: string, data: UpdateMentorProfileData): Promise<MentorProfile> {
    await this.delay()

    const profiles = this.getProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new MentorError('멘토 프로필을 찾을 수 없습니다', 'NOT_FOUND')
    }

    const updatedProfile: MentorProfile = {
      ...profile,
      ...(data.university && { university: data.university }),
      ...(data.major && { major: data.major }),
      ...(data.styleTags && { styleTags: data.styleTags }),
      ...(data.intro && { intro: data.intro }),
      updatedAt: new Date().toISOString(),
    }

    profiles[userId] = updatedProfile
    this.saveProfiles(profiles)

    // console.log('[MockMentorService] Profile updated:', userId)
    return updatedProfile
  }

  async uploadVerificationDocs(userId: string, files: File[]): Promise<MentorProfile> {
    await this.delay()

    const profiles = this.getProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new MentorError('멘토 프로필을 찾을 수 없습니다', 'NOT_FOUND')
    }

    const newDocs = files.map(file => this.createVerificationDoc(file))

    const updatedProfile: MentorProfile = {
      ...profile,
      verificationDocs: [...profile.verificationDocs, ...newDocs],
      status: profile.status === 'REJECTED' ? 'PENDING' : profile.status,
      rejectionReason: profile.status === 'REJECTED' ? undefined : profile.rejectionReason,
      updatedAt: new Date().toISOString(),
    }

    profiles[userId] = updatedProfile
    this.saveProfiles(profiles)

    // console.log('[MockMentorService] Docs uploaded:', userId, newDocs.length)
    return updatedProfile
  }

  async getMyProfile(userId: string): Promise<MentorProfile | null> {
    await this.delay()

    const profiles = this.getProfiles()
    return profiles[userId] || null
  }

  async searchMentors(filters: MentorSearchFilters): Promise<MentorProfile[]> {
    await this.delay()

    const profiles = this.getProfiles()
    let results = Object.values(profiles)

    // Default to APPROVED for public directory
    const statusFilter = filters.status || 'APPROVED'
    results = results.filter(p => p.status === statusFilter)

    if (filters.university) {
      const universityLower = filters.university.toLowerCase()
      results = results.filter(p => p.university.toLowerCase().includes(universityLower))
    }

    if (filters.styleTag) {
      const styleTagLower = filters.styleTag.toLowerCase()
      results = results.filter(p =>
        p.styleTags.some(tag => tag.toLowerCase().includes(styleTagLower))
      )
    }

    // console.log('[MockMentorService] Search results:', results.length)
    return results
  }

  async getMentorById(userId: string): Promise<MentorProfile | null> {
    await this.delay()

    const profiles = this.getProfiles()
    const profile = profiles[userId]

    // Only return approved mentors for public access
    if (profile && profile.status === 'APPROVED') {
      return profile
    }

    return null
  }

  async getAllApplications(): Promise<MentorProfile[]> {
    await this.delay()

    const profiles = this.getProfiles()
    const pendingApplications = Object.values(profiles).filter(p => p.status === 'PENDING')

    // console.log('[MockMentorService] Pending applications:', pendingApplications.length)
    return pendingApplications
  }

  async approveMentor(userId: string): Promise<MentorProfile> {
    await this.delay()

    const profiles = this.getProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new MentorError('멘토 프로필을 찾을 수 없습니다', 'NOT_FOUND')
    }

    if (profile.status !== 'PENDING') {
      throw new MentorError('대기 중인 신청만 승인할 수 있습니다', 'INVALID_STATUS')
    }

    const updatedProfile: MentorProfile = {
      ...profile,
      status: 'APPROVED',
      rejectionReason: undefined,
      updatedAt: new Date().toISOString(),
    }

    profiles[userId] = updatedProfile
    this.saveProfiles(profiles)

    // console.log('[MockMentorService] Mentor approved:', userId)
    return updatedProfile
  }

  async rejectMentor(userId: string, reason: string): Promise<MentorProfile> {
    await this.delay()

    if (!reason.trim()) {
      throw new MentorError('거절 사유를 입력해주세요', 'VALIDATION_ERROR')
    }

    const profiles = this.getProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new MentorError('멘토 프로필을 찾을 수 없습니다', 'NOT_FOUND')
    }

    if (profile.status !== 'PENDING') {
      throw new MentorError('대기 중인 신청만 거절할 수 있습니다', 'INVALID_STATUS')
    }

    const updatedProfile: MentorProfile = {
      ...profile,
      status: 'REJECTED',
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    }

    profiles[userId] = updatedProfile
    this.saveProfiles(profiles)

    // console.log('[MockMentorService] Mentor rejected:', userId, reason)
    return updatedProfile
  }
}

export const mentorService = new MockMentorService()

// Expose for testing via browser console (as per quickstart.md)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).mockMentorService = mentorService
}
