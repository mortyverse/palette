// src/lib/mentor/mentor-service.interface.ts
import type {
  MentorProfile,
  CreateMentorProfileData,
  UpdateMentorProfileData,
  MentorSearchFilters,
} from '@/types/mentor'

export interface MentorService {
  // Mentor Actions
  createProfile(data: CreateMentorProfileData): Promise<MentorProfile>
  updateProfile(userId: string, data: UpdateMentorProfileData): Promise<MentorProfile>
  uploadVerificationDocs(userId: string, files: File[]): Promise<MentorProfile>
  getMyProfile(userId: string): Promise<MentorProfile | null>

  // Public/Student Actions
  searchMentors(filters: MentorSearchFilters): Promise<MentorProfile[]>
  getMentorById(userId: string): Promise<MentorProfile | null>

  // Admin Actions
  getAllApplications(): Promise<MentorProfile[]>
  approveMentor(userId: string): Promise<MentorProfile>
  rejectMentor(userId: string, reason: string): Promise<MentorProfile>
}
