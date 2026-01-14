// app/gallery/[id]/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Image from 'next/image'

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>
}

// Mock data for artwork details
const artworkData: Record<string, {
  title: string
  student: string
  description: string
  image: string
  mentorComment: {
    name: string
    text: string
    date: string
  }
  comments: Array<{ name: string; text: string; date: string }>
}> = {
  '1': {
    title: 'Charcoal Study No. 5',
    student: 'Sofia L.',
    description: 'A detailed study of facial structure using compressed charcoal on textured paper. I focused heavily on the chiaroscuro technique to bring out the depth. Looking for feedback on the proportions of the nose and mouth.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1000&q=80',
    mentorComment: {
      name: 'Mentor Sarah Kim',
      text: 'Excellent work on the shading, Sofia! The contrast is very striking. Regarding your question: The nose bridge seems slightly too wide for the angle. Also, try to soften the edge of the jawline just a bit to make it turn in space better.',
      date: '2 hours ago',
    },
    comments: [
      { name: 'ArtStudent99', text: 'The texture of the paper really adds to this! Love it.', date: '5 hours ago' },
    ],
  },
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { id } = await params
  const artwork = artworkData[id] || artworkData['1']

  return (
    <ProtectedRoute>
      <div className="max-w-[1100px] mx-auto my-12 px-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
        {/* Left: Artwork */}
        <main className="flex flex-col gap-6">
          <div className="relative w-full bg-[var(--palette-border)] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={1000}
              height={800}
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--palette-border)] text-[var(--palette-muted)] rounded transition-all hover:border-[var(--palette-gold)] hover:text-[var(--palette-gold)]">
              Like (42)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--palette-border)] text-[var(--palette-muted)] rounded transition-all hover:border-[var(--palette-gold)] hover:text-[var(--palette-gold)]">
              Scrap
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--palette-border)] text-[var(--palette-muted)] rounded transition-all hover:border-[var(--palette-gold)] hover:text-[var(--palette-gold)]">
              Share
            </button>
          </div>
        </main>

        {/* Right: Info */}
        <aside className="flex flex-col gap-8">
          <div className="border-b border-[var(--palette-border)] pb-6">
            <div className="flex items-center gap-2 font-bold mb-2">
              <div className="w-8 h-8 bg-[var(--palette-border)] rounded-full" />
              <span>{artwork.student}</span>
            </div>
            <h1
              className="text-[2rem] mb-2 text-[var(--palette-text)]"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
            >
              {artwork.title}
            </h1>
            <p className="text-[var(--palette-muted)] text-[0.95rem]">
              {artwork.description}
            </p>
          </div>

          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Critiques & Comments
          </h3>

          <div className="flex flex-col gap-6">
            {/* Mentor Feedback */}
            <article className="relative bg-white border border-[var(--palette-gold)] rounded-lg p-6 shadow-[0_4px_15px_rgba(166,146,109,0.1)]">
              <div className="absolute -top-2.5 left-5 bg-[var(--palette-text)] text-[var(--palette-bg)] px-2.5 py-0.5 text-xs font-bold rounded uppercase">
                Best Critique
              </div>
              <div className="flex justify-between mb-3 text-[0.9rem]">
                <span className="font-bold">{artwork.mentorComment.name}</span>
                <span className="text-[#999] text-[0.8rem]">{artwork.mentorComment.date}</span>
              </div>
              <div className="text-[0.95rem] leading-relaxed">
                <p>{artwork.mentorComment.text}</p>
              </div>
            </article>

            {/* Regular Comments */}
            {artwork.comments.map((comment, index) => (
              <article key={index} className="py-4 border-b border-gray-100">
                <div className="flex justify-between mb-2 text-[0.9rem]">
                  <span className="font-bold">{comment.name}</span>
                  <span className="text-[#999] text-[0.8rem]">{comment.date}</span>
                </div>
                <div className="text-[0.95rem] leading-relaxed">
                  {comment.text}
                </div>
              </article>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <input
              type="text"
              placeholder="Leave a comment..."
              className="flex-1 px-4 py-3 border border-[var(--palette-border)] rounded text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)]"
            />
            <button className="px-6 py-3 bg-[var(--palette-text)] text-white rounded font-bold">
              Post
            </button>
          </div>
        </aside>
      </div>
    </ProtectedRoute>
  )
}
