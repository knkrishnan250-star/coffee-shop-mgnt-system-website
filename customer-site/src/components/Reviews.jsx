import { useState } from 'react'

const reviews = [
  {
    id: 1,
    name: 'Priya S.',
    role: 'Loyal Regular',
    rating: 5,
    text: "Bean & Bloom has ruined every other café for me. The Caramel Bloom Latte is genuinely the best thing I drink all week. The ambiance is just *chef's kiss*.",
    avatar: '🙋‍♀️',
    date: 'October 2024',
  },
  {
    id: 2,
    name: 'Marcus T.',
    role: 'Coffee Enthusiast',
    rating: 5,
    text: 'I\'ve been to third-wave cafés all over the world and Bean & Bloom holds its own. The espresso has this remarkable depth — fruity, chocolatey, lingering. Worth every penny.',
    avatar: '👨‍💼',
    date: 'September 2024',
  },
  {
    id: 3,
    name: 'Aisha R.',
    role: 'Work-from-Café Regular',
    rating: 5,
    text: 'Perfect for working. Fast Wi-Fi, great playlists, and the staff remember your order. I practically live here on Tuesdays. The cinnamon rolls are sinful.',
    avatar: '👩‍💻',
    date: 'October 2024',
  },
  {
    id: 4,
    name: 'James L.',
    role: 'Weekend Brunch Visitor',
    rating: 5,
    text: 'Brought my parents here for the first time and they immediately asked if we could come back next week. The chai latte won them over instantly.',
    avatar: '👨‍🦱',
    date: 'August 2024',
  },
  {
    id: 5,
    name: 'Noor K.',
    role: 'First Timer',
    rating: 5,
    text: 'Found this place by accident while exploring the neighbourhood. The iced brown sugar oat was phenomenal and the vibe is so warm and welcoming.',
    avatar: '🧕',
    date: 'July 2024',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? '#f59e0b' : '#d4ae78' }}>★</span>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [active, setActive] = useState(0)
  const total = reviews.length

  const prev = () => setActive((a) => (a - 1 + total) % total)
  const next = () => setActive((a) => (a + 1) % total)

  const visible = [
    reviews[(active) % total],
    reviews[(active + 1) % total],
    reviews[(active + 2) % total],
  ]

  return (
    <section id="reviews" className="py-24 px-6" style={{ backgroundColor: '#f5e9d3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a86f35' }}>
            What Guests Say
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Stories from Our Community
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <span className="font-semibold" style={{ color: '#2c1a0a' }}>4.9</span>
            <span style={{ color: '#6b4220' }}>· 2,400+ reviews on Google</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {visible.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-3xl transition-all duration-300"
              style={{ backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(44,26,10,0.08)' }}
            >
              <Stars count={review.rating} />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#4a2e15' }}>
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 mt-6">
                <span className="text-2xl">{review.avatar}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2c1a0a' }}>{review.name}</p>
                  <p className="text-xs" style={{ color: '#a86f35' }}>{review.role} · {review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile single card */}
        <div className="md:hidden">
          <div
            className="p-6 rounded-3xl"
            style={{ backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(44,26,10,0.08)' }}
          >
            <Stars count={reviews[active].rating} />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#4a2e15' }}>
              "{reviews[active].text}"
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-2xl">{reviews[active].avatar}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#2c1a0a' }}>{reviews[active].name}</p>
                <p className="text-xs" style={{ color: '#a86f35' }}>{reviews[active].role} · {reviews[active].date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0' }}
          >
            ‹
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: i === active ? '#a86f35' : '#d4ae78' }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0' }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
