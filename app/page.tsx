import Link from 'next/link'
import Image from 'next/image'

// Mock artwork data
const artworks = [
  {
    id: 1,
    title: 'Charcoal Study No. 5',
    description: 'A detailed study of facial structure using compressed charcoal. Focus on chiaroscuro.',
    student: 'Sofia L.',
    score: 9.5,
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=500&q=80',
  },
  {
    id: 2,
    title: 'Digital Metropolis',
    description: 'Concept art for an urban environment using atmospheric perspective and sharp lighting.',
    student: 'Marcus T.',
    score: 9.2,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279ccf?w=500&q=80',
  },
  {
    id: 3,
    title: 'Morning Serenity',
    description: 'Wet-on-wet watercolor technique capturing the mist over a quiet lake.',
    student: 'Chen W.',
    score: 9.8,
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500&q=80',
  },
  {
    id: 4,
    title: 'Still Life in Oil',
    description: 'Classic composition focusing on the texture of fruits and metallic reflections.',
    student: 'Emma R.',
    score: 9.0,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[520px] overflow-hidden flex items-end justify-center pb-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&q=80)',
            filter: 'brightness(0.95) sepia(0.15) contrast(0.9)',
          }}
        />

        {/* Search Container */}
        <div className="relative z-10 bg-[var(--palette-card)]/85 backdrop-blur-md p-4 px-6 rounded-xl shadow-[0_8px_32px_rgba(62,54,46,0.1)] border border-white/40 max-w-[800px] w-[90%] flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] flex flex-col">
            <label className="text-xs font-bold text-[var(--palette-gold)] mb-1 ml-1 uppercase tracking-wider">
              What are you looking for?
            </label>
            <input
              type="text"
              placeholder="Keyword, Mentor, or Subject..."
              className="px-4 py-3 border border-[var(--palette-border)] bg-white rounded-md text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)] transition-colors"
            />
          </div>

          <div className="flex-[0.6] min-w-[150px] flex flex-col">
            <label className="text-xs font-bold text-[var(--palette-gold)] mb-1 ml-1 uppercase tracking-wider">
              Category
            </label>
            <select className="px-4 py-3 border border-[var(--palette-border)] bg-white rounded-md text-[var(--palette-text)] focus:outline-none focus:border-[var(--palette-gold)] transition-colors">
              <option>All Majors</option>
              <option>Fine Art</option>
              <option>Design</option>
              <option>Oriental Painting</option>
              <option>Sculpture</option>
            </select>
          </div>

          <button className="mt-5 h-[46px] px-8 bg-[var(--palette-gold)] text-white rounded-md font-bold uppercase tracking-wider text-base hover:bg-[var(--palette-gold-dark)] transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Content Section */}
      <main className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-[2.8rem] font-normal text-[var(--palette-text)] mb-2"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
          >
            Curated Masterpieces
          </h2>
          <p className="text-[var(--palette-muted)] text-lg">
            Explore high-quality feedback and portfolios from top mentors and students.
          </p>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-10">
          {artworks.map((artwork) => (
            <article
              key={artwork.id}
              className="group bg-[var(--palette-card)] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(62,54,46,0.04)] border border-[var(--palette-text)]/[0.03] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(62,54,46,0.08)]"
            >
              <div className="relative h-60 bg-[var(--palette-border)] overflow-hidden">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--palette-text)] px-2.5 py-1.5 text-xs font-bold rounded shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  Student: {artwork.student}
                </div>
                <div className="absolute top-3 right-3 bg-[var(--palette-gold)] text-white px-2.5 py-1.5 text-sm font-bold rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  {artwork.score}
                </div>
              </div>
              <div className="p-7 text-left">
                <h3
                  className="text-xl mb-2 text-[var(--palette-text)]"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
                >
                  {artwork.title}
                </h3>
                <p className="text-[0.95rem] text-[var(--palette-muted)] mb-6 leading-relaxed line-clamp-2">
                  {artwork.description}
                </p>
                <Link
                  href={`/gallery/${artwork.id}`}
                  className="block w-full py-3 bg-[var(--palette-card)] text-[var(--palette-gold)] text-center rounded-md text-sm font-bold uppercase tracking-widest border border-[var(--palette-gold)] transition-all hover:bg-[var(--palette-gold)] hover:text-white"
                >
                  View Critique
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
