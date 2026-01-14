// app/gallery/page.tsx
import Link from 'next/link'
import Image from 'next/image'

// Mock gallery items
const galleryItems = [
  {
    id: '1',
    title: 'Charcoal Study No. 5',
    student: 'Sofia L.',
    score: 9.5,
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=500&q=80',
  },
  {
    id: '2',
    title: 'Digital Metropolis',
    student: 'Marcus T.',
    score: 9.2,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279ccf?w=500&q=80',
  },
  {
    id: '3',
    title: 'Morning Serenity',
    student: 'Chen W.',
    score: 9.8,
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500&q=80',
  },
  {
    id: '4',
    title: 'Still Life in Oil',
    student: 'Emma R.',
    score: 9.0,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
  },
]

export default function GalleryPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
        >
          Gallery
        </h1>
        <p className="text-[var(--palette-muted)] text-lg">
          Click on any artwork to view detailed feedback and critiques.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-10">
        {galleryItems.map(item => (
          <Link
            key={item.id}
            href={`/gallery/${item.id}`}
            className="group block bg-[var(--palette-card)] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(62,54,46,0.04)] border border-[var(--palette-text)]/[0.03] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(62,54,46,0.08)]"
          >
            <div className="relative h-60 bg-[var(--palette-border)] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--palette-text)] px-2.5 py-1.5 text-xs font-bold rounded shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                Student: {item.student}
              </div>
              <div className="absolute top-3 right-3 bg-[var(--palette-gold)] text-white px-2.5 py-1.5 text-sm font-bold rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                {item.score}
              </div>
            </div>
            <div className="p-7">
              <h3
                className="text-xl text-[var(--palette-text)] text-center"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
              >
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
