import { z } from 'zod';

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const uploadArtworkSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(100, '제목은 100자 이내로 입력해주세요.'),
  description: z
    .string()
    .min(1, '설명을 입력해주세요.')
    .max(500, '설명은 500자 이내로 입력해주세요.'),
});

export type UploadArtworkFormData = z.infer<typeof uploadArtworkSchema>;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: '이미지를 선택해주세요.' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, WebP 형식의 이미지만 업로드할 수 있습니다.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '이미지 크기는 500KB 이하여야 합니다.' };
  }

  return { valid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
