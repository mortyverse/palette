// src/lib/constants/mentor.ts

export const UNIVERSITIES = [
  '홍익대학교',
  '서울대학교',
  '이화여자대학교',
  '국민대학교',
  '한양대학교',
  '중앙대학교',
  '건국대학교',
  '동덕여자대학교',
  '상명대학교',
  '계원예술대학교',
] as const

export const STYLE_TAGS = [
  '수채화',
  '유화',
  '디지털아트',
  '일러스트',
  '조소',
  '판화',
  '한국화',
  '디자인',
  '사진',
  '설치미술',
] as const

export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
]
export const ALLOWED_FILE_EXTENSIONS = '.jpg, .jpeg, .png, .gif, .pdf'

export const MENTOR_STATUS_LABELS = {
  PENDING: '심사 대기중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
} as const
