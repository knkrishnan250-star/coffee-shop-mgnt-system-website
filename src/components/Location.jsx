const hours = [
  { day: 'Monday – Friday', time: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '9:00 AM – 8:00 PM' },
]

function getTodayStatus() {
  const day = new Date().getDay()
  if (day === 0) return { label: 'Closes at 8 PM today', open: true }
  if (day === 6) return { label: 'Closes at 10 PM today', open: true }
  return { label: 'Closes at 9 PM today', open: true }
}

export default function Location() {
  const status = getTodayStatus()

  return (
    <section id="location" className="py-24 px-6" style={{ backgroundColor: '#fdf8f0' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a86f35' }}>
            Come Visit Us
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Find Us &amp; Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Map — real street-level photo with overlay pin */}
          <div
            className="rounded-3xl overflow-hidden h-80 lg:h-auto min-h-64 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80&auto=format&fit=crop"
              alt="City street map view"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Warm tint overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(74,46,21,0.25)' }}
            />

            {/* Pin */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl text-3xl mb-3"
                  style={{ backgroundColor: '#2c1a0a' }}
                >
                  📍
                </div>
                <div
                  className="px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
                  style={{ backgroundColor: '#fff', color: '#2c1a0a' }}
                >
                  Bean &amp; Bloom — Downtown
                </div>
              </div>
            </div>

            {/* Open now badge */}
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Open Now · {status.label}
            </div>
          </div>

          {/* Info cards */}
          <div className="flex flex-col gap-5">
            {/* Address */}
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(44,26,10,0.08)' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2c1a0a' }}>Address</h3>
                  <p style={{ color: '#6b4220' }}>42 Blossom Lane, Downtown Quarter</p>
                  <p style={{ color: '#6b4220' }}>New City, NC 10001</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-medium"
                    style={{ color: '#a86f35' }}
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(44,26,10,0.08)' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">🕐</span>
                <div className="w-full">
                  <h3 className="font-semibold mb-3" style={{ color: '#2c1a0a' }}>Opening Hours</h3>
                  <div className="flex flex-col gap-2">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span style={{ color: '#4a2e15' }}>{h.day}</span>
                        <span className="font-medium" style={{ color: '#2c1a0a' }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(44,26,10,0.08)' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2c1a0a' }}>Contact Us</h3>
                  <p style={{ color: '#6b4220' }}>+1 (555) 234-5678</p>
                  <p style={{ color: '#6b4220' }}>hello@beanandbloom.com</p>
                </div>
              </div>
            </div>

            {/* Reserve CTA */}
            <a
              href="#reserve"
              className="w-full py-4 rounded-2xl text-center font-semibold text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0' }}
            >
              🪑 Reserve a Table
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
