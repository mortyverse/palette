// app/gallery/page.tsx
import Link from 'next/link'

export default function GalleryPage() {
  // Mock gallery items
  const galleryItems = [
    { id: '1', title: '작품 1', thumbnail: '🎨' },
    { id: '2', title: '작품 2', thumbnail: '🖼️' },
    { id: '3', title: '작품 3', thumbnail: '🎭' },
    { id: '4', title: '작품 4', thumbnail: '🌟' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">갤러리</h1>
      <p className="text-gray-600 mb-8">
        작품 썸네일을 클릭하면 상세 정보를 볼 수 있습니다. (로그인 필요)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryItems.map(item => (
          <Link
            key={item.id}
            href={`/gallery/${item.id}`}
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-6xl mb-4 text-center">{item.thumbnail}</div>
            <h3 className="text-lg font-semibold text-center">{item.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
