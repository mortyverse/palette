// src/types/auth.ts
export type UserRole = 'student' | 'mentor'

export interface User {
  id: string
  email: string
  passwordHash: string
  name?: string
  role: UserRole
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: UserRole
  name?: string
}

export interface AuthResponse {
  user: UserProfile
  message?: string
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: 'INVALID_CREDENTIALS' | 'EMAIL_EXISTS' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
