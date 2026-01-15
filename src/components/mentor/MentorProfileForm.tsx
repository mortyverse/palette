// src/components/mentor/MentorProfileForm.tsx
'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useMentorStore } from '@/store/mentor-store'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import {
  UNIVERSITIES,
  STYLE_TAGS,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
} from '@/lib/constants/mentor'
import type { MentorProfile } from '@/types/mentor'

interface MentorProfileFormProps {
  existingProfile?: MentorProfile | null
  onSuccess?: () => void
}

interface FormErrors {
  university?: string
  major?: string
  styleTags?: string
  intro?: string
  files?: string
}

export function MentorProfileForm({ existingProfile, onSuccess }: MentorProfileFormProps) {
  const user = useAuthStore(state => state.user)
  const { createProfile, updateProfile, uploadDocs, isLoading, error } = useMentorStore()

  const [university, setUniversity] = useState(existingProfile?.university || '')
  const [major, setMajor] = useState(existingProfile?.major || '')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(existingProfile?.styleTags || [])
  const [intro, setIntro] = useState(existingProfile?.intro || '')
  const [files, setFiles] = useState<File[]>([])
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const isEditing = !!existingProfile

  const validateFiles = (fileList: File[]): string | undefined => {
    for (const file of fileList) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return `파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다: ${file.name}`
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `허용되지 않는 파일 형식입니다: ${file.name}`
      }
    }
    return undefined
  }

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (!university.trim()) {
      errors.university = '대학교를 선택해주세요'
    }

    if (!major.trim()) {
      errors.major = '전공을 입력해주세요'
    }

    if (selectedStyles.length === 0) {
      errors.styleTags = '최소 1개의 스타일을 선택해주세요'
    }

    if (!intro.trim()) {
      errors.intro = '자기소개를 입력해주세요'
    } else if (intro.length < 10) {
      errors.intro = '자기소개는 최소 10자 이상이어야 합니다'
    }

    if (!isEditing && files.length === 0) {
      errors.files = '인증 서류를 업로드해주세요'
    }

    const fileError = validateFiles(files)
    if (fileError) {
      errors.files = fileError
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) {
      const newFiles = Array.from(fileList)
      const error = validateFiles(newFiles)
      if (error) {
        setFormErrors(prev => ({ ...prev, files: error }))
      } else {
        setFormErrors(prev => ({ ...prev, files: undefined }))
        setFiles(prev => [...prev, ...newFiles])
      }
    }
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !user) return

    try {
      if (isEditing) {
        await updateProfile(user.id, {
          university,
          major,
          styleTags: selectedStyles,
          intro,
        })
        if (files.length > 0) {
          await uploadDocs(user.id, files)
        }
      } else {
        await createProfile({
          userId: user.id,
          university,
          major,
          styleTags: selectedStyles,
          intro,
          files,
        })
      }
      onSuccess?.()
    } catch {
      // Error is handled by store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block font-bold text-[var(--palette-text)]">대학교</label>
        <select
          value={university}
          onChange={e => setUniversity(e.target.value)}
          className={`w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] ${
            formErrors.university ? 'border-[var(--danger)]' : 'border-[var(--palette-border)]'
          }`}
        >
          <option value="">선택해주세요</option>
          {UNIVERSITIES.map(uni => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
        {formErrors.university && (
          <p className="text-sm text-[var(--danger)]">{formErrors.university}</p>
        )}
      </div>

      <FormField
        label="전공"
        value={major}
        onChange={e => setMajor(e.target.value)}
        placeholder="예: 서양화과"
        error={formErrors.major}
      />

      <div className="space-y-2">
        <label className="block font-bold text-[var(--palette-text)]">작업 스타일</label>
        <div className="flex flex-wrap gap-2">
          {STYLE_TAGS.map(style => (
            <button
              key={style}
              type="button"
              onClick={() => handleStyleToggle(style)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedStyles.includes(style)
                  ? 'bg-[var(--palette-gold)] text-white'
                  : 'bg-[var(--palette-card)] border border-[var(--palette-border)] text-[var(--palette-text)] hover:border-[var(--palette-gold)]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        {formErrors.styleTags && (
          <p className="text-sm text-[var(--danger)]">{formErrors.styleTags}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-bold text-[var(--palette-text)]">자기소개</label>
        <textarea
          value={intro}
          onChange={e => setIntro(e.target.value)}
          placeholder="멘토로서의 경험과 전문 분야를 소개해주세요..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] resize-none ${
            formErrors.intro ? 'border-[var(--danger)]' : 'border-[var(--palette-border)]'
          }`}
        />
        {formErrors.intro && (
          <p className="text-sm text-[var(--danger)]">{formErrors.intro}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-bold text-[var(--palette-text)]">
          인증 서류 {isEditing && '(추가 업로드)'}
        </label>
        <p className="text-sm text-[var(--palette-muted)]">
          재학증명서, 학생증 사진 등을 업로드해주세요 ({ALLOWED_FILE_EXTENSIONS}, 최대 {MAX_FILE_SIZE_MB}MB)
        </p>
        <input
          type="file"
          accept={ALLOWED_FILE_EXTENSIONS}
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-[var(--palette-text)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-bold file:bg-[var(--palette-gold)] file:text-white hover:file:bg-[var(--palette-gold-dark)]"
        />
        {formErrors.files && (
          <p className="text-sm text-[var(--danger)]">{formErrors.files}</p>
        )}

        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-[var(--palette-card)] rounded-md"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-[var(--danger)] hover:underline text-sm"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        {isEditing && existingProfile && existingProfile.verificationDocs.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-[var(--palette-text)] mb-2">
              기존 업로드된 서류
            </p>
            <ul className="space-y-1">
              {existingProfile.verificationDocs.map(doc => (
                <li
                  key={doc.id}
                  className="flex items-center p-2 bg-[var(--palette-card)] rounded-md text-sm"
                >
                  <span className="truncate">{doc.name}</span>
                  <span className="ml-2 text-[var(--palette-muted)]">
                    ({new Date(doc.uploadedAt).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? '처리 중...' : isEditing ? '프로필 수정' : '멘토 신청'}
      </Button>
    </form>
  )
}
