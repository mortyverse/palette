// src/types/mentor.ts
export type MentorStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface VerificationDoc {
  id: string
  name: string
  url: string
  uploadedAt: string
}

export interface MentorProfile {
  userId: string
  status: MentorStatus
  university: string
  major: string
  styleTags: string[]
  intro: string
  verificationDocs: VerificationDoc[]
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMentorProfileData {
  userId: string
  university: string
  major: string
  styleTags: string[]
  intro: string
  files: File[]
}

export interface UpdateMentorProfileData {
  university?: string
  major?: string
  styleTags?: string[]
  intro?: string
}

export interface MentorSearchFilters {
  university?: string
  styleTag?: string
  status?: MentorStatus
}

export class MentorError extends Error {
  constructor(
    message: string,
    public code?: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'ALREADY_EXISTS' | 'INVALID_STATUS'
  ) {
    super(message)
    this.name = 'MentorError'
  }
}
