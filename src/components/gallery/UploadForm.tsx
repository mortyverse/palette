'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import {
  uploadArtworkSchema,
  UploadArtworkFormData,
  validateImageFile,
  fileToBase64,
} from '@/lib/validation/gallery-schemas';
import { galleryService } from '@/lib/gallery';
import { useGalleryStore } from '@/store/gallery-store';

export function UploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const addArtwork = useGalleryStore((state) => state.addArtwork);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadArtworkFormData>({
    resolver: zodResolver(uploadArtworkSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || '이미지 검증에 실패했습니다.');
      return;
    }

    setImageError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: UploadArtworkFormData) => {
    if (!imageFile) {
      setImageError('이미지를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const artwork = await galleryService.uploadArtwork({
        title: data.title,
        description: data.description,
        imageUrl: base64Image,
      });

      addArtwork(artwork);
      router.push('/gallery');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {submitError}
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block font-bold text-[var(--palette-text)]">
          작품 이미지 *
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors ${
            imageError
              ? 'border-red-400 bg-red-50'
              : 'border-[var(--palette-border)] hover:border-[var(--palette-gold)]'
          }`}
        >
          {imagePreview ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
              <Upload className="h-10 w-10 text-[var(--palette-muted)] mb-3" />
              <span className="text-[var(--palette-muted)] text-sm">
                이미지를 클릭하거나 드래그하여 업로드
              </span>
              <span className="text-[var(--palette-muted)] text-xs mt-1">
                JPG, PNG, WebP (최대 500KB)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {imageError && (
          <p className="text-sm text-red-500">{imageError}</p>
        )}
      </div>

      {/* Title */}
      <FormField
        label="제목 *"
        placeholder="작품 제목을 입력하세요"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block font-bold text-[var(--palette-text)]"
        >
          설명 *
        </label>
        <textarea
          id="description"
          placeholder="작품에 대한 설명을 입력하세요"
          rows={4}
          className={`w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] resize-none ${
            errors.description
              ? 'border-red-400'
              : 'border-[var(--palette-border)]'
          }`}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              업로드 중...
            </>
          ) : (
            '작품 업로드'
          )}
        </Button>
      </div>
    </form>
  );
}
