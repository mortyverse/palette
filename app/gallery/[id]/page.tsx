// app/gallery/[id]/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = await params

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">갤러리 상세 페이지</h1>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">작품 ID: {id}</p>
            <div className="text-8xl mb-6 text-center py-12 bg-gray-50 rounded">
              🎨
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">작품 설명</h2>
            <p className="text-gray-700 leading-relaxed">
              이 페이지는 로그인한 사용자만 볼 수 있습니다.
              인증된 사용자만이 작품의 상세 정보, 작가 정보, 그리고 관련 코멘트를 확인할 수 있습니다.
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">✓ 인증 완료</h3>
              <p className="text-blue-800 text-sm">
                현재 로그인된 상태입니다. 모든 컨텐츠에 접근할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
