export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed hero photo */}
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80&auto=format&fit=crop"
        alt="Cozy coffee shop interior with warm lighting"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />
      {/* Dark overlay to keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(44,26,10,0.82) 0%, rgba(74,46,21,0.70) 40%, rgba(107,66,32,0.60) 70%, rgba(139,90,43,0.50) 100%)',
          zIndex: 1,
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: '#f59e0b', filter: 'blur(80px)', zIndex: 2 }}
      />
      <div
        className="absolute bottom-20 left-10 w-72 h-72 rounded-full opacity-10"
        style={{ backgroundColor: '#d4ae78', filter: 'blur(60px)', zIndex: 2 }}
      />

      {/* Coffee bean pattern */}
      <div className="absolute inset-0 opacity-5" style={{ zIndex: 2 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              transform: `rotate(${i * 37}deg)`,
            }}
          >
            ☕
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
          style={{ backgroundColor: '#a86f35', color: '#fdf8f0' }}>
          <span>✦</span>
          <span>Freshly Roasted Every Morning</span>
          <span>✦</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif", color: '#fdf8f0' }}
        >
          Where Every Cup
          <br />
          <span style={{ color: '#f59e0b' }}>Tells a Story</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#d4ae78' }}>
          Handcrafted coffees, cozy corners, and the aroma of freshly baked pastries —
          welcome to your neighbourhood's favourite bloom.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#menu"
            className="px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#f59e0b', color: '#2c1a0a' }}
          >
            Explore Our Menu
          </a>
          <a
            href="#about"
            className="px-8 py-3.5 rounded-full font-semibold text-base border-2 transition-all duration-200 hover:scale-105"
            style={{ borderColor: '#d4ae78', color: '#d4ae78' }}
          >
            Our Story
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { value: '50+', label: 'Menu Items' },
            { value: '12K+', label: 'Happy Guests' },
            { value: '8 Yrs', label: 'Est. 2016' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#f59e0b', fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: '#a86f35' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-xs" style={{ color: '#a86f35' }}>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path d="M8 4v16M2 14l6 6 6-6" stroke="#a86f35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
