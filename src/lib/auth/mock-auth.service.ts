// src/lib/auth/mock-auth.service.ts
import { hashPassword, verifyPassword } from './password'
import type {
  LoginCredentials,
  RegisterData,
  UserProfile,
  User,
} from '@/types/auth'

const MOCK_USERS_KEY = 'mock-users'

class MockAuthService {
  private getUsers(): Record<string, User> {
    if (typeof window === 'undefined') return {}
    const users = localStorage.getItem(MOCK_USERS_KEY)
    return users ? JSON.parse(users) : {}
  }

  private saveUsers(users: Record<string, User>) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
  }

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const users = this.getUsers()
    const user = Object.values(users).find(u => u.email === credentials.email)

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    const isValid = await verifyPassword(credentials.password, user.passwordHash)
    if (!isValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userProfile } = user
    return userProfile
  }

  async register(data: RegisterData): Promise<UserProfile> {
    const users = this.getUsers()

    if (Object.values(users).some(u => u.email === data.email)) {
      throw new Error('이미 사용 중인 이메일입니다')
    }

    const passwordHash = await hashPassword(data.password)
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      createdAt: new Date().toISOString(),
    }

    users[user.id] = user
    this.saveUsers(users)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userProfile } = user
    return userProfile
  }

  async logout(): Promise<void> {
    // Zustand store handles state clearing
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    // Zustand persist handles this
    return null
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const users = this.getUsers()
    return !Object.values(users).some(u => u.email === email)
  }
}

export const authService = new MockAuthService()
