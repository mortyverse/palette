# Contract: Mentor Service

## Interface Definition

```typescript
// src/lib/mentor/mentor-service.interface.ts

export type MentorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VerificationDoc {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface MentorProfile {
  userId: string;
  status: MentorStatus;
  university: string;
  major: string;
  styleTags: string[];
  intro: string;
  verificationDocs: VerificationDoc[];
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentorProfileData {
  userId: string;
  university: string;
  major: string;
  styleTags: string[];
  intro: string;
  files: File[]; // For upload
}

export interface UpdateMentorProfileData {
  university?: string;
  major?: string;
  styleTags?: string[];
  intro?: string;
}

export interface MentorSearchFilters {
  university?: string;
  styleTag?: string;
  status?: MentorStatus; // Defaults to APPROVED for public directory
}

export interface MentorService {
  // Mentor Actions
  createProfile(data: CreateMentorProfileData): Promise<MentorProfile>;
  updateProfile(userId: string, data: UpdateMentorProfileData): Promise<MentorProfile>;
  uploadVerificationDocs(userId: string, files: File[]): Promise<MentorProfile>;
  getMyProfile(userId: string): Promise<MentorProfile | null>;

  // Public/Student Actions
  searchMentors(filters: MentorSearchFilters): Promise<MentorProfile[]>;
  getMentorById(userId: string): Promise<MentorProfile | null>;

  // Admin Actions
  getAllApplications(): Promise<MentorProfile[]>; // Returns PENDING applications
  approveMentor(userId: string): Promise<MentorProfile>;
  rejectMentor(userId: string, reason: string): Promise<MentorProfile>;
}
```

## API Endpoints (Conceptual - for Future Backend)

- `POST /api/mentors/profile` - Create profile
- `PUT /api/mentors/profile` - Update profile
- `POST /api/mentors/profile/docs` - Upload docs
- `GET /api/mentors` - Search mentors (Public)
- `GET /api/admin/mentors/applications` - List applications (Admin)
- `POST /api/admin/mentors/{id}/approve` - Approve
- `POST /api/admin/mentors/{id}/reject` - Reject
